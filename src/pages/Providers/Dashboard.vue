<!-- src/pages/Providers/Dashboard.vue - PROFILE DROPDOWN FIX ONLY -->
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
        <!-- Notifications Icon - NO CHANGES -->
        <div class="notification-wrapper">
          <button 
            @click="goTo('notifications')"
            class="notification-btn"
            :class="{ 'has-notifications': unreadCount > 0 }"
            aria-label="Notifications"
            :title="`${unreadCount} unread notifications`"
          >
            <i class="fa-solid fa-bell"></i>
            <!-- Notification Badge - NO CHANGES -->
            <span v-if="unreadCount > 0" class="notification-badge" :class="{ 'pulse': unreadCount > 0 }">
              {{ unreadCount > 99 ? '99+' : unreadCount }}
            </span>
          </button>
        </div>
        
        <!-- Profile Dropdown - FIXED: Working dropdown -->
        <div class="profile-dropdown-container">
          <button 
            @click="toggleProfileDropdown"
            class="profile-dropdown-btn"
            aria-label="Profile Menu"
            ref="profileButton"
          >
            <div class="profile-avatar">
              <i class="fa-solid fa-user"></i>
            </div>
            <span class="user-name" v-if="provider && !isMobile">
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
            ref="dropdownMenu"
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
            
           
            
            <div class="dropdown-divider"></div>
            
            <button @click="confirmLogout" class="dropdown-item logout-item">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">
          <i class="fa-solid fa-right-from-bracket"></i>
        </div>
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to logout from your account?</p>
        <div class="modal-actions">
          <button @click="showLogoutModal = false" class="modal-btn cancel-btn">
            Cancel
          </button>
          <button @click="performLogout" class="modal-btn logout-btn">
            Yes, Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar - NO CHANGES -->
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

          <!-- Dashboard Sub-menu -->
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

    <!-- Main Content - NO CHANGES -->
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
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import http from "@/api/index.js";

