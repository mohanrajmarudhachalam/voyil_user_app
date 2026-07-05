import axios from 'axios';

//const BACKEND_URL = 'http://localhost:5000';
const BACKEND_URL = 'https://voyil-backend.onrender.com';
export const API = `${BACKEND_URL}/api`;

const PHONE_KEY = 'aevum.phone';
const NAME_KEY = 'aevum.name';
const ADDR_KEY = 'aevum.address';
const ADMIN_KEY = 'aevum.admin_token';
const USERID_KEY = 'aevum.userid';

export const getStoredPhone = () => localStorage.getItem(PHONE_KEY) || '';
export const getStoredName = () => localStorage.getItem(NAME_KEY) || '';
export const getStoredAddress = () => localStorage.getItem(ADDR_KEY) || '';
export const getStoredUserId = () => localStorage.getItem(USERID_KEY) || '';

export const setIdentity = ({ name, phone, address,userid }) => {
  if (phone) localStorage.setItem(PHONE_KEY, phone);
  if (name) localStorage.setItem(NAME_KEY, name);
  if (address) localStorage.setItem(ADDR_KEY, address);
  if (userid) localStorage.setItem(USERID_KEY, userid);
  window.dispatchEvent(new Event('aevum:identity-changed'));
};
export const clearIdentity = () => {
    console.log("Removing User ID:", localStorage.getItem(USERID_KEY));

  localStorage.removeItem(PHONE_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(ADDR_KEY);
  localStorage.removeItem(USERID_KEY);
  window.dispatchEvent(new Event('aevum:identity-changed'));
};

/* ---------- Public ---------- */
export const fetchServices = async () => {
  const { data } = await axios.get(`${API}/services`);
  console.log(JSON.stringify(data));
  
  return data;
};

export const createBooking = async (payload) => {
  console.log(JSON.stringify(payload));
  const { data } = await axios.post(`${API}/bookings`, payload);
  return data;
};

export const fetchMyBookings = async (userId) => {
  const { data } = await axios.get(
    `${API}/bookings/user/${userId}`
  );

  return data;
};

export const cancelMyBooking = async (id, phone) => {
  const { data } = await axios.patch(`${API}/bookings/${id}/cancel`, null, {
    params: { phone },
  });
  return data;
};

/* ---------- Admin ---------- */
export const getAdminToken = () => localStorage.getItem(ADMIN_KEY) || '';
export const setAdminToken = (t) => {
  if (t) localStorage.setItem(ADMIN_KEY, t);
  else localStorage.removeItem(ADMIN_KEY);
};
export const adminLogin = async (password) => {
  const { data } = await axios.post(`${API}/admin/login`, { password });
  setAdminToken(data.token);
  return data.token;
};
//Login
export async function signIn({ email, password }) {
  try {
    const res = await fetch(`${API}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
 
    const data = await res.json();
 
    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Login failed. Please try again.',
      };
    }
 
    // Response shape: { success, message, token, user: { id, email, phone } }
    const { token, user: apiUser } = data;
 
    // API doesn't return a display name, so derive one from the email.
    const n = apiUser.email.split('@')[0].replace(/\W/g, ' ').trim();
    const displayName = n ? n.charAt(0).toUpperCase() + n.slice(1) : 'Member';
 
    setIdentity({ name: displayName, phone: apiUser.phone,userid:apiUser.id, token });
 
    return {
      success: true,
      message: data.message || 'Welcome back!',
      user: { name: displayName, phone: apiUser.phone },
    };
  } catch (err) {
    return {
      success: false,
      message: 
      err.message || 'Login failed. Please try again.',
    };
  }
}
const adminHeaders = () => ({ headers: { 'X-Admin-Token': getAdminToken() } });
export const adminListBookings = async ({ status, q } = {}) => {
  const { data } = await axios.get(`${API}/admin/bookings`, {
    ...adminHeaders(),
    params: { status, q },
  });
  return data;
};
export const adminUpdateStatus = async (id, status) => {
  const { data } = await axios.patch(
    `${API}/admin/bookings/${id}/status`,
    { status },
    adminHeaders()
  );
  return data;
};
export const adminStats = async () => {
  const { data } = await axios.get(`${API}/admin/stats`, adminHeaders());
  return data;
};
