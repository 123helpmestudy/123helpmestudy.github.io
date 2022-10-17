import { setNavigationBar } from '/assets/js/components/navigationBar.js';
import { setPageHeader } from '/assets/js/components/pageHeader.js';
import { setPageFooter } from '/assets/js/components/pageFooter.js';
import { setContactButtons } from '/assets/js/components/contactButtons.js';

window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();
}