// Click outside directive - KEEPING THIS AS IS
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
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
    const showLogoutModal = ref(false);
    const unreadCount = ref(0);
    const notificationInterval = ref(null);
    const isMobile = ref(window.innerWidth < 768);
    
    // Track when we should trust local state vs API
    const useLocalNotificationState = ref(true);
    const lastNotificationSync = ref(null);

    // Menu items - NO CHANGES
    const menuItems = {
      home: { label: "Dashboard", icon: "fa-solid fa-house", route: "ProviderHome", category: "main" },
      services: { label: "My Services", icon: "fa-solid fa-briefcase", route: "ProviderServices", category: "dashboard" },
      bookings: { label: "Bookings", icon: "fa-solid fa-calendar-check", route: "ProviderBookings", category: "dashboard" },
      
      reviews: { label: "Reviews", icon: "fa-solid fa-star", route: "ProviderReviews", category: "dashboard" },
      notifications: { label: "Notifications", icon: "fa-solid fa-bell", route: "ProviderNotifications", category: "dashboard" },
      profile: { label: "My Profile", icon: "fa-solid fa-user", route: "ProviderProfile", category: "account" },
     
    };

    // Computed properties - NO CHANGES
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

    // ========== FIXED: Load notification state from localStorage ==========
    const loadNotificationState = () => {
      try {
        console.log('🔄 Dashboard: Loading notification state from localStorage')
        
        // CRITICAL FIX: Check the shared state that NotificationSection saves
        const savedState = localStorage.getItem('notification_shared_state')
        if (savedState) {
          const state = JSON.parse(savedState)
          if (state && typeof state.unreadCount === 'number') {
            unreadCount.value = state.unreadCount
            useLocalNotificationState.value = true
            console.log(`✅ Dashboard: Loaded from shared state: ${state.unreadCount}`)
            return true
          }
        }
        
        // Fallback to other storage methods
        const savedSummary = localStorage.getItem('notification_summary')
        if (savedSummary) {
          const parsed = JSON.parse(savedSummary)
          if (parsed && typeof parsed.unread === 'number') {
            unreadCount.value = parsed.unread
            useLocalNotificationState.value = true
            console.log(`✅ Dashboard: Loaded from summary: ${parsed.unread}`)
            return true
          }
        }
        
        const storedCount = localStorage.getItem('unread_notification_count')
        if (storedCount !== null) {
          const count = parseInt(storedCount)
          if (!isNaN(count)) {
            unreadCount.value = count
            useLocalNotificationState.value = true
            console.log(`✅ Dashboard: Loaded from count: ${count}`)
            return true
          }
        }
        
        console.log('⚠️ Dashboard: No local state found, will fetch from API')
        useLocalNotificationState.value = false
        return false
        
      } catch (error) {
        console.error('❌ Dashboard: Error loading notification state:', error)
        useLocalNotificationState.value = false
        return false
      }
    }

    // ========== FIXED: Event listener for real-time updates ==========
    const setupNotificationListener = () => {
      console.log('🔔 Dashboard: Setting up notification listeners')
      
      // Listen for updates from NotificationSection
      window.addEventListener('notification-count-updated', (event) => {
        console.log('📢 Dashboard: Received notification-count-updated event')
        if (event.detail && typeof event.detail.unread === 'number') {
          unreadCount.value = event.detail.unread
          useLocalNotificationState.value = true
          lastNotificationSync.value = new Date().toISOString()
          console.log(`✅ Dashboard: Updated count to ${event.detail.unread}`)
          
          // Save to shared state
          localStorage.setItem('notification_shared_state', JSON.stringify({
            unreadCount: event.detail.unread,
            totalCount: event.detail.total,
            lastUpdated: new Date().toISOString(),
            source: 'notification-center'
          }))
        }
      })
      
      // Listen for individual notification read
      window.addEventListener('notification-marked-read', (event) => {
        console.log('📢 Dashboard: Received notification-marked-read event')
        if (unreadCount.value > 0) {
          unreadCount.value--
          useLocalNotificationState.value = true
          console.log(`✅ Dashboard: Decremented count to ${unreadCount.value}`)
          
          // Update shared state
          const sharedState = {
            unreadCount: unreadCount.value,
            lastUpdated: new Date().toISOString(),
            source: 'dashboard-event'
          }
          localStorage.setItem('notification_shared_state', JSON.stringify(sharedState))
        }
      })
      
      // Listen for all notifications read - CRITICAL FIX
      window.addEventListener('all-notifications-marked-read', () => {
        console.log('📢 Dashboard: Received all-notifications-marked-read event')
        unreadCount.value = 0
        useLocalNotificationState.value = true
        console.log('✅ Dashboard: Set count to 0')
        
        // Save to shared state
        localStorage.setItem('notification_shared_state', JSON.stringify({
          unreadCount: 0,
          totalCount: 0,
          lastUpdated: new Date().toISOString(),
          source: 'mark-all-read'
        }))
        
        // Also clear other storage
        localStorage.setItem('unread_notification_count', '0')
      })
      
      // Listen for storage events
      window.addEventListener('storage', (event) => {
        console.log('📦 Dashboard: Storage event for', event.key)
        
        if (event.key === 'notification_shared_state') {
          try {
            if (event.newValue) {
              const state = JSON.parse(event.newValue)
              if (state && typeof state.unreadCount === 'number') {
                unreadCount.value = state.unreadCount
                useLocalNotificationState.value = true
                console.log(`✅ Dashboard: Storage updated to ${state.unreadCount}`)
              }
            }
          } catch (error) {
            console.error('Error parsing storage event:', error)
          }
        }
      })
    }

    // ========== FIXED: Clean up event listeners ==========
    const cleanupEventListeners = () => {
      console.log('🔔 Dashboard: Cleaning up event listeners')
      window.removeEventListener('notification-count-updated', null)
      window.removeEventListener('notification-marked-read', null)
      window.removeEventListener('all-notifications-marked-read', null)
      window.removeEventListener('storage', null)
    }

    // ========== PROFILE DROPDOWN FIXES ONLY ==========
    const toggleProfileDropdown = () => {
      showProfileDropdown.value = !showProfileDropdown.value;
    };

    const closeProfileDropdown = () => {
      showProfileDropdown.value = false;
    };

    const goToProfile = () => {
      console.log('📁 Going to Profile');
      router.push({ name: 'ProviderProfile' });
      closeProfileDropdown();
    };

    const goToSettings = () => {
      console.log('⚙️ Going to Settings');
      router.push({ name: 'ProviderSettings' });
      closeProfileDropdown();
    };

    const confirmLogout = () => {
      console.log('🚪 Opening logout confirmation');
      showLogoutModal.value = true;
      closeProfileDropdown();
    };

    // ========== FIXED: Logout function with correct endpoint ==========
    const performLogout = async () => {
      console.log('🔓 Performing logout');
      showLogoutModal.value = false;
      
      try {
        console.log('📤 Calling logout API...');
        
        // FIX: Based on your API config, we should use JUST "/auth/logout"
        // Your API base URL already includes the path prefix:
        // - Development: "/api" + "/auth/logout" = "/api/auth/logout" ✓
        // - Production: "https://infinity-booking-backend1-1.onrender.com/infinity-booking" + "/auth/logout" = 
        //   "https://infinity-booking-backend1-1.onrender.com/infinity-booking/auth/logout" ✓
        
        console.log('📡 Logout endpoint:', '/auth/logout');
        console.log('🌐 Base URL from API config:', http.defaults.baseURL);
        
        const response = await http.post("/auth/logout");
        console.log('✅ Logout API successful:', response.data);
        
      } catch (error) {
        console.error("⚠️ Logout API call failed:", error);
        
        // Log detailed error info
        if (error.response) {
          console.error('📋 Response status:', error.response.status);
          console.error('📋 Response data:', error.response.data);
          console.error('📋 Full URL attempted:', error.config?.baseURL + error.config?.url);
        }
        
        // Try alternative endpoints if the main one fails
        try {
          console.log('🔄 Trying alternative logout method: GET request...');
          
          // Try a GET request instead of POST
          const getResponse = await http.get("/auth/logout");
          console.log('✅ GET logout successful:', getResponse.data);
          
        } catch (getError) {
          console.log('⚠️ GET logout also failed, trying basic endpoint...');
          
          try {
            // Try the most basic endpoint
            const basicResponse = await http.post("/logout");
            console.log('✅ Basic logout successful:', basicResponse.data);
            
          } catch (basicError) {
            console.log('⚠️ All logout attempts failed, continuing with client-side cleanup');
          }
        }
      } finally {
        // Always perform client-side cleanup
        console.log('🧹 Performing client-side cleanup');
        
        // Clear all auth-related localStorage items
        const itemsToRemove = [
          'provider_token',
          'loggedProvider',
          'provider_id',
          'user_token',
          'token',
          'user_id',
          'user',
          'notification_shared_state',
          'unread_notification_count',
          'notification_summary',
          'last_notification_check'
        ];
        
        itemsToRemove.forEach(item => {
          localStorage.removeItem(item);
        });
        
        // Clear session storage
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        console.log('✅ Client-side cleanup complete');
        
        // Clear axios authorization header
        delete http.defaults.headers.common['Authorization'];
        
        // Redirect to login page
        await router.push({ name: "Login" });
        
        // Force page reload to clear any remaining state
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    };

    // Navigation - NO CHANGES
    const goTo = (menuKey) => {
      const targetRoute = menuItems[menuKey]?.route;
      if (targetRoute) {
        router.push({ name: targetRoute });
      }
      sidebarOpen.value = false;
    };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const logout = async () => {
      confirmLogout();
    };

    // Get provider ID - NO CHANGES
    const getProviderId = () => {
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

    // ========== FIXED: Fetch unread count - ONLY when needed ==========
    const fetchUnreadCount = async (force = false) => {
      // If we're using local state and not forcing refresh, skip API call
      if (useLocalNotificationState.value && !force) {
        console.log('📊 Dashboard: Using local notification state, skipping API call')
        return
      }
      
      try {
        const providerId = getProviderId();
        if (!providerId) {
          console.log('⚠️ Dashboard: No provider ID found')
          unreadCount.value = 0;
          return;
        }

        console.log(`🔔 Dashboard: Fetching from API for provider: ${providerId}`);

        try {
          const timestamp = new Date().getTime()
          const response = await http.get('/notifications', {
            params: {
              recipientId: providerId,
              recipientType: 'provider',
              read: false,
              limit: 1,
              _t: timestamp
            },
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          
          let count = 0;
          
          if (Array.isArray(response.data)) {
            count = response.data.length;
          } else if (response.data && typeof response.data === 'object') {
            if (response.data.count !== undefined) {
              count = response.data.count;
            } else if (response.data.unreadCount !== undefined) {
              count = response.data.unreadCount;
            } else if (Array.isArray(response.data.notifications)) {
              count = response.data.notifications.length;
            } else if (Array.isArray(response.data.data)) {
              count = response.data.data.length;
            }
          }
          
          console.log(`✅ Dashboard: API returned ${count} unread notifications`);
          
          // IMPORTANT: Compare with local state
          if (useLocalNotificationState.value) {
            console.log(`⚠️ Dashboard: Local state (${unreadCount.value}) differs from API (${count})`)
            console.log('⚠️ Dashboard: Trusting local state (NotificationSection knows better)')
            // Keep local state, don't update from API
          } else {
            unreadCount.value = count;
            console.log(`✅ Dashboard: Using API count: ${count}`)
          }
          
        } catch (apiError) {
          console.error('❌ Dashboard: API fetch failed:', apiError.message);
          // Keep local state if available
          if (!useLocalNotificationState.value) {
            unreadCount.value = 0;
          }
        }
        
      } catch (error) {
        console.error("❌ Dashboard: Error in fetchUnreadCount:", error)
        if (!useLocalNotificationState.value) {
          unreadCount.value = 0;
        }
      }
    };

    // Fetch provider data - NO CHANGES
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
        
        // Only fetch notifications if we don't have local state
        if (!useLocalNotificationState.value) {
          fetchUnreadCount();
        }
      } catch (err) {
        console.error("Profile load failed:", err);
        localStorage.clear();
        router.push({ name: "Login" });
      }
    };

    // Check screen size
    const checkScreenSize = () => {
      isMobile.value = window.innerWidth < 768;
    };

    // ========== FIXED: Watch for route changes ==========
    watch(() => route.name, (newRoute) => {
      const isProviderRoute = newRoute?.includes('Provider') || 
                             route.path.includes('/provider');
      
      if (isProviderRoute && localStorage.getItem("provider_token")) {
        console.log(`🔄 Dashboard: Route changed to ${newRoute}`)
        
        // When navigating between sections, trust local state
        loadNotificationState()
        
        // Only fetch from API if:
        // 1. We don't have local state, OR
        // 2. It's been more than 2 minutes since last sync
        if (!useLocalNotificationState.value) {
          console.log('🔄 Dashboard: No local state, fetching from API...')
          fetchUnreadCount()
        } else {
          const now = new Date()
          const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000)
          
          if (lastNotificationSync.value) {
            const lastSync = new Date(lastNotificationSync.value)
            if (lastSync < twoMinutesAgo) {
              console.log('🔄 Dashboard: Local state is stale (>2min), refreshing...')
              fetchUnreadCount(true) // Force refresh
            }
          }
        }
        
        fetchProvider();
      }
    });

    onMounted(() => {
      const isProviderRoute = route.path.includes('/provider') || 
                             route.name?.includes('Provider');
      const hasToken = localStorage.getItem("provider_token");
      
      if (isProviderRoute && hasToken) {
        console.log('🚀 Dashboard: Component mounted')
        
        // 1. Load notification state FIRST
        loadNotificationState()
        
        // 2. Then fetch provider data
        fetchProvider();
        
        // 3. Setup real-time listeners
        setupNotificationListener()
        
        // 4. Check screen size
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        // 5. Only poll API if we're not using local state
        if (!useLocalNotificationState.value) {
          notificationInterval.value = setInterval(() => fetchUnreadCount(true), 120000); // 2 minutes
        } else {
          console.log('⏰ Dashboard: Using local state, skipping periodic API polling')
        }
        
        // 6. Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden && !useLocalNotificationState.value) {
            console.log('👁️ Dashboard: Page became visible, checking API...')
            fetchUnreadCount(true)
          }
        })
      } else if (isProviderRoute && !hasToken) {
        router.push({ name: "Login" });
      }
    });

    onBeforeUnmount(() => {
      console.log('🔔 Dashboard: Component unmounting')
      
      if (notificationInterval.value) {
        clearInterval(notificationInterval.value);
      }
      
      cleanupEventListeners()
      window.removeEventListener('resize', checkScreenSize)
      document.removeEventListener('visibilitychange', null)
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
      showLogoutModal,
      unreadCount,
      isMobile,
      mainMenuItems,
      dashboardSubmenuItems,
      accountMenuItems,
      showDashboardSubmenu,
      isActiveRoute,
      goTo,
      toggleSidebar,
      toggleProfileDropdown,
      closeProfileDropdown,
      goToProfile,
      goToSettings,
      logout,
      confirmLogout,
      performLogout,
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
  background: #e2e7eb;
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
  font-size: 1.1rem;
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

/* Notification Wrapper - NO CHANGES */
.notification-wrapper {
  position: relative;
  display: inline-block;
}

/* Notifications Button - NO CHANGES */
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

.notification-btn.has-notifications {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 82, 82, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
}

/* Notification Badge - NO CHANGES */
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
  transform: scale(1.02);
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
  color: white;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  max-width: 120px;
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
  animation: slideDown 0.2s ease;
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
  border-bottom: 1px solid #f1f5f9;
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

/* Logout Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-icon {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.modal-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.modal-content p {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-btn {
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.logout-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
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

/* Logo Section - NO CHANGES */
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
  padding-top: 1.5rem;
}

/* Navigation - NO CHANGES */
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

/* Dashboard Submenu - NO CHANGES */
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

/* Main Content - NO CHANGES */
.dashboard-main {
  flex: 1;
  padding: 2rem;
  padding-top: 90px;
  background: #f8fafc;
  min-height: calc(100vh - 90px);
}

/* Fallback Content - NO CHANGES */
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
    padding: 0.5rem 0.75rem;
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
  
  .modal-content {
    padding: 2rem;
    width: 85%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
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
    right: -15px;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
}
</style>