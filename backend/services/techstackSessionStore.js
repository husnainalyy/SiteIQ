import { v4 as uuidv4 } from 'uuid';

const sessionStore = new Map();
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

// Start session with auto-assigned ID and mode
export function createSession(mode) {
  const sessionId = uuidv4();
  const createdAt = Date.now();

  sessionStore.set(sessionId, {
    sessionId,
    mode,
    history: [],
    createdAt
  });

  return sessionId;
}

// Get session by ID
export function getSession(sessionId) {
  return sessionStore.get(sessionId);
}

// Check if session exists
export function sessionExists(sessionId) {
  return sessionStore.has(sessionId);
}

// Session cleanup every minute
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessionStore.entries()) {
    if (now - session.createdAt > SESSION_TIMEOUT) {
      console.log(`🧹 Cleaning up session ${id} due to inactivity.`);
      sessionStore.delete(id);
    }
  }
}, 60 * 1000);
