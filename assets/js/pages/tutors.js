import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';
import { apiCall } from '../components/api.js';
import { home, contactUs } from '../components/routes.js';
import { resetInvalidInput, tutorSubjectToggle } from './../components/utils.js';

const onlineLessonToggle = document.getElementById('checkOnline');
const face2FaceLessonToggle = document.getElementById('checkFace2Face');
const postCode = document.getElementById('postZipCode');

window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();

  // Fetch a list of subjects available
  tutorSubjects();

  // Add event  listener for back to subjects
  document.getElementById('back-to-subjects').addEventListener('click', () => {
    document.getElementById('tutors-card').style.display = 'none';
    document.getElementById('tutors-card-disclaimer').style.display = 'none';
    document.getElementById('subject-card').style.display = 'block';
    tutorListSection.innerHTML = '';
  });

  // Add event listeners to the toggle buttons for lesson location type
  postCode.addEventListener('focus', resetInvalidInput);
  onlineLessonToggle.addEventListener('click', tutorSubjectToggle);
  face2FaceLessonToggle.addEventListener('click', tutorSubjectToggle);

  /**
   * Add event listener for  navigating to contact us
   * for the subject not found / on list card
   */
  document.getElementById('go-to-contact-us').addEventListener('click', contactUs);

  // Unpack search parameters locally
  unpackSearchParams();

}

const unpackSearchParams = () => {
  if (!window.location.search) return;
  let params = {};
  const keyValList = window.location.search.substring(1).split('&');
  for (let i = 0; i < keyValList.length; i++) {
    let [key, val] = keyValList[i].split('=');
    params[key] = val;
  }
  if (
    'subject' in params &&
    'lesson_type' in params &&
    'post_zip_code' in params
  ) {
    if (params.lesson_type === 'face-to-face') {
      tutorSubjectToggle();
    }
    document.getElementById('lessonLocation').value = params.lesson_type;
    document.getElementById('postZipCode').value = params.post_zip_code.replace('%20', ' ');
    displayTutors(parseInt(params.subject));
  } else {
    alert('Invalid location criteria!');
    home();
  }
};

const defineColour = (lineNumber) => {
  let colour = 'light-blue-card';
  if (lineNumber == 1) {
    lineNumber = 2;
  } else if (lineNumber == 2) {
    lineNumber = 3;
    colour = '';
  } else if (lineNumber == 3) {
    lineNumber = 4;
    colour = 'light-green-card';
  } else if (lineNumber == 4) {
    lineNumber = 1;
    colour = '';
  }
  return [lineNumber, colour];
}

const subjectsList = document.getElementById('subject-list');
const tutorSubjects = async () => {
  let path = '/api/salesorders/list_subjects';
  let headers = {};
  let method = 'GET';
  let payload = {};
  let response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) {
    let subjects = response.response.data;
    let lineNumber = 1;
    let colour = '';
    for (let i = 0; i < subjects.length; i++) {
      // Handle cheapest option not available - do not show card
      if (subjects[i].lowest_price === 'Not available') continue;

      // Add the button to the card
      let cheapestOptionBtn = document.createElement('button');
      cheapestOptionBtn.className = 'btn btn-primary shadow';
      cheapestOptionBtn.style.fontSize = '13px';
      let boldBtnText = document.createElement('b');
      boldBtnText.innerText = `From £${subjects[i].lowest_price}/hr`;
      cheapestOptionBtn.appendChild(boldBtnText);
      
      // Handle the colour of the cards
      [lineNumber, colour] = defineColour(lineNumber);

      // Create the subject card
      let subjectCard = document.createElement('div');
      subjectCard.className = `card mb-1 ${colour} rounded`;
      subjectCard.addEventListener('click', async () => {
        await displayTutors(subjects[i].subject_id);
      });
      let subSubjectCard = document.createElement('div');
      subSubjectCard.className = 'card-body dashboard-button pt-1 px-0';

      // Define the cheapest option section in the card
      let cheapestOptionSection = document.createElement('div');
      cheapestOptionSection.className = 'text-right pr-1';
      cheapestOptionSection.appendChild(cheapestOptionBtn);
      subSubjectCard.appendChild(cheapestOptionSection);

      // Define the subject section
      let subjectSection = document.createElement('div');
      subjectSection.className = 'my-3 px-3';
      let boldSubjectText = document.createElement('b');
      boldSubjectText.style.fontSize = '23px';
      boldSubjectText.innerText = subjects[i].long_name;
      subjectSection.appendChild(boldSubjectText);
      subSubjectCard.appendChild(subjectSection);
      subjectCard.appendChild(subSubjectCard);

      subjectsList.appendChild(subjectCard);
    }
    document.getElementById('loading-card').style.display = 'none';
    document.getElementById('subject-view').style.display = 'block';
  }
}

