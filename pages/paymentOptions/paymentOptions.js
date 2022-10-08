import { setNavigationBar } from '/assets/js/components/navigationBar.js';
import { setContactButtons } from '/assets/js/components/contactButtons.js';
import { home } from '/assets/js/components/routes.js';
import { apiCall } from '/assets/js/components/api.js';
import vars from '/assets/js/vars.js';
import { resetError, setFile } from '/assets/js/components/utils.js';

// Page elements
const pageTitle = document.getElementById('page-title');
const cardPaymentForm = document.getElementById('card-payment-form');
const backBtn = document.getElementById('show-back-button');
const showBankDetails = document.getElementById('show-bank-details');
const payByCard = document.getElementById('pay-by-card-card');
const cardTutorFee = document.getElementById('card-tutor-fee');
const cardAdminFee = document.getElementById('card-admin-fee');
const cardFee = document.getElementById('card-total-fee');
const cardTotalFee = document.getElementById('card-total-fee-value');
const tutorsName1 = document.getElementById('tutors-name-1');
const tutorsName2 = document.getElementById('tutors-name-2');
const payByBank = document.getElementById('pay-by-bank-card');
const bankTutorFee = document.getElementById('BACS-tutor-fee');
const bankAdminFee = document.getElementById('BACS-admin-fee');
const bankTotalFee = document.getElementById('BACS-total-fee');
const bankChargeAmount = document.getElementById('BACS-charge-amount');
const bankEvidenceUpload = document.getElementById('bacs-evidence-upload');
const bankEvidenceBase64 = document.getElementById('bacs-evidence-base64');
const bankEvidenceSubmitBtn = document.getElementById('submit-bacs-evidence-file');
const bankEvidenceError = document.getElementById('error-card');
const bankEvidenceErrorText = document.getElementById('error-response');
const bankEvidencePending = document.getElementById('pending-send');
const platformAccountName = document.getElementById('account-name');
const platformAccountNumber = document.getElementById('account-number');
const platformSortCode = document.getElementById('sort-code');
const platformBankName = document.getElementById('bank-name');
// Stripe elements
const cardError = document.getElementById('error-card-payment-card');
const cardErrorText = document.getElementById('error-response-card-payment');
const cardSuccess = document.getElementById('success-card-payment-card');
const cardSuccessText = document.getElementById('success-response-card-payment');
const stripeCard = document.getElementById('stripe-input-card')
const payBtn = document.getElementById('pay-now-button');
const pendingCardPayment = document.getElementById('pending-card-payment');

// Page variables
const stripe = Stripe(vars.stripeUrl);
let salesOrderId;
let salesOrderDetails;
let clientSecret;
let card; // Stripe element

window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar(true);
  setContactButtons();

  // Add event listener for payment section
  payByCard.addEventListener('click', displayCardDetails);
  payByBank.addEventListener('click', displayBankDetails);

  // Setup stripe card box
  setupStripeCardBox();

  // Add event listener for payment button
  payBtn.addEventListener('click', makePayment);

  // Add event listener for back button
  backBtn.addEventListener('click', back);

  // Add event listeners to 
  bankEvidenceUpload.addEventListener('focus', resetError);
  bankEvidenceUpload.addEventListener(
    'change', () => {
        setFile(
          'bacs-evidence-base64', // output (attribute)
          'bacs-evidence-label', // label
          'bacs-evidence-upload', // input
          ''
        );
    }
  );
  bankEvidenceSubmitBtn.addEventListener('click', submitBankEvidence);

  // Add event listener for screen resize
  window.addEventListener('resize', (event) => {
    if (screen.width > 480) {
      document.getElementById('card-body-payment-form').classList.remove('px-4');
      document.getElementById('card-body-payment-form').classList.add('px-5');
      document.getElementById('card-body-bank-details').classList.remove('px-4');
      document.getElementById('card-body-bank-details').classList.add('px-5');
    } else {
      document.getElementById('card-body-payment-form').classList.remove('px-5');
      document.getElementById('card-body-payment-form').classList.add('px-4');
      document.getElementById('card-body-bank-details').classList.remove('px-5');
      document.getElementById('card-body-bank-details').classList.add('px-4');
    }
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
    'id' in params
  ) {
    salesOrderId = params.id;
    constructPaymentPage();
  } else {
    alert('Invalid location criteria!');
    home();
  }
};

