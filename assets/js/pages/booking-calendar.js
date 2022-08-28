/**
 * LOGIC BREAKDOWN
 * PAGE LOAD --> DISPLAY CALENDAR --> LOGIN --> GET CUSTOMER ID --> GET TUTOR ID --> CREATE SALESORDER --> CREATE STRIPE INTENT --> DISPLAY SUMMARY DETAILS --> MAKE PAYMENT
 */

import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';
import { apiCall } from '../components/api.js';
import { home } from '../components/routes.js';
import {
  resetInvalidInput,
  resetError,
  validateTarget,
  messageCounter
} from './../components/utils.js';
import vars from '../vars.js';
import { daysOfWeek, months } from '../components/date.js';

let largeScreen = window.innerWidth < 625 ? false : true;

const calendar = document.getElementById('build-calendar');
const yearDisplay = document.getElementById('calendar-year');
const monthisplay = document.getElementById('calendar-month');
const increaseMonthBtn = document.getElementById('increase-month');
const decreaseMonthBtn = document.getElementById('decrease-month');
const calendarLoading = document.getElementById('pending-load-calendar');
const availabilityPicker = document.getElementById('availability-picker');
const backToTopBtn = document.getElementById('back-to-top');
const noAccountLink = document.getElementById('login-no-account');

let isLoading = false;

let username;
let tutorDetails;
let availability = {};
let activeDayPicked;
let activeSubjectId;
let salesOrderDetails;
let lessonFee;
let discountCode;
let customerId;
let clientSecret;
let requestedDuration;

// Store user interaction events
let activeYear;
let activeMonth;
let activeDay;
let activeSlot;
let activeDuration;

// Login form
const loginSection = document.getElementById('login-section');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-submit');
const loginPending = document.getElementById('pending-login');
const loginErrorCard = document.getElementById('login-error-card');
const loginErrorMessage = document.getElementById('login-error-response');

// Details form
const formSection = document.getElementById('details-form');
const formDate = document.getElementById('date');
const formTimeSlot = document.getElementById('time-slot');
const formDuration = document.getElementById('duration');
const formDiscountCode = document.getElementById('discount-code');
const formDiscountCodeBtn = document.getElementById('submit-discount-code');
const formDiscountMsgSection = document.getElementById('discount-code-message-section');
const formDiscountMsg = document.getElementById('discount-code-message');
const formPrice = document.getElementById('price');
const formEmail = document.getElementById('email');
const formMessage = document.getElementById('message');
const formSubmit = document.getElementById('submit-calendar');
const pendingPaymentLoader = document.getElementById('pending-card-payment');
const stripePaymentSection = document.getElementById('payment-section');
const stripeInputBox = document.getElementById('stripe-input-card');
const stripeSuccessSection = document.getElementById('success-card-payment-card');
const stripeSuccessMessage = document.getElementById('success-response-card-payment');

// Stripe
const errorWithCardPaymentBox = document.getElementById('error-card-payment-card');
const errorWithCardPaymentMessage = document.getElementById('error-response-card-payment');
const stripe = Stripe(vars.stripeUrl);
let stripeCard;

window.addEventListener('DOMContentLoaded', main);
function main() {
  isLoading = true;
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();

  // Set calendar month
  const now = new Date();
  activeYear = now.getFullYear();
  activeMonth = now.getMonth() + 1;
  yearDisplay.innerText = activeYear;
  setCalendarMonth(activeMonth);

  // Add event listener for increaseing / decreasing month
  increaseMonthBtn.addEventListener('click', calculateNextMonthYear);
  decreaseMonthBtn.addEventListener('click', calculatePrevMonthYear);

  // Add event listener to back to top button
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo(0, 0);
  });

  // Add event listener to pay / submit button
  formEmail.addEventListener('focus', resetInvalidInput);
  formMessage.addEventListener('focus', resetInvalidInput);
  formSubmit.addEventListener('click', submitForm);
  formDiscountCodeBtn.addEventListener('click', () => {applyDiscountCode(false)});
  messageCounter('message', 'message-str-len');

  // Set the no account link
  noAccountLink.href = `${window.location.origin}/information/sign-up.html`;

  // Add event listener for login submit
  loginBtn.addEventListener('click', submitLogin);
  loginEmail.addEventListener('focus', resetInvalidInput);
  loginPassword.addEventListener('focus', resetInvalidInput);
  if (localStorage.getItem('123helpmestudy-email')) loginEmail.value = localStorage.getItem('123helpmestudy-email');

  // Add event listener for screen width
  window.addEventListener('resize', (event) => {
    // transition if screen size becomes small and was a large screen
    if (window.innerWidth < 625 && largeScreen) {
      calendar.innerHTML = '';
      buildCalendar(activeYear, activeMonth);
      largeScreen = false;
    }
    // transition if screen size becomes large and was a small screen
    if (window.innerWidth >= 625 && !largeScreen) {
      calendar.innerHTML = '';
      buildCalendar(activeYear, activeMonth);
      largeScreen = true;
    }
    tinyScreenCheck();
  });

  // Unpack search parameters locally
  unpackSearchParams(activeYear, activeMonth);

  // Setup Stripe
  setupStripeBox();
}

