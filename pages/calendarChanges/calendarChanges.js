import { setNavigationBar } from '/assets/js/components/navigationBar.js';
import { setPageHeader } from '/assets/js/components/pageHeader.js';
import { setPageFooter } from '/assets/js/components/pageFooter.js';
import { setContactButtons } from '/assets/js/components/contactButtons.js';
import { apiCall } from '/assets/js/components/api.js'
import { home } from '/assets/js/components/routes.js';


const requestTitle = document.getElementById('request-title');

let requestType;

window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();



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
    'type' in params
  ) {
    requestType = params.type;
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
    buttonClass: 'btn-warning',
  },
  update: {
    title: 'Update request',
    button: 'Update',
    buttonClass: 'btn-danger',
  }
};

const constructPage = () => {
  requestTitle.innerText = requestTitles[requestType].title;
};