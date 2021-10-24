import { sleep, api_call } from '../utils.js';

window.addEventListener('DOMContentLoaded', calendar_page_load_page);


async function calendar_page_load_page() {
    // Render Calendar
    createCalendar([]);
    // Adjust height for the windows size to 75% height of whole window
    document.getElementById('calendar').style.height = (window.innerHeight * 0.7) + 'px';
    // Adjust the max width of the calendar card
    if (window.innerWidth > 900) {
        document.getElementById('calendar-parent-card').style.maxWidth = (window.innerWidth * 0.75) + 'px';
    }
    // Fetch events array and load into calendar
    var path = ('/api/users/schedule?email='
                +localStorage.getItem('123helpmestudy-email'));
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'GET';
    var payload = {};
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        console.log(response['response']['events']);
        createCalendar(response['response']['events']);
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/calendar.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    // console.log(response['status']);
    // console.log(response['response']);
}


function createCalendar(events) {
    // Load empty calendar
    let calendarEvents = events;
    // Calculate the screen width and render appropriate calendar
    let calendarView = 'timeGridDay';
    if (window.innerWidth > 900) {
        calendarView = 'timeGridWeek';
    }
    // Initialise the full calendar
    let calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = '';
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: calendarView,
        themeSystem: 'bootstrap',
        firstDay: 1,
        events: calendarEvents
    });
    calendar.render();

    /* 
    If display size is less than 500px then 
    adjust calendar header date + buttons.
    500px is smaller than a tablet device but still bigger 
    than a mobile phone.
    */
    if (window.innerWidth < 500) {
        let allH2s = document.querySelectorAll('h2');
        for (let i = 0; i < allH2s.length; i++) {
            if (allH2s[i].className == 'fc-toolbar-title') {
                allH2s[i].style.fontSize = '1rem';
            }
        }
        let allButtons = document.querySelectorAll('button');
        for (let i = 0; i < allButtons.length; i++) {
            for (let j = 0; j < allButtons[i].classList.length; j++) {
                if (allButtons[i].classList[j] == 'fc-today-button') {
                    allButtons[i].style.display = 'none';
                }
            }
        }
    }
    // Adjust calendar width in div
    let allTables = document.querySelectorAll('table');
    // console.log(allTables);
    for (let i = 0; i < allTables.length; i++) {
        allTables[i].style.width = '500px';
        allTables[i].style.width = '100%';
    }
    // Adjust all table divs
    let allDivs = document.querySelectorAll('div');
    for (let i = 0; i < allDivs.length; i++) {
        if (allDivs[i].className.indexOf('fc-daygrid-body') > -1) {
            allDivs[i].style.width = '100%';
        } else if (allDivs[i].className.indexOf('fc-timegrid-body') > -1) {
            allDivs[i].style.width = '100%';
        }
    }
}

// Event listener for resizing of the window, specifically relating to height
window.addEventListener('resize', function() {
    document.getElementById('calendar').style.height = (window.innerHeight * 0.7) + 'px';
    // TODO: Adjust so that calendar is responsive across screen sizes
    if (window.innerWidth > 900) {
        document.getElementById('calendar-parent-card').style.maxWidth = (window.innerWidth * 0.75) + 'px';
        // Render Calendar
        calendar_page_load_page();
    } else {
        document.getElementById('calendar-parent-card').style.maxWidth = '';
        // Render Calendar
        calendar_page_load_page();
    }
});