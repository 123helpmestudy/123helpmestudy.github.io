import { apiCall } from '../api.js';

const validateUserInteraction = async () => {
  const path = ('/api/validate_user_interaction');
  const headers = {};
  const method = 'GET';
  const payload = {};
  const response = await apiCall(
    path,
    headers,
    method,
    payload
  );
  if (response.status === 200) {
    const attributes = response['response']['data'];
    for (let i = 0; i < attributes.length; i++) {
      let validImg = document.getElementById(`validImg${i + 1}`);
      let img = document.createElement('img');
      img.className = 'hover-pointer little-flag';
      img.src = attributes[i].icon;
      img.addEventListener('click', () => {
        let findCountryNumber = document.getElementById('find-country-answer').innerHTML;
        if (attributes[i].number == findCountryNumber) {
          document.getElementById('is-a-robot').innerHTML = 'no';
          document.getElementById('check-validator').style.display = 'none';
          document.getElementById('submitForm').style.display = 'inline';
        } else {
          document.getElementById('check-validator').style.display = 'none';
          document.getElementById('robot-error-card').style.display = 'block';
        }
      });
      validImg.appendChild(img);
    }
    document.getElementById('find-country').innerHTML = (
      "Can you identify the flag for "
      + response['response']['find_country']
      + "?"
    );
    document.getElementById('find-country-answer').innerHTML = response['response']['find_country_number'];
  }
};

export { validateUserInteraction };