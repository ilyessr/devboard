let accessToken: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const tokenStore = {
  get() {
    return accessToken;
  },

  set(token: string | null) {
    accessToken = token;
    notify();
  },

  clear() {
    accessToken = null;
    notify();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
