// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Layout
import MainLayout from "@/Layouts/MainLayout.vue";

// General pages
import Home from "@/pages/Home.vue";
import About from "@/pages/About.vue";
import Contact from "@/pages/Contact.vue";
import HowItWorks from "@/pages/HowItWorks.vue";

// Auth pages
import Login from "@/pages/Auth/Login.vue";
import Register from "@/pages/Auth/Register.vue";
import ForgotPassword from "@/pages/Auth/ForgotPassword.vue";


// Provider Dashboard
import Dashboard from "@/pages/Providers/Dashboard.vue";
import HomeDashboard from "@/pages/Providers/HomeDashboard.vue";
import ProfileSection from "@/pages/Providers/ProfileSection.vue";
import ServiceSection from "@/pages/Providers/Services/ServiceSection.vue";
import BookingsSection from "@/pages/Providers/BookingsSection.vue";

import ReviewsSection from "@/pages/Providers/ReviewsSection.vue";

import NotificationsSection from "@/pages/Providers/NotificationsSection.vue";

// Footer pages
import Features from "@/pages/Footer/Features.vue";
import Pricing from "@/pages/Footer/Pricing.vue";
import HelpCenter from "@/pages/Footer/HelpCenter.vue";
import Feedback from "@/pages/Footer/Feedback.vue";
import Team from "@/pages/Footer/team.vue";
import Security from "@/pages/Footer/Security.vue";
import PrivacyPolicy from "@/pages/Footer/PrivacyPolicy.vue";
import TermsOfService from "@/pages/Footer/TermsOfService.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      // General pages
      { path: "", name: "Home", component: Home },
      { path: "about", name: "About", component: About },
      { path: "contact", name: "Contact", component: Contact },
      { path: "how-it-works", name: "HowItWorks", component: HowItWorks },

      // Auth pages
      { path: "login", name: "Login", component: Login },
      { path: "register", name: "Register", component: Register },
      { path: "forgot-password", name: "ForgotPassword", component: ForgotPassword },
     

      // Footer pages
      { path: "features", name: "Features", component: Features },
      { path: "pricing", name: "Pricing", component: Pricing },
      { path: "help-center", name: "HelpCenter", component: HelpCenter },
      { path: "feedback", name: "Feedback", component: Feedback },
      { path: "team", name: "Team", component: Team },
      { path: "security", name: "Security", component: Security },
      { path: "privacy-policy", name: "PrivacyPolicy", component: PrivacyPolicy },
      { path: "terms-of-service", name: "TermsOfService", component: TermsOfService },
    ],
  },

  // Provider Dashboard
  {
    path: "/provider",
    component: Dashboard,
    meta: { requiresProvider: true },
    children: [
      { path: "", redirect: "/provider/home" },
      { path: "home", name: "ProviderHome", component: HomeDashboard },
      { path: "profile", name: "ProviderProfile", component: ProfileSection },
      { path: "services", name: "ProviderServices", component: ServiceSection },
      { path: "bookings", name: "ProviderBookings", component: BookingsSection },
      
      { path: "reviews", name: "ProviderReviews", component: ReviewsSection },
      
      { path: "notifications", name: "ProviderNotifications", component: NotificationsSection },
    ],
  },

  // 404 fallback
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

// Auth guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("provider_token");
  const provider = localStorage.getItem("loggedProvider");

  if (to.meta.requiresProvider && (!token || !provider)) {
    return next({ name: "Login" });
  }

  if ((to.name === "Login" || to.name === "Register") && token && provider) {
    return next({ name: "ProviderHome" });
  }

  next();
});

export default router;