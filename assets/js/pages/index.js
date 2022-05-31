import { setNavigationBar } from './../components/navigationBar.js';
import { setPageHeader } from './../components/pageHeader.js';
import { setPageFooter } from './../components/pageFooter.js';
import { setContactButtons } from './../components/contactButtons.js';
import { apiCall } from './../components/api.js';

window.addEventListener('DOMContentLoaded', main);
function main() {
    // Setup page navigation
    const base = window.location.origin;
    setNavigationBar(base);
    setPageHeader();
    setPageFooter(base);
    setContactButtons(base);

    /* Test the API is alive an functioning, otherwise
     * return error page.
     */
    testAPI();

    // Get available subjects
    loadSubjectsSelector();

    // For managing the flag
    validateUserInteraction();

    // Add event listener for submit redirect
    document.getElementById('submit-find-lesson').addEventListener(
        'click', redirectIndexToTutor
    );

    // Define page functions
    // var min = 1;
    // var max = 21;
    // document.getElementById('first-number').innerHTML =  Math.floor(Math.random() * (max - min) + min);
    // document.getElementById('second-number').innerHTML = Math.floor(Math.random() * (max - min) + min);
    // function offline_reset_error() {
    //     if (document.getElementById('offline-error-card') != null) {
    //         document.getElementById('offline-error-card').style.display = 'none';    
    //     }
    // }
}


async function testAPI() {
    var path = ('/api/status');
    var headers = {};
    var method = 'GET';
    var payload = {};
    /* For simplifying page */
    try {
        /* Execute API */
        var response = await apiCall(
            path, 
            headers, 
            method,
            payload
        );
        if (response['status'] == 200) {
            console.log('API is alive!');
        }
    } catch(e) {
        //console.log(e);
        document.getElementById('navigation-bar').style.display = 'none';
        document.getElementById('getting-started-card').style.display = 'none';
        document.getElementById('request-contact-form').style.display = 'none';
        document.getElementById('api-fail-email-button').style.display = 'block';
    }
}


async function loadSubjectsSelector() {
    var path = ('/api/salesorders/list_subjects');
    var headers = {};
    var method = 'GET';
    var payload = {};
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response.status == 200) {
        var subjects = response.response.data;
        var option_list;
        for (var i = 0; i < subjects.length; i++) {
            if (subjects[i]['lowest_price'] == 'Not available') {
                continue;
            }
            var html = `
            <option value=`+subjects[i]['subject_id']+`>`+subjects[i]['long_name']+`</option>
            `;
            option_list += html;
        }
        document.getElementById('subject-list').innerHTML = option_list;
    }
}


async function validateUserInteraction() {
    var path = ('/api/validate_user_interaction');
    var headers = {};
    var method = 'GET';
    var payload = {};
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        var attributes = response['response']['data'];
        for (var i = 0; i < attributes.length; i++) {
            html = `
            <img onclick="validate_user_check(`+attributes[i]['number']+`);" class="hover-pointer little-flag" src="`+attributes[i]['icon']+`">
            `;
            document.getElementById('valid-img-'+(i+1)).innerHTML = html;
        }
        document.getElementById('find-country').innerHTML = (
            "Can you identify the flag for "
            +response['response']['find_country']
            +"?"
        );
        document.getElementById('find-country-answer').innerHTML = response['response']['find_country_number'];
    }
}


function redirectIndexToTutor() {
    var arg = '/index.html';
    var base = window.location.pathname;
    if (base == '/') {base = ''}
    base = base.toString().replace(arg, '');
    var subject = document.getElementById('subject-list').value;
    var lesson_type = document.getElementById('lesson-location').value;
    var post_zip_code = document.getElementById('post-zip-code').value;
    if (lesson_type == 'face-to-face' && post_zip_code.length == 0) {
        var class_list = document.getElementById('post-zip-code').className;
        if (class_list.indexOf('is-invalid') == -1) {
            document.getElementById('post-zip-code').className = (
                class_list
                +' is-invalid'
            );
        }
        return false;
    }
    window.location.assign(
        base+'/information/tutors.html?subject='+subject
        +'&lesson_type='+lesson_type
        +'&post_zip_code='+post_zip_code
    );
}