const tinyScreenCheck = () => {
  if (window.innerWidth < 375) {
    calendar.innerHTML = `<p>Your screen size is too small, try rotating your screen.</p><div><img style="width: 50%;" src="${window.location.origin}/assets/images/rotate-smartphone.png" /></div>`;
  }
};

const unpackSearchParams = (year, month) => {
  if (!window.location.search) home();
  let params = {};
  const keyValList = window.location.search.substring(1).split('&');
  for (let i = 0; i < keyValList.length; i++) {
    let [key, val] = keyValList[i].split('=');
    params[key] = val;
  }
  if (
    'username' in params &&
    'subject' in params
  ) {
    if ('dur' in params) requestedDuration = parseInt(params.dur);
    if ('code' in params) discountCode = params.code;
    username = params.username;
    activeSubjectId = params.subject;
    buildAvailability(params.username);
  } else {
    alert('Invalid username and subject!');
    home();
  }
};

const calculateNextMonthYear = () => {
  if (isLoading) return;
  isLoading = true;
  calendar.innerHTML = '';
  availabilityPicker.innerHTML = '';
  calendarLoading.style.display = 'block';

  activeMonth++;
  if (activeMonth === 13) {
    activeMonth = 1;
    activeYear++;
  }

  // Set the year
  yearDisplay.innerText = activeYear;
  setCalendarMonth(activeMonth);
  // Build calendar
  buildAvailability(username, activeYear, activeMonth);
};

const calculatePrevMonthYear = () => {
  if (isLoading) return;
  isLoading = true;
  calendar.innerHTML = '';
  availabilityPicker.innerHTML = '';
  calendarLoading.style.display = 'block';

  activeMonth--;
  if (activeMonth === 0) {
    activeMonth = 12;
    activeYear--;
  }

  // Set the year
  yearDisplay.innerText = activeYear;
  setCalendarMonth(activeMonth);
  // Build calendar
  buildAvailability(username, activeYear, activeMonth);
};

const setCalendarMonth = (month) => {
  monthisplay.innerText = months[(month - 1)].name;
};

