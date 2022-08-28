import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';
import { apiCall } from '../components/api.js';
import { fetchTutor } from '../components/apiCalls/tutorProfile.js';
import { home } from '../components/routes.js';

// Detail storage
const tutorSelected = document.getElementById('tutor-selected');
const subjectSelected = document.getElementById('subject-selected');
const tutorFirstNameSelected = document.getElementById('tutor-first-name-selected');
// Page details
const name = document.getElementById('tutor-name');
const profileHeader = document.getElementById('profile-header');
const lastLogin = document.getElementById('last-login');
const photo = document.getElementById('profile-photo');
const backgroundChecked = document.getElementById('background-checked');
const techerChecked = document.getElementById('qualified-teacher-checked');
const qualificationChecked = document.getElementById('qualification-checked');
const hourly = document.getElementById('hourly-rate');
const serviceCharge = document.getElementById('service-charge');
const qualification = document.getElementById('qualification');
const hoursTaught = document.getElementById('hours-taught');
const subject1 = document.getElementById('subject-1');
const subject2 = document.getElementById('subject-2');
const subject3 = document.getElementById('subject-3');
const about = document.getElementById('about-tutor');
const background = document.getElementById('background-tutor');

// Confirmed Image
const getConfirmedImg = () => {
  const confirmedImg = document.createElement('img');
  confirmedImg.src = `${window.location.origin}/assets/images/tick_image.svg`;
  confirmedImg.className = 'p-0 add-img-btn circle-img';
  return confirmedImg;
}

window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();

  // Add event listener for going back to tutors
  document.getElementById('back-to-tutors').addEventListener('click', () => {
    window.history.go(-1);
  });

  // Add event listener to message tutor
  document.getElementById('message-tutor').addEventListener('click', () => {
    window.location.assign(
      `${window.location.origin}/information/message-tutor.html?tutor=${tutorSelected.innerText}&first_name=${tutorFirstNameSelected.innerText}&subject=${subjectSelected.innerText}`
    );
  });
  
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
    'tutor' in params &&
    'subject' in params
  ) {
    tutorSelected.innerHTML = params.tutor;
    subjectSelected.innerHTML = params.subject;
    fetchProfile(params.tutor);
  } else {
    alert('Invalid location criteria!');
    home();
  }
};


const fetchProfile = async (id) => {
  const tutor = await fetchTutor(id);
  if (!tutor) return;
  // Set the page contents
  tutorFirstNameSelected.innerText = tutor.first_name;
  name.innerText = `${tutor.first_name} ${tutor.last_name_initial}`;
  profileHeader.innerText = tutor.profile_header;
  lastLogin.innerText = `${tutor.last_active.substring(8, 10)}/${tutor.last_active.substring(5, 7)}/${tutor.last_active.substring(0, 4)}`;
  if (tutor.profile_photo.length > 0) photo.src = tutor.profile_photo;
  if (tutor.background_check_confirmed) {
    let text = document.createElement('b');
    text.innerText = 'Background checked ';
    backgroundChecked.appendChild(text);
    backgroundChecked.appendChild(getConfirmedImg());
  }
  if (tutor.teacher_status_confirmed) {
    let text = document.createElement('b');
    text.innerText = 'Teacher status checked ';
    techerChecked.appendChild(text);
    techerChecked.appendChild(getConfirmedImg());
  }
  if (tutor.qualification_confirmed) {
    let text = document.createElement('b');
    text.innerText = 'Education checked ';
    qualificationChecked.appendChild(text);
    qualificationChecked.appendChild(getConfirmedImg());
  }
  hourly.innerText = `£${tutor.hourly_rate}/hr`;
  serviceCharge.innerHTML = `<i>£${tutor.admin_fee}*</i>`;
  qualification.innerText = tutor.highest_qualification;
  hoursTaught.innerHTML = `I have taught <b>${tutor.hours_taught}</b> hours in total<br>on 123 Help Me Study`;
  subject1.innerText = tutor.subject_options_1;
  subject2.innerText = tutor.subject_options_2;
  subject3.innerText = tutor.subject_options_3;
  about.innerText = `${tutor.about_tutor_1}${tutor.about_tutor_2}`;
  background.innerText = `${tutor.background_tutor_1}${tutor.background_tutor_2}`;

  // Set page display
  document.getElementById('tutor-card').style.display = 'block';
  document.getElementById('disclaimer-card').style.display = 'block';
  document.getElementById('disclaimer-card-spacer').style.display = 'block';
  document.getElementById('loading-card').style.display = 'none';
};