
function set_navigation_bar(base) {
    /* 
    Set navigation bar
    Requires: <div id="navigation-bar"></div>
    */
   html = `
   <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item"> 
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/index.html" target="_parent"><i class="bi-house"></i> Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/information/about-us.html"><i class="bi-person"></i> About Us</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/information/tutors.html" target="_parent"><i class="bi-award"></i> Tutors</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/information/contact-us.html" target="_parent"><i class="bi-chat-right-text"></i> Contact Us</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="https://www.facebook.com/123helpmestudy" target="_blank"><i class="bi-facebook"></i> Facebook</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/information/sign-up.html" target="_parent"><i class="bi-person-plus"></i> Sign Up</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/information/login.html"><i class="bi-box-arrow-right"></i> Login</a>
                </li>
            </ul>
        </div>
    </nav>
   `;
   document.getElementById('navigation-bar').innerHTML = html;
}

function set_application_navigation_bar(base) {
    /* 
    Set navigation bar
    Requires: <div id="navigation-bar"></div>
    */
   html = `
   <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <!--<li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/index.html" target="_parent"><i class="bi-house"></i> Home</a>
                </li>-->
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/application/home.html" target="_parent"><i class="bi-grid-3x3-gap"></i> Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/information/tutors.html" target="_parent"><i class="bi-award"></i> Tutors</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/information/contact-us.html" target="_parent"><i class="bi-chat-right-text"></i> Contact Us</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link font-weight-bold px-3" href="`+base+`/information/login.html" target="_parent"><i class="bi-box-arrow-left"></i> Logout</a>
                </li>
            </ul>
        </div>
    </nav>
   `;
   document.getElementById('navigation-bar').innerHTML = html;
}

function set_page_header() {
    /* 
    Set page header
    Requires: <div id="page-header"></div>
    */
    html = `
    <div class="card border-0">
        <div class="card-body text-center text-white cust-header-background">
            <h1 class="font-weight-bold">123 Help Me Study</h1>
        </div>
    </div>
    `;
    document.getElementById('page-header').innerHTML = html;
}

function set_page_footer(base) {
    /* 
    Set page footer
    Requires: <div id="page-footer"></div>
    */
    html = `
    <div class="container-fluid bg-dark pb-3">
        <p class="pt-5 text-light">Established in August 2019</p>
        <p class="text-light">Trading As "123 Help Me Study"</p>
        <a class="text-light" href="`+base+`/information/privacy-policy.html" target="_parent"><p>Privacy Policy</p></a>
        <a class="text-light" href="`+base+`/information/terms-and-conditions.html" target="_parent"><p>Terms &amp; Conditions</p></a>            
    </div>
    `;
    document.getElementById('page-footer').innerHTML = html;
}

function set_contact_buttons() {
    /* 
    Set Contact Buttons on page 
    Requires: <div id="contact-buttons"></div>
    */
    html = `
        <a href="tel:07493696970">
            <div class="phone">
                <img class="comms-image" alt="call or text 123 help me study" src="https://ik.imagekit.io/123helpmestudy/123_Help_Me_Study/Website_Media/phone-icon_vfkqE-lLC.png">
            </div>
        </a>
        <a href="https://join.skype.com/invite/brePqBzYCveV">
            <div class="skype">
                <img class="comms-image" alt="skype 123 help me study" src="https://ik.imagekit.io/123helpmestudy/123_Help_Me_Study/Website_Media/skype-icon_GsT8vFll7cwp.png">
            </div>
        </a>
    `;
    document.getElementById('contact-buttons').innerHTML = html;
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
    <option>Accounting</option>
    <option>Art and Design</option>
    <option>Bengali</option>
    <option>Biology</option>
    <option>Business</option>
    <option>Chemistry</option>
    <option>Chinese (Mandarin)</option>
    <option>Citizenship Studies</option>
    <option>Computer Science and IT</option>
    <option>Dance</option>
    <option>Design and Technology</option>
    <option>Drama</option>
    <option>Economics</option>
    <option>Engineering</option>
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

function tutor_subject_page_toggle_options(id) {
    if (id == 1) {
        document.getElementById('lesson-location').value = 'online';
        document.getElementById('post-zip-code').style.display = 'none';
        document.getElementById('check-face-2-face').className = "col btn m-0";
        document.getElementById('check-online').className = "col btn m-0 bg-primary font-weight-bold text-white";
    } else if (id == 2) {
        document.getElementById('lesson-location').value = 'face-to-face';
        document.getElementById('post-zip-code').style.display = 'block';
        document.getElementById('check-online').className = "col btn m-0";
        document.getElementById('check-face-2-face').className = "col btn m-0 bg-primary font-weight-bold text-white";
    }
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

function index_to_tutor_page_submit() {
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

function reset_error() {
    if (document.getElementById('error-card') != null) {
        document.getElementById('error-card').style.display = 'none';    
    }
}

function reset_invalid_input(id) {
    reset_error();
    var class_list = document.getElementById(id).className;
    class_list = class_list.replace('is-invalid', '').trim();
    document.getElementById(id).className = (
        class_list
    );
}

function index_page(base) {
    set_navigation_bar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons();
    
}

function about_us_page(base) {
    set_navigation_bar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons();
}

function sign_up_page(base) {
    set_navigation_bar(base);
    set_enter_submit('confirm-password', 'sign-up-submit');
}

function login_page(base) {
    set_navigation_bar(base);
    set_enter_submit('password', 'login_submit');
}

function contact_us_page(base) {
    set_navigation_bar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons();
    tutor_page_set_input_string_length('message', 'message-str-len');
}

function legal_pages(base) {
    set_navigation_bar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons();
}

function tutors_page(base) {
    set_navigation_bar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons();
}

function profile_page(base) {
    set_navigation_bar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons();
}

function message_tutor_page(base) {
    set_navigation_bar(base);
    set_page_header();
    set_page_footer(base);
    set_contact_buttons();
    tutor_page_set_input_string_length('message', 'message-str-len');
}

function application_home_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
}

function application_lessons_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
}

function application_messages_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
}