const setupStripeCardBox = () => {
  const elements = stripe.elements();
  let cardFontSize = '13px';
  if (screen.width > 480) cardFontSize = '18px';
  const style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: cardFontSize,
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#444f5a"
      },
      iconColor: "#268df4"
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    },
    complete: {
      iconColor: "#1cce1f"
    }
  };
  card = elements.create("card", { style: style });
  card.mount("#card-element");
  card.on('change', (event) => {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
};

const paymentError = (error) => {
  cardErrorText.innerText = error;
  cardError.style.display = 'block';
  payBtn.style.display = 'block';
  pendingCardPayment.style.display = 'none';
};

const paymentSuccess = () => {
  cardSuccess.style.display = 'block';
  cardSuccessText.innerHTML = `Your payment reference is <b>123-STUDY-${salesOrderId}</b>`;
  pendingCardPayment.style.display = 'none';
  stripeCard.style.display = 'none';
};

const makePayment = () => {
  cardError.style.display = 'none';
  payBtn.style.display = 'none';
  pendingCardPayment.style.display = 'block';
  let customerName = '';
  if (customerName.length == 0) customerName = 'New Customer';
  // Stripe payment confirmation
  stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: customerName
      }
    },
    setup_future_usage: 'off_session'
  }).then((result) => {
    if (result.error) {
      // Inform customer of error
      paymentError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // Inform customer of success
        recordPayment(
          salesOrderId,
          result.paymentIntent.payment_method
        );
        paymentSuccess();
      } else {
        paymentError(
          'An error occured in making the payment, please contact customer support'
        );
      }
    }
  });
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
    total_gross: salesOrderDetails.card_total_fee.toFixed(2)
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


const constructPaymentPage = async () => {
  salesOrderDetails = await fetchOrderDetails(salesOrderId);
  if (!salesOrderDetails) {
    failedToFetch();
    return;
  }
  if (salesOrderDetails.payment_received === 'complete') window.history.go(-1);
  pageTitle.style.display = 'block';
  // Card Payment Details
  payByCard.style.display = 'block';
  cardTutorFee.innerText = `Tutor fee: £${salesOrderDetails.tutor_fee.toFixed(2)}`;
  cardAdminFee.innerText = `Admin fee: £${salesOrderDetails.card_admin_fee.toFixed(2)}`;
  cardFee.innerText = `Total charge: £${salesOrderDetails.card_total_fee.toFixed(2)}`;
  cardTotalFee.value = salesOrderDetails.card_total_fee.toFixed(2);
  tutorsName1.innerText = salesOrderDetails.tutor_name;
  tutorsName2.innerText = salesOrderDetails.tutor_name;
  // Bank Payment Details
  payByBank.style.display = 'block';
  bankTutorFee.innerText = `Tutor fee: £${salesOrderDetails.tutor_fee.toFixed(2)}`;
  bankAdminFee.innerText = `Admin fee: £${salesOrderDetails.bacs_admin_fee.toFixed(2)}`;
  bankTotalFee.innerText = `Total charge: £${salesOrderDetails.bacs_total_fee.toFixed(2)}`;
  bankChargeAmount.innerText =`£${salesOrderDetails.bacs_total_fee.toFixed(2)}`;
  // Platform bank details
  const bankDetails = salesOrderDetails.bank_details;
  platformAccountName.innerText = bankDetails.account_name;
  platformAccountNumber.innerText = bankDetails.account_number;
  platformSortCode.innerText = bankDetails.sort_code;
  platformBankName.innerText = bankDetails.bank_name;
};

