import { setNavigationBar } from '/assets/js/components/navigationBar.js';
import { setPageHeader } from '/assets/js/components/pageHeader.js';
import { setPageFooter } from '/assets/js/components/pageFooter.js';
import { setContactButtons } from '/assets/js/components/contactButtons.js';
import { apiCall } from '/assets/js/components/api.js';
import { validateUserInteraction } from '/assets/js/components/apiCalls/validateUserInteraction.js';
import {
  resetInvalidInput,
  validateTarget,
  tutorSubjectToggle
} from '/assets/js/components/utils.js';

// Lesson toggle elements
const subjectList = document.getElementById('subject-list');
const submitFindLesson = document.getElementById('submitFindLesson');
const onlineLessonToggle = document.getElementById('checkOnline');
const face2FaceLessonToggle = document.getElementById('checkFace2Face');
const postCode = document.getElementById('postZipCode');
// Request call back form elements
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const mobileInput = document.getElementById('mobile');
const emailInput = document.getElementById('email');
const submitCallBackFormBtn = document.getElementById('submitForm');
const termsAndConditions = document.getElementById('tickTermsAndConditions');
const privacyPolicy = document.getElementById('tickPrivacyPolicy');

window.addEventListener('DOMContentLoaded', main);
function main() {
  // Setup page navigation
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();

  /* Test the API is alive and functioning, otherwise
  * return maintenance view.
  */
  testAPI();

  // Get available subjects
  loadSubjectsSelector();

  // For managing the flag
  validateUserInteraction();

  // Add event listener for submit redirect
  submitFindLesson.addEventListener(
    'click', redirectIndexToTutor
  );

  // Add event listeners to the toggle buttons for lesson location type
  postCode.addEventListener('focus', resetInvalidInput);
  onlineLessonToggle.addEventListener('click', tutorSubjectToggle);
  face2FaceLessonToggle.addEventListener('click', tutorSubjectToggle);

  // Add event listeners to input fields in request call back form
  firstNameInput.addEventListener('focus', resetInvalidInput);
  lastNameInput.addEventListener('focus', resetInvalidInput);
  mobileInput.addEventListener('focus', resetInvalidInput);
  emailInput.addEventListener('focus', resetInvalidInput);
  termsAndConditions.addEventListener('focus', resetInvalidInput);
  privacyPolicy.addEventListener('focus', resetInvalidInput);

  // Add event listener for call back form submit button
  submitCallBackFormBtn.addEventListener(
    'click', callBackFormSubmit
  );

  // Define page functions
  // let min = 1;
  // let max = 21;
  // document.getElementById('first-number').innerHTML =  Math.floor(Math.random() * (max - min) + min);
  // document.getElementById('second-number').innerHTML = Math.floor(Math.random() * (max - min) + min);
  // function offline_reset_error() {
  //     if (document.getElementById('offline-error-card') != null) {
  //         document.getElementById('offline-error-card').style.display = 'none';    
  //     }
  // }
}


async function testAPI() {
  let path = ('/api/status');
  let headers = {};
  let method = 'GET';
  let payload = {};
  /* For simplifying page */
  try {
    /* Execute API */
    let response = await apiCall(
      path, 
      headers, 
      method,
      payload
    );
    if (response['status'] == 200) {
      console.log('API is alive!');
    }
  } catch(e) {
    //console.log(e);
    document.getElementById('navigation-bar').style.display = 'none';
    document.getElementById('getting-started-card').style.display = 'none';
    document.getElementById('request-contact-form').style.display = 'none';
    document.getElementById('api-fail-email-button').style.display = 'block';
  }
}


async function loadSubjectsSelector() {
  let path = ('/api/salesorders/list_subjects');
  let headers = {};
  let method = 'GET';
  let payload = {};
  let response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status !== 200) return;
  subjectList.innerHTML = '';
  let subjects = response.response.data;
  subjects.forEach(subject => {
    if (subject.lowest_price === 'Not available') return;
    const option = document.createElement('option');
    option.value = subject.subject_id;
    option.innerText = subject.long_name;
    subjectList.appendChild(option);
  });
  // Check the inner node list of the subjects to display
  if (subjectList.children.length > 0) return;
  const option = document.createElement('option');
  option.innerText = 'No subjects found';
  subjectList.appendChild(option);
}


function redirectIndexToTutor() {
  let arg = '/index.html';
  let base = window.location.pathname;
  if (base == '/') {base = ''}
  base = base.toString().replace(arg, '');
  let subject = subjectList.value;
  let lesson_type = document.getElementById('lessonLocation').value;
  let post_zip_code = document.getElementById('postZipCode').value;
  if (lesson_type == 'face-to-face' && post_zip_code.length == 0) {
    let class_list = document.getElementById('postZipCode').className;
    if (class_list.indexOf('is-invalid') == -1) {
      document.getElementById('postZipCode').className = (
        class_list
        +' is-invalid'
      );
    }
    return false;
  }
  window.location.assign(
    base+'/information/tutors.html?subject='+subject
    +'&lesson_type='+lesson_type
    +'&post_zip_code='+post_zip_code
  );
}


/**
 * First validates if the call back form is populated correctly,
 * then submits the content to the API endpoint /api/salesorders/create_sales_leads
 */
async function callBackFormSubmit() {
  /* Validate user input */
  let validate = false;
  if (validateTarget('firstName')) validate = true;
  if (validateTarget('lastName')) validate = true;
  if (validateTarget('mobile')) validate = true;
  if (validateTarget('email')) validate = true;
  if (validate) return false;
  /* Validate user agreement and t & c's */
  if (
    document.getElementById('tickTermsAndConditions').checked == false ||
    document.getElementById('tickPrivacyPolicy').checked == false
  ) {
    // Failed to tick terms and conditions and privacy policy
    document.getElementById('error-card').style.display = 'block';
    document.getElementById('error-response').innerHTML = (
      'To proceed, please read and agree to our terms '
      +'and conditions, and our privacy policy.'
    );
    return false;
  }
  /* Validate user robot */
  let robotStatus = document.getElementById('is-a-robot').innerHTML;
  if (robotStatus === 'yes') {
    document.getElementById('submitForm').style.display = 'none';
    document.getElementById('check-validator').style.display = 'block';
    return false;
  }
  /* Disable submit button */
  document.getElementById('pending-send').style.display = 'block';
  document.getElementById('submitForm').style.display = 'none';
  /* Execute API */
  let path = '/api/salesorders/create_sales_leads';
  let headers = {
    'Access-Token': '',
  };
  let method = 'POST';
  let payload = {
    first_name: firstNameInput.value,
    last_name: lastNameInput.value,
    email: emailInput.value,
    mobile: mobileInput.value,
  };
  let response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) {
    document.getElementById('pending-send').style.display = 'none';
    document.getElementById('request-contact-form').style.display = 'none';
    document.getElementById('success-card').style.display = 'block';
  } else {
    document.getElementById('pending-send').style.display = 'none';
    document.getElementById('error-card').style.display = 'block';
    document.getElementById('error-response').innerHTML = "An error has occured, please call us. Thanks.";
  }
}
