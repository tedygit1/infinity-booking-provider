// src/router/guards.js
import { userStore } from "@/store/user";

export function requireAuth(to, from, next) {
  if (!userStore.isAuthenticated()) {
    return next("/login");
  }
  next();
}
