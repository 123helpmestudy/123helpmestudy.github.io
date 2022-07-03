import { baseUrl } from '../vars.js';

async function apiCall(path, headers, method, payload) {
    let url = `${baseUrl}${path}`;
    let headings = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Incoming-Source': 'signed_by_123_help_me_study'
    };
    for (let header in headers) {
        if (headers[header]) {
            headings[header] = headers[header];
        }
    }
    let requestOptions = {
        headers: headings,
        method: method,
        redirect: 'follow'
    };
    if (method != 'GET') {
        requestOptions['body'] = JSON.stringify(payload);
    }
    let response = await fetch(url, requestOptions);
    let json_response = await response.json();
    return {
        'status': response.status, 
        'response': json_response
    };
}

export { apiCall };