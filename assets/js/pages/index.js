import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';
import { apiCall } from './../components/api.js';
import { resetError, validateTarget } from './../components/utils.js';

// Lesson toggle elements
const submitFindLesson = document.getElementById('submitFindLesson');
const onlineLessonToggle = document.getElementById('checkOnline');
const face2FaceLessonToggle = document.getElementById('checkFace2Face');
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
  const base = window.location.origin;
  setNavigationBar(base);
  setPageHeader();
  setPageFooter(base);
  setContactButtons(base);

  /* Test the API is alive and functioning, otherwise
  * return maintenance view.
  */
  testAPI();

  // Get available subjects
  loadSubjectsSelector();

  // For managing the flag
  // validateUserInteraction();

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
  if (response.status == 200) {
    let subjects = response.response.data;
    let option_list;
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i]['lowest_price'] == 'Not available') {
          continue;
      }
      let html = `
      <option value=`+subjects[i]['subject_id']+`>`+subjects[i]['long_name']+`</option>
      `;
      option_list += html;
    }
    document.getElementById('subject-list').innerHTML = option_list;
  }
}


async function validateUserInteraction() {
  let path = ('/api/validate_user_interaction');
  let headers = {};
  let method = 'GET';
  let payload = {};
  let response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response['status'] == 200) {
    let attributes = response['response']['data'];
    for (let i = 0; i < attributes.length; i++) {
      html = `
      <img onclick="validate_user_check(`+attributes[i]['number']+`);" class="hover-pointer little-flag" src="`+attributes[i]['icon']+`">
      `;
      document.getElementById('valid-img-'+(i+1)).innerHTML = html;
    }
    document.getElementById('find-country').innerHTML = (
      "Can you identify the flag for "
      +response['response']['find_country']
      +"?"
    );
    document.getElementById('find-country-answer').innerHTML = response['response']['find_country_number'];
  }
}


function redirectIndexToTutor() {
  let arg = '/index.html';
  let base = window.location.pathname;
  if (base == '/') {base = ''}
  base = base.toString().replace(arg, '');
  let subject = document.getElementById('subject-list').value;
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
  document.getElementById('submit-form').style.display = 'none';
  /* Execute API */
  let path = '/api/salesorders/create_sales_leads';
  let headers = {
    'Access-Token': '',
  };
  let method = 'POST';
  let payload = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    email: document.getElementById('email').value,
    mobile: document.getElementById('mobile').value,
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
    document.getElementById('error-card').style.display = 'block';
    document.getElementById('error-response').innerHTML = "An error has occured, please call us. Thanks.";
  }
}


// Allows the user to toggle between online and face-to-face sessions
const lessonLocation = document.getElementById('lessonLocation');
const postCode = document.getElementById('postZipCode');
const onlineBtn = document.getElementById('checkOnline');
const face2FaceBtn = document.getElementById('checkFace2Face');
let onlineLessons = true;
function tutorSubjectToggle() {
  if (!onlineLessons) {
    lessonLocation.value = 'online';
    postCode.style.display = 'none';
    face2FaceBtn.className = "col btn m-0";
    addActiveClasses(onlineBtn);
    onlineLessons = true;
  } else {
    lessonLocation.value = 'face-to-face';
    postCode.style.display = 'block';
    onlineBtn.className = "col btn m-0";
    addActiveClasses(face2FaceBtn);
    onlineLessons = false;
  }
}

function addActiveClasses(btn) {
  const classNames = [
    'col',
    'btn',
    'm-0',
    'bg-primary',
    'font-weight-bold',
    'text-white'
  ];
  for (let i = 0; i < classNames.length; i++) {
    btn.classList.add(classNames[i]);
  }
}

/**
 * Provides a way to reset the request a callback form
 * After user has not filled out the required fields
 */
function resetInvalidInput() {
  const id = this.id;
  resetError();
  document.getElementById(id).classList.remove('is-invalid');
}