const buildCalendar = (year, month) => {
  const now = new Date();
  // Define the start  of the month
  const startOfMonth = new Date(year, (month - 1), 1);
  let startOfMonthDayOfWeek = startOfMonth.getDay();
  if (startOfMonthDayOfWeek === 0) startOfMonthDayOfWeek = 7;
  
  const monthDetails = months[(month - 1)];

  const calendarTable = document.createElement('table');
  calendarTable.style.marginLeft = 'auto';
  calendarTable.style.marginRight = 'auto';
  const calendarHeader = document.createElement('tr');
  // Add days of the week to the header
  for (let i = 0; i < daysOfWeek.length; i++) {
    let header = document.createElement('td');
    header = tdStyle(header);
    let headerContents = document.createElement('p');
    headerContents = pStyle(headerContents);
    headerContents.style.fontWeight = '600';
    headerContents.style.cursor = 'auto';
    headerContents.innerText = daysOfWeek[i];
    header.appendChild(headerContents);
    calendarHeader.appendChild(header);
  }
  calendarTable.appendChild(calendarHeader);

  let dayNumber = 1;
  let displayDayOfMonth = false;
  while (dayNumber <= monthDetails.days) {
    let calendarRow = document.createElement('tr');
    for (let i = 0; i < daysOfWeek.length; i++) {
      let entry = document.createElement('td');
      // Add event listener to entry
      entry.addEventListener('click', dayPicker);
      let entryContents = document.createElement('p');
      entryContents = pStyle(entryContents);
      if ((i + 1) === startOfMonthDayOfWeek && dayNumber === 1) displayDayOfMonth = true;
      if (dayNumber > monthDetails.days) displayDayOfMonth = false;
      if (
        dayNumber === now.getDate() &&
        month === (now.getMonth() + 1) &&
        year === now.getFullYear()
      ){
        entryContents.style.borderRadius = '50%';
        entryContents.style.backgroundColor = 'rgba(225, 225, 225, 1)';
        if (dayNumber < 10) entryContents.style.paddingLeft = '22px';
        if (dayNumber < 10 && window.innerWidth < 625) entryContents.style.paddingLeft = '11px';
        if (dayNumber < 10) entryContents.style.paddingRight = '22px';
        if (dayNumber < 10 && window.innerWidth < 625) entryContents.style.paddingRight = '11px';
        entry.removeEventListener('click', dayPicker);
      }
      // Check if there is availability
      let strDayNumber = `${dayNumber}`;
      if (dayNumber < 10) strDayNumber = `0${dayNumber}`;
      let strMonth = `${month}`;
      if (parseInt(month) < 10) strMonth = `0${month}`;
      if (availability.hasOwnProperty(`${year}-${strMonth}-${strDayNumber}`)) {
        entryContents.style.borderRadius = '50%';
        entryContents.style.backgroundColor = '#95ceff';
        if (dayNumber < 10) entryContents.style.paddingLeft = '22px';
        if (dayNumber < 10 && window.innerWidth < 625) entryContents.style.paddingLeft = '11px';
        if (dayNumber < 10) entryContents.style.paddingRight = '22px';
        if (dayNumber < 10 && window.innerWidth < 625) entryContents.style.paddingRight = '11px';
      }
      entryContents.innerText = '';
      entry = tdStyle(entry);
      // Override and display day
      if (displayDayOfMonth) {
        entryContents.innerText = dayNumber;
        dayNumber++;
      }

      entry.appendChild(entryContents);
      calendarRow.appendChild(entry);
    }
    calendarTable.appendChild(calendarRow);
  }
  calendarLoading.style.display = 'none';
  calendar.appendChild(calendarTable);
  // Set is loading to false
  isLoading = false;
};

const tdStyle = (e) => {
  if (window.innerWidth < 625) {
    e.style.height = '40px';
    e.style.width = '41px';
  } else {
    e.style.height = '70px';
    e.style.width = '70px';
  }
  e.style.cursor = 'pointer';
  return e;
};

const pStyle = (e) => {
  if (window.innerWidth < 625) {
    e.style.padding = '4px';
    e.style.paddingLeft = '6px';
    e.style.paddingRight = '6px';
  } else {
    e.style.padding = '15px';
    e.style.paddingLeft = '18px';
    e.style.paddingRight = '18px';
  }
  e.style.margin = '0px';
  e.style.display = 'inline';
  e.style.verticalAlign = 'middle';
  return e;
};


const buildAvailability = async (username) => {
  // Fetch availability
  availability = await fetchSchedule(username, activeYear, activeMonth);
  // Build calendar
  buildCalendar(activeYear, activeMonth);
  tutorDetails = await fetchTutorDetails(username);
  tinyScreenCheck();
};

const fetchSchedule = async (username, year, month) => {
  const path = `/api/users/open_schedule?username=${username}&year=${year}&month=${month}`;
  const headers = {};
  const method = 'GET';
  const payload = {};
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) return response.response.availability;
  return {};
};

