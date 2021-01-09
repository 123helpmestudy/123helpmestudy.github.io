//var BASE_URL = 'http://127.0.0.1:8000';
var BASE_URL = 'https://api.123helpmestudy.com';

async function api_call(path, headers, method, payload) {
    var url = BASE_URL+path;
    var headings = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    for (var header in headers) {
        if (headers[header]) {
            headings[header] = headers[header];
        }
    }
    var requestOptions = {
        headers: headings,
        method: method,
        redirect: 'follow'
    };
    if (method != 'GET') {
        requestOptions['body'] = JSON.stringify(payload);
    }
    var response = await fetch(url, requestOptions);
    var json_response = await response.json();
    return {
        'status': response.status, 
        'response': json_response
    };
}

async function index_page_test_api() {
    var path = ('/api/status');
    var headers = {};
    var method = 'GET';
    var payload = {};
    /* For simplifying page */
    try {
        /* Execute API */
        var response = await api_call(
            path, 
            headers, 
            method,
            payload
        );
        if (response['status'] == 200) {
        } else {}
        //console.log(response['status']);
        //console.log(response['response']);
    } catch(e) {
        //console.log(e);
        document.getElementById('navigation-bar').style.display = 'none';
        document.getElementById('getting-started-card').style.display = 'none';
        document.getElementById('request-contact-form').style.display = 'none';
        document.getElementById('api-fail-email-button').style.display = 'block';
    }
}

