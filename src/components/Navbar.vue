<!-- src/components/Navbar.vue -->
<template>
  <!-- Only show navbar if NOT on provider dashboard routes -->
  <nav v-if="!isProviderRoute" class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <span class="logo-icon">∞</span>
          <span class="logo-text">Infinity-Booking</span>
        </router-link>
      </div>

      <!-- Desktop Navigation - ONLY 4 LINKS -->
      <div class="desktop-nav">
        <ul class="nav-menu">
          <li>
            <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
              <span class="link-text">Home</span>
              <span class="link-hover"></span>
            </router-link>
          </li>
          <li>
            <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }">
              <span class="link-text">About</span>
              <span class="link-hover"></span>
            </router-link>
          </li>
          <li>
            <router-link to="/how-it-works" class="nav-link" :class="{ active: $route.path === '/how-it-works' }">
              <span class="link-text">How It Works</span>
              <span class="link-hover"></span>
            </router-link>
          </li>
          <li>
            <router-link to="/contact" class="nav-link" :class="{ active: $route.path === '/contact' }">
              <span class="link-text">Contact</span>
              <span class="link-hover"></span>
            </router-link>
          </li>
        </ul>
        
        <!-- Auth Buttons -->
        <div class="auth-section">
          <router-link v-if="!isLoggedIn" to="/login" class="login-btn">
            <span>Sign In</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M20 12h-9.5m7.5 3l3-3-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 3.75H7.5a2.25 2.25 0 00-2.25 2.25v11.25a2.25 2.25 0 002.25 2.25h8.25a2.25 2.25 0 002.25-2.25v-.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </router-link>
          <div v-else class="user-dropdown">
            <button class="user-menu" @click="toggleDropdown">
              <span class="user-avatar">{{ userInitials }}</span>
              <svg class="dropdown-icon" :class="{ rotated: dropdownOpen }" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="dropdownOpen" class="dropdown-menu">
              <router-link to="/dashboard" class="dropdown-item" @click="closeDropdown">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Dashboard</span>
              </router-link>
              <button class="dropdown-item" @click="logout">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button class="mobile-toggle" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }">
        <span class="line line1"></span>
        <span class="line line2"></span>
        <span class="line line3"></span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>

    <!-- Mobile Menu - Small sidebar from right -->
    <div class="mobile-sidebar" :class="{ open: mobileMenuOpen }">
      <div class="sidebar-content">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <router-link to="/" class="mobile-logo" @click="closeMobileMenu">
            <span class="logo-icon">∞</span>
            <span class="logo-text">Infinity-Booking</span>
          </router-link>
          <button class="sidebar-close" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Sidebar Navigation - ONLY 4 LINKS -->
        <div class="sidebar-nav">
          <router-link to="/" class="sidebar-link" :class="{ active: $route.path === '/' }" @click="closeMobileMenu">
            <span class="link-icon">🏠</span>
            <span>Home</span>
          </router-link>
          
          <router-link to="/about" class="sidebar-link" :class="{ active: $route.path === '/about' }" @click="closeMobileMenu">
            <span class="link-icon">📖</span>
            <span>About</span>
          </router-link>
          
          <router-link to="/how-it-works" class="sidebar-link" :class="{ active: $route.path === '/how-it-works' }" @click="closeMobileMenu">
            <span class="link-icon">⚙️</span>
            <span>How It Works</span>
          </router-link>
          
          <router-link to="/contact" class="sidebar-link" :class="{ active: $route.path === '/contact' }" @click="closeMobileMenu">
            <span class="link-icon">📞</span>
            <span>Contact</span>
          </router-link>
        </div>

        <!-- Sidebar Auth -->
        <div class="sidebar-auth">
          <div v-if="!isLoggedIn" class="sidebar-buttons">
            <router-link to="/login" class="sidebar-login-btn" @click="closeMobileMenu">
              <span>Sign In</span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 12h-9.5m7.5 3l3-3-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 3.75H7.5a2.25 2.25 0 00-2.25 2.25v11.25a2.25 2.25 0 002.25 2.25h8.25a2.25 2.25 0 002.25-2.25v-.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </router-link>
          </div>
          <div v-else class="sidebar-user">
            <div class="user-info">
              <div class="user-avatar-mobile">{{ userInitials }}</div>
              <div class="user-details">
                <p class="user-name">{{ userStore.user?.name || 'User' }}</p>
                <p class="user-email">{{ userStore.user?.email || 'user@example.com' }}</p>
              </div>
            </div>
            <div class="sidebar-user-menu">
              <router-link to="/dashboard" class="sidebar-user-item" @click="closeMobileMenu">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Dashboard</span>
              </router-link>
              <button class="sidebar-user-item" @click="logout">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { userStore } from "@/store/user";
import { toast } from "vue-sonner";

const router = useRouter();
const route = useRoute();
const mobileMenuOpen = ref(false);
const dropdownOpen = ref(false);
const isScrolled = ref(false);

