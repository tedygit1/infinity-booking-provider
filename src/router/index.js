import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/Layouts/MainLayout.vue";
import AuthLayout from "@/Layouts/AuthLayout.vue";

import Home from "@/pages/Home.vue";
import About from "@/pages/About.vue";
import Contact from "@/pages/Contact.vue";
import HowItWorks from "@/pages/HowItWorks.vue";
import Providers from "@/pages/Providers/Providers.vue";
import ProviderDashboard from "@/pages/Providers/ProviderDashboard.vue";
import ProviderDetails from "@/pages/Providers/ProviderDetails.vue";
import Login from "@/pages/auth/Login.vue";

// ✅ check if user is logged in from localStorage
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

const routes = [
  { path: "/", name: "Home", component: Home, meta: { layout: "main" } },
  { path: "/about", name: "About", component: About, meta: { layout: "main" } },
  { path: "/contact", name: "Contact", component: Contact, meta: { layout: "main" } },
  { path: "/how-it-works", name: "HowItWorks", component: HowItWorks, meta: { layout: "main" } },
  { path: "/providers", name: "Providers", component: Providers, meta: { layout: "main" } },
  { path: "/provider/:id", name: "ProviderDetails", component: ProviderDetails, meta: { layout: "main" } },
  { path: "/provider-dashboard", name: "ProviderDashboard", component: ProviderDashboard, meta: { layout: "main", requiresAuth: true } },
  { path: "/login", name: "Login", component: Login, meta: { layout: "auth", guest: true } },
  { path: "/:pathMatch(.*)*", redirect: "/" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // ✅ scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition; // back/forward buttons
    return { top: 0 }; // always scroll to top on new route
  },
});

// ✅ route guard protects dashboard & prevents going back to login
router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn();

  if (to.meta.requiresAuth && !loggedIn) {
    return next({ name: "Login" });
  }

  if (to.meta.guest && loggedIn) {
    return next({ name: "ProviderDashboard" });
  }

  next();
});

export default router;
