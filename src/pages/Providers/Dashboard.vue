<!-- src/pages/Providers/Dashboard.vue - FINAL FIXED VERSION -->
<template>
  <div class="dashboard-container">
    <!-- Mobile Header -->
    <header class="mobile-header">
      <button @click="toggleSidebar" class="hamburger-btn" aria-label="Menu">
        <i class="fa-solid fa-bars"></i>
      </button>

      <h1 class="mobile-title">Provider Hub</h1>
      
      <!-- Header Actions with Profile Dropdown -->
      <div class="header-actions">
        <!-- Notifications Icon - ULTRA FIXED: Added debug mode -->
        <div class="notification-wrapper">
          <button 
            @click="goToNotifications"
            class="notification-btn"
            aria-label="Notifications"
            :title="`${unreadCount} unread notifications`"
          >
            <i class="fa-solid fa-bell"></i>
            <!-- DEBUG: Show count next to bell for testing -->
            <span class="debug-count" v-if="debugMode">{{ unreadCount }}</span>
            <!-- ACTUAL BADGE -->
            <span 
              v-if="unreadCount > 0" 
              class="notification-badge"
              :class="{ 'pulse': unreadCount > 0 }"
            >
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>
        </div>
        
        <!-- Profile Dropdown -->
        <div class="profile-dropdown-container">
          <button 
            @click="toggleProfileDropdown"
            class="profile-dropdown-btn"
            aria-label="Profile Menu"
          >
            <div class="profile-avatar">
              <i class="fa-solid fa-user"></i>
            </div>
            <span class="user-name" v-if="provider">
              {{ provider.fullname || 'Provider' }}
            </span>
            <i class="dropdown-arrow" :class="{ 'rotated': showProfileDropdown }">
              ▼
            </i>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="showProfileDropdown"
            class="dropdown-menu"
            v-click-outside="closeProfileDropdown"
          >
            <div class="dropdown-header">
              <div class="dropdown-avatar">
                <i class="fa-solid fa-user-circle"></i>
              </div>
              <div class="dropdown-user-info">
                <h4>{{ provider?.fullname || 'Provider' }}</h4>
                <p>{{ provider?.email || 'provider@example.com' }}</p>
              </div>
            </div>
            
            <div class="dropdown-divider"></div>
            
            <button @click="goToProfile" class="dropdown-item">
              <i class="fa-solid fa-user"></i>
              <span>My Profile</span>
            </button>
            
            <button @click="goToSettings" class="dropdown-item">
              <i class="fa-solid fa-gear"></i>
              <span>Settings</span>
            </button>
            
            <div class="dropdown-divider"></div>
            
            <button @click="logout" class="dropdown-item logout-item">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      class="dashboard-sidebar"
      :class="{ 'sidebar-open': sidebarOpen }"
    >
      <div class="sidebar-inner">
        <!-- Logo Section -->
        <div class="logo-section">
          <div class="logo-icon">💼</div>
          <div class="logo-text">
            <h2 class="sidebar-title">Provider Hub</h2>
            <p class="sidebar-subtitle">Business Dashboard</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <!-- Main Dashboard Section -->
          <div class="nav-section">
            <h3 class="nav-section-title">MAIN</h3>
            <ul class="sidebar-menu">
              <li
                v-for="(item, key) in mainMenuItems"
                :key="key"
                @click="goTo(key)"
                :class="{ active: isActiveRoute(key) }"
              >
                <div class="menu-item-content">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>

          <!-- Dashboard Sub-menu (shown when on dashboard) -->
          <div 
            class="nav-section dashboard-submenu" 
            v-if="showDashboardSubmenu"
          >
            <h3 class="nav-section-title">DASHBOARD SECTIONS</h3>
            <ul class="sidebar-menu submenu">
              <li
                v-for="(item, key) in dashboardSubmenuItems"
                :key="key"
                @click="goTo(key)"
                :class="{ active: isActiveRoute(key) }"
              >
                <div class="menu-item-content">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>

          <!-- Account Section -->
          <div class="nav-section">
            <h3 class="nav-section-title">ACCOUNT</h3>
            <ul class="sidebar-menu">
              <li
                v-for="(item, key) in accountMenuItems"
                :key="key"
                @click="goTo(key)"
                :class="{ active: isActiveRoute(key) }"
              >
                <div class="menu-item-content">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
                <div class="active-indicator"></div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="dashboard-main">
      <router-view 
        :provider="provider" 
        @profileUpdated="handleProfileUpdated"
        @logout="logout"
      />
      
      <div v-if="!$route.name" class="fallback-content">
        <div class="fallback-icon">🚀</div>
        <h2>Welcome to Your Dashboard</h2>
        <p>Select a section from the menu to get started managing your business.</p>
        <div class="fallback-stats">
          <div class="stat">
            <div class="stat-number">0</div>
            <div class="stat-label">Active Services</div>
          </div>
          <div class="stat">
            <div class="stat-number">0</div>
            <div class="stat-label">Pending Bookings</div>
          </div>
          <div class="stat">
            <div class="stat-number">0</div>
            <div class="stat-label">New Messages</div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Debug Panel (remove in production) -->
    <div v-if="debugMode" class="debug-panel">
      <div class="debug-title">🔧 Debug Info</div>
      <div>Unread Count: {{ unreadCount }}</div>
      <div>Profile Dropdown: {{ showProfileDropdown ? 'Open' : 'Closed' }}</div>
      <div>Provider: {{ provider?.fullname || 'Not loaded' }}</div>
      <button @click="debugMode = false" class="debug-close">Hide Debug</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import http from "@/api/index.js";