const displayTutors = async (id) => {
  let lessonType = document.getElementById('lessonLocation').value;
  let postZipCode = document.getElementById('postZipCode');
  /**
   * Validate if face to face lessons are selected
   * that the postal code is populated
   */
  if (lessonType == 'face-to-face' && postZipCode.value.length == 0) {
    postZipCode.classList.add('is-invalid');
    return false;
  }

  // Set the selected subject ID
  document.getElementById('subject-selected').innerHTML = id;
  let path = (
    '/api/salesorders/list_tutors_by_subject'
    + `?subject=${id}`
    + `&lesson_type=${lessonType}`
    + `&post_zip_code=${postZipCode.value}`
  );
  let headers = {};
  let method = 'GET';
  let payload = {};
  let response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) {
    let tutors = response.response.data;
    // Store all the tutors for future load
    localStorage.setItem('all-tutors', JSON.stringify(
      tutors
    ));
    
    // Reset the tutors list
    if (tutors.length == 0) {
      tutorListSection.innerHTML = `
        <br><br><br><br>
          <p class="px-5 font-weight-bold font-italic">
            Unfortunately, at this time, none of our registered tutors match your criteria. 
            Please read our notice below so that we may assist you further.
          </p>
        <br><br><br><br>
      `;
    } else {
      // Using a function to render the tutor cards    
      await renderTutors('price-low-to-high');
    }
    document.getElementById('subject-card').style.display = 'none';
    document.getElementById('tutors-card').style.display = 'block';
    document.getElementById('tutors-card-disclaimer').style.display = 'block';
  } else if (response.status === 480) {
    document.getElementById('error-card').style.display = 'block';
    document.getElementById('error-response').innerHTML = response.response.message;
  }
};


