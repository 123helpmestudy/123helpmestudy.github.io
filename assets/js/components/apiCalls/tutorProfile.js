import { apiCall } from '../api.js';

const fetchTutor = async (id) => {
  const path = `/api/salesorders/show_tutor?tutor=${id}`;
  const headers = {};
  const method = 'GET';
  const payload = {};
  let response = await apiCall(
    path, 
    headers, 
    method,
    payload
  );
  if (response.status === 200) return response.response.data;
  return null;
};

export { fetchTutor };