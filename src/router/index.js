import { createRouter, createWebHistory } from 'vue-router';

// Pages
import Home from '../pages/Home.vue';
import Providers from '../pages/Providers.vue';
import ProviderDetails from '../pages/ProviderDetails.vue';
import About from '../pages/About.vue';
import Contact from '../pages/Contact.vue';
import Login from '../pages/Login.vue';

// Dashboard Pages

import ProviderDashboard from '../pages/ProviderDashboard.vue';


const routes = [
  // Core Infinity Booking routes
  { path: '/', name: 'Home', component: Home },
  { path: '/providers', name: 'Providers', component: Providers },
  { path: '/providers/:id', name: 'ProviderDetails', component: ProviderDetails, props: true },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/login', name: 'Login', component: Login },
  
  // New page: How It Works
  { path: '/how-it-works', name: 'HowItWorks', component: () => import('../pages/HowItWorks.vue') },

  // Dashboard routes
 
  { path: '/provider-dashboard', name: 'ProviderDashboard', component: ProviderDashboard },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
