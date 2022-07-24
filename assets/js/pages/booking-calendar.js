import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';
import { apiCall } from '../components/api.js';
import { home } from '../components/routes.js';

const calendar = document.getElementById('build-calendar');
const yearDisplay = document.getElementById('calendar-year');
const monthisplay = document.getElementById('calendar-month');
const increaseMonthBtn = document.getElementById('increase-month');
const decreaseMonthBtn = document.getElementById('decrease-month');


window.addEventListener('DOMContentLoaded', main);
function main() {
  setNavigationBar();
  setPageHeader();
  setPageFooter();
  setContactButtons();

  // Unpack search parameters locally
  unpackSearchParams();

  // Set calendar month
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  yearDisplay.innerText = nowYear;
  setCalendarMonth(nowMonth);

  // Build calendar
  buildCalendar(nowYear, nowMonth);

  // Add event listener for increaseing / decreasing month
  increaseMonthBtn.addEventListener('click', calculateNextMonthYear);
  decreaseMonthBtn.addEventListener('click', calculatePrevMonthYear);
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
    'subject' in params
  ) {
    tutorSelected.innerHTML = params.tutor;
    subjectSelected.innerHTML = params.subject;
    fetchProfile(params.tutor);
  } else {
    alert('Invalid location criteria!');
    home();
  }
};

const calculateNextMonthYear = () => {
  let year = parseInt(yearDisplay.innerText);
  const monthName = monthisplay.innerText;
  let monthNumber = 0;
  for (let i = 0; i < months.length; i++) {
    if (monthName === months[i].name) monthNumber = months[i].number;
  }
  monthNumber++;
  if (monthNumber === 13) {
    monthNumber = 1;
    year++;
  }
  // Set the year
  yearDisplay.innerText = year;
  setCalendarMonth(monthNumber);
  // Build calendar
  buildCalendar(year, monthNumber);
};

const calculatePrevMonthYear = () => {
  let year = parseInt(yearDisplay.innerText);
  const monthName = monthisplay.innerText;
  let monthNumber = 0;
  for (let i = 0; i < months.length; i++) {
    if (monthName === months[i].name) monthNumber = months[i].number;
  }
  monthNumber--;
  if (monthNumber === 0) {
    monthNumber = 12;
    year--;
  }
  // Set the year
  yearDisplay.innerText = year;
  setCalendarMonth(monthNumber);
  // Build calendar
  buildCalendar(year, monthNumber);
};

const setCalendarMonth = (month) => {
  monthisplay.innerText = months[(month - 1)].name;
};

const buildCalendar = (year, month) => {
  calendar.innerHTML = '';
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
      let entryContents = document.createElement('p');
      entryContents = pStyle(entryContents);
      if ((i + 1) === startOfMonthDayOfWeek && dayNumber === 1) displayDayOfMonth = true;
      if (dayNumber > monthDetails.days) displayDayOfMonth = false;
      console.log(dayNumber);
      console.log(monthDetails.days);
      console.log(displayDayOfMonth);
      if (
        dayNumber === now.getDate() &&
        month === (now.getMonth() + 1) &&
        year === now.getFullYear()
      ){
        entryContents.style.borderRadius = '50%';
        // entryContents.style.backgroundColor = '#95ceff';
        entryContents.style.backgroundColor = 'rgba(225, 225, 225, 1)';
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
  calendar.appendChild(calendarTable);
};

const tdStyle = (e) => {
  e.style.height = '70px';
  e.style.width = '70px';
  e.style.cursor = 'pointer';
  return e;
};

const pStyle = (e) => {
  e.style.padding = '15px';
  e.style.paddingLeft = '18px';
  e.style.paddingRight = '18px';
  e.style.margin = '0px';
  e.style.display = 'inline';
  e.style.verticalAlign = 'middle';
  return e;
};

const daysOfWeek = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

const months = [
  {
    number: 1,
    name: 'January',
    days: 31,
  },
  {
    number: 2,
    name: 'February',
    days: 28,
  },
  {
    number: 3,
    name: 'March',
    days: 31,
  },
  {
    number: 4,
    name: 'April',
    days: 30,
  },
  {
    number: 5,
    name: 'May',
    days: 31,
  },
  {
    number: 6,
    name: 'June',
    days: 30,
  },
  {
    number: 7,
    name: 'July',
    days: 31,
  },
  {
    number: 8,
    name: 'August',
    days: 31,
  },
  {
    number: 9,
    name: 'September',
    days: 30,
  },
  {
    number: 10,
    name: 'October',
    days: 31,
  },
  {
    number: 11,
    name: 'November',
    days: 30,
  },
  {
    number: 12,
    name: 'December',
    days: 31,
  },
];


const buildAvailability = () => {

};