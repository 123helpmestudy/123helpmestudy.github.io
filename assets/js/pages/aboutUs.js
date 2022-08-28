import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';

window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();
}