async function index_page_load_page() {
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
    if (response['status'] == 200) {
        var subjects = response['response']['data'];
        var option_list;
        for (var i = 0; i < subjects.length; i++) {
            var html = `
            <option value=`+subjects[i]['subject_id']+`>`+subjects[i]['long_name']+`</option>
            `;
            option_list += html;
        }
        document.getElementById('subject-list').innerHTML = option_list;
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function index_page_submit_form() {
    function validate_target(id) {
        if (document.getElementById(id).value.length == 0) {
            var class_list = document.getElementById(id).className;
            if (class_list.indexOf('is-invalid') == -1) {
                document.getElementById(id).className = (
                    class_list
                    +' is-invalid'
                );
            }
            return true;
        }
        return false;
    }
    /* Validate user input */
    var validate = false;
    if (validate_target('first_name')) {validate = true;}
    if (validate_target('last_name')) {validate = true;}
    if (validate_target('mobile')) {validate = true;}
    if (validate_target('email')) {validate = true;}
    if (validate) {return false;}
    /* Validate user agreement and t & c's */
    if (
        document.getElementById('tick-terms-and-conditions').checked == false
        ||
        document.getElementById('tick-privacy-policy').checked == false
    ) {
        // Failed to tick terms and conditions and privacy policy
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = (
            'To proceed, please read and agree to our terms '
            +'and conditions, and our privacy policy.');
            return false;
    }
    /* Validate user robot */
    var robot_status = document.getElementById('is-a-robot').innerHTML;
    if (robot_status == 'yes') {
        document.getElementById('submit-form').style.display = 'none';
        document.getElementById('check-validator').style.display = 'block';
        return false;
    }
    /* Disable submit button */
    document.getElementById('pending-send').style.display = 'block';
    document.getElementById('submit-form').style.display = 'none';
    /* Execute API */
    var path = '/api/salesorders/create_sales_leads';
    var headers = {
        'Access-Token': '',
    };
    var method = 'POST';
    var payload = {
        'first_name': document.getElementById('first_name').value,
        'last_name': document.getElementById('last_name').value,
        'email': document.getElementById('email').value,
        'mobile': document.getElementById('mobile').value,
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        document.getElementById('pending-send').style.display = 'none';
        document.getElementById('request-contact-form').style.display = 'none';
        document.getElementById('success-card').style.display = 'block';
    } else {
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = "An error has occured, please call us. Thanks.";
    }
    //console.log(response['status']);
    //console.log(response['response']);
}

async function validate_user_interaction_page_load() {
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
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

function validate_user_check(id) {
    var find_country_number = document.getElementById('find-country-answer').innerHTML;
    if (id == find_country_number) {
        document.getElementById('is-a-robot').innerHTML = 'no';
        document.getElementById('check-validator').style.display = 'none';
        document.getElementById('submit-form').style.display = 'inline';
    } else {
        document.getElementById('check-validator').style.display = 'none';
        document.getElementById('robot-error-card').style.display = 'block';
    }
}

async function login_page_submit_form() {
    var path = '/api/users/login';
    var headers = {
        'Access-Token': '',
    };
    var method = 'POST';
    var payload = {
        'email': document.getElementById('email').value,
        'secret': btoa(document.getElementById('password').value),
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        /* Change DOM based on message or data */
        //response['response']
        /* Redirect page */
        localStorage.setItem(
            "123helpmestudy-email", payload['email']
        );
        localStorage.setItem(
            "123helpmestudy-access-token", response['response']['data']['access-token']
        );
        var base = (window.location.pathname).toString().replace('/information/login.html', '');
        window.location.assign(base+'/application/home.html');
    } else if (response['status'] == 480) {
        var base = (window.location.pathname).toString().replace('/information/login.html', '');
        var parameters = '?email='+payload['email']+'&email_token='
        window.location.assign(base+'/application/sign-up/email-verification.html'+parameters);
    } else {
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = response['response']['message'];
    }
    //console.log(response['status']);
    //console.log(response['response']);
}

async function sign_up_page_submit_form() {
    if (
        document.getElementById('password').value !=
        document.getElementById('confirm-password').value
        
    ) {
        // Failed to match passwords
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = 'Password does not match.';
        return false;
    }
    if (
        document.getElementById('tick-terms-and-conditions').checked == false
        &&
        document.getElementById('tick-privacy-policy').checked == false
    ) {
        // Failed to tick terms and conditions and privacy policy
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = (
            'To proceed, please read and agree to our terms '
            +'and conditions and privacy policy.');
            return false;
    }
    /* Disable submit button */
    document.getElementById('pending-send').style.display = 'block';
    document.getElementById('sign-up-submit').style.display = 'none';
    /* Execute API */
    var path = '/api/users/create';
    var headers = {
        'Access-Token': '',
    };
    var method = 'POST';
    var payload = {
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value,
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        var base = (window.location.pathname).toString().replace('/information/sign-up.html', '');
        var parameters = '?email='+payload['email']+'&email_token='
        window.location.assign(base+'/application/sign-up/email-verification.html'+parameters);
    } else {
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = response['response']['message'];
    }
    //console.log(response['status']);
    //console.log(response['response']);
}

async function email_verification_submit_form() {
    var path = '/api/users/validate';
    var headers = {
        'Access-Token': '',
    };
    var method = 'PUT';
    var payload = {
        'email': document.getElementById('email').value,
        'email_token': document.getElementById('email_token').value,
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        var base = (window.location.pathname).toString().replace('/application/sign-up/email-verification.html', '');
        var parameters = '?email='+payload['email']
        window.location.assign(base+'/information/login.html'+parameters);
    } else {
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = response['response']['message'];
    }
    //console.log(response['status']);
    //console.log(response['response']);
}

async function home_page_submit_user_type_form(user_type) {
    var path = '/api/users/update_user_attribute';
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'PUT';
    var payload = {
        'email': localStorage.getItem('123helpmestudy-email'),
        'attribute': 'user_type',
        'value': user_type,
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        /* Change DOM based on message or data */
        //response['response']
        /* Redirect page */
        location.reload();
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/home.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function home_page_load_page() {
    var path = ('/api/users/list_user_actions');
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
        var attributes = response['response']['data'];
        for (var i = 0; i < attributes.length; i++) {
            if (
                attributes[i]['attribute'] == 'unread_messages'
                &&
                attributes[i]['value'] > 0) {
                document.getElementById('unread-message-count').innerHTML = (
                    attributes[i]['value']+' unread messages'
                );
            }
            if (attributes[i]['attribute'] == 'user_type') {
                if (attributes[i]['value'] == 'new') {
                    document.getElementById('navigation-card').style.display = 'none';
                    document.getElementById('initialise-user-type').style.display = 'block';
                }
                if (attributes[i]['value'] == 'tutor') {
                    document.getElementById('tutor-profile').style.display = 'block';
                }
                if (attributes[i]['value'] in ['parent', 'student']) {
                    //document.getElementById('customer-profile').style.display = 'block';
                }
            }
            if (attributes[i]['attribute'] == 'permissions') {
                if(attributes[i]['value'] == 'super') {
                    document.getElementById('tutor-profile').style.display = 'block';
                    document.getElementById('customer-profile').style.display = 'block';
                    document.getElementById('remove-user').style.display = 'block';
                    document.getElementById('sensor-user-message').style.display = 'block';
                }
            }
        }
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/home.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    console.log(response['status']);
    console.log(response['response']);
}

async function account_page_submit_form() {
    var email = localStorage.getItem('123helpmestudy-email');
    var path = '/api/users/update_user_attribute';
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'PUT';
    var attributes_list = [
        {
            'attribute': 'first_name',
            'value': document.getElementById('first-name').value
        },
        {
            'attribute': 'last_name',
            'value': document.getElementById('last-name').value
        },
        {
            'attribute': 'mobile',
            'value': document.getElementById('mobile').value
        },
        {
            'attribute': 'dob',
            'value': document.getElementById('dob').value
        },
        {
            'attribute': 'house_number_or_name',
            'value': document.getElementById('house-number-or-name').value
        },
        {
            'attribute': 'address_line_1',
            'value': document.getElementById('address-line-1').value
        },
        {
            'attribute': 'address_line_2',
            'value': document.getElementById('address-line-2').value
        },
        {
            'attribute': 'city',
            'value': document.getElementById('city').value
        },
        {
            'attribute': 'post_zip_code',
            'value': document.getElementById('post-zip-code').value.toString().toUpperCase()
        },
        {
            'attribute': 'country',
            'value': document.getElementById('country').value
        },
    ];
    for (var i = 0; i < attributes_list.length; i++) {
        var payload = {
            'email': email,
            'attribute': attributes_list[i]['attribute'],
            'value': attributes_list[i]['value']
        };
        var response = await api_call(
            path,
            headers,
            method,
            payload
        );
        if (response['status'] == 200) {} else if (response['status'] == 401) {
            var base = (window.location.pathname).toString().replace('/application/user/account.html', '');
            window.location.assign(base+'/information/login.html');
        } else {}
        //console.log(response['status']);
        //console.log(response['response']);
    }
    location.reload();
}

async function account_page_load_page() {
    var path = ('/api/users/list_user_attributes?email='
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
        document.getElementById('email').innerHTML += localStorage.getItem('123helpmestudy-email');
        var attributes = response['response']['data'];
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i]['attribute'] == 'first_name') {
                document.getElementById('first-name').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'last_name') {
                document.getElementById('last-name').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'mobile') {
                document.getElementById('mobile').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'dob') {
                document.getElementById('dob').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'house_number_or_name') {
                document.getElementById('house-number-or-name').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'address_line_1') {
                document.getElementById('address-line-1').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'address_line_2') {
                document.getElementById('address-line-2').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'city') {
                document.getElementById('city').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'post_zip_code') {
                document.getElementById('post-zip-code').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'country') {
                document.getElementById('country').value = attributes[i]['value'];
            }
        }
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/account.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function tutor_profile_page_load_page() {
    var path = ('/api/users/list_user_attributes?email='
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
        document.getElementById('email').innerHTML += localStorage.getItem('123helpmestudy-email');
        var attributes = response['response']['data'];
        for (var i = 0; i < attributes.length; i++) {
            if (attributes[i]['attribute'] == 'tutor_profile_status') {
                if (attributes[i]['value'] == 'inactive') {
                    document.getElementById('profile-status-inactive').style.display = 'inline';
                }
                if (attributes[i]['value'] == 'pending') {
                    document.getElementById('profile-status-pending').style.display = 'inline';
                }
                if (attributes[i]['value'] == 'active') {
                    document.getElementById('profile-status-active').style.display = 'inline';
                }
            }
            if (attributes[i]['attribute'] == 'profile_photo') {
                if (attributes[i]['value']) {
                    var image_attributes_array = attributes[i]['value'].toString().split(';');
                    document.getElementById('profile-photo').src = image_attributes_array[1];
                }
            }
            if (attributes[i]['attribute'] == 'profile_header') {
                document.getElementById('profile-header').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'hourly_rate') {
                document.getElementById('hourly-rate').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'about_tutor_1') {
                localStorage.setItem('123helpmestudy-about-tutor-1', attributes[i]['value']);
            }
            if (attributes[i]['attribute'] == 'about_tutor_2') {
                localStorage.setItem('123helpmestudy-about-tutor-2', attributes[i]['value']);
            }
            if (attributes[i]['attribute'] == 'background_tutor_1') {
                localStorage.setItem('123helpmestudy-background-tutor-1', attributes[i]['value']);
            }
            if (attributes[i]['attribute'] == 'background_tutor_2') {
                localStorage.setItem('123helpmestudy-background-tutor-2', attributes[i]['value']);
            }
            if (attributes[i]['attribute'] == 'highest_qualification') {
                document.getElementById('highest-qualification').value = attributes[i]['value'];
                console.log(attributes[i]['value']);
                console.log(document.getElementById('highest-qualification').value);
            }
            if (attributes[i]['attribute'] == 'qualification_support_document') {
                if (attributes[i]['value'] == 'confirmed') {
                    document.getElementById('qualification-document-confirmed').style.display = 'block';
                } else if (attributes[i]['value']) {
                    document.getElementById('qualification-document-pending').style.display = 'block';
                }
            }
            if (attributes[i]['attribute'] == 'subject_options_1') {
                document.getElementById('subject-options-1').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'subject_options_2') {
                document.getElementById('subject-options-2').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'subject_options_3') {
                document.getElementById('subject-options-3').value = attributes[i]['value'];
            }
            if (attributes[i]['attribute'] == 'background_check_document') {
                if (attributes[i]['value'] == 'confirmed') {
                    document.getElementById('background-check-document-confirmed').style.display = 'block';
                } else if (attributes[i]['value']) {
                    document.getElementById('background-check-document-pending').style.display = 'block';
                }
            }
            if (attributes[i]['attribute'] == 'teacher_status_document') {
                if (attributes[i]['value'] == 'confirmed') {
                    document.getElementById('teacher-status-document-confirmed').style.display = 'block';
                } else if (attributes[i]['value']) {
                    document.getElementById('teacher-status-document-pending').style.display = 'block';
                }
            }
        }
        document.getElementById('about-tutor').value = (
            localStorage.getItem('123helpmestudy-about-tutor-1')
            + localStorage.getItem('123helpmestudy-about-tutor-2')
        );
        document.getElementById('about-tutor-str-len').innerHTML = (
            document.getElementById('about-tutor').value.toString().length.toString()
            + ' / 500'
        );
        document.getElementById('background-tutor').value = (
            localStorage.getItem('123helpmestudy-background-tutor-1')
            + localStorage.getItem('123helpmestudy-background-tutor-2')
        );
        document.getElementById('background-tutor-str-len').innerHTML = (
            document.getElementById('background-tutor').value.toString().length.toString()
            + ' / 500'
        );
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/tutor_profile.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

function tutor_profile_page_click_element_by_id(id) {
    document.getElementById(id).click();
}

async function tutor_profile_page_submit_form() {
    var email = localStorage.getItem('123helpmestudy-email');
    var path = '/api/users/update_user_attribute';
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'PUT';
    var attributes_list = [
        {
            'attribute': 'profile_header',
            'value': document.getElementById('profile-header').value
        },
        {
            'attribute': 'hourly_rate',
            'value': document.getElementById('hourly-rate').value
        },
        {
            'attribute': 'about_tutor_1',
            'value': document.getElementById('about-tutor').value.toString().substring(0, 250)
        },
        {
            'attribute': 'about_tutor_2',
            'value': document.getElementById('about-tutor').value.toString().substring(250, 500)
        },
        {
            'attribute': 'background_tutor_1',
            'value': document.getElementById('background-tutor').value.toString().substring(0, 250)
        },
        {
            'attribute': 'background_tutor_2',
            'value': document.getElementById('background-tutor').value.toString().substring(250, 500)
        },
        {
            'attribute': 'highest_qualification',
            'value': document.getElementById('highest-qualification').value
        },
        {
            'attribute': 'subject_options_1',
            'value': document.getElementById('subject-options-1').value
        },
        {
            'attribute': 'subject_options_2',
            'value': document.getElementById('subject-options-2').value
        },
        {
            'attribute': 'subject_options_3',
            'value': document.getElementById('subject-options-3').value
        },
    ];
    /* A base64 encoded image */
    if (document.getElementById('profile-photo').src.toString().includes('profile_default_img') == false) {
        var profile_photo_base64 = document.getElementById('profile-photo').src;
        attributes_list.push({
            'attribute': 'profile_photo',
            'value': profile_photo_base64
        });
    }
    if (localStorage.getItem('123helpmestudy-qualification-document')) {
        attributes_list.push({
            'attribute': 'qualification_support_document',
            'value': localStorage.getItem('123helpmestudy-qualification-document')
        });
        localStorage.removeItem('123helpmestudy-qualification-document');
    }
    if (localStorage.getItem('123helpmestudy-background-check-document')) {
        attributes_list.push({
            'attribute': 'background_check_document',
            'value': localStorage.getItem('123helpmestudy-background-check-document')
        });
        localStorage.removeItem('123helpmestudy-background-check-document');
    }
    if (localStorage.getItem('123helpmestudy-teacher-status-document')) {
        attributes_list.push({
            'attribute': 'teacher_status_document',
            'value': localStorage.getItem('123helpmestudy-teacher-status-document')
        });
        localStorage.removeItem('123helpmestudy-teacher-status-document');

    }
    for (var i = 0; i < attributes_list.length; i++) {
        var payload = {
            'email': email,
            'attribute': attributes_list[i]['attribute'],
            'value': attributes_list[i]['value']
        };
        var response = await api_call(
            path,
            headers,
            method,
            payload
        );
        if (response['status'] == 200) {
            
        } else if (response['status'] == 401) {
            var base = (window.location.pathname).toString().replace('/application/user/tutor_profile.html', '');
            window.location.assign(base+'/information/login.html');
        } else {}
        //console.log(response['status']);
        //console.log(response['response']);
    }
    location.reload();
}

async function tutor_subjects_load_page() {
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
    if (response['status'] == 200) {
        var subjects = response['response']['data'];
        var a = 1;
        for (var i = 0; i < subjects.length; i++) {
            var colour = 'light-blue-card';
            if (a == 1) {
                a = 2;
            } else if (a == 2) {
                a = 3;
                colour = '';
            } else if (a == 3) {
                a = 4;
                colour = 'light-green-card';
            } else if (a == 4) {
                a = 1;
                colour = '';
            }
            var html = `
            <div onclick="tutor_subject_display_tutors_load_page(`+subjects[i]['subject_id']+`);" class="card mb-1 `+colour+`">
                <div class="card-body dashboard-button">
                    <b>`+subjects[i]['long_name']+`</b>
                </div>
            </div>
            `;
            document.getElementById('subject-list').innerHTML += html;
        }
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function tutor_subject_display_tutors_load_page(id) {
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
    document.getElementById('subject-selected').innerHTML = id;
    var path = (
        '/api/salesorders/list_tutors_for_subject'
        +'?subject='+id
        +'&lesson_type='+lesson_type
        +'&post_zip_code='+post_zip_code
    );
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
        var tutors = response['response']['data'];
        document.getElementById('tutor-list').innerHTML = '';
        console.log(tutors);
        if (tutors.length == 0) {
            document.getElementById('tutor-list').innerHTML = `
            <br><br><br><br>
            <p class="px-5 font-weight-bold font-italic">
                Unfortunately, at this time, none of our registered tutors match your criteria. 
                Please read our notice below so that we may assist you further.
            </p>
            <br><br><br><br>
            `;
        }
        for (var i = 0; i < tutors.length; i++) {
            var miles_button = '';
            if ('distance_miles' in tutors[i]) {
                console.log('Miles given');
                miles_button = `<button class="btn btn-success">`+tutors[i]['distance_miles']+` miles away</button>`;
            }
            var html = `
            <div class="card mb-2">
                <div onclick="go_to_tutor_profile(`+tutors[i]['profile_id']+`);" class="card-body dashboard-button">
                    <div class="text-right">
                        `+miles_button+`
                    </div>
                    <img class="circle-img-profile-list" src="`+tutors[i]['profile_photo']+`">
                    <p class="my-0">`+tutors[i]['first_name']+' '+tutors[i]['last_name_initial']+`</p>
                    <p class="my-0"><em>`+tutors[i]['profile_header']+`</em></p>
                    <p class="my-0">Hours Taught: <b>`+tutors[i]['hours_taught']+`</b></p>
                    <p class="my-0">Highest Qualification: <b>`+tutors[i]['highest_qualification']+`<b/></p>
                </div>
            </div>
            `;
            document.getElementById('tutor-list').innerHTML += html;
        }
        document.getElementById('subject-card').style.display = 'none';
        document.getElementById('tutors-card').style.display = 'block';
        document.getElementById('tutors-card-disclaimer').style.display = 'block';
    } else if (response['status'] == 480) {
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = response['response']['message'];
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function profile_page_load_page(id) {
    var path = ('/api/salesorders/show_tutor?tutor='+id);
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
        document.getElementById('tutor-first-name-selected').innerHTML = (
            response['response']['data']['first_name']
        );
        document.getElementById('tutor-name').innerHTML = (
            response['response']['data']['first_name']
            +' '
            +response['response']['data']['last_name_initial']
        );
        document.getElementById('profile-header').innerHTML = response['response']['data']['profile_header'];
        document.getElementById('last-login').innerHTML = (
            'Last seen on<br>'
            +response['response']['data']['last_active'].substring(8, 10)
            +'/'
            +response['response']['data']['last_active'].substring(5, 7)
            +'/'
            +response['response']['data']['last_active'].substring(0, 4)
        );
        document.getElementById('profile-photo').src = response['response']['data']['profile_photo'];
        if (response['response']['data']['background_check_confirmed']) {
            html = `
            <b>Background checked </b>
            <img class="p-0 add-img-btn circle-img" src="../assets/images/tick_image.svg"></img>
            `;
            document.getElementById('background-checked').innerHTML = html;
        }
        if (response['response']['data']['teacher_status_confirmed']) {
            html = `
            <b>Teacher status checked </b>
            <img class="p-0 add-img-btn circle-img" src="../assets/images/tick_image.svg"></img>
            `;
            document.getElementById('qualified-teacher-checked').innerHTML = html;
        }
        if (response['response']['data']['qualification_confirmed']) {
            html = `
            <b>Education checked </b>
            <img class="p-0 add-img-btn circle-img" src="../assets/images/tick_image.svg"></img>
            `;
            document.getElementById('qualification-checked').innerHTML = html;
        }
        document.getElementById('hourly-rate').innerHTML = '£'+response['response']['data']['hourly_rate']+'/hr';
        if (parseInt(response['response']['data']['hourly_rate']) <= 30) {
            document.getElementById('service-charge').innerHTML = '<i>+ £ 2.50*</i>';
        } else {
            document.getElementById('service-charge').innerHTML = '<i>+ £ 3.95*</i>';
        }
        document.getElementById('qualification').innerHTML = response['response']['data']['highest_qualification'];
        document.getElementById('hours-taught').innerHTML = (
            'I have taught <b>'
            +response['response']['data']['hours_taught']
            +'</b> hours in total<br>on 123 Help Me Study'
        );
        document.getElementById('subject-1').innerHTML = response['response']['data']['subject_options_1'];
        document.getElementById('subject-2').innerHTML = response['response']['data']['subject_options_2'];
        document.getElementById('subject-3').innerHTML = response['response']['data']['subject_options_3'];
        document.getElementById('about-tutor').innerHTML = (
            response['response']['data']['about_tutor_1']
            +response['response']['data']['about_tutor_2']
        );
        document.getElementById('background-tutor').innerHTML = (
            response['response']['data']['background_tutor_1']
            +response['response']['data']['background_tutor_2']
        );
        /* Set page display */
        document.getElementById('tutor-card').style.display = 'block';
        document.getElementById('disclaimer-card').style.display = 'block';
        document.getElementById('disclaimer-card-spacer').style.display = 'block';
        document.getElementById('loading-card').style.display = 'none';
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

function contact_us_load_page() {
    var now = new Date();
    var contact_today_key = (
        '123helpmestudy-message-'
        +btoa(
            now.toString().substring(0, 18)
        )
    );
    var contact_today = localStorage.getItem(contact_today_key)
    if (contact_today == null) {
        document.getElementById('message-already-sent-today').style.display = 'none';
        document.getElementById('contact-us-form').style.display = 'block';
    }
}

async function contact_us_page_submit() {
    function validate_target(id) {
        if (document.getElementById(id).value.length == 0) {
            var class_list = document.getElementById(id).className;
            if (class_list.indexOf('is-invalid') == -1) {
                document.getElementById(id).className = (
                    class_list
                    +' is-invalid'
                );
            }
            return true;
        }
        return false;
    }
    /* Validate user input */
    var validate = false;
    if (validate_target('email')) {validate = true;}
    if (validate_target('mobile')) {validate = true;}
    if (validate_target('subject')) {validate = true;}
    if (validate_target('message')) {validate = true;}
    if (validate) {return false;}
    /* Validate user agreement and t & c's */
    if (
        document.getElementById('tick-terms-and-conditions').checked == false
        ||
        document.getElementById('tick-privacy-policy').checked == false
    ) {
        // Failed to tick terms and conditions and privacy policy
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = (
            'To proceed, please read and agree to our terms '
            +'and conditions, and our privacy policy.');
        return false;
    }
    /* Validate user robot */
    var robot_status = document.getElementById('is-a-robot').innerHTML;
    if (robot_status == 'yes') {
        document.getElementById('submit-form').style.display = 'none';
        document.getElementById('check-validator').style.display = 'block';
        return false;
    }
    /* Disable submit button */
    document.getElementById('pending-send').style.display = 'block';
    document.getElementById('submit-form').style.display = 'none';
    /* Execute API */
    var path = '/api/salesorders/contact_us';
    var headers = {};
    var method = 'POST';
    var payload = {
        'email_from': document.getElementById('email').value,
        'mobile_from': document.getElementById('mobile').value,
        'subject': document.getElementById('subject').value,
        'message': document.getElementById('message').value
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        var now = new Date();
        var contact_today_key = (
            '123helpmestudy-message-'
            +btoa(now)
        );
        var contact_today = localStorage.getItem(contact_today_key)
        if (contact_today == null) {
            localStorage.setItem(
                contact_today_key,
                'sent'
            );
        }
        document.getElementById('contact-us-form').style.display = 'none';
        document.getElementById('pending-send').style.display = 'none';
        document.getElementById('message-successfully-sent').style.display = 'block';
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function message_tutor_load_page(id) {
    /* Load stored email address */
    var email = localStorage.getItem('123helpmestudy-email');
    if (email != null) {
        document.getElementById('email').value = email;
    }
    /* Load subject attributes */
    var subject_id = document.getElementById('subject-selected').innerHTML;
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
    var subject_request = '{subject}';
    if (response['status'] == 200) {
        var subjects = response['response']['data'];
        for (var i = 0; i < subjects.length; i++) {
            if (subjects[i]['subject_id'] == subject_id) {
                //console.log(subjects[i]['long_name']);
                subject_request = subjects[i]['long_name'];
            }
        }
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
    /* Load tutor attributes */
    var tutor_id = document.getElementById('tutor-selected').innerHTML;
    var path = ('/api/salesorders/show_tutor?tutor='+tutor_id);
    var headers = {};
    var method = 'GET';
    var payload = {};
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    var tutor = '{tutor}';
    if (response['status'] == 200) {
        tutor = response['response']['data']['first_name'];
        document.getElementById('profile-photo').src = response['response']['data']['profile_photo'];
    } else {}
    var html = (
        "Hello "+tutor+",\n\n"
        +"I am looking for help with "+subject_request+".\n"
        +"I came across your profile and feel like you would be a great fit for me.\n"
        +"Please could you let me know when you would be free for a first lesson.\n\n"
        +"Thanks"
    );
    document.getElementById('message').value = html;
    document.getElementById('message-str-len').innerHTML = (
        html.length.toString()
        +' / 500'
    );
    //console.log(response['status']);
    //console.log(response['response']);
}

async function message_tutor_page_submit() {
    function validate_target(id) {
        if (document.getElementById(id).value.length == 0) {
            var class_list = document.getElementById(id).className;
            if (class_list.indexOf('is-invalid') == -1) {
                document.getElementById(id).className = (
                    class_list
                    +' is-invalid'
                );
            }
            return true;
        }
        return false;
    }
    /* Validate user input */
    var validate = false;
    if (validate_target('email')) {validate = true;}
    if (validate_target('mobile')) {validate = true;}
    if (validate_target('message')) {validate = true;}
    if (validate) {return false;}
    /* Validate user agreement and t & c's */
    if (
        document.getElementById('tick-terms-and-conditions').checked == false
        ||
        document.getElementById('tick-privacy-policy').checked == false
    ) {
        // Failed to tick terms and conditions and privacy policy
        document.getElementById('error-card').style.display = 'block';
        document.getElementById('error-response').innerHTML = (
            'To proceed, please read and agree to our terms '
            +'and conditions, and our privacy policy.');
        return false;
    }
    /* Validate user robot */
    var robot_status = document.getElementById('is-a-robot').innerHTML;
    if (robot_status == 'yes') {
        document.getElementById('submit-form').style.display = 'none';
        document.getElementById('check-validator').style.display = 'block';
        return false;
    }
    /* Disable submit button */
    document.getElementById('pending-send').style.display = 'block';
    document.getElementById('submit-form').style.display = 'none';
    /* Execute API */
    var path = '/api/salesorders/message_tutor';
    var headers = {};
    var method = 'POST';
    var payload = {
        'email_from': document.getElementById('email').value,
        'mobile_from': document.getElementById('mobile').value,
        'subject_id': document.getElementById('subject-selected').innerHTML,
        'tutor_id': document.getElementById('tutor-selected').innerHTML,
        'message': document.getElementById('message').value
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        document.getElementById('submit-form').style.display = 'none';
        document.getElementById('pending-send').style.display = 'none';
        document.getElementById('message').value = '';
        document.getElementById('message-sent-successfully').style.display = 'block';
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function remove_users_load_page() {
    var path = '/api/users/list_users';
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
        var users = response['response']['data'];
        for (var i = 0; i < users.length; i++) {
            var html = `
            <div class="card mb-3 p-3 danger-dashboard-button text-center">
                <div class="card-body">
                    <p onclick="remove_users_validate('show-keep-record', `+users[i]['user_id']+`, '');" class="mb-0 hover-pointer">`+users[i]['email']+`</p>
                </div>
                <span id="email-`+users[i]['user_id']+`" class="hidden-el">`+users[i]['email']+`</span>
                <span id="keep-`+users[i]['user_id']+`" class="hidden-el">Y</span>
                <div id="validate-keeping-`+users[i]['user_id']+`" class="hidden-el">
                    <div class="paragraph-seperator"></div>    
                    <p class="mt-3">Keep a record of this user?</p>
                    <button onclick="remove_users_validate('keep-record', `+users[i]['user_id']+`, 'Y');" class="btn btn-success">Yes</button>
                    <button onclick="remove_users_validate('keep-record', `+users[i]['user_id']+`, 'N');" class="btn btn-danger">No</button>
                </div>
                <div id="confirm-delete-`+users[i]['user_id']+`" class="hidden-el">
                    <div class="paragraph-seperator"></div>    
                    <p class="mt-3">Are you sure you want to delete<br>`+users[i]['email']+`?</p>
                    <button onclick="remove_users_submit_page(`+users[i]['user_id']+`);" class="btn btn-danger">Yes</button>
                    <button onclick="remove_users_validate('reset', `+users[i]['user_id']+`, '');" class="btn btn-primary">Cancel</button>
                </div>
            </div>
            `;
            document.getElementById('users-list').innerHTML += html;
        }
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/home.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

function remove_users_validate(parameter, id, answer) {
    if (parameter == 'show-keep-record') {
        document.getElementById('confirm-delete-'+id.toString()).style.display = 'none';
        document.getElementById('validate-keeping-'+id.toString()).style.display = 'block';
    }
    if (parameter == 'keep-record') {
        document.getElementById('keep-'+id.toString()).innerHTML = answer;
        document.getElementById('validate-keeping-'+id.toString()).style.display = 'none';
        document.getElementById('confirm-delete-'+id.toString()).style.display = 'block';
    }
    if (parameter == 'reset') {
        document.getElementById('confirm-delete-'+id.toString()).style.display = 'none';
        document.getElementById('validate-keeping-'+id.toString()).style.display = 'none';
    }
}

async function remove_users_submit_page(id) {
    /* Execute API */
    var email = document.getElementById('email-'+id.toString()).innerHTML;
    var keep = document.getElementById('keep-'+id.toString()).innerHTML;
    var path = '/api/users/delete_user';
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'DELETE';
    var payload = {
        'email': email,
        'keep': keep
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        window.location.reload();
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function messages_page_load_page() {
    var path = ('/api/users/list_user_messages');
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
        var messages = response['response']['data'];
        var a = 0;
        var row_colour = '';
        for (var i = 0; i < messages.length; i++) {
            if (a == 0) {
                a = 1;
                row_colour = '';
            } else {
                a = 0;
                row_colour = ' bg-light';
            }
            var new_message = '';
            if (messages[i]['message_read']) {
                var button_padding = ' pt-2';
                var button_type = 'primary';
            } else {
                if (messages[i]['name'].toString().length > 0) {
                    var button_padding = ' pt-3';
                } else {
                    var button_padding = ' pt-2';
                }
                var button_type = 'success';
                var new_message = '*New*';
            }
            var html = `
            <div class="row py-3`+row_colour+`">
                <div class="col">
                    <p class="font-weight-bold m-0 p-0">`+new_message+`</p>
                    <p class="font-weight-bold m-0 p-0">`+messages[i]['name']+`</p>
                    <p class="m-0 p-0"><small>`+messages[i]['date']+`</small></p>
                </div>
                <div class="col`+button_padding+`">
                    <button onclick="messages_page_submit_page(`+messages[i]['thread_id']+`);" class=" btn btn-`+button_type+`">Read</button>
                </div>
            </div>
            `;
            document.getElementById('messages-list').innerHTML += html;
        }
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/messages.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    console.log(response['status']);
    console.log(response['response']);
}

async function messages_page_submit_page(id) {
    /* Execute API */
    var path = '/api/users/message_read';
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'PUT';
    var payload = {
        'thread_id': id
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        var base = window.location.pathname;
        base = base.toString().replace('/application/user/messages.html', '');
        window.location.assign(base+'/application/user/message-thread.html?id='+id);
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/message-thread.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    console.log(response['status']);
    console.log(response['response']);
}

async function message_thread_page_load_page(id) {
    /* Execute API */
    var path = '/api/users/list_message_thread?thread='+id;
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
        var messages = response['response']['data']['messages'];
        for (var i = 0; i < messages.length; i++) {
            if (messages[i]['source'] == 'me') {
                var bubble_class = 'text-left light-green-card ml-3';
                var from = 'me';
                var to = messages[i]['to_name'];
            } else {
                var bubble_class = 'text-left light-blue-card mr-3';
                var from = messages[i]['from_name'];
                var to = 'me';
            }
            var html = `
            <div class="`+bubble_class+` mb-4 p-3">
                <p class="mb-0">From: <i>`+from+`</i></p>
                <p class="mb-0">To: <i>`+to+`</i></p>
                <p class="mb-0">Date: <i>`+messages[i]['date']+`</i></p>
                <p>Subject: <i>`+messages[i]['subject'].toString().trim()+`</i></p>
                <p class="mb-0">
                    `+messages[i]['message']
                    .toString()
                    .replace('\n', '<br>')+`
                </p>
            </div>
            `;
            document.getElementById('previous-messages').innerHTML += html;
        }
        /* Populate booking details */
        if (response['response']['data']['user_type'] == 'tutor') {
            document.getElementById('customer-id').innerHTML = (
                response['response']['data']['booking_details']['customer_id']
            );
            document.getElementById('tutor-id').innerHTML = (
                response['response']['data']['booking_details']['tutor_id']
            );
            document.getElementById('tutor-rate').innerHTML = (
                response['response']['data']['booking_details']['hourly_rate']
            );
            var subjects = response['response']['data']['booking_details']['tutor_subjects'];
            for (var i = 0; i < subjects.length; i++) {
                var html = "<option value="+subjects[i]['id']+">"+subjects[i]['value']+"</option>";
                document.getElementById('tutor-subjects').innerHTML += html;
            }
            var student_levels = response['response']['data']['booking_details']['student_levels'];
            for (var i = 0; i < student_levels.length; i++) {
                var html = "<option value="+student_levels[i]['id']+">"+student_levels[i]['value']+"</option>";
                document.getElementById('student-level').innerHTML += html;
            }
        }
        
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/message-thread.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    console.log(response['status']);
    console.log(response['response']);
}

async function message_thread_send_message_page_submit_page() {
    /* Validate user response */
    var new_message = document.getElementById('new-message').value;
    if (new_message.length == 0) {
        document.getElementById('error-response').innerHTML = 'Please add a message before sending.';
        document.getElementById('error-card').style.display = 'block';
        return false;
    } else if (new_message > 500) {
        document.getElementById('error-response').innerHTML = 'Your message is too long.';
        document.getElementById('error-card').style.display = 'block';
        return false;
    }
    /* Disable submit button */
    document.getElementById('pending-send').style.display = 'block';
    document.getElementById('submit-new-message').style.display = 'none';
    /* Execute API */
    var path = '/api/users/respond_message';
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'POST';
    var payload = {
        'thread_id': document.getElementById('message-thread').innerHTML,
        'message': new_message
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        window.location.reload();
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/message-thread.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    console.log(response['status']);
    console.log(response['response']);
}

async function message_thread_book_lesson_submit_page() {
    /* Validation */
    var subject_id = document.getElementById('tutor-subjects').value;
    var student_level_id = document.getElementById('student-level').value;
    var requested_booking_date = document.getElementById('lesson-date').value
    var start_time = document.getElementById('lesson-time').value;
    var lesson_duration = document.getElementById('lesson-duration').value;
    var lesson_location = document.getElementById('lesson-location').value;
    var validated = true;
    if (lesson_location == -1) {
        document.getElementById('lesson-location').className += ' is-invalid';
        validated = false;
    }
    if (requested_booking_date == '') {
        document.getElementById('lesson-date').className += ' is-invalid';
        validated = false;
    }
    if (start_time == '') {
        document.getElementById('lesson-time').className += ' is-invalid';
        validated = false;
    }
    if (lesson_duration == -1) {
        document.getElementById('lesson-duration').className += ' is-invalid';
        validated = false;
    }
    if (subject_id == -1) {
        document.getElementById('tutor-subjects').className += ' is-invalid';
        validated = false;
    }
    if (student_level_id == -1) {
        document.getElementById('student-level').className += ' is-invalid';
        validated = false;
    }
    if (validated == false) {
        return false;
    }
    /* Calculations */
    //return false;
    /* Disable book button */
    document.getElementById('pending-send-2').style.display = 'block';
    document.getElementById('submit-book-lesson').style.display = 'none';
    /* Execute API */
    var path = '/api/salesorders/create_sales_order';
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'POST';
    var payload = {
        'sales_source': "123 Help Me Study",
        'customer_id': document.getElementById('customer-id').innerHTML,
        'student_id': document.getElementById('customer-id').innerHTML,
        'subject_id': subject_id,
        'student_level_id': student_level_id,
        'examining_body': '',
        'requested_booking_date': requested_booking_date,
        'promised_booking_date': requested_booking_date,
        'customer_comments': '',
        'internal_comments': '',
        'start_time': start_time+':00',
        'lesson_duration': lesson_duration,
        'tutor_id': document.getElementById('tutor-id').innerHTML,
        'lesson_location': lesson_location,
        'location': '',
        'payment_method_id': 1,
        'total_gross': document.getElementById('tutor-rate').innerHTML
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        var base = (window.location.pathname).toString().replace('/application/user/message-thread.html', '');
        window.location.assign(base+'/application/user/lessons.html');
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/message-thread.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    console.log(response['status']);
    console.log(response['response']);
}


async function lessons_page_load_page() {
    var path = ('/api/salesorders/list_lessons');
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
        var lessons = response['response']['data']['upcoming_lessons'];
        if (lessons.length == 0) {
            var html = `
            <div class="row mb-1">                        
                <div class="col p-0">
                    <div class="card dashboard-button">
                        <div class="card-body">
                            <p class="mb-0">No upcoming lessons</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.getElementById('lessons-list').innerHTML = html;
        }
        for (var i = 0; i < lessons.length; i++) {
            // For customer payment button
            if (lessons[i]['user_type'] != 'tutor') {
                var payment_activity = '<a href="../user/payment-option.html?id='+lessons[i]['lesson_id']+'"><button href="" class="btn btn-success">Pay now to confirm lesson</button></a>';
            } else {
                // For tutor payment status
                if (lessons[i]['payment_status'] == 'pending') {
                    var payment_activity = `
                    <p class="text-danger mb-0">Lesson payment status: `+lessons[i]['payment_status']+`</p>
                    <small class="text-secondary">Please do not attend this lesson until payment is confirmed, otherwise we can <b>not</b> guarentee payment to you.</small>
                    `;
                }
            }
            var html = `
            <div class="row mb-1">                        
                <div class="col p-0">
                    <div class="card">
                        <div class="card-body text-left">
                            <div class="px-4">
                                <p class="mb-0 font-weight-bold">`+lessons[i]['lesson_date']+`</p>
                                <p class="mb-0">`+lessons[i]['header']+`</p>    
                                <div class="mt-3">
                                    `+payment_activity+`
                                </div>
                                <div class="mt-3">
                                    <button onclick="display_change_date_time_lessons_card(`+lessons[i]['lesson_id']+`);" class="btn btn-info">Change lesson date and time</button>
                                </div>
                                <div id="change-lesson-date-time-`+lessons[i]['lesson_id']+`" class="mt-3 hidden-el">
                                    <input id="lesson-date-`+lessons[i]['lesson_id']+`" onclick="reset_invalid_date_time('lesson-date-`+lessons[i]['lesson_id']+`');" class="form-control mb-2" type="date">
                                    <input id="lesson-time-`+lessons[i]['lesson_id']+`" onclick="reset_invalid_date_time('lesson-time-`+lessons[i]['lesson_id']+`');" class="form-control mb-2" type="time">
                                    <div class="mb-5">
                                        <button onclick="lessons_page_change_date_time_on_order(`+lessons[i]['lesson_id']+`);" class="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <button onclick="lessons_page_cancel_order(`+lessons[i]['lesson_id']+`);" class="btn btn-danger">Cancel lesson</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.getElementById('lessons-list').innerHTML += html;
        }
        
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/lessons.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function lessons_page_cancel_order(id) {
    var path = ('/api/salesorders/cancel_salesorder');
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'PUT';
    var payload = {
        'sales_order_id': id
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        window.location.reload();
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/lessons.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function lessons_page_change_date_time_on_order(id) {
    /* Define parameters */
    var lesson_date = document.getElementById('lesson-date-'+id).value;
    var lesson_time = document.getElementById('lesson-time-'+id).value;
    var validated = true;
    if (lesson_date == '') {
        document.getElementById('lesson-date-'+id).className += ' is-invalid';
        validated = false;
    }
    if (lesson_time == '') {
        document.getElementById('lesson-time-'+id).className += ' is-invalid';
        validated = false;
    }
    if (validated == false) {
        return false;
    }
    /* Execute API */
    var path = ('/api/salesorders/change_salesorder_datetime');
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'PUT';
    var payload = {
        'sales_order_id': id,
        'promised_booking_date': lesson_date,
        'start_time': lesson_time,
    };
    var response = await api_call(
        path, 
        headers, 
        method,
        payload
    );
    if (response['status'] == 200) {
        window.location.reload();
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/lessons.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}

async function payment_options_bacs_evidence_page_submit_form() {
    /* Validate base64 */
    var base64_file = document.getElementById('bacs-evidence-base64').innerHTML;
    if (base64_file == '') {
        document.getElementById('error-card').style.display = 'block';
        return false;
    }
    /* Display loading spinner & hide submit buttons */
    document.getElementById('submit-bacs-evidence-file').style.display = 'none';
    document.getElementById('pending-send').style.display = 'block';
    /* Execute API */
    var path = '/api/users/update_user_attribute';
    var headers = {
        'Access-Token': localStorage.getItem('123helpmestudy-access-token'),
    };
    var method = 'PUT';
    var payload = {
        'email': localStorage.getItem('123helpmestudy-email'),
        'attribute': 'bacs_evidence',
        'value': base64_file
    };
    var response = await api_call(
        path,
        headers,
        method,
        payload
    );
    if (response['status'] == 200) {
        var base = (window.location.pathname).toString().replace('/application/user/payment-option.html', '');
        window.location.assign(base+'/information/login.html');
    } else if (response['status'] == 401) {
        var base = (window.location.pathname).toString().replace('/application/user/tutor_profile.html', '');
        window.location.assign(base+'/information/login.html');
    } else {}
    //console.log(response['status']);
    //console.log(response['response']);
}