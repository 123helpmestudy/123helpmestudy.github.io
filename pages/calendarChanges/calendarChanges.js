import { setNavigationBar } from '/assets/js/components/navigationBar.js';
import { setPageHeader } from '/assets/js/components/pageHeader.js';
import { setPageFooter } from '/assets/js/components/pageFooter.js';
import { setContactButtons } from '/assets/js/components/contactButtons.js';
import { apiCall } from '/assets/js/components/api.js'
import { home } from '/assets/js/components/routes.js';
import {
  resetInvalidInput,
  resetError,
  validateTarget,
} from '/assets/js/components/utils.js';

const invalidSection = document.getElementById('invalid-load');

// Login form
const loginSection = document.getElementById('login-section');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-submit');
const loginPending = document.getElementById('pending-login');
const loginErrorCard = document.getElementById('login-error-card');
const loginErrorMessage = document.getElementById('login-error-response');

// Change request form
const requestForm = document.getElementById('request-form');
const requestTitle = document.getElementById('request-title');
const bookingName = document.getElementById('requester-name');
const bookingDate = document.getElementById('requester-date');
const bookingTime = document.getElementById('requester-time');
const bookingDuration = document.getElementById('requester-duration');
const submitBtn = document.getElementById('request-button');
const cancelOrderResponseSection = document.getElementById('cancel-order-card');
const cancelOrderResponse = document.getElementById('cancel-order-card-response');

let requestType;
let salesOrderId;
let salesOrderDetails;

window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();

  // Add event listener for login submit
  loginBtn.addEventListener('click', () => {
    submitLogin(false);
  });
  loginEmail.addEventListener('focus', resetInvalidInput);
  loginPassword.addEventListener('focus', resetInvalidInput);
  if (localStorage.getItem('123helpmestudy-email')) loginEmail.value = localStorage.getItem('123helpmestudy-email');

  // Unpack search parameters locally
  unpackSearchParams();
}


const unpackSearchParams = () => {
  if (!window.location.search) {
    invalidSection.childNodes[1].innerText = 'Nothing to display...';
    return;
  }
  let params = {};
  const keyValList = window.location.search.substring(1).split('&');
  for (let i = 0; i < keyValList.length; i++) {
    let [key, val] = keyValList[i].split('=');
    params[key] = val;
  }
  if (
    'id' in params &&
    't' in params
  ) {
    salesOrderId = params.id;
    requestType = params.t;
    constructPage();
  } else {
    alert('Invalid location criteria!');
    home();
  }
};


const requestTitles = {
  cancel: {
    title: 'Cancellation request',
    button: 'Cancel',
    buttonClass: 'btn-danger',
  },
  update: {
    title: 'Update request',
    button: 'Update',
    buttonClass: 'btn-warning',
  }
};


const constructPage = async () => {
  // Hide invalid section
  invalidSection.style.display = 'none';

  // Attempt auto login
  salesOrderDetails = await getOrderDetails();
  if (salesOrderDetails) {
    showChangeRequestForm();
    return;
  }

  // Build login section
  loginSection.style.display = 'block';
};


const submitLogin = async () => {
  /* Data validation */
  var validForm = true;
  if (validateTarget('login-email')) validForm = false;
  if (validateTarget('login-password')) validForm = false;
  if (!validForm) return;

  // Deactivate login button and show pending
  loginBtn.style.display = 'none';
  loginPending.style.display = 'block';

  // Submit details
  const path = '/api/users/login';
  const headers = {
    'Access-Token': '',
  };
  const method = 'POST';
  const payload = {
    email: loginEmail.value,
    secret: btoa(loginPassword.value),
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) {
    const data = response.response.data;
    localStorage.setItem('123helpmestudy-email', loginEmail.value);
    localStorage.setItem('123helpmestudy-access-token', data['access-token']);
    showChangeRequestForm();
  } else {
    loginErrorCard.style.display = 'block';
    loginErrorMessage.innerText = response.response.message;
  }
  loginPending.style.display = 'none';
  loginBtn.style.display = 'inline';
};


const showChangeRequestForm = async () => {
  // Fetch order details
  if (!salesOrderDetails) salesOrderDetails = await getOrderDetails();
  // Hide login section
  loginSection.style.display = 'none';

  // Add request form details
  requestTitle.innerText = requestTitles[requestType].title;
  bookingName.value = salesOrderDetails.customer_name;
  bookingDate.value = salesOrderDetails.booking_date;
  bookingTime.value = salesOrderDetails.start_time.substring(0, 5);
  bookingDuration.value = `${salesOrderDetails.lesson_duration} minutes`;
  submitBtn.innerText = requestTitles[requestType].button;
  submitBtn.classList.add(requestTitles[requestType].buttonClass);

  // Add event listener to to submit button
  if (requestType === 'update') submitBtn.addEventListener('click', () => {});
  if (requestType === 'cancel') submitBtn.addEventListener('click', cancelOrder);

  // Display form
  requestForm.style.display = 'block';
};


const getOrderDetails = async () => {
  const path = `/api/salesorders/list_order_details?id=${salesOrderId}`;
  const headers = {
    'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
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


const cancelOrder = async () => {
  submitBtn.style.display = 'none';
  const path = '/api/salesorders/cancel_salesorder';
  const headers = {
    'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'PUT';
  const payload = {
    sales_order_id: salesOrderId
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) {
    cancelOrderResponseSection.classList.remove('border-danger');
    cancelOrderResponseSection.classList.remove('warning-bg');
    cancelOrderResponseSection.classList.add('border-success');
    cancelOrderResponseSection.classList.add('success-bg');
    cancelOrderResponseSection.style.display = 'block';
    cancelOrderResponse.innerText = 'Your session has been cancelled';
    return;
  }
  cancelOrderResponseSection.style.display = 'block';
  cancelOrderResponse.innerText = 'Failed to cancel session';
  submitBtn.style.display = 'block';
};