const dayPicker = (event) => {
  const day = parseInt(event.target.innerText);
  const previousDay = activeDay;
  activeDay = day;
  const year = activeYear;
  const month = activeMonth;

  // Define string date
  let strDayNumber = `${day}`;
  if (day < 10) strDayNumber = `0${day}`;

  let strPrevDayNumber = `${previousDay}`;
  if (previousDay < 10) strPrevDayNumber = `0${previousDay}`;

  let strMonth = `${month}`;
  if (month < 10) strMonth = `0${month}`;

  const stringPrevDate = `${year}-${strMonth}-${strPrevDayNumber}`
  const stringDate = `${year}-${strMonth}-${strDayNumber}`

  // Unstyle previous node
  if (activeDayPicked !== undefined) {
    if (availability.hasOwnProperty(stringPrevDate)) {
      activeDayPicked.style.backgroundColor = '#95ceff';
    } else {
      activeDayPicked.style.backgroundColor = '';
    }
    activeDayPicked.style.color = '#000000';
  }
  // Get p node to style
  let pNode = event.target;
  if (event.target.localName === 'td') {
    pNode = event.target.childNodes[0];
  }
  // Make pNode active
  pNode.style.backgroundColor = '#007bff';
  pNode.style.color = '#ffffff';
  pNode.style.borderRadius = '50%';
  if (day < 10) pNode.style.paddingLeft = '22px';
  if (day < 10) pNode.style.paddingRight = '22px';
  
  // Set new activeDayPicked Node
  activeDayPicked = pNode;

  // Load content into the availability section
  backToTopBtn.style.display = 'none';
  availabilityPicker.innerHTML = '';

  let slots = [];
  // Check if there is availability
  if (availability.hasOwnProperty(stringDate)) slots = availability[stringDate];
  if (slots.length === 0) return;
  // Display slots
  for (let i = 0; i < slots.length; i++) {
    let [slotStart, slotEnd] = slots[i];
    let box = document.createElement('div');
    box.style.marginTop = '20px';
    box.style.marginBottom = '20px';
    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.padding = '15px';
    // Make an hourly slot if reqquested
    if (
      requestedDuration &&
      requestedDuration === 60 &&
      checkForNextSlot(slotStart, slotEnd, slots)
    ) {
      let slotStartHour = parseInt(slotStart.substring(0, 2));
      let nextHour = slotStartHour + 1;
      let strNextHour = `${nextHour}:${slotStart.substring(3, 5)}`;
      if (nextHour < 10) strNextHour = `0${nextHour}:${slotStart.substring(3, 5)}`;
      slotEnd = strNextHour;
    }
    // Validate slot conforms to requested duration
    if (requestedDuration && requestedDuration !== getSlotDuration(slotStart, slotEnd)) continue;
    btn.innerText = `${slotStart} to ${slotEnd}`;
    btn.addEventListener('click', showConfirmTime)
    box.appendChild(btn);
    availabilityPicker.appendChild(box);
  }
  if (availabilityPicker.childNodes.length === 0) {
    availabilityPicker.innerText = `No available slots for the requested duration of ${requestedDuration} minutes`;
  }
  backToTopBtn.style.display = 'block';
};

const checkForNextSlot = (start, end, slots) => {
  for (let i = 0; i < slots.length; i++) {
    let [slotStart, slotEnd] = slots[i];
    if (end === slotStart) return true;
  }
  return false;
};

const showConfirmTime = (event) => {
  const parentEl = event.path[1];
  activeSlot = parentEl.innerText;
  // Remove the confirm button if it exists
  if (parentEl.children.length === 2) {
    const timeBtn = parentEl.children[0];
    parentEl.innerHTML = '';
    parentEl.appendChild(timeBtn)    
  } else {
    // Add the confirm button to the page
    const btn = document.createElement('button');
    btn.className = 'btn btn-success';
    btn.innerText = 'Confirm';
    btn.style.padding = '15px';
    btn.style.marginLeft = '10px';
    btn.addEventListener('click', confirmTime);
    parentEl.appendChild(btn);
  }
};

const getSlotDuration = (slotStart, slotEnd) => {
  let duration;
  // Calculate the lesson duration
  const slotStartDateTime = new Date(
    activeYear,
    activeMonth,
    activeDay,
    parseInt(slotStart.substring(0, 2)),
    parseInt(slotStart.substring(3, 5)),
  );
  const slotEndDateTime = new Date(
    activeYear,
    activeMonth,
    activeDay,
    parseInt(slotEnd.substring(0, 2)),
    parseInt(slotEnd.substring(3, 5)),
  );
  duration = (slotEndDateTime.getTime() - slotStartDateTime.getTime()) / (1000 * 60);
  return duration
};

const confirmTime = (event) => {
  // Hide date picked and availability
  calendar.style.display = 'none';
  availabilityPicker.style.display = 'none';
  backToTopBtn.style.display = 'none';
  yearDisplay.style.display = 'none';
  monthisplay.style.display = 'none';
  increaseMonthBtn.style.display = 'none';
  decreaseMonthBtn.style.display = 'none';

  // Show the login section
  loginSection.style.display = 'block';

  // Set form date
  let strDayNumber = `${activeDay}`;
  if (activeDay < 10) strDayNumber = `0${activeDay}`;
  let strMonth = `${activeMonth}`;
  if (activeMonth < 10) strMonth = `0${activeMonth}`;

  // Set form data
  formDate.value = `${activeYear}-${strMonth}-${strDayNumber}`;
  formTimeSlot.value = activeSlot;
  const [slotStart, slotEnd] = activeSlot.split(' to ');
  activeDuration = getSlotDuration(slotStart, slotEnd);
  formEmail.value = loginEmail.value;
  if (!lessonFee) lessonFee = (parseFloat(tutorDetails.hourly_rate) + parseFloat(tutorDetails.admin_fee)) * activeDuration / 60;
  formPrice.value = `£${lessonFee.toFixed(2)}`;
  formDuration.value = activeDuration;
  if (discountCode) {
    formDiscountCode.value = discountCode;
    formDiscountCode.disabled = true;
    formDiscountCodeBtn.style.display = 'none';
  }
};

