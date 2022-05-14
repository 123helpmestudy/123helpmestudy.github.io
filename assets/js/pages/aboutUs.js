import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';

window.addEventListener('DOMContentLoaded', main);
function main() {
    const base = window.location.origin;
    setNavigationBar(base);
    setPageHeader();
    setPageFooter(base);
    setContactButtons(base);
}
