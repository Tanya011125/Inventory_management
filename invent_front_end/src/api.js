// // api.js → Common API utilities for the entire frontend

// export function apiBase() {
//   return "http://127.0.0.1:8000";  // your Django backend
// }

// // Get authentication headers (token from storage)
// export function authHeaders() {
//   const token =
//     sessionStorage.getItem("token") || localStorage.getItem("token");

//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// // Wrapper for GET requests
// export async function apiGet(path) {
//   const res = await fetch(`${apiBase()}${path}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json", ...authHeaders() }
//   });
//   return res.json();
// }

// // Wrapper for POST requests
// export async function apiPost(path, body) {
//   const res = await fetch(`${apiBase()}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", ...authHeaders() },
//     body: JSON.stringify(body)
//   });
//   return res.json();
// }

// // Wrapper for PUT requests
// export async function apiPut(path, body) {
//   const res = await fetch(`${apiBase()}${path}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json", ...authHeaders() },
//     body: JSON.stringify(body)
//   });
//   return res.json();
// }
