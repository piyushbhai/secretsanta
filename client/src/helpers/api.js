import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export function uploadEmployeeFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  return http.post('/employees/upload', fd);
}

export function fetchEmployees() {
  return http.get('/employees');
}

export function runSecretSanta(prevFile) {
  const fd = new FormData();
  if (prevFile) fd.append('previousFile', prevFile);
  return http.post('/assignments/generate', fd);
}

export function fetchAssignments(year) {
  return http.get(`/assignments/${year || ''}`);
}

export function getDownloadUrl(year) {
  return `http://localhost:5000/api/assignments/download/${year || new Date().getFullYear()}`;
}