function application_message_thread_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
    tutor_page_set_input_string_length('new-message', 'message-str-len');
}

function application_account_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
}

function application_tutor_profile_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
    set_tutor_page_subject_options();
    tutor_page_set_input_string_length('about-tutor', 'about-tutor-str-len');
    tutor_page_set_input_string_length('background-tutor', 'background-tutor-str-len');
}

function application_customer_profile_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
    set_tutor_page_subject_options();
    tutor_page_set_input_string_length('about-customer', 'customer-requirements-str-len');
}

function application_remove_users_page(base) {
    set_application_navigation_bar(base);
}

function application_payment_options_page(base) {
    set_application_navigation_bar(base);
}

function application_sensor_user_messages_page(base) {
    set_application_navigation_bar(base);
}

function application_tutor_resources_page(base) {
    set_application_navigation_bar(base);
}

function application_record_payment_page(base) {
    set_application_navigation_bar(base);
}

function application_validate_user_document_page(base) {
    set_application_navigation_bar(base);
}

function application_tutoring_opportunities_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
}

function application_students_page(base) {
    set_application_navigation_bar(base);
    set_contact_buttons();
}

function has_unique_id() {
    var unique = localStorage.getItem('123helpmestudy-unique');
    var now = new Date();
    if (unique == null) {
        localStorage.setItem(
            '123helpmestudy-unique',
            btoa(now)
        );
    }
}

function main(arg, base) {
    base = base.toString().replace(arg, '');
    console.log(arg);
    console.log(base);
    has_unique_id();
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
        application_home_page(base);
    }
    if (arg == '/application/user/messages.html') {
        application_messages_page(base);
    }
    if (arg == '/application/user/lessons.html') {
        application_lessons_page(base);
    }
    if (arg == '/application/user/message-thread.html') {
        application_message_thread_page(base);
    }
    if (arg == '/application/user/account.html') {
        application_account_page(base);
    }
    if (arg == '/application/user/tutor-profile.html') {
        application_tutor_profile_page(base);
    }
    if (arg == '/application/user/customer-profile.html') {
        application_customer_profile_page(base);
    }
    if (arg == '/application/admin/remove-users.html') {
        application_remove_users_page(base);
    }
    if (arg == '/application/user/payment-option.html') {
        application_remove_users_page(base);
    }
    if (arg == '/application/admin/sensor-user-messages.html') {
        application_sensor_user_messages_page(base);
    }
    if (arg == '/application/user/tutor-resources.html') {
        application_tutor_resources_page(base);
    }
    if (arg == '/application/admin/record-payment.html') {
        application_record_payment_page(base);
    }
    if (arg == '/application/admin/validate-user-document.html') {
        application_validate_user_document_page(base);
    }
    if (arg == '/application/user/tutoring-opportunities.html') {
        application_tutoring_opportunities_page(base);
    }
    if (arg == '/application/user/students.html') {
        application_tutoring_opportunities_page(base);
    }
}