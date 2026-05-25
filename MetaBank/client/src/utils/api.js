const api = {
  get: (path) => fetch(path, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` } }),
  post: (path, body) => fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` }, body: JSON.stringify(body) }),
  postForm: (path, formData) => fetch(path, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` }, body: formData })
};

export default api;
