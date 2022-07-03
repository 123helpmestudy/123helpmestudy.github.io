import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';
import { apiCall } from '../components/api.js';

window.addEventListener('DOMContentLoaded', main);
function main() {
  const base = window.location.origin;
  setNavigationBar(base);
  setPageHeader();
  setPageFooter(base);
  setContactButtons(base);

  // Fetch a list of subjects available
  tutorSubjects();
}

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
      subjectCard.addEventListener('click', () => {
        displayTutors(subjects[i].subject_id);
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
  let lessonType = document.getElementById('lesson-location').value;
  let postZipCode = document.getElementById('post-zip-code');
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
    +'?subject='+id
    +'&lesson_type='+lessonType
    +'&post_zip_code='+postZipCode.value
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
    let tutors = response['response']['data'];
    // Store all the tutors for future load
    localStorage.setItem('all-tutors', JSON.stringify(
      tutors
    ));
    
    // Reset the tutors list
    document.getElementById('tutor-list').innerHTML = '';
    if (tutors.length == 0) {
      document.getElementById('tutor-list').innerHTML = `
        <br><br><br><br>
          <p class="px-5 font-weight-bold font-italic">
            Unfortunately, at this time, none of our registered tutors match your criteria. 
            Please read our notice below so that we may assist you further.
          </p>
        <br><br><br><br>
      `;
    } else {
      // Using a function to render the tutor cards    
      renderTutors('price-low-to-high');
    }
    document.getElementById('subject-card').style.display = 'none';
    document.getElementById('tutors-card').style.display = 'block';
    document.getElementById('tutors-card-disclaimer').style.display = 'block';
  } else if (response['status'] == 480) {
    document.getElementById('error-card').style.display = 'block';
    document.getElementById('error-response').innerHTML = response.response.message;
  }
  console.log(response['status']);
  console.log(response['response']);
}

const renderTutors = (method) => {
  let tutors = localStorage.getItem('all-tutors');
  tutors = JSON.parse(tutors);
  let sortByBtnText;
  [tutors, sortByBtnText] = sortTutorDisplay(tutors, method);
  document.getElementById('tutor-sort-by-button').innerHTML = `Sort by: ${sortByBtnText}`;

  // Create sort by dropdown list
  document.getElementById('tutor-list').innerHTML = '';
  document.getElementById('tutor-list').innerHTML += '<h3>Browse the tutors that cover your subject</h3>';
  document.getElementById('tutor-list').innerHTML += `
  <div class="mb-3 text-left dropdown">
      <button 
          id="tutor-sort-by-button" 
          type="button" 
          data-toggle="dropdown" 
          class="btn btn-info dropdown-toggle"
      >
          Sort by: Price (lowest to highest)
      </button>
      <div class="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton">
          <a onclick="render_tutors_page('price-low-to-high');" class="hover-pointer dropdown-item bg-dark text-white">Price (lowest to highest)</a>
          <a onclick="render_tutors_page('price-high-to-low');" class="hover-pointer dropdown-item bg-dark text-white">Price (highest to lowest)</a>
          <a onclick="render_tutors_page('hours-low-to-high');" class="hover-pointer dropdown-item bg-dark text-white">Hours taught (lowest to highest)</a>
          <a onclick="render_tutors_page('hours-high-to-low');" class="hover-pointer dropdown-item bg-dark text-white">Hours taught (highest to lowest)</a>
      </div>
  </div>
  `;
  
  // Display all tutors for a subject
  for (var i = 0; i < tutors.length; i++) {
      var miles_button = '';
      if ('distance_miles' in tutors[i]) {
          miles_button = `<button class="btn btn-success shadow"><b>`+tutors[i]['distance_miles']+` miles away</b></button>`;
      }
      var html = `
      <div class="card mb-2 shadow">
          <div onclick="go_to_tutor_profile(`+tutors[i]['profile_id']+`);" class="card-body dashboard-button">
              <div class="text-right mb-2">
                  `+miles_button+`
                  <button class="btn btn-primary shadow"><!--style="width: 80px; height: 75px; padding-top: 1px; font-weight: 700; color: rgb(255, 255, 255);"-->
                      <b>£`+tutors[i]['hourly_rate']+`/hr</b>
                  </button>
              </div>
              <img class="circle-img-profile-list" src="`+tutors[i]['profile_photo']+`">
              <p class="my-0">`+tutors[i]['first_name']+' '+tutors[i]['last_name_initial']+`</p>
              <p class="my-0"><em>`+tutors[i]['profile_header']+`</em></p>
              <p class="my-0">Hours Taught: <b>`+tutors[i]['hours_taught']+`</b></p>
              <p class="my-0">Highest Qualification: <b>`+tutors[i]['highest_qualification']+`<b/></p>
          </div>
      </div>
      `;
      document.getElementById('tutor-list').innerHTML += html;
  }
}

const sortTutorDisplay = (tutors, method) => {
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
}