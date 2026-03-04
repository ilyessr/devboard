let accessToken: string | null = null;

export const tokenStore = {
  get() {
    return accessToken;
  },

  set(token: string | null) {
    accessToken = token;
  },

  clear() {
    accessToken = null;
  },
};