const submitForm = () => {
  // Validate the form email and message
  let validForm = true;
  if (validateTarget('email')) validForm = false;
  // if (validateTarget('message')) validForm = false;
  if (!validForm) return;

  makePayment(formEmail.value);
};

const setupStripeBox = () => {
  const elements = stripe.elements();
  const cardFont = screen.width > 480 ? '18px' : '13px';
  const style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: cardFont,
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#444f5a'
      },
      iconColor: '#268df4'
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    },
    complete: {
      iconColor: '#1cce1f'
    }
  };
  stripeCard = elements.create('card', { style: style });
  stripeCard.mount('#card-element');
  stripeCard.on('change', (event) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
};

const createStripePaymentIntent = async () => {
  const path = '/api/salesorders/create_stripe_initial_payment_intent';
  const headers = {
      'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'POST';
  const payload = {
      customer_id: customerId,
      amount: lessonFee.toFixed(2),
      description: `Sales order Id: ${salesOrderDetails.order_id}`
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 402) {
    // Create the stripe customer id
    await createStripeCustomerId();
    // Call this method again
    return await createStripePaymentIntent();
  }
  if (response.status === 200) return response.response.data.client_secret;
  loginErrorCard.style.display = 'block';
  loginErrorMessage.innerText = response.response.message;
  return;
};

const createStripeCustomerId = async () => {
  const path = '/api/users/create_stripe_customer';
  const headers = {
      'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'POST';
  const payload = {
      customer_id: customerId,
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) return;
  loginErrorCard.style.display = 'block';
  loginErrorMessage.innerText = response.response.message;
  return;
};

const makePayment = (email) => {
  errorWithCardPaymentBox.style.display = 'none';
  formSubmit.style.display = 'none';
  pendingPaymentLoader.style.display = 'block';
  stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: stripeCard,
      billing_details: {
        name: email
      }
    },
    setup_future_usage: 'off_session'
  }).then((result) => {
    if (result.error) {
      paymentError(result.error.message);
      // Hide payment pending loader
      pendingPaymentLoader.style.display = 'none';
      // Display pay button again
      formSubmit.style.display = 'inline';
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        const recordedPayment = recordPayment(
          salesOrderDetails.order_id,
          result.paymentIntent.payment_method
        );
        if (recordedPayment !== null) {
          stripeSuccessSection.style.display = 'block';
          stripeSuccessMessage.innerHTML = `Your payment reference is <b>123-STUDY-${salesOrderDetails.order_id}</b>`;
          stripeInputBox.style.display = 'none';
          formMessage.disabled = true;
        }
      }
    }
    // Hide payment pending loader
    pendingPaymentLoader.style.display = 'none';
  });
}

const paymentError = (error) => {
  errorWithCardPaymentBox.style.display = 'block';
  errorWithCardPaymentMessage.innerText = error;
  formSubmit.style.display = 'inline';
};


const recordPayment = async (salesOrderId, stripeReference) => {
  const path = '/api/salesorders/confirm_payment_received';
  const headers = {
    'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'PUT';
  const payload = {
    sales_order_id: salesOrderId,
    payment_reference: stripeReference, // Stripe reference
    total_gross: lessonFee.toFixed(2),
    message: formMessage.value,
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status !== 200) {
    paymentError(response.response.message);
    return null;
  }
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
    // Fetch customer ID
    const userAttributes = await fetchUserAttributes();
    // Get the customer ID from the attributes
    for (let i = 0; i < userAttributes.length; i++) {
      if (userAttributes[i].attribute === 'user_id') customerId = userAttributes[i].value;
    }
    if (customerId === undefined) {
      loginErrorCard.style.display = 'block';
      loginErrorMessage.innerText = 'Failed to find your customer ID';
    } else {
      // Create the sales order
      salesOrderDetails = await createSalesOrder(customerId);
      // Apply discount code if it exists
      if (discountCode) await applyDiscountCode(true);
      // Create stripe payment intent
      if (lessonFee > 0) clientSecret = await createStripePaymentIntent();
      if (lessonFee > 0 && salesOrderDetails && clientSecret) {
        // Hide loading section
        loginSection.style.display = 'none';
        // Show order details section
        formSection.style.display = 'block';
      } else if (discountCode && lessonFee === 0 && salesOrderDetails) {
        // Hide loading section
        loginSection.style.display = 'none';
        // Show order details section
        formSection.style.display = 'block';
      }
    }
  } else {
    loginErrorCard.style.display = 'block';
    loginErrorMessage.innerText = response.response.message;
  }
  loginPending.style.display = 'none';
  loginBtn.style.display = 'inline';
};


