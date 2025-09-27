export const isAuthenticated = () => {
  // BYPASS AUTH FOR TEST ROUTES
  const currentPath = window.location.pathname;
  const isTestRoute = currentPath.startsWith('/test') || 
                     currentPath === '/working-form' ||
                     currentPath.includes('resume-test.html') ||
                     currentPath.includes('simple-test.html');
  
  if (isTestRoute) {
    console.log('🎯 Bypassing auth check for test route:', currentPath);
    return true; // Always authenticated for test routes
  }

  // NORMAL AUTH CHECK FOR NON-TEST ROUTES
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  // Don't remove token on test routes
  const currentPath = window.location.pathname;
  const isTestRoute = currentPath.startsWith('/test') || 
                     currentPath === '/working-form';
  
  if (isTestRoute) {
    console.log('🎯 Skipping token removal for test route:', currentPath);
    return;
  }
  
  localStorage.removeItem('token');
};

export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// HELPER FUNCTION FOR TEST ROUTES
export const isTestRoute = (path = window.location.pathname) => {
  return path.startsWith('/test') || 
         path === '/working-form' ||
         path.includes('resume-test.html') ||
         path.includes('simple-test.html');
};

// MOCK USER FOR TEST ROUTES
export const getMockUser = () => {
  return {
    id: 1,
    email: 'test@example.com',
    fullName: 'Test User',
    isTestUser: true
  };
};
