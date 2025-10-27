// src/store/user.js
import { reactive } from 'vue';

export const userStore = reactive({
  user: null,  // logged-in user info

  login(payload) {
    this.user = payload;
    localStorage.setItem('token', JSON.stringify(payload)); // optional: persist
  },

  logout() {
    this.user = null;
    localStorage.removeItem('token');
  },

  init() {
    // load user from localStorage on app start
    const token = localStorage.getItem('token');
    if (token) {
      this.user = JSON.parse(token);
    }
  }
});
