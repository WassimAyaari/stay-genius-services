
// Re-export all authentication services from the modular files
export * from './auth';
// Explicitly export these services, avoiding conflicts with ./auth exports
export { loginUser } from './auth/loginService';
export { logoutUser } from './auth/logoutService';
export { registerUser } from './auth/registerService';
export { getCurrentSession } from './auth/sessionService';
// Don't re-export isAuthenticated from sessionService since it's already exported from './auth'
