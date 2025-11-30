<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link" @click="closeMobileMenu">
          <span class="logo-icon">∞</span>
          <span class="logo-text">Infinity-Booking</span>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="desktop-nav">
        <div class="nav-links">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            :class="{ active: $route.path === item.to }"
          >
            {{ item.label }}
          </router-link>
        </div>
        <div class="nav-actions">
          <router-link 
            v-if="!isLoggedIn" 
            to="/login" 
            class="login-btn"
          >
            Get Started
          </router-link>
          <div v-else class="user-menu">
            <button class="user-btn" @click="toggleUserMenu">
              <span class="user-avatar">{{ userInitials }}</span>
              <span class="user-name">{{ userStore.user?.name || 'User' }}</span>
            </button>
            <div v-if="userMenuOpen" class="user-dropdown">
              <router-link to="/dashboard" class="dropdown-item">
                Dashboard
              </router-link>
              <router-link to="/profile" class="dropdown-item">
                Profile
              </router-link>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" @click="logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        class="mobile-menu-btn"
        :class="{ 'active': mobileMenuOpen }"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Mobile Menu Overlay -->
      <div 
        v-if="mobileMenuOpen" 
        class="mobile-overlay" 
        @click="closeMobileMenu"
      ></div>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" :class="{ 'active': mobileMenuOpen }">
        <div class="mobile-nav-header">
          <div class="logo">
            <router-link to="/" class="logo-link" @click="closeMobileMenu">
              <span class="logo-icon">∞</span>
              <span class="logo-text">Infinity-Booking</span>
            </router-link>
          </div>
        </div>
        
        <div class="mobile-nav-content">
          <div class="mobile-nav-links">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="mobile-nav-link"
              :class="{ active: $route.path === item.to }"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </router-link>
          </div>
          
          <div class="mobile-nav-actions">
            <router-link 
              v-if="!isLoggedIn" 
              to="/login" 
              class="mobile-login-btn"
              @click="closeMobileMenu"
            >
              Get Started
            </router-link>
            <div v-else class="mobile-user-info">
              <div class="user-details">
                <span class="user-avatar">{{ userInitials }}</span>
                <div class="user-text">
                  <div class="user-name">{{ userStore.user?.name || 'User' }}</div>
                  <div class="user-email">{{ userStore.user?.email }}</div>
                </div>
              </div>
              <div class="mobile-user-links">
                <router-link to="/dashboard" class="user-link" @click="closeMobileMenu">
                  Dashboard
                </router-link>
                <router-link to="/profile" class="user-link" @click="closeMobileMenu">
                  Profile
                </router-link>
                <button class="user-link logout" @click="logout">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/store/user";
import { toast } from "vue-sonner";

const router = useRouter();
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);

const isLoggedIn = computed(() => !!userStore.user);

const userInitials = computed(() => {
  const name = userStore.user?.name || '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contact", label: "Contact" },
];

// Menu toggle functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  userMenuOpen.value = false;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const logout = () => {
  userStore.logout();
  toast.success("Logged out successfully");
  router.push("/");
  closeMobileMenu();
  userMenuOpen.value = false;
};

// Close menus on outside click and escape key
const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    userMenuOpen.value = false;
  }
};

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    closeMobileMenu();
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 1000;
  height: 70px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* ===== LOGO ===== */
.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.logo-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
}

.logo-text {
  background: linear-gradient(135deg, #1a1a1a, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ===== DESKTOP NAVIGATION ===== */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #1a1a1a;
}

.nav-link.active::after,
.nav-link:hover::after {
  width: 100%;
}

/* ===== NAV ACTIONS ===== */
.nav-actions {
  display: flex;
  align-items: center;
}

.login-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* ===== USER MENU ===== */
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a1a1a;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  padding: 8px 0;
  z-index: 1001;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-decoration: none;
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #1a1a1a;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.04);
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 8px 0;
}

/* ===== MOBILE MENU BUTTON ===== */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.mobile-menu-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

.mobile-menu-btn span {
  width: 20px;
  height: 2px;
  background: #1a1a1a;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* ===== MOBILE OVERLAY ===== */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* ===== MOBILE NAVIGATION ===== */
.mobile-nav {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  max-width: 320px;
  height: 100vh;
  background: white;
  z-index: 999;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-nav.active {
  right: 0;
}

.mobile-nav-header {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-nav-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-nav-link {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
}

.mobile-nav-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 20px;
}

.mobile-login-btn {
  display: block;
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  transition: all 0.2s ease;
}

.mobile-login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* ===== MOBILE USER INFO ===== */
.mobile-user-info {
  padding: 16px 0;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  margin-bottom: 16px;
}

.user-text {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.9rem;
}

.user-email {
  color: #6b7280;
  font-size: 0.8rem;
}

.mobile-user-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-link {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}

.user-link:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #1a1a1a;
}

.user-link.logout {
  color: #ef4444;
}

.user-link.logout:hover {
  background: rgba(239, 68, 68, 0.04);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .logo-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    height: 64px;
  }
  
  .mobile-nav {
    max-width: 100%;
  }
  
  .mobile-nav-content {
    padding: 16px;
  }
}
</style>