const isLoggedIn = computed(() => !!userStore.user);

// Check if current route is a provider dashboard route
const isProviderRoute = computed(() => {
  return route.path.startsWith('/provider') || 
         route.path.includes('/dashboard') ||
         route.path === '/provider' ||
         route.path === '/dashboard';
});

// Get user initials for avatar
const userInitials = computed(() => {
  if (!userStore.user?.name) return 'U';
  const names = userStore.user.name.split(' ');
  return names.length > 1 
    ? `${names[0][0]}${names[1][0]}`.toUpperCase()
    : names[0][0].toUpperCase();
});

// Handle scroll effect
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const logout = () => {
  userStore.logout();
  toast.success("✅ Signed out successfully");
  router.push("/");
  closeDropdown();
  closeMobileMenu();
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownOpen.value && !event.target.closest('.user-dropdown')) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
  border-bottom-color: rgba(226, 232, 240, 0.9);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
}

/* ===== LOGO ===== */
.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: translateY(-1px);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 20px;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

/* ===== DESKTOP NAVIGATION ===== */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-menu {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  position: relative;
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 8px 4px;
  transition: color 0.3s ease;
  overflow: hidden;
}

.link-text {
  position: relative;
  z-index: 2;
}

/* Underline - HIDDEN by default */
.link-hover {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: translateX(-100%); /* Start hidden on left */
  transition: transform 0.3s ease;
  opacity: 0; /* Start invisible */
}

/* Hover effect - underline appears ONLY on hover */
.nav-link:hover .link-hover {
  transform: translateX(0); /* Slide in from left */
  opacity: 1; /* Become visible */
}

.nav-link:hover {
  color: #1e293b;
}

/* Active state - NO underline by default, just color change */
.nav-link.active {
  color: #667eea;
  font-weight: 600;
}

/* Active state - show underline ONLY on hover */
.nav-link.active:hover .link-hover {
  transform: translateX(0);
  opacity: 1;
}

/* ===== AUTH SECTION ===== */
.auth-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* ===== USER DROPDOWN ===== */
.user-dropdown {
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-menu:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
  transition: transform 0.3s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  z-index: 100;
  animation: dropdownSlide 0.3s ease;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  color: #475569;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #667eea;
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
  color: #94a3b8;
}

.dropdown-item:hover svg {
  color: #667eea;
}

/* ===== MOBILE TOGGLE ===== */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 101;
}

.line {
  width: 28px;
  height: 2px;
  background: #475569;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-toggle.active .line1 {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-toggle.active .line2 {
  opacity: 0;
  transform: translateX(-10px);
}

.mobile-toggle.active .line3 {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ===== MOBILE OVERLAY ===== */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 998;
  animation: overlayFade 0.3s ease;
}

@keyframes overlayFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ===== MOBILE SIDEBAR (SMALL SIZE) ===== */
.mobile-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px; /* FIXED: Small width, not full page */
  height: 100vh;
  background: white;
  z-index: 999;
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.mobile-sidebar.open {
  transform: translateX(0);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
}

/* Sidebar Header */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #64748b;
  transition: color 0.2s ease;
}

.sidebar-close:hover {
  color: #1e293b;
}

.sidebar-close svg {
  width: 24px;
  height: 24px;
}

/* Sidebar Navigation */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  background: #f8fafc;
  color: #1e293b;
}

.sidebar-link.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  color: #667eea;
  font-weight: 600;
}

.link-icon {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

/* Sidebar Auth */
.sidebar-auth {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.sidebar-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.2s ease;
}

.sidebar-login-btn:hover {
  transform: translateY(-2px);
}

.sidebar-login-btn svg {
  width: 18px;
  height: 18px;
}

/* Sidebar User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.user-avatar-mobile {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.user-email {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.sidebar-user-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #475569;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.sidebar-user-item:hover {
  background: #f8fafc;
  color: #667eea;
}

.sidebar-user-item svg {
  width: 18px;
  height: 18px;
  color: #94a3b8;
}

.sidebar-user-item:hover svg {
  color: #667eea;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .container {
    padding: 0 20px;
  }
  
  .nav-menu {
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .container {
    height: 64px;
    padding: 0 16px;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .mobile-toggle {
    display: flex;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
  
  /* Mobile sidebar width for tablets */
  .mobile-sidebar {
    width: 260px;
  }
}

@media (max-width: 480px) {
  /* Mobile sidebar width for phones */
  .mobile-sidebar {
    width: 260px;
  }
  
  .sidebar-content {
    padding: 20px;
  }
  
  .sidebar-link {
    font-size: 0.95rem;
    padding: 12px 16px;
  }
  
  .link-icon {
    font-size: 1rem;
  }
}

/* For very small screens, make sidebar even narrower */
@media (max-width: 360px) {
  .mobile-sidebar {
    width: 240px;
  }
}
</style>