const tutorListSection = document.getElementById('tutor-list');
const renderTutors = async (method) => {
  // Set tutors
  const [tutors, sortByBtnText] = await sortTutorDisplay(
    JSON.parse(localStorage.getItem('all-tutors')),
    method
  );

  // Add a title to the section
  const heading = document.createElement('h3');
  heading.innerText = 'Browse the tutors that cover your subject';
  tutorListSection.appendChild(heading);
  
  // Create sort by dropdown list
  const orderBtnSection = document.createElement('div');
  orderBtnSection.className = 'my-3 text-right dropdown';

  // Ordering button
  const orderBtn = document.createElement('button');
  orderBtn.type = 'button';
  orderBtn.className = 'btn btn-info dropdown-toggle';
  orderBtn.dataset.toggle = 'dropdown';
  orderBtn.innerText = `Sort by: ${sortByBtnText}`;
  // Attach button to ordering button section
  orderBtnSection.appendChild(orderBtn);

  // Dropdown option section
  const sortOptSection = document.createElement('div');
  sortOptSection.className = 'dropdown-menu bg-dark';
  sortOptSection.ariaLabelledby = 'dropdownMenuButton';

  // Dropdown option
  const sortOption = [
    {
      sort: 'price-low-to-high',
      sortText: 'Price (lowest to highest)'
    },
    {
      sort: 'price-high-to-low',
      sortText: 'Price (highest to lowest)'
    },
    {
      sort: 'hours-low-to-high',
      sortText: 'Hours taught (lowest to highest)'
    },
    {
      sort: 'hours-high-to-low',
      sortText: 'Hours taught (highest to lowest)'
    },
  ];
  for (let i = 0; i < sortOption.length; i++) {
    let option = document.createElement('a');
    option.id = `option-${i}`;
    option.className = 'hover-pointer dropdown-item bg-dark text-white';
    option.innerText = sortOption[i].sortText;
    option.addEventListener('click', () => {
      tutorListSection.innerHTML = '';
      renderTutors(sortOption[i].sort);
    });
    // Attach option to dropdown
    sortOptSection.appendChild(option);
  }
  
  // Attach  sort option section to order section
  orderBtnSection.appendChild(sortOptSection);

  // Append button section tutor list section
  tutorListSection.appendChild(orderBtnSection);

  // Iterate over tutor's to build the cards
  for (let i = 0; i < tutors.length; i++) {
    // Tutor profile section
    let tutorCardSection = document.createElement('div');
    tutorCardSection.className = 'card mb-2 shadow';
    // Tutor card nav section
    let tutorNavCard = document.createElement('div');
    tutorNavCard.className = 'card-body dashboard-button';
    tutorNavCard.addEventListener('click', () => {
      const subject = document.getElementById('subject-selected').innerHTML;
      window.location.assign(
        `${window.location.origin}/information/profile.html?tutor=${tutors[i].profile_id}&subject=${subject}`
      );
    });
    // Mileage & price button section
    let btnSection = document.createElement('div');
    btnSection.className = 'text-right mb-2';
    if ('distance_miles' in tutors[i]) {
      let milesBtn = document.createElement('button');
      milesBtn.className = 'btn btn-success shadow';
      milesBtn.style.marginRight = '5px';
      milesBtn.innerText = `${tutors[i].distance_miles} miles away`;
      btnSection.appendChild(milesBtn);
    }
    let priceBtn = document.createElement('button');
    priceBtn.className = 'btn btn-primary shadow';
    priceBtn.innerText = `£${tutors[i].hourly_rate}/hr`;
    btnSection.appendChild(priceBtn)
    // Attach btn section
    tutorNavCard.appendChild(btnSection);

    // Tutor image
    let tutorImage = document.createElement('img');
    tutorImage.className = 'circle-img-profile-list';
    tutorImage.src = tutors[i].profile_photo;
    tutorNavCard.appendChild(tutorImage);

    // Tutor Name
    let tutorName = document.createElement('p');
    tutorName.className = 'my-0';
    tutorName.innerText = `${tutors[i].first_name} ${tutors[i].last_name_initial}`;
    tutorNavCard.appendChild(tutorName);

    // Tutor header
    let tutorHeader = document.createElement('p');
    tutorHeader.className = 'my-0'; // Add emphasis attribute
    tutorHeader.innerHTML = `<em>${tutors[i].profile_header}</em>`;
    tutorNavCard.appendChild(tutorHeader);

    // Tutor: hours taught
    let hoursTaught = document.createElement('p');
    hoursTaught.className = 'my-0';
    hoursTaught.innerHTML = `<b>Hours Taught: ${tutors[i].hours_taught}</b>`;
    tutorNavCard.appendChild(hoursTaught);

    // Tutor: highest qualification
    let qualification = document.createElement('p');
    qualification.className = 'my-0';
    qualification.innerHTML = `<b>Highest Qualification: ${tutors[i].highest_qualification}</b>`;
    tutorNavCard.appendChild(qualification);

    // Attach nav card section
    tutorCardSection.appendChild(tutorNavCard);
    // Attach tutor card section
    tutorListSection.appendChild(tutorCardSection);
  }
};

const sortTutorDisplay = async (tutors, method) => {
  let sortByBtnText = 'Price (lowest to highest)';
  if (method == 'price-low-to-high') {
    sortByBtnText = 'Price (lowest to highest)';
    tutors.sort(function(a, b) {
      return parseFloat(a['hourly_rate']) - parseFloat(b['hourly_rate']);
    });
  } else if (method == 'price-high-to-low') {
    sortByBtnText = 'Price (highest to lowest)';
    tutors.sort(function(a, b) {
      return parseFloat(b['hourly_rate']) - parseFloat(a['hourly_rate']);
    });
  } else if (method == 'hours-low-to-high') {
    sortByBtnText = 'Hours (lowest to highest)';
    tutors.sort(function(a, b) {
      return parseFloat(a['hours_taught']) - parseFloat(b['hours_taught']);
    });
  } else if (method == 'hours-high-to-low') {
    sortByBtnText = 'Hours (highest to lowest)';
    tutors.sort(function(a, b) {
      return parseFloat(b['hours_taught']) - parseFloat(a['hours_taught']);
    });
  }
  return [tutors, sortByBtnText];
};