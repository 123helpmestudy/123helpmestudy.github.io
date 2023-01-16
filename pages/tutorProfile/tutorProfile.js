import { setNavigationBar } from '/assets/js/components/navigationBar.js';
import { setSubjects } from '/assets/js/components/subjectOptions.js';
import { setContactButtons } from '/assets/js/components/contactButtons.js';
import { resetInvalidInput, resetError, validateTarget, messageCounter } from '/assets/js/components/utils.js';
import { apiCall } from '/assets/js/components/api.js';
import { times, dayOfWeekMap } from './constants.js';


window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar(true);
  setSubjects();

  // Set max input length for text areas
  messageCounter('about-tutor', 'about-tutor-str-len');
  messageCounter('background-tutor', 'background-tutor-str-len');

  // Construct page
  constructTutorProfilePage();
}

// General tutor properties
const email = document.getElementById('email');
const profileHeader = document.getElementById('profile-header');
const profileHourlyRate = document.getElementById('hourly-rate');
let profileAboutPart1 = '';
let profileAboutPart2 = '';
const profileAbout = document.getElementById('about-tutor');
const profileAboutLength = document.getElementById('about-tutor-str-len');
let profileBackgroundPart1 = '';
let profileBackgroundPart2 = '';
const profileBackground = document.getElementById('background-tutor');
const profileBackgroundLength = document.getElementById('background-tutor-str-len');
const profileHighestQualification = document.getElementById('highest-qualification');
const profileSubject1 = document.getElementById('subject-options-1');
const profileSubject2 = document.getElementById('subject-options-2');
const profileSubject3 = document.getElementById('subject-options-3');
const profileQualificationConfirmed = document.getElementById('qualification-document-confirmed');
const profileQualificationPending = document.getElementById('qualification-document-pending');
const profileBackgroundCheckConfirmed = document.getElementById('background-check-document-confirmed');
const profileBackgroundCheckPending = document.getElementById('background-check-document-pending');
const profileTeacherStatusConfirmed = document.getElementById('teacher-status-document-confirmed');
const profileTeacherStatusPending = document.getElementById('teacher-status-document-pending');
const profileUsername = document.getElementById('username');
const profileExternalCalendar = document.getElementById('external-calendar-link');
const profileTimezoneOffset = document.getElementById('calendar-timezone-offset');


const constructTutorProfilePage = async () => {
  // Set the registered email address
  email.innerText = `User Email: ${localStorage.getItem('123helpmestudy-email')}`;
  // Set tutor attributes
  const tutorAttributes = await fetchTutorDetails();
  tutorAttributes.forEach(pair => {
    const { attribute, value } = pair;
    switch(attribute) {
      case 'tutor_profile_status':
        manageTutorStatus(value);
        break;
      case 'profile_photo':
        manageProfilePhoto(value);
        break;
      case 'profile_header':
        profileHeader.value = value;
        break;
      case 'hourly_rate':
        profileHourlyRate.value = value;
        break;
      case 'about_tutor_1':
        profileAboutPart1 = value;
        break;
      case 'about_tutor_2':
        profileAboutPart2 = value;
        break;
      case 'background_tutor_1':
        profileBackgroundPart1 = value;
        break;
      case 'background_tutor_2':
        profileBackgroundPart2 = value;
        break;
      case 'highest_qualification':
        profileHighestQualification.value = value;
        break;
      case 'subject_options_1':
        profileSubject1.value = value;
        break;
      case 'subject_options_2':
        profileSubject2.value = value;
        break;
      case 'subject_options_3':
        profileSubject3.value = value;
        break;
      case 'qualification_support_document':
        if (value === 'confirmed') profileQualificationConfirmed.style.display = 'block';
        if (value !== 'confirmed' && value) profileQualificationPending.style.display = 'block';
        break;
      case 'background_check_document':
        if (value === 'confirmed') profileBackgroundCheckConfirmed.style.display = 'block';
        if (value !== 'confirmed' && value) profileBackgroundCheckPending.style.display = 'block';
        break;
      case 'teacher_status_document':
        if (value === 'confirmed') profileTeacherStatusConfirmed.style.display = 'block';
        if (value !== 'confirmed' && value) profileTeacherStatusPending.style.display = 'block';
        break;
      case 'username':
        profileUsername.value = value;
        break;
      case 'schedule_ics_url':
        profileExternalCalendar.value = value;
        break;
      case 'schedule_timezone_offset':
        profileTimezoneOffset.value = value / 60;
        break;
      case 'availability':
        manageAvailability(JSON.parse(value));
        break;
      case 'discount_codes':
        manageDiscountCodes(JSON.parse(value));
        break;

      default:
        // console.warn(`Nothing setup for ${attribute}`);
    }
  });

  // Set about section from local storage
  profileAbout.value = `${profileAboutPart1}${profileAboutPart2}`;
  profileAboutLength.innerText = `${profileAbout.value.length} / 500`;
  // Set background section
  profileBackground.value = `${profileBackgroundPart1}${profileBackgroundPart2}`;
  profileBackgroundLength.innerText = `${profileBackground.value.length} / 500`;
};


