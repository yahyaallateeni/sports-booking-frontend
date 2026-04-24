const API_BASE_URL = '/api/v1';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      'حدث خطأ أثناء الاتصال بالخادم';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return data;
}

async function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function getCities() {
  return apiRequest('/locations/cities');
}

window.API = {
  registerUser,
  loginUser,
  getCities,
};