const fetchUserAttributes = async () => {
  const path = `/api/users/list_user_attributes?email=${loginEmail.value}`;
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
  return [];
};


const createSalesOrder = async (customerId) => {
  const path = '/api/salesorders/create_sales_order';
  const headers = {
    'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'POST';
  const payload = {
    sales_source: "123 Help Me Study",
    customer_id: customerId,
    student_id: customerId,
    subject_id: activeSubjectId,
    student_level_id: 1,
    examining_body: '',
    requested_booking_date: `${activeYear}-${activeMonth}-${activeDay}`,
    promised_booking_date: `${activeYear}-${activeMonth}-${activeDay}`,
    customer_comments: '',
    internal_comments: 'Created through calendar',
    start_time: `${activeSlot.substring(0, 5)}:00`,
    lesson_duration: activeDuration,
    tutor_id: username,
    lesson_location: 'online',
    location: '',
    hourly_rate: (parseFloat(tutorDetails.hourly_rate) + parseFloat(tutorDetails.admin_fee)).toFixed(2),
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) return response.response;
  loginErrorCard.style.display = 'block';
  loginErrorMessage.innerText = response.response.message;
  return;
};


const fetchTutorDetails = async (username) => {
  const path = `/api/salesorders/show_tutor?tutor=${username}`;
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

const applyDiscountCode = async (automatic) => {
  /* Data validation - only when not automatic*/
  if (!automatic) {
    discountCode = formDiscountCode.value;
    let validForm = true;
    if (validateTarget('discount-code')) validForm = false;
    if (!validForm) return;
  }
  const path = '/api/salesorders/apply_discount_code';
  const headers = {
    'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'PUT';
  const payload = {
    sales_order_id: salesOrderDetails.order_id,
    code: discountCode,
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) {
    const discountDetails = response.response;
    if (discountDetails.discount_applied) {
      formDiscountMsg.innerText = 'Discount applied';
      formDiscountMsg.style.color = '#28a745'; // green
      formPrice.value = `£${discountDetails.discount_amount.toFixed(2)}`;
      lessonFee = discountDetails.discount_amount;
      formDiscountMsgSection.style.display = 'block';
      // Disable the field and hide apply button
      formDiscountCodeBtn.style.display = 'none';
      formDiscountCode.disabled = true;
      // Check if the code amount results in nothing to pay
      if (discountDetails.discount_amount === 0) {
        // Hide the payment section
        stripeInputBox.style.display = 'none';
        // Remove the standard recording functionality for payments
        formSubmit.removeEventListener('click', submitForm);
        // Change the text of the payment button to submit instead
        formSubmit.innerText = 'Submit';
        // Add the recording process for payment
        formSubmit.addEventListener('click', () => {
          const recordedPayment = recordPayment(
            salesOrderDetails.order_id,
            `Discount code: ${discountCode}`
          );
          if (recordedPayment !== null) {
            stripeSuccessSection.style.display = 'block';
            stripeSuccessMessage.innerHTML = `Your payment reference is <b>123-STUDY-${salesOrderDetails.order_id}</b>`;
            formMessage.disabled = true;
            formSubmit.style.display = 'none';
          }
        });
      } else {
        clientSecret = await createStripePaymentIntent(customerId, discountDetails.discount_amount);
      }
    } else {
      formDiscountMsg.innerText = 'Invalid discount code';
      formDiscountMsg.style.color = '#dc3545'; // red
      formDiscountMsgSection.style.display = 'block';
    }
    return;
  };
  formDiscountMsg.innerText = response.response.message;
  formDiscountMsg.style.color = '#dc3545'; // red
  formDiscountMsgSection.style.display = 'block';
};