const fetchTutorDetails = async () => {
  const email = localStorage.getItem('123helpmestudy-email');
  const accessToken = localStorage.getItem('123helpmestudy-access-token');
  const path = `/api/users/list_user_attributes?email=${email}`;
  const headers = {
    'Access-Token': accessToken,
  };
  const method = 'GET';
  const payload = {};
  const response = await apiCall(
      path, 
      headers, 
      method,
      payload
  );
  if (response.status === 401) window.location.assign(`${window.location.origin}/information/login.html`);
  if (response.status === 200) return response.response.data;
  return [];
};


const profileStatus = document.getElementById('tutor-profile-status');
const statusInactiveComplete = document.getElementById('profile-status-inactive-complete');
const statusInactiveIncomplete = document.getElementById('profile-status-inactive-incomplete');
const statusPending = document.getElementById('profile-status-pending');
const statusActive = document.getElementById('profile-status-active');
/**
 * Handle the display of the tutors profile status
 */
const manageTutorStatus = (value) => {
  profileStatus.value = value;
  if (value === 'inactive_complete') statusInactiveComplete.style.display = 'inline';
  if (
    value === 'inactive_incomplete' ||
    value === 'inactive'
  ) statusInactiveIncomplete.style.display = 'inline';
  if (value === 'pending') statusPending.style.display = 'inline';
  if (value === 'active') statusActive.style.display = 'inline';
};


const profilePhoto = document.getElementById('profile-photo');
/**
 * Handle displaying the profile photo
 */
const manageProfilePhoto = (value) => {
  if (value) {
    const [id, url] = value.toString().split(';');
    profilePhoto.src = url;
  }
};


const profileAvailability = document.getElementById('calendar-availability');
/**
 * Handle the users availability
 */
const manageAvailability = (availability) => {
  // Add column headers

  // Add availability rows
  for (let dayOfWeekIdx in availability) {
    let dayName = dayOfWeekMap[dayOfWeekIdx];
    let row = document.createElement('div');
    row.classList.add('row');
    row.classList.add('py-1');
    profileAvailability.appendChild(row);
    // Day of week col
    let dayOfWeekCol = document.createElement('div');
    dayOfWeekCol.classList.add('col');
    row.appendChild(dayOfWeekCol);
    dayOfWeekCol.innerText = dayName;
    // Start time
    let startTimeCol = document.createElement('div');
    startTimeCol.classList.add('col');
    row.appendChild(startTimeCol);
    let startTimeInput = document.createElement('select');
    startTimeInput.id = `start-time-${dayOfWeekIdx}`;
    startTimeInput.className = 'form-control mb-3';
    startTimeCol.appendChild(startTimeInput);
    times.forEach(slot => {
      const option = document.createElement('option');
      option.innerText = slot;
      startTimeInput.appendChild(option);
    });
    // End time
    let endTimeCol = document.createElement('div');
    endTimeCol.classList.add('col');
    row.appendChild(endTimeCol);
    let endTimeInput = document.createElement('select');
    endTimeInput.id = `end-time-${dayOfWeekIdx}`;
    endTimeInput.className = 'form-control mb-3';
    endTimeCol.appendChild(endTimeInput);
    times.forEach(slot => {
      const option = document.createElement('option');
      option.innerText = slot;
      endTimeInput.appendChild(option);
    });
    if (availability[dayOfWeekIdx].length > 0) {
      let [start, end] = availability[dayOfWeekIdx][0];
      startTimeInput.value = start;
      endTimeInput.value = end;
    }
  }
};
