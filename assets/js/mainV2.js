import { sleep, hasUniqueId } from './components/utils.js';
import { setNavigationBar } from './components/navigationBar.js';



function clearIsInvalid() {
    document.getElementById('live-chat-input').classList.remove('is-invalid');
}

function set_enter_submit(input_id, output_id) {
    var input = document.getElementById(input_id);
    input.addEventListener("keyup", function(event) {
        if (event.key == 'Enter') {
        event.preventDefault();
        document.getElementById(output_id).click();
        }
    });
}

function set_picture_on_submit(preview_id, image_id) {
    if (preview_id) {
        var preview = document.getElementById(preview_id);
    }
    var profile_picture = document.getElementById(image_id).files[0];
    var reader = new FileReader();
    /* Reads the file */
    reader.addEventListener('load', function () {
        var image_result = reader.result;
        //console.log(image_result);
        if (preview_id) {
            preview.src = image_result;
        }
    }, false);
    /* Initialises tthe code as base64 */
    if (profile_picture) {
        reader.readAsDataURL(profile_picture);
    }
}

function set_file_on_submit(attribute, input_id, tick_id) {
    function convert_file_to_base64(attribute) {
        var new_file = document.getElementById(input_id).files;
        if (new_file.length > 0) {
            var file_to_read = new_file[0];
            var file_reader = new FileReader();
            // Onload of file read the file content
            file_reader.onload = function(fileLoadedEvent) {
                var file_base64 = fileLoadedEvent.target.result;
                //console.log(file_base64);
                document.getElementById(attribute).innerHTML = file_base64;
            };
            file_reader.readAsDataURL(file_to_read);
        }
    }
    convert_file_to_base64(attribute);
    if (tick_id != '') {
        document.getElementById(tick_id).style.display = 'inline';
    }
}

function set_tutor_page_subject_options() {
    /* 
    Set subject options
    Requires: 
    <span id="subject-options-1">
    <span id="subject-options-2">
    <span id="subject-options-3">
    */
    html = `
    <option>None</option>
    <option>Accounting</option>
    <option>Art and Design</option>
    <option>Bengali</option>
    <option>Biology</option>
    <option>Business</option>
    <option>Chemistry</option>
    <option>Chinese (Mandarin)</option>
    <option>Citizenship Studies</option>
    <option>Computer programming in C</option>
    <option>Computer programming in Python</option>
    <option>Computer Science and IT</option>
    <option>Dance</option>
    <option>Design and Technology</option>
    <option>Drama</option>
    <option>Economics</option>
    <option>Engineering</option>
    <option>English as a Foreign Language</option>
    <option>English Language</option>
    <option>English Literature</option>
    <option>Entry Level Certificates (ELC)</option>
    <option>EPQ</option>
    <option>Entertainment Technology</option>
    <option>Food</option>
    <option>French</option>
    <option>Geography</option>
    <option>German</option>
    <option>Hebrew (Biblical)</option>
    <option>Hebrew (Modern)</option>
    <option>History</option>
    <option>History of Art</option>
    <option>ICT</option>
    <option>Italian</option>
    <option>Languages</option>
    <option>Law</option>
    <option>Mathematics</option>
    <option>Media Studies</option>
    <option>Music</option>
    <option>Panjabi</option>
    <option>Performing Arts</option>
    <option>Philosophy</option>
    <option>Physical Education</option>
    <option>Physics</option>
    <option>Polish</option>
    <option>Politics</option>
    <option>Programmes</option>
    <option>Projects</option>
    <option>Psychology</option>
    <option>Personal and Social Education</option>
    <option>Religious Studies</option>
    <option>Science</option>
    <option>Sociology</option>
    <option>Spanish</option>
    <option>Statistics</option>
    <option>Tech-levels</option>
    <option>Technical Awards</option>
    <option>Unit Award Scheme</option>
    <option>Urdu</option>
    <option>None</option>
   `;
   if (document.getElementById('subject-options-1')) {
    document.getElementById('subject-options-1').innerHTML = html;
   }
   if (document.getElementById('subject-options-2')) {
    document.getElementById('subject-options-2').innerHTML = html;
   }
   if (document.getElementById('subject-options-3')) {
    document.getElementById('subject-options-3').innerHTML = html;
   }
}

function tutor_page_set_input_string_length(input_id, output_id) {
    var input = document.getElementById(input_id);
    input.addEventListener("keyup", function(event) {
        var string_length = input.value.length;
        if (string_length > 500) {
            document.getElementById(output_id).style.color = 'rgb(255, 0, 0)';
        } else {
            document.getElementById(output_id).style.color = 'rgb(0, 0, 0)';
        }
        document.getElementById(output_id).innerHTML = (
            string_length.toString() + ' / 500'
        );
    });
}