// Click outside directive - FIXED version
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    setTimeout(() => {
      document.body.addEventListener('click', el.clickOutsideEvent);
    }, 0);
  },
  beforeUnmount(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};

export default {
  name: 'Dashboard',
  directives: {
    'click-outside': vClickOutside
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const provider = ref(null);
    const sidebarOpen = ref(false);
    const showProfileDropdown = ref(false);
    const unreadCount = ref(0);
    const notificationInterval = ref(null);
    const debugMode = ref(true); // Set to false in production

    // Force show badge for testing
    onMounted(() => {
      // Test: Force show badge with 10 notifications
      setTimeout(() => {
        if (debugMode.value) {
          console.log('🔧 DEBUG: Forcing unreadCount to 10 for testing');
          unreadCount.value = 10;
        }
      }, 1000);
    });

    // Menu items
    const menuItems = {
      home: { label: "Dashboard", icon: "fa-solid fa-house", route: "ProviderHome", category: "main" },
      services: { label: "My Services", icon: "fa-solid fa-briefcase", route: "ProviderServices", category: "dashboard" },
      bookings: { label: "Bookings", icon: "fa-solid fa-calendar-check", route: "ProviderBookings", category: "dashboard" },
      earnings: { label: "Earnings", icon: "fa-solid fa-wallet", route: "ProviderEarnings", category: "dashboard" },
      analytics: { label: "Analytics", icon: "fa-solid fa-chart-line", route: "ProviderAnalytics", category: "dashboard" },
      messages: { label: "Messages", icon: "fa-solid fa-envelope", route: "ProviderMessages", category: "dashboard" },
      reviews: { label: "Reviews", icon: "fa-solid fa-star", route: "ProviderReviews", category: "dashboard" },
      notifications: { label: "Notifications", icon: "fa-solid fa-bell", route: "ProviderNotifications", category: "dashboard" },
      profile: { label: "My Profile", icon: "fa-solid fa-user", route: "ProviderProfile", category: "account" },
      settings: { label: "Settings", icon: "fa-solid fa-gear", route: "ProviderSettings", category: "account" },
    };

    // Computed properties
    const mainMenuItems = computed(() => 
      Object.entries(menuItems)
        .filter(([key, item]) => item.category === 'main')
        .reduce((obj, [key, item]) => ({ ...obj, [key]: item }), {})
    );

    const dashboardSubmenuItems = computed(() => 
      Object.entries(menuItems)
        .filter(([key, item]) => item.category === 'dashboard')
        .reduce((obj, [key, item]) => ({ ...obj, [key]: item }), {})
    );

    const accountMenuItems = computed(() => 
      Object.entries(menuItems)
        .filter(([key, item]) => item.category === 'account')
        .reduce((obj, [key, item]) => ({ ...obj, [key]: item }), {})
    );

    const showDashboardSubmenu = computed(() => {
      return route.name === 'ProviderHome' || 
             Object.values(dashboardSubmenuItems.value).some(item => 
               route.name?.includes(item.route.replace('Provider', '')) || 
               route.name === item.route
             );
    });

    const isActiveRoute = (menuKey) => {
      const menuRoute = menuItems[menuKey]?.route;
      if (!menuRoute) return false;
      
      if (menuRoute === "ProviderHome" && route.name === "ProviderHome") return true;
      
      return route.name?.includes(menuRoute.replace('Provider', '')) || 
             route.name === menuRoute;
    };

    // Navigation
    const goTo = (menuKey) => {
      const targetRoute = menuItems[menuKey]?.route;
      if (targetRoute) {
        router.push({ name: targetRoute });
      }
      sidebarOpen.value = false;
    };

    const goToNotifications = () => {
      console.log('🔔 Going to notifications page');
      router.push({ name: 'ProviderNotifications' });
    };

    // Profile dropdown functions
    const toggleProfileDropdown = (event) => {
      event.stopPropagation();
      showProfileDropdown.value = !showProfileDropdown.value;
      console.log('👤 Profile dropdown toggled:', showProfileDropdown.value);
    };

    const closeProfileDropdown = (event) => {
      const dropdown = document.querySelector('.profile-dropdown-container');
      if (dropdown && !dropdown.contains(event.target)) {
        showProfileDropdown.value = false;
      }
    };

    const goToProfile = () => {
      router.push({ name: 'ProviderProfile' });
      showProfileDropdown.value = false;
    };

    const goToSettings = () => {
      router.push({ name: 'ProviderSettings' });
      showProfileDropdown.value = false;
    };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const logout = async () => {
      try {
        await http.post("/ainfinity-booking/auth/logout");
      } catch (error) {
        console.log("Logout API call failed", error);
      }
      
      localStorage.clear();
      showProfileDropdown.value = false;
      await router.push({ name: "Login" });
    };

    // Get provider ID
    const getProviderPid = () => {
      try {
        const loggedProvider = localStorage.getItem('loggedProvider');
        if (!loggedProvider) return null;
        
        const providerData = JSON.parse(loggedProvider);
        return providerData.pid || providerData._id || providerData.id;
      } catch (err) {
        console.error('Error getting provider ID:', err.message);
        return null;
      }
    };

    // Fetch unread notification count
    const fetchUnreadCount = async () => {
      try {
        const providerPid = getProviderPid();
        if (!providerPid) {
          console.log('⚠️ No provider ID found');
          unreadCount.value = 0;
          return;
        }

        console.log('🔔 Fetching notification count for provider:', providerPid);

        const endpoints = [
          `/notifications?recipientId=${providerPid}&recipientType=provider&read=false`,
          `/notifications?providerId=${providerPid}&read=false`,
          `/notifications/unread/count?providerId=${providerPid}`,
        ];

        for (const url of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${url}`);
            const response = await http.get(url);
            
            if (response.data !== undefined && response.data !== null) {
              let count = 0;
              
              if (typeof response.data === 'number') {
                count = response.data;
              } else if (Array.isArray(response.data)) {
                count = response.data.length;
              } else if (response.data.count !== undefined) {
                count = response.data.count;
              } else if (response.data.unreadCount !== undefined) {
                count = response.data.unreadCount;
              } else if (response.data.total !== undefined) {
                count = response.data.total;
              } else if (response.data.data && Array.isArray(response.data.data)) {
                count = response.data.data.length;
              }
              
              console.log(`✅ Count from ${url}:`, count);
              
              if (count > 0) {
                unreadCount.value = count;
                return;
              }
            }
          } catch (error) {
            if (!error.response || error.response.status !== 404) {
              console.log(`⚠️ Endpoint ${url} failed:`, error.message);
            }
          }
        }
        
        unreadCount.value = 0;
        
      } catch (error) {
        console.error("❌ Error fetching notification count:", error);
        unreadCount.value = 0;
      }
    };

    // Fetch provider data
    const fetchProvider = async () => {
      const token = localStorage.getItem("provider_token");
      if (!token) {
        return router.push({ name: "Login" });
      }

      try {
        const res = await http.get("/users/profile", {
          headers: { "Cache-Control": "no-cache" },
        });
        
        provider.value = res.data;
        if (res.data._id) {
          localStorage.setItem("provider_id", res.data._id);
        }
        
        fetchUnreadCount();
      } catch (err) {
        console.error("Profile load failed:", err);
        localStorage.clear();
        router.push({ name: "Login" });
      }
    };

    // Watch for route changes
    watch(() => route.name, (newRoute) => {
      const isProviderRoute = newRoute?.includes('Provider') || 
                             route.path.includes('/provider');
      
      if (isProviderRoute && localStorage.getItem("provider_token")) {
        fetchProvider();
      }
    });

    onMounted(() => {
      const isProviderRoute = route.path.includes('/provider') || 
                             route.name?.includes('Provider');
      const hasToken = localStorage.getItem("provider_token");
      
      if (isProviderRoute && hasToken) {
        fetchProvider();
        
        notificationInterval.value = setInterval(fetchUnreadCount, 60000);
      } else if (isProviderRoute && !hasToken) {
        router.push({ name: "Login" });
      }
    });

    onBeforeUnmount(() => {
      if (notificationInterval.value) {
        clearInterval(notificationInterval.value);
      }
    });

    const handleProfileUpdated = () => {
      if (localStorage.getItem("provider_token")) {
        fetchProvider();
      }
    };

    return {
      provider,
      sidebarOpen,
      showProfileDropdown,
      unreadCount,
      debugMode,
      mainMenuItems,
      dashboardSubmenuItems,
      accountMenuItems,
      showDashboardSubmenu,
      isActiveRoute,
      goTo,
      goToNotifications,
      toggleSidebar,
      toggleProfileDropdown,
      closeProfileDropdown,
      goToProfile,
      goToSettings,
      logout,
      handleProfileUpdated
    };
  }
};
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', 'Poppins', sans-serif;
  overflow-x: hidden;
}

/* ===== MOBILE HEADER ===== */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(30, 64, 175, 0.2);
}

.hamburger-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.mobile-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

/* ===== HEADER ACTIONS ===== */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* NOTIFICATION WRAPPER - FIXED */
.notification-wrapper {
  position: relative;
  display: inline-block;
}

/* Notifications Button - ULTRA FIXED */
.notification-btn {
  position: relative !important;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  width: 44px;
  height: 44px;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.notification-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* DEBUG COUNT (visible next to bell) */
.debug-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: yellow;
  color: black;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 4px;
  z-index: 1002;
}

/* NOTIFICATION BADGE - ULTRA FIXED */
.notification-badge {
  position: absolute !important;
  top: -8px !important;
  right: -8px !important;
  background: #ff5252 !important;
  color: white !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  min-width: 20px !important;
  height: 20px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 4px !important;
  box-shadow: 0 2px 8px rgba(255, 82, 82, 0.4) !important;
  border: 2px solid white !important;
  z-index: 1001 !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: none !important;
  animation: badgeAppear 0.3s ease !important;
}

@keyframes badgeAppear {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.notification-badge.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 82, 82, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
}

/* Profile Dropdown */
.profile-dropdown-container {
  position: relative;
}

.profile-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 160px;
}

.profile-dropdown-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 0.7rem;
  margin-left: auto;
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.3s ease;
  border: 1px solid #e2e8f0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dropdown-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
}

.dropdown-user-info h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.dropdown-user-info p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.dropdown-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #3b82f6;
}

.dropdown-item i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
}

.dropdown-item.logout-item {
  color: #ef4444;
}

.dropdown-item.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* ===== SIDEBAR ===== */
.dashboard-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 320px;
  height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e2e8f0;
  box-shadow: 8px 0 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 90;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dashboard-sidebar.sidebar-open {
  transform: translateX(0);
}

.sidebar-inner {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.logo-icon {
  font-size: 2.2rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.sidebar-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
}

/* Dashboard Submenu */
.dashboard-submenu {
  margin-left: 1rem;
  border-left: 2px solid #e2e8f0;
  padding-left: 1rem;
}

.dashboard-submenu .nav-section-title {
  font-size: 0.7rem;
  color: #64748b;
}

.sidebar-menu.submenu {
  margin-left: 0.5rem;
}

.sidebar-menu.submenu .menu-item-content {
  padding: 0.5rem 1rem;
}

.sidebar-menu.submenu li span {
  font-size: 0.9rem;
  font-weight: 500;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-menu li {
  position: relative;
  cursor: pointer;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 1.25rem;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.sidebar-menu li i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.sidebar-menu li span {
  font-weight: 600;
  color: #475569;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.sidebar-menu li:hover .menu-item-content {
  background: #f1f5f9;
  transform: translateX(4px);
}

.sidebar-menu li:hover i,
.sidebar-menu li:hover span {
  color: #3b82f6;
}

.sidebar-menu li.active .menu-item-content {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.sidebar-menu li.active i,
.sidebar-menu li.active span {
  color: white;
}

.active-indicator {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-menu li.active .active-indicator {
  opacity: 1;
}

/* Main Content */
.dashboard-main {
  flex: 1;
  padding: 2rem;
  padding-top: 90px;
  background: #f8fafc;
  min-height: calc(100vh - 90px);
}

/* Fallback Content */
.fallback-content {
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  text-align: center;
  margin: 2rem 0;
  border: 1px solid #f1f5f9;
}

.fallback-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.fallback-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.fallback-content p {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 2rem;
}

.fallback-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.stat {
  background: #f8fafc;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

/* DEBUG PANEL */
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 9999;
  max-width: 200px;
}

.debug-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: yellow;
}

.debug-close {
  margin-top: 5px;
  background: #666;
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .mobile-header {
    padding: 1rem;
  }
  
  .mobile-title {
    font-size: 1.2rem;
  }
  
  .profile-dropdown-btn {
    min-width: auto;
    padding: 0.5rem;
  }
  
  .user-name {
    display: none;
  }
  
  .dropdown-arrow {
    display: none;
  }
  
  .notification-btn {
    width: 40px;
    height: 40px;
  }
  
  .notification-badge {
    top: -6px !important;
    right: -6px !important;
    min-width: 18px !important;
    height: 18px !important;
    font-size: 0.65rem !important;
  }
  
  .dashboard-main {
    padding: 1.5rem;
    padding-top: 80px;
  }
  
  .dropdown-menu {
    width: 260px;
    right: -10px;
  }
  
  .fallback-content {
    padding: 2rem;
  }
  
  .fallback-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    padding: 1rem;
    padding-top: 80px;
  }
  
  .fallback-content {
    padding: 1.5rem;
  }
  
  .fallback-icon {
    font-size: 3rem;
  }
  
  .fallback-content h2 {
    font-size: 1.5rem;
  }
  
  .fallback-content p {
    font-size: 1rem;
  }
  
  .dropdown-menu {
    width: 240px;
  }
  
  .debug-panel {
    bottom: 10px;
    right: 10px;
    font-size: 10px;
    padding: 8px 12px;
  }
}
</style>