const failedToFetch = () => {
  pageTitle.innerHTML = '';
  pageTitle.style.textAlign = 'center';
  const pageTitleText = document.createElement('h1');
  pageTitleText.innerText = 'No order details found';
  pageTitle.appendChild(pageTitleText);
  pageTitle.style.display = 'block';
};

const fetchOrderDetails = async (salesOrderId) => {
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
  if (response.status === 401) home();
  if (response.status === 200) return response.response.data;
  return null;
};

const displayCardDetails = async () => {
  if (
    cardPaymentForm.style.display == 'none' ||
    cardPaymentForm.style.display == ''
  ) {
    backBtn.style.display = 'block';
    cardPaymentForm.style.display = 'block';
    payByBank.style.display = 'none';
  } else {
    backBtn.style.display = 'none';
    cardPaymentForm.style.display = 'none';
    payByBank.style.display = 'block';
  }
  const paymentMethodSet = await setPaymentMethod(salesOrderDetails.payment_methods.stripe.id);
  if (!paymentMethodSet) {
    alert("Could not set payment method. Please contact support.")
    return;
  }
  if (!clientSecret) clientSecret = await createStripePaymentIntent();
};


const setPaymentMethod = async (paymentMethodId) => {
  const path = '/api/salesorders/change_salesorder_payment_method';
  const headers = {
    'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'PUT';
  const payload = {
    sales_order_id: salesOrderId,
    payment_method_id: paymentMethodId,
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) return true;
  return false;
};

const createStripePaymentIntent = async () => {
  const path = '/api/salesorders/create_stripe_initial_payment_intent';
  const headers = {
    'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'POST';
  const payload = {
    customer_id: salesOrderDetails.customer_id,
    amount: salesOrderDetails.card_total_fee.toFixed(2),
    description: `Sales order Id: ${salesOrderId}`
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
  return null;
};


/**
 * Return back to payment selection
 */
const back = () => {
  backBtn.style.display = 'none';
  showBankDetails.style.display = 'none';
  cardPaymentForm.style.display = 'none';
  payByBank.style.display = 'block';
  payByCard.style.display = 'block';
};


const displayBankDetails = async () => {
  if (
    showBankDetails.style.display == 'none' ||
    showBankDetails.style.display == ''
  ) {
    backBtn.style.display = 'block';
    showBankDetails.style.display = 'block';
    payByCard.style.display = 'none';
  } else {
    backBtn.style.display = 'none';
    showBankDetails.style.display = 'none';
    payByCard.style.display = 'block';
  }
  const paymentMethodSet = await setPaymentMethod(salesOrderDetails.payment_methods.bacs.id);
  if (!paymentMethodSet) {
    alert("Could not set payment method. Please contact support.")
    return;
  }
};


const submitBankEvidence = async () => {
  if (bankEvidenceBase64.innerText.length === 0) {
    bankEvidenceError.style.display = 'block';
    return;
  }
  // Show loading
  bankEvidenceSubmitBtn.style.display = 'none';
  bankEvidencePending.style.display = 'block';
  // Execute API
  const path = '/api/users/update_user_attribute';
  const headers = {
      'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
  };
  const method = 'PUT';
  const payload = {
    email: localStorage.getItem('123helpmestudy-email'),
    attribute: 'bacs_evidence',
    value: bankEvidenceBase64.innerText
  };
  const response = await apiCall(
    path,
    headers,
    method,
    payload
  );
  if (response.status === 401) home();
  if (response.status === 200) {
    bankEvidenceErrorText.innerText = 'Thank you for submitting evidence of your BACS payment';
    bankEvidenceError.classList.remove('border-danger');
    bankEvidenceError.classList.remove('warning-bg');
    bankEvidenceError.classList.add('border-success');
    bankEvidenceError.classList.add('success-bg');
    bankEvidenceError.style.display = 'block';
    bankEvidencePending.style.display = 'none';
    return;
  }
  bankEvidenceErrorText.innerText = 'Something went wrong with your upload'
  bankEvidenceError.style.display = 'block';
};