function customer_advertisement_page_toggle_options(id) {
    if (id == 1) {
        document.getElementById('advertisement-status').value = 'open';
        document.getElementById('check-closed-status').className = "col btn m-0";
        document.getElementById('check-open-status').className = "col btn m-0 bg-primary font-weight-bold text-white";
    } else if (id == 2) {
        document.getElementById('advertisement-status').value = 'closed';
        document.getElementById('check-open-status').className = "col btn m-0";
        document.getElementById('check-closed-status').className = "col btn m-0 bg-primary font-weight-bold text-white";
    }
}





function sign_up_page(base) {
    setNavigationBar(base);
    set_enter_submit('confirm-password', 'sign-up-submit');
}

function login_page(base) {
    setNavigationBar(base);
    set_enter_submit('password', 'login-submit');
}

function contact_us_page(base) {
    setNavigationBar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons(base);
    tutor_page_set_input_string_length('message', 'message-str-len');
}

function legal_pages(base) {
    setNavigationBar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons(base);
}

function site_map_page(base) {
    setNavigationBar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons(base);
}

function tutors_page(base) {
    setNavigationBar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons(base);
}

function profile_page(base) {
    setNavigationBar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons(base);
}

function message_tutor_page(base) {
    setNavigationBar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons(base);
    tutor_page_set_input_string_length('message', 'message-str-len');
}

function application_message_thread_page(base) {
    setNavigationBar(base);
    set_contact_buttons(base);
    tutor_page_set_input_string_length('new-message', 'message-str-len');
}

function application_tutor_profile_page(base) {
    setNavigationBar(base);
    set_contact_buttons(base);
    set_tutor_page_subject_options();
    tutor_page_set_input_string_length('about-tutor', 'about-tutor-str-len');
    tutor_page_set_input_string_length('background-tutor', 'background-tutor-str-len');
}

function application_customer_profile_page(base) {
    setNavigationBar(base);
    set_contact_buttons(base);
    set_tutor_page_subject_options();
    tutor_page_set_input_string_length('about-customer', 'customer-requirements-str-len');
}

function application_general_nav_only(base) {
    setNavigationBar(base);
}

function application_general_nav_and_contact(base) {
    setNavigationBar(base);
    set_contact_buttons(base);
}



function main() {
    console.log(window.location.origin);
    console.log(window.location.href);
    let arg = window.location.pathname;
    let base = window.location.pathname;
    base = base.toString().replace(arg, '');
    console.log(arg);
    console.log(base);
    hasUniqueId();
    /* Website pages */
    if (arg == '/index.html') {
        if (base == '/') {base = ''}
        index_page(base);
    }
    if (arg == '/information/about-us.html') {
        about_us_page(base);
    }
    if (arg == '/information/terms-and-conditions.html') {
        legal_pages(base);
    }
    if (arg == '/information/site-map.html') {
        site_map_page(base);
    }
    if (arg == '/information/tutors.html') {
        tutors_page(base);
    }
    if (arg == '/information/profile.html') {
        profile_page(base);
    }
    if (arg == '/information/message-tutor.html') {
        message_tutor_page(base);
    }
    if (arg == '/information/privacy-policy.html') {
        legal_pages(base);
    }
    if (arg == '/information/sign-up.html') {
        sign_up_page(base);
    }
    if (arg == '/information/login.html') {
        login_page(base);
    }
    if (arg == '/information/contact-us.html') {
        contact_us_page(base);
    }
    /* Application pages */
    if (arg == '/application/home.html') {
        application_general_nav_and_contact(base);
    }
    if (arg == '/application/user/messages.html') {
        application_general_nav_and_contact(base);
    }
    if (arg == '/application/user/lessons.html') {
        application_general_nav_and_contact(base);
    }
    if (arg == '/application/user/message-thread.html') {
        application_message_thread_page(base);
    }
    if (arg == '/application/user/account.html') {
        application_general_nav_and_contact(base);
    }
    if (arg == '/application/user/tutor-profile.html') {
        application_tutor_profile_page(base);
    }
    if (arg == '/application/user/customer-profile.html') {
        application_customer_profile_page(base);
    }
    if (arg == '/application/admin/remove-users.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/user/payment-option.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/admin/sensor-user-messages.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/admin/view-instant-messages.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/admin/instant-messenger.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/user/tutor-resources.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/admin/record-payment.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/admin/validate-user-document.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/user/tutoring-opportunities.html') {
        application_general_nav_and_contact(base);
    }
    if (arg == '/application/user/students.html') {
        application_general_nav_and_contact(base);
    }
    if (arg == '/application/admin/all-tutors.html') {
        application_general_nav_only(base);
    }
    if (arg == '/application/user/calendar.html') {
        application_general_nav_only(base);
    }
}

window.addEventListener('DOMContentLoaded', main);