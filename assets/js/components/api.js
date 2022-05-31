var BASE_URL = 'http://127.0.0.3:8000';
//var BASE_URL = 'https://api.123helpmestudy.com';

async function apiCall(path, headers, method, payload) {
    var url = BASE_URL+path;
    var headings = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Incoming-Source': 'signed_by_123_help_me_study'
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

export { apiCall };