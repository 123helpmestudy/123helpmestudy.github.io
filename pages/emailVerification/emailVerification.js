import { setContactButtons } from '/assets/js/components/contactButtons.js';
import { setFaqModal } from '/assets/js/components/faqModal.js';
import { resetInvalidInput, resetError, validateTarget } from '/assets/js/components/utils.js';
import { apiCall } from '/assets/js/components/api.js';

const submitBtn = document.getElementById('submit-email-veri');
const email = document.getElementById('email');
const token = document.getElementById('token');
const errorCard = document.getElementById('error-card');
const errorResponse = document.getElementById('error-response');

window.addEventListener('DOMContentLoaded', main);
function main() {
  setContactButtons();
  setFaqModal({ show: true });

  // Add event listener for submit button
  submitBtn.addEventListener('click', submitForm);

  // Add event listeners for form
  email.addEventListener('focus', resetInvalidInput);
  token.addEventListener('focus', resetInvalidInput);

  // Unpack search parameters locally
  unpackSearchParams();
}

const unpackSearchParams = () => {
  if (!window.location.search) {
    return;
  }
  let params = {};
  const keyValList = window.location.search.substring(1).split('&');
  for (let i = 0; i < keyValList.length; i++) {
    let [key, val] = keyValList[i].split('=');
    params[key] = val;
  }
  if (
    'email' in params ||
    'token' in params
  ) {
    if ('email' in params) email.value = params.email;
    if ('token' in params) token.value = params.token.replace('~', '=');
  }
};

const submitForm = async () => {
  let validForm = true;
  if (validateTarget('email')) validForm = false;
  if (validateTarget('token')) validForm = false;
  if (!validForm) return;

  const path = '/api/users/validate';
  const headers = {
    'Access-Token': '',
  };
  const method = 'PUT';
  const payload = {
    email: email.value,
    email_token: token.value,
  };
  const response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) {
    const parameters = `?email=${payload.email}`;
    window.location.assign(`${window.location.origin}/information/login.html${parameters}`);
    return;
  } else {
    errorCard.style.display = 'block';
    errorResponse.innerHTML = response.response.message;
    return;
  }
};



/*
if (window.location.search) {
        var get_params = {};
        var get_string = (window
          .location
          .search
          .toString()
          .replace('?', '')
          .split('&'));
        for (var a = 0; a < get_string.length; a++) {
          var key_value = get_string[a].split('=');
          get_params[key_value[0]] = key_value[1];
        }
        //console.log(get_params);
        if ('email' in get_params) {
          document.getElementById('email').value = get_params['email'];
        }
        if ('token' in get_params) {
          //console.log(get_params['token'].replace('~', '='));
          document.getElementById('email_token').value = get_params['token'].replace('~', '=');
        }
      }
*/