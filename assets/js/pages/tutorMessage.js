import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';
import { apiCall } from '../components/api.js';
import { fetchTutor } from '../components/apiCalls/tutorProfile.js';
import { validateUserInteraction } from '../components/apiCalls/validateUserInteraction.js';
import {
  resetInvalidInput,
  resetError,
  validateTarget
} from './../components/utils.js';

const tutorSelected = document.getElementById('tutor-selected');
const subjectSelected = document.getElementById('subject-selected');
const nameSelected = document.getElementById('message-heading');
const photo = document.getElementById('profile-photo');

const messageBox = document.getElementById('message');
const messageLen = document.getElementById('message-str-len');

// Form elements
const email = document.getElementById('email');
const mobile = document.getElementById('mobile');
const submitBtn = document.getElementById('submitForm');
const termsAndConditions = document.getElementById('tickTermsAndConditions');
const privacyPolicy = document.getElementById('tickPrivacyPolicy');

window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();

  // For managing the flag
  validateUserInteraction();

  // Add event listener for send message button
  submitBtn.addEventListener('click', sendMessage);

  // Add event listeners to reset input fields
  email.addEventListener('focus', resetInvalidInput);
  mobile.addEventListener('focus', resetInvalidInput);
  messageBox.addEventListener('focus', resetInvalidInput);
  termsAndConditions.addEventListener('focus', resetInvalidInput);
  privacyPolicy.addEventListener('focus', resetInvalidInput);
  
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
    'first_name' in params &&
    'subject' in params
  ) {
    tutorSelected.innerText = params.tutor;
    subjectSelected.innerText = params.subject;
    nameSelected.innerHTML = `Message <br>${params.first_name.toString().replace(/%20/g, ' ')}`;
    fetchMessageHelper();
  } else {
    alert('Invalid location criteria!');
    home();
  }
};

const fetchMessageHelper = async () => {
  /* Load stored email address */
  const email = localStorage.getItem('123helpmestudy-email');
  if (email != null) document.getElementById('email').value = email;

  let requestSubject = '{subject}';
  const subjects = await fetchSubjects();
  for (let i = 0; i < subjects.length; i++) {
    if (subjects[i].subject_id == subjectSelected.innerText) requestSubject = subjects[i].long_name;
  }

  /* Load tutor attributes */
  const tutor = await fetchTutor(tutorSelected.innerText);
  if (!tutor) return;
  photo.src = tutor.profile_photo;
  const html = (
    `Hello ${tutor.first_name} ${tutor.last_name_initial},\n\n`
    + `I am looking for help with ${requestSubject}.\n`
    + 'I came across your profile and feel like you would be a great fit for me.\n'
    + 'Please could you let me know when you would be free for a first lesson.\n\n'
    + 'Thanks'
  );
  messageBox.value = html;
  messageLen.innerText = `${html.length} / 500`;
};

const fetchSubjects = async () => {
  const path = '/api/salesorders/list_subjects';
  const headers = {};
  const method = 'GET';
  const payload = {};
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) return response.response.data;
  return null;
};

const sendMessage = async () => {
  /* Validate user input */
  let validate = false;
  if (validateTarget('email')) {validate = true;}
  if (validateTarget('mobile')) {validate = true;}
  if (validateTarget('message')) {validate = true;}
  if (validate) {return;}
  /* Validate user agreement and t & c's */
  if (
    termsAndConditions.checked == false ||
    privacyPolicy.checked == false
  ) {
    // Failed to tick terms and conditions and privacy policy
    document.getElementById('error-card').style.display = 'block';
    document.getElementById('error-response').innerText = (
      'To proceed, please read and agree to our terms '
      + 'and conditions, and our privacy policy.'
    );
    return false;
  }
  /* Validate user robot */
  let robotStatus = document.getElementById('is-a-robot').innerHTML;
  if (robotStatus == 'yes') {
    document.getElementById('submitForm').style.display = 'none';
    document.getElementById('check-validator').style.display = 'block';
    return false;
  }
  /* Disable submit button */
  document.getElementById('pending-send').style.display = 'block';
  document.getElementById('submitForm').style.display = 'none';
  /* Execute API */
  const path = '/api/salesorders/message_tutor';
  const headers = {};
  const method = 'POST';
  const payload = {
    email_from: email.value,
    mobile_from: mobile.value,
    subject_id: subjectSelected.innerText,
    tutor_id: tutorSelected.innerText,
    message: messageBox.value
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) {
    document.getElementById('submitForm').style.display = 'none';
    document.getElementById('pending-send').style.display = 'none';
    messageBox.value = '';
    document.getElementById('message-sent-successfully').style.display = 'block';
  } else {
    // Failed to send the message
    document.getElementById('error-card').style.display = 'block';
    document.getElementById('pending-send').style.display = 'none';
    document.getElementById('error-response').innerText = response.response.message;
  }
};