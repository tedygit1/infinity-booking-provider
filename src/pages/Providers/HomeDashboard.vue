<!-- src/pages/Providers/HomeDashboard.vue -->
<template>
  <div class="home-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="welcome-section">
          <h1 class="title">Welcome back, {{ provider?.fullname || 'Provider' }}! 👋</h1>
          <p class="subtitle">Your business overview at a glance</p>
          <div class="date-display">
            <i class="fa-solid fa-calendar"></i>
            {{ currentDate }}
          </div>
        </div>
        <div class="header-actions">
          <!-- Notification Bell -->
          <div class="notification-container">
            <button class="notification-btn" @click="toggleNotifications" 
                    @blur="onNotificationBlur"
                    aria-label="Notifications">
              <i class="fa-solid fa-bell"></i>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            </button>
            
            <!-- Notifications Dropdown -->
            <transition name="fade-slide">
              <div v-if="showNotifications" class="notifications-dropdown" 
                   :class="{ 'mobile-dropdown': isMobile }"
                   @click.stop>
                <div class="notifications-header">
                  <h4>Notifications</h4>
                  <div class="notifications-actions">
                    <button v-if="unreadCount > 0" @click="markAllAsRead" class="btn-mark-all">
                      <i class="fa-solid fa-check-double"></i> Mark all read
                    </button>
                    <button @click="refreshNotifications" class="btn-refresh" :disabled="loadingNotifications">
                      <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loadingNotifications }"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Notifications List -->
                <div class="notifications-list" ref="notificationsList" v-if="notifications.length > 0">
                  <div v-for="notification in notifications" 
                       :key="notification._id || notification.id" 
                       class="notification-item"
                       :class="{ 'unread': !notification.read, 'clickable': notification.action || getActionFromType(notification.type) }"
                       @click="handleNotificationClick(notification)">
                    <div class="notification-icon" :class="getNotificationIcon(notification.type)">
                      <i :class="getNotificationIconClass(notification.type)"></i>
                    </div>
                    <div class="notification-content">
                      <div class="notification-title">
                        {{ notification.title || getDefaultTitle(notification.type) }}
                      </div>
                      <div class="notification-message">
                        {{ notification.message || notification.content }}
                      </div>
                      <div class="notification-meta">
                        <span class="notification-time">{{ formatNotificationTime(notification.createdAt) }}</span>
                        <span v-if="notification.type" class="notification-type">{{ notification.type }}</span>
                      </div>
                    </div>
                    <div class="notification-actions">
                      <button v-if="!notification.read" 
                              @click.stop="markAsRead(notification._id || notification.id)"
                              class="btn-action mark-read"
                              aria-label="Mark as read">
                        <i class="fa-solid fa-circle"></i>
                      </button>
                      <button @click.stop="deleteNotification(notification._id || notification.id)"
                              class="btn-action delete"
                              aria-label="Delete notification">
                        <i class="fa-solid fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Empty State -->
                <div v-else class="notifications-empty">
                  <i class="fa-solid fa-bell-slash"></i>
                  <p>No notifications yet</p>
                </div>
                
                <!-- View All Link -->
                <div class="notifications-footer">
                  <button @click="viewAllNotifications" class="btn-view-all">
                    View all notifications <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
                
                <!-- Mobile close button -->
                <button v-if="isMobile" @click="closeNotifications" class="btn-close-mobile">
                  <i class="fa-solid fa-times"></i> Close
                </button>
              </div>
            </transition>
            
            <!-- Mobile overlay -->
            <div v-if="showNotifications && isMobile" class="notifications-overlay" @click="closeNotifications"></div>
          </div>
          
          <!-- Refresh Button -->
          <button class="btn btn-primary" @click="refreshData" :disabled="loading">
            <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
          
          <!-- Debug Reviews Button (temporary) -->
          <button class="btn btn-secondary" @click="diagnoseReviews" 
                  style="background: #f97316; color: white; margin-left: 8px;">
            <i class="fa-solid fa-bug"></i> Debug Reviews
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !hasData" class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <h3>Loading Dashboard</h3>
        <p>Getting your business summary...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="criticalError && !hasData" class="error-container">
      <div class="error-content">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <h3>Unable to Load Data</h3>
        <p>{{ criticalError }}</p>
        <button class="btn btn-primary" @click="loadDashboardData">
          Try Again
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="dashboard-content">
      <!-- Data Source Indicator -->
      <div class="data-source-indicator">
        <div class="source-badge real-data">
          <i class="fa-solid fa-database"></i>
          Live Data
        </div>
        <div class="last-updated">
          <i class="fa-solid fa-clock"></i>
          Updated: {{ lastUpdated }}
        </div>
      </div>

      <!-- Key Metrics Grid - ALL REAL DATA -->
      <div class="metrics-grid compact">
        <!-- Total Bookings -->
        <div class="metric-card primary" @click="navigateTo('/provider/bookings')">
          <div class="metric-icon">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div class="metric-content">
            <h3>{{ totalBookings }}</h3>
            <p class="metric-title">Total Bookings</p>
            <div class="metric-trend" :class="getTrendClass(bookingGrowth)">
              <i :class="getTrendIcon(bookingGrowth)"></i>
              {{ Math.abs(bookingGrowth) }}% {{ bookingGrowth >= 0 ? 'increase' : 'decrease' }}
            </div>
          </div>
        </div>

        <!-- Total Services -->
        <div class="metric-card success" @click="navigateTo('/provider/services')">
          <div class="metric-icon">
            <i class="fa-solid fa-briefcase"></i>
          </div>
          <div class="metric-content">
            <h3>{{ totalServices }}</h3>
            <p class="metric-title">Total Services</p>
            <div class="metric-status">
              <i class="fa-solid fa-check-circle"></i>
              {{ activeServices }} active
            </div>
          </div>
        </div>

        <!-- FIXED REVIEWS CARD -->
        <div class="metric-card purple" @click="navigateTo('/provider/reviews')">
          <div class="metric-icon">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="metric-content">
            <h3>{{ totalReviews }}</h3>
            <p class="metric-title">Reviews</p>
            <div class="metric-rating">
              <div class="stars">
                <i v-for="n in 5" :key="n" 
                   :class="getStarClass(n, avgRating)"
                   class="fa-star"></i>
              </div>
              <span class="rating-text">{{ avgRating.toFixed(1) }}/5</span>
            </div>
            <!-- Debug info (temporary) -->
            <div v-if="totalReviews === 0 && reviewDebugInfo" class="metric-detail debug-info">
              <small style="color: #ef4444; font-size: 0.7rem;">
                <i class="fa-solid fa-triangle-exclamation"></i>
                {{ reviewDebugInfo }}
              </small>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="metric-card revenue" @click="navigateTo('/provider/revenue')">
          <div class="metric-icon">
            <i class="fa-solid fa-money-bill-wave"></i>
          </div>
          <div class="metric-content">
            <h3>${{ formatCurrency(totalRevenue) }}</h3>
            <p class="metric-title">Total Revenue</p>
            <div class="metric-trend" :class="getTrendClass(revenueGrowth)">
              <i :class="getTrendIcon(revenueGrowth)"></i>
              {{ Math.abs(revenueGrowth) }}% {{ revenueGrowth >= 0 ? 'increase' : 'decrease' }}
            </div>
          </div>
        </div>

        <!-- Today's Bookings -->
        <div class="metric-card warning" @click="navigateTo('/provider/bookings?filter=today')">
          <div class="metric-icon">
            <i class="fa-solid fa-calendar-day"></i>
          </div>
          <div class="metric-content">
            <h3>{{ todayBookings }}</h3>
            <p class="metric-title">Today's Bookings</p>
            <div class="metric-status">
              <i class="fa-solid fa-clock"></i>
              {{ upcomingBookings }} upcoming
            </div>
          </div>
        </div>

        <!-- REPEAT CUSTOMER RATE -->
        <div class="metric-card info" @click="navigateTo('/provider/customers')">
          <div class="metric-icon">
            <i class="fa-solid fa-users"></i>
          </div>
          <div class="metric-content">
            <h3>{{ repeatRate }}%</h3>
            <p class="metric-title">Repeat Customers</p>
            <div class="metric-status">
              <i class="fa-solid fa-user-check"></i>
              {{ repeatCustomers }} loyal customers
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats Grid - REAL DATA ONLY -->
      <div class="quick-stats-grid">
        <!-- Customer Overview - From Bookings Data -->
        <div class="stats-card">
          <div class="stats-header">
            <h3><i class="fa-solid fa-users"></i> Customer Overview</h3>
            <p class="stats-subtitle">Based on booking data</p>
          </div>
          <div class="stats-content">
            <div class="stat-row compact">
              <div class="stat-item">
                <div class="stat-value">{{ totalCustomers }}</div>
                <div class="stat-label">Total Customers</div>
                <div class="stat-note">Unique customers who booked</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ repeatCustomers }}</div>
                <div class="stat-label">Repeat Customers</div>
                <div class="stat-note">Booked more than once</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ newCustomers }}</div>
                <div class="stat-label">New (30 days)</div>
                <div class="stat-note">First-time in last 30 days</div>
              </div>
            </div>
            <div class="customer-chart" v-if="totalCustomers > 0">
              <div class="chart-bar repeat" :style="{ width: repeatRate + '%' }">
                <span>{{ repeatRate }}% Repeat</span>
              </div>
              <div class="chart-bar new" :style="{ width: (100 - repeatRate) + '%' }">
                <span>{{ 100 - repeatRate }}% New</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Performance - REAL DATA -->
        <div class="stats-card">
          <div class="stats-header">
            <h3><i class="fa-solid fa-chart-pie"></i> Booking Performance</h3>
            <p class="stats-subtitle">Real-time booking analytics</p>
          </div>
          <div class="stats-content">
            <div class="performance-metrics">
              <div class="performance-summary">
                <div class="performance-item">
                  <div class="performance-label">Completion Rate</div>
                  <div class="performance-value">{{ completionRate }}%</div>
                  <div class="performance-bar">
                    <div class="performance-fill" :style="{ width: completionRate + '%' }"></div>
                  </div>
                  <div class="performance-detail">{{ completedBookings }} completed</div>
                </div>
                
                <div class="performance-stats">
                  <div class="stat-mini">
                    <div class="stat-value">{{ avgResponseTime }}</div>
                    <div class="stat-label">Avg. Response</div>
                  </div>
                  <div class="stat-mini">
                    <div class="stat-value">${{ formatCurrency(avgBookingValue) }}</div>
                    <div class="stat-label">Avg. Booking</div>
                  </div>
                </div>
              </div>
              
              <div class="status-breakdown">
                <div class="status-item" v-for="status in bookingStatuses" :key="status.type">
                  <span class="status-dot" :class="status.class"></span>
                  <span class="status-label">{{ status.label }}</span>
                  <span class="status-count">{{ status.count }}</span>
                  <span class="status-percentage">{{ status.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming Soon Features -->
      <div class="coming-soon-section" v-if="upcomingFeatures.length > 0">
        <h3><i class="fa-solid fa-rocket"></i> Coming Soon</h3>
        <div class="features-grid compact">
          <div class="feature-card" v-for="feature in upcomingFeatures" :key="feature.id">
            <div class="feature-icon" :class="feature.iconClass">
              <i :class="feature.icon"></i>
            </div>
            <div class="feature-content">
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.description }}</p>
              <span class="feature-status" :class="feature.statusClass">{{ feature.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import http from "@/api/index.js";

export default {
  name: 'HomeDashboard',
  props: {
    provider: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    const router = useRouter();
    const route = useRoute();
    
    // Reactive data - ALL REAL DATA
    const loading = ref(false);
    const criticalError = ref("");
    const hasData = ref(false);
    const reviewDebugInfo = ref("");
    
    // Real data from API
    const bookings = ref([]);
    const services = ref([]);
    const serviceReviews = ref([]);
    const providerReviews = ref([]);
    
    // Dashboard metrics - calculated from real data
    const dashboardMetrics = ref({
      totalBookings: 0,
      bookingGrowth: 0,
      totalServices: 0,
      activeServices: 0,
      totalReviews: 0,
      avgRating: 0,
      totalRevenue: 0,
      revenueGrowth: 0,
      todayBookings: 0,
      upcomingBookings: 0,
      completedBookings: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      totalCustomers: 0,
      repeatCustomers: 0,
      newCustomers: 0,
      completionRate: 0,
      avgResponseTime: '0h',
      avgBookingValue: 0
    });
    
    // Notification state
    const showNotifications = ref(false);
    const notifications = ref([]);
    const loadingNotifications = ref(false);
    const notificationError = ref("");
    const isMobile = ref(window.innerWidth <= 768);
    
    // ========== CHECK ALL POSSIBLE ENDPOINTS ==========
    const API_ENDPOINTS = {
      // Try different booking endpoints
      bookingsByProvider1: (pid) => `/bookings/provider/${pid}`,
      bookingsByProvider2: (pid) => `/bookings?providerId=${pid}`,
      bookingsByProvider3: (pid) => `/provider/${pid}/bookings`,
      bookingsByProvider4: (pid) => `/bookings?provider=${pid}`,
      bookingsByProvider5: (pid) => `/api/bookings?providerId=${pid}`,
      
      // Try different review endpoints
      providerReviews1: (pid) => `/reviews/provider/${pid}`,
      providerReviews2: (pid) => `/reviews?providerId=${pid}`,
      providerReviews3: (pid) => `/provider/${pid}/reviews`,
      
      // Services endpoint (this works)
      services: (pid) => `/services?providerId=${pid}`,
      
      // Service reviews
      serviceReviews: (serviceId) => `/reviews/service/${serviceId}`,
      serviceReviews2: (serviceId) => `/reviews?serviceId=${serviceId}`,
    };
    
    // ========== LOAD REAL DATA FUNCTIONS ==========
    
    const loadDashboardData = async () => {
      if (!shouldLoadData()) {
        loading.value = false;
        return;
      }

      const providerPid = getProviderPid();
      if (!providerPid) {
        loading.value = false;
        return;
      }

      loading.value = true;
      criticalError.value = "";
      hasData.value = false;
      reviewDebugInfo.value = "";
      
      // Reset data
      bookings.value = [];
      services.value = [];
      serviceReviews.value = [];
      providerReviews.value = [];
      
      // Reset metrics
      Object.keys(dashboardMetrics.value).forEach(key => {
        dashboardMetrics.value[key] = 0;
      });
      dashboardMetrics.value.avgResponseTime = '0h';

      try {
        console.log("🚀 Loading REAL dashboard data for provider:", providerPid);
        console.log("Base URL:", http.defaults.baseURL);
        
        // Load services first (this works)
        await loadServicesData(providerPid);
        
        // Load bookings from API
        await loadBookingsData(providerPid);
        
        // Load reviews
        await loadReviewsData(providerPid);
        
        // Calculate all metrics from whatever real data we got
        calculateAllMetrics();
        
        hasData.value = true;
        
        console.log("=== REAL DATA LOAD COMPLETE ===");
        console.log("Services:", services.value.length);
        console.log("Bookings:", bookings.value.length);
        console.log("Service Reviews:", serviceReviews.value.length);
        console.log("Provider Reviews:", providerReviews.value.length);
        console.log("===============================");
        
      } catch (error) {
        console.error("❌ Dashboard load error:", error);
        // Even if some endpoints fail, we can still show what we have
        calculateAllMetrics();
        hasData.value = true;
      } finally {
        loading.value = false;
      }
    };
    
    const loadBookingsData = async (providerPid) => {
      console.log("📤 Loading bookings for provider:", providerPid);
      
      // Try multiple endpoints in order
      const endpoints = [
        { name: 'bookingsByProvider2', url: `/bookings?providerId=${providerPid}` },
        { name: 'bookingsByProvider1', url: `/bookings/provider/${providerPid}` },
        { name: 'bookingsByProvider4', url: `/bookings?provider=${providerPid}` },
        { name: 'bookingsByProvider3', url: `/provider/${providerPid}/bookings` },
        { name: 'bookingsByProvider5', url: `/api/bookings?providerId=${providerPid}` },
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint.url}`);
          const response = await http.get(endpoint.url);
          
          if (response.data) {
            let loadedBookings = [];
            
            // Handle different response formats
            if (Array.isArray(response.data)) {
              loadedBookings = response.data;
            } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
              loadedBookings = response.data.bookings;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              loadedBookings = response.data.data;
            } else if (response.data.results && Array.isArray(response.data.results)) {
              loadedBookings = response.data.results;
            }
            
            if (loadedBookings.length > 0) {
              bookings.value = loadedBookings;
              console.log(`✅ Success! Loaded ${bookings.value.length} REAL bookings from ${endpoint.name}`);
              return; // Stop trying once we get data
            } else {
              console.log(`ℹ️ Endpoint ${endpoint.name} returned empty array`);
              bookings.value = []; // Explicitly set to empty array
            }
          }
        } catch (error) {
          console.log(`⚠️ Endpoint ${endpoint.name} failed:`, error.message);
          // Continue to next endpoint
        }
      }
      
      // If all endpoints fail or return empty, set bookings to empty array
      console.log("ℹ️ All booking endpoints returned empty or failed. Setting bookings to 0.");
      bookings.value = [];
    };
    
    const loadServicesData = async (providerPid) => {
      try {
        console.log("📤 Loading services from:", API_ENDPOINTS.services(providerPid));
        
        const servicesResponse = await http.get(API_ENDPOINTS.services(providerPid));
        if (servicesResponse.data) {
          services.value = Array.isArray(servicesResponse.data) ? servicesResponse.data : [];
          console.log(`✅ Loaded ${services.value.length} services`);
        }
      } catch (error) {
        console.error("❌ Failed to load services:", error);
        services.value = [];
      }
    };
    
    const loadReviewsData = async (providerPid) => {
      try {
        console.log("📤 Attempting to load reviews for provider:", providerPid);
        
        // First, let's try the most common review endpoints
        const endpoints = [
          `/reviews/provider/${providerPid}`,
          `/reviews?providerId=${providerPid}`,
          `/provider/${providerPid}/reviews`,
          `/reviews`
        ];
        
        for (const url of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${url}`);
            const response = await http.get(url);
            
            if (response.data) {
              let reviews = [];
              
              // Handle different response formats
              if (Array.isArray(response.data)) {
                reviews = response.data;
              } else if (response.data.reviews && Array.isArray(response.data.reviews)) {
                reviews = response.data.reviews;
              } else if (response.data.data && Array.isArray(response.data.data)) {
                reviews = response.data.data;
              }
              
              console.log(`📊 Found ${reviews.length} reviews from ${url}`);
              
              // Filter reviews for this provider if we got all reviews
              if (url === '/reviews' && reviews.length > 0) {
                reviews = reviews.filter(review => {
                  return review.providerId === providerPid || 
                         review.provider?._id === providerPid ||
                         review.provider?.pid === providerPid ||
                         review.provider === providerPid;
                });
                console.log(`📊 Filtered to ${reviews.length} reviews for this provider`);
              }
              
              if (reviews.length > 0) {
                providerReviews.value = reviews;
                console.log("✅ Successfully loaded reviews:", reviews.length);
                
                // Debug: Show first review details
                if (reviews[0]) {
                  console.log("Sample review structure:", {
                    id: reviews[0]._id || reviews[0].id,
                    rating: reviews[0].rating,
                    comment: reviews[0].comment,
                    providerId: reviews[0].providerId,
                    serviceId: reviews[0].serviceId
                  });
                }
                return; // Stop trying once we get data
              }
            }
          } catch (error) {
            console.log(`⚠️ Endpoint ${url} failed:`, error.message);
            // Continue to next endpoint
          }
        }
        
        console.log("ℹ️ No reviews found or no review endpoints available");
        providerReviews.value = [];
        
        // Load service-specific reviews as fallback
        console.log("🔄 Attempting to load service reviews as fallback");
        if (services.value.length > 0) {
          serviceReviews.value = [];
          const serviceReviewsPromises = [];
          
          // Limit to first 5 services to avoid too many requests
          const servicesToCheck = services.value.slice(0, 5);
          
          for (const service of servicesToCheck) {
            if (service._id) {
              try {
                const promise = http.get(`/reviews/service/${service._id}`).then(response => {
                  if (response.data && Array.isArray(response.data)) {
                    return response.data;
                  }
                  return [];
                }).catch(() => []);
                
                serviceReviewsPromises.push(promise);
              } catch (error) {
                console.log(`⚠️ Could not load reviews for service ${service._id}`);
              }
            }
          }
          
          try {
            const serviceReviewsArrays = await Promise.all(serviceReviewsPromises);
            serviceReviews.value = serviceReviewsArrays.flat();
            console.log(`📊 Loaded ${serviceReviews.value.length} service reviews`);
            
            if (serviceReviews.value.length > 0 && providerReviews.value.length === 0) {
              reviewDebugInfo.value = `Found ${serviceReviews.value.length} service reviews`;
            }
          } catch (error) {
            console.log("⚠️ Failed to load service reviews:", error);
          }
        }
        
        console.log("📊 Total reviews summary:", {
          providerReviews: providerReviews.value.length,
          serviceReviews: serviceReviews.value.length,
          combined: providerReviews.value.length + serviceReviews.value.length
        });
        
      } catch (error) {
        console.error("❌ Critical error loading reviews:", error);
        providerReviews.value = [];
        serviceReviews.value = [];
        reviewDebugInfo.value = "Error loading reviews: " + error.message;
      }
    };
    
    // ========== CALCULATE METRICS FROM REAL DATA ==========
    
    const calculateAllMetrics = () => {
      console.log("📊 Calculating metrics from real data...");
      console.log("Available data - Bookings:", bookings.value.length, "Services:", services.value.length);
      
      // 1. Service Metrics
      calculateServiceMetrics();
      
      // 2. Booking Metrics (only if we have real booking data)
      if (bookings.value.length > 0) {
        calculateBookingMetrics();
      } else {
        console.log("⚠️ No booking data available - setting booking metrics to 0");
        // Explicitly set all booking metrics to 0 when no bookings
        dashboardMetrics.value.totalBookings = 0;
        dashboardMetrics.value.completedBookings = 0;
        dashboardMetrics.value.confirmedBookings = 0;
        dashboardMetrics.value.pendingBookings = 0;
        dashboardMetrics.value.cancelledBookings = 0;
        dashboardMetrics.value.todayBookings = 0;
        dashboardMetrics.value.upcomingBookings = 0;
        dashboardMetrics.value.totalRevenue = 0;
        dashboardMetrics.value.completionRate = 0;
        dashboardMetrics.value.avgBookingValue = 0;
        dashboardMetrics.value.totalCustomers = 0;
        dashboardMetrics.value.repeatCustomers = 0;
        dashboardMetrics.value.newCustomers = 0;
      }
      
      // 3. Review Metrics
      calculateReviewMetrics();
      
      // 4. Revenue Metrics (already calculated in booking metrics)
      calculateRevenueMetrics();
      
      // 5. Performance Metrics
      calculatePerformanceMetrics();
    };
    
    const calculateBookingMetrics = () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      let totalBookings = 0;
      let completedBookings = 0;
      let confirmedBookings = 0;
      let pendingBookings = 0;
      let cancelledBookings = 0;
      let todayBookings = 0;
      let upcomingBookings = 0;
      let totalRevenue = 0;
      
      console.log(`📈 Calculating metrics from ${bookings.value.length} real bookings`);
      
      bookings.value.forEach(booking => {
        totalBookings++;
        
        // Try to get status from various field names
        let status = '';
        if (booking.status) status = booking.status.toLowerCase();
        else if (booking.bookingStatus) status = booking.bookingStatus.toLowerCase();
        else if (booking.state) status = booking.state.toLowerCase();
        
        // Try to get booking date
        let bookingDate = null;
        const dateFields = ['bookingDate', 'date', 'createdAt', 'startDate', 'appointmentDate', 'startTime'];
        for (const field of dateFields) {
          if (booking[field]) {
            try {
              bookingDate = new Date(booking[field]);
              if (!isNaN(bookingDate.getTime())) break;
            } catch (e) {
              // Continue to next field
            }
          }
        }
        
        // Try to get amount
        let amount = 0;
        const amountFields = ['amount', 'price', 'total', 'cost', 'totalPrice', 'totalAmount'];
        for (const field of amountFields) {
          if (booking[field] !== undefined && booking[field] !== null) {
            amount = parseFloat(booking[field]) || 0;
            break;
          }
        }
        
        // Count by status
        if (status.includes('complete') || status.includes('done') || status.includes('finished')) {
          completedBookings++;
          totalRevenue += amount;
        } else if (status.includes('confirm') || status.includes('accept') || status.includes('approve')) {
          confirmedBookings++;
        } else if (status.includes('pending') || status.includes('request') || status.includes('waiting')) {
          pendingBookings++;
        } else if (status.includes('cancel') || status.includes('reject') || status.includes('decline')) {
          cancelledBookings++;
        }
        
        // Today's bookings
        if (bookingDate && bookingDate >= todayStart) {
          todayBookings++;
        }
        
        // Upcoming bookings (future dates)
        if (bookingDate && bookingDate > now && 
            (status.includes('confirm') || status.includes('pending') || status.includes('accept'))) {
          upcomingBookings++;
        }
      });
      
      // Set metrics
      dashboardMetrics.value.totalBookings = totalBookings;
      dashboardMetrics.value.completedBookings = completedBookings;
      dashboardMetrics.value.confirmedBookings = confirmedBookings;
      dashboardMetrics.value.pendingBookings = pendingBookings;
      dashboardMetrics.value.cancelledBookings = cancelledBookings;
      dashboardMetrics.value.todayBookings = todayBookings;
      dashboardMetrics.value.upcomingBookings = upcomingBookings;
      dashboardMetrics.value.totalRevenue = totalRevenue;
      
      // Calculate completion rate
      dashboardMetrics.value.completionRate = totalBookings > 0 ? 
        Math.round((completedBookings / totalBookings) * 100) : 0;
      
      // Calculate average booking value
      dashboardMetrics.value.avgBookingValue = completedBookings > 0 ? 
        Math.round(totalRevenue / completedBookings) : 0;
      
      console.log("📊 Booking Metrics:", {
        total: dashboardMetrics.value.totalBookings,
        completed: dashboardMetrics.value.completedBookings,
        confirmed: dashboardMetrics.value.confirmedBookings,
        pending: dashboardMetrics.value.pendingBookings,
        cancelled: dashboardMetrics.value.cancelledBookings,
        today: dashboardMetrics.value.todayBookings,
        upcoming: dashboardMetrics.value.upcomingBookings,
        revenue: dashboardMetrics.value.totalRevenue,
        completionRate: dashboardMetrics.value.completionRate
      });
    };
    
    const calculateServiceMetrics = () => {
      dashboardMetrics.value.totalServices = services.value.length;
      dashboardMetrics.value.activeServices = services.value.filter(
        service => {
          const status = (service.status || '').toLowerCase();
          return status === 'active' || 
                 service.isActive === true ||
                 service.active === true ||
                 service.published === true ||
                 status === 'published';
        }
      ).length;
      
      console.log("🔧 Service Metrics:", {
        total: dashboardMetrics.value.totalServices,
        active: dashboardMetrics.value.activeServices
      });
    };
    
    const calculateReviewMetrics = () => {
      console.log("⭐ Calculating review metrics...");
      
      // Get all reviews (combine provider and service reviews)
      const allReviews = [...providerReviews.value];
      
      // Add service reviews but avoid duplicates
      serviceReviews.value.forEach(serviceReview => {
        const exists = allReviews.some(review => 
          review._id === serviceReview._id || 
          review.id === serviceReview.id
        );
        if (!exists) {
          allReviews.push(serviceReview);
        }
      });
      
      console.log(`📊 Processing ${allReviews.length} unique reviews`);
      
      dashboardMetrics.value.totalReviews = allReviews.length;
      
      // Calculate average rating
      if (allReviews.length > 0) {
        const validReviews = allReviews.filter(review => {
          const rating = parseFloat(review.rating);
          return !isNaN(rating) && rating >= 0 && rating <= 5;
        });
        
        if (validReviews.length > 0) {
          const totalRating = validReviews.reduce((sum, review) => {
            const rating = parseFloat(review.rating) || 0;
            return sum + rating;
          }, 0);
          
          dashboardMetrics.value.avgRating = totalRating / validReviews.length;
          console.log(`📊 Average rating calculated: ${dashboardMetrics.value.avgRating} from ${validReviews.length} valid reviews`);
          
          if (validReviews.length < allReviews.length) {
            reviewDebugInfo.value = `${validReviews.length} valid ratings found (some had invalid ratings)`;
          }
        } else {
          dashboardMetrics.value.avgRating = 0;
          console.log("⚠️ No valid ratings found");
          reviewDebugInfo.value = "No valid ratings found in reviews";
        }
      } else {
        dashboardMetrics.value.avgRating = 0;
        console.log("ℹ️ No reviews to calculate average rating");
        reviewDebugInfo.value = "No reviews found for this provider";
      }
      
      console.log("⭐ Final Review Metrics:", {
        total: dashboardMetrics.value.totalReviews,
        avgRating: dashboardMetrics.value.avgRating
      });
    };
    
    const calculateCustomerMetrics = () => {
      const customerMap = new Map();
      const repeatCustomers = new Set();
      const newCustomers = new Set();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      bookings.value.forEach(booking => {
        // Try to get customer ID from various field names
        let customerId = null;
        const idFields = ['customerId', 'customer._id', 'userId', 'user._id', 'clientId', 'client._id'];
        
        for (const field of idFields) {
          if (field.includes('.')) {
            const parts = field.split('.');
            let value = booking;
            for (const part of parts) {
              if (value && value[part]) {
                value = value[part];
              } else {
                value = null;
                break;
              }
            }
            if (value) {
              customerId = value;
              break;
            }
          } else if (booking[field]) {
            customerId = booking[field];
            break;
          }
        }
        
        if (customerId) {
          if (customerMap.has(customerId)) {
            customerMap.set(customerId, customerMap.get(customerId) + 1);
            repeatCustomers.add(customerId);
          } else {
            customerMap.set(customerId, 1);
          }
          
          // Check if new customer (first booking in last 30 days)
          let bookingDate = null;
          const dateFields = ['createdAt', 'bookingDate', 'date'];
          for (const field of dateFields) {
            if (booking[field]) {
              bookingDate = new Date(booking[field]);
              break;
            }
          }
          
          if (bookingDate && bookingDate >= thirtyDaysAgo) {
            newCustomers.add(customerId);
          }
        }
      });
      
      dashboardMetrics.value.totalCustomers = customerMap.size;
      dashboardMetrics.value.repeatCustomers = repeatCustomers.size;
      dashboardMetrics.value.newCustomers = newCustomers.size;
      
      console.log("👥 Customer Metrics:", {
        total: dashboardMetrics.value.totalCustomers,
        repeat: dashboardMetrics.value.repeatCustomers,
        new: dashboardMetrics.value.newCustomers
      });
    };
    
    const calculateRevenueMetrics = () => {
      console.log("💰 Revenue Metrics:", {
        total: dashboardMetrics.value.totalRevenue,
        avgBooking: dashboardMetrics.value.avgBookingValue
      });
    };
    
    const calculatePerformanceMetrics = () => {
      console.log("📈 Performance Metrics calculated");
    };
    
    // ========== COMPUTED PROPERTIES ==========
    
    const currentDate = computed(() => new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));

    const lastUpdated = computed(() => new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    }));

    const totalBookings = computed(() => dashboardMetrics.value.totalBookings);
    const bookingGrowth = computed(() => dashboardMetrics.value.bookingGrowth);
    const totalServices = computed(() => dashboardMetrics.value.totalServices);
    const activeServices = computed(() => dashboardMetrics.value.activeServices);
    const totalReviews = computed(() => dashboardMetrics.value.totalReviews);
    const avgRating = computed(() => dashboardMetrics.value.avgRating);
    const totalRevenue = computed(() => dashboardMetrics.value.totalRevenue);
    const revenueGrowth = computed(() => dashboardMetrics.value.revenueGrowth);
    const todayBookings = computed(() => dashboardMetrics.value.todayBookings);
    const upcomingBookings = computed(() => dashboardMetrics.value.upcomingBookings);
    const completedBookings = computed(() => dashboardMetrics.value.completedBookings);
    const completionRate = computed(() => dashboardMetrics.value.completionRate);
    const avgResponseTime = computed(() => dashboardMetrics.value.avgResponseTime);
    const avgBookingValue = computed(() => dashboardMetrics.value.avgBookingValue);
    
    const totalCustomers = computed(() => dashboardMetrics.value.totalCustomers);
    const repeatCustomers = computed(() => dashboardMetrics.value.repeatCustomers);
    const newCustomers = computed(() => dashboardMetrics.value.newCustomers);
    
    const repeatRate = computed(() => {
      if (totalCustomers.value === 0) return 0;
      return Math.round((repeatCustomers.value / totalCustomers.value) * 100);
    });
    
    const bookingStatuses = computed(() => {
      const total = totalBookings.value;
      return [
        { 
          type: 'completed', 
          label: 'Completed', 
          count: dashboardMetrics.value.completedBookings,
          percentage: total > 0 ? 
            Math.round((dashboardMetrics.value.completedBookings / total) * 100) : 0,
          class: 'completed' 
        },
        { 
          type: 'confirmed', 
          label: 'Confirmed', 
          count: dashboardMetrics.value.confirmedBookings,
          percentage: total > 0 ? 
            Math.round((dashboardMetrics.value.confirmedBookings / total) * 100) : 0,
          class: 'confirmed' 
        },
        { 
          type: 'pending', 
          label: 'Pending', 
          count: dashboardMetrics.value.pendingBookings,
          percentage: total > 0 ? 
            Math.round((dashboardMetrics.value.pendingBookings / total) * 100) : 0,
          class: 'pending' 
        },
        { 
          type: 'cancelled', 
          label: 'Cancelled', 
          count: dashboardMetrics.value.cancelledBookings,
          percentage: total > 0 ? 
            Math.round((dashboardMetrics.value.cancelledBookings / total) * 100) : 0,
          class: 'cancelled' 
        }
      ];
    });
    
    const upcomingFeatures = computed(() => [
      {
        id: 1,
        title: 'Payment Analytics',
        description: 'Track payments & revenue trends',
        icon: 'fa-solid fa-credit-card',
        iconClass: 'payment',
        status: 'In Development',
        statusClass: 'development'
      },
      {
        id: 2,
        title: 'Advanced Reports',
        description: 'Detailed performance insights',
        icon: 'fa-solid fa-chart-pie',
        iconClass: 'reports',
        status: 'Planned',
        statusClass: 'planned'
      }
    ]);
    
    // ========== HELPER FUNCTIONS ==========
    
    const getTrendClass = (value) => {
      return value >= 0 ? 'positive' : 'negative';
    };
    
    const getTrendIcon = (value) => {
      return value >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down';
    };
    
    const getStarClass = (index, rating) => {
      const starValue = index - 0.5;
      if (rating >= index) return 'fa-solid fa-star';
      if (rating >= starValue) return 'fa-solid fa-star-half-stroke';
      return 'fa-regular fa-star';
    };
    
    const formatCurrency = (amount) => {
      return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    const shouldLoadData = () => {
      if (!props.provider) {
        console.warn('⚠️ No provider data available');
        return false;
      }
      
      const token = localStorage.getItem("provider_token");
      if (!token) {
        console.warn('⚠️ No authentication token');
        return false;
      }
      
      const isProviderHome = route.path.includes('/provider/home') || 
                            route.name === 'ProviderHome';
      
      if (!isProviderHome) {
        console.warn('⚠️ Not on provider home route');
        return false;
      }
      
      console.log('✅ Conditions met - should load data');
      return true;
    };

    const getProviderPid = () => {
      try {
        const loggedProvider = localStorage.getItem("loggedProvider");
        if (!loggedProvider) throw new Error("No logged provider found");
        
        const providerData = JSON.parse(loggedProvider);
        return providerData.pid || providerData._id;
      } catch (err) {
        criticalError.value = "Authentication error: " + err.message;
        return null;
      }
    };

    const refreshData = () => loadDashboardData();
    const navigateTo = (path) => router.push(path);
    
    // ========== NOTIFICATION FUNCTIONS ==========
    
    const getActionFromType = (type) => {
      const actionMap = {
        booking: '/provider/bookings',
        review: '/provider/reviews',
        payment: '/provider/revenue',
        message: '/provider/messages',
        system: '/provider/settings',
        info: '/provider/dashboard',
        reminder: '/provider/bookings',
        cancellation: '/provider/bookings'
      };
      return actionMap[type] || '/provider/dashboard';
    };

    const getNotificationIconClass = (type) => {
      const iconClassMap = {
        booking: 'fa-solid fa-calendar-check',
        review: 'fa-solid fa-star',
        reminder: 'fa-solid fa-clock',
        system: 'fa-solid fa-info-circle',
        payment: 'fa-solid fa-credit-card',
        cancellation: 'fa-solid fa-times-circle',
        message: 'fa-solid fa-message',
        info: 'fa-solid fa-bell'
      };
      return iconClassMap[type] || 'fa-solid fa-bell';
    };

    const getNotificationIcon = (type) => {
      const iconMap = {
        booking: 'icon-booking',
        review: 'icon-review',
        reminder: 'icon-reminder',
        system: 'icon-system',
        payment: 'icon-payment',
        cancellation: 'icon-cancellation',
        message: 'icon-message'
      };
      return iconMap[type] || 'icon-info';
    };

    const getDefaultTitle = (type) => {
      const titleMap = {
        booking: 'New Booking',
        review: 'New Review',
        reminder: 'Reminder',
        system: 'System Update',
        payment: 'Payment Update',
        cancellation: 'Booking Cancelled',
        message: 'New Message'
      };
      return titleMap[type] || 'Notification';
    };

    const formatNotificationTime = (timestamp) => {
      if (!timestamp) return 'Just now';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const fetchNotifications = async () => {
      notifications.value = [];
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value && notifications.value.length === 0) {
        fetchNotifications();
      }
    };

    const closeNotifications = () => {
      showNotifications.value = false;
    };

    const onNotificationBlur = (event) => {
      if (isMobile.value) return;
      
      setTimeout(() => {
        if (!event.relatedTarget || !event.relatedTarget.closest('.notification-container')) {
          showNotifications.value = false;
        }
      }, 100);
    };

    const markAsRead = async (notificationId) => {
      const notification = notifications.value.find(n => (n._id === notificationId || n.id === notificationId));
      if (notification) notification.read = true;
    };

    const markAllAsRead = async () => {
      notifications.value.forEach(n => n.read = true);
    };

    const deleteNotification = async (notificationId) => {
      const index = notifications.value.findIndex(n => (n._id === notificationId || n.id === notificationId));
      if (index > -1) notifications.value.splice(index, 1);
    };

    const handleNotificationClick = (notification) => {
      const action = notification.action || getActionFromType(notification.type);
      if (action) navigateTo(action);
      closeNotifications();
    };

    const refreshNotifications = () => fetchNotifications();
    const viewAllNotifications = () => navigateTo('/provider/notifications');

    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length;
    });

    // Lifecycle
    onMounted(() => {
      console.log('🏠 HomeDashboard mounted');
      
      window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 768;
      });
      
      // Load data
      setTimeout(() => {
        if (shouldLoadData()) {
          loadDashboardData();
        }
      }, 100);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', () => {});
    });

    // Watch for provider prop changes
    watch(() => props.provider, (newProvider) => {
      if (newProvider && shouldLoadData()) {
        console.log('👤 Provider data received, loading dashboard...');
        loadDashboardData();
      }
    }, { immediate: true });

    return {
      // State
      loading,
      criticalError,
      hasData,
      reviewDebugInfo,
      currentDate,
      lastUpdated,
      
      // Notification State
      showNotifications,
      notifications,
      loadingNotifications,
      notificationError,
      unreadCount,
      isMobile,
      
      // Computed Metrics - ALL REAL DATA
      totalBookings,
      bookingGrowth,
      totalServices,
      activeServices,
      totalReviews,
      avgRating,
      totalRevenue,
      revenueGrowth,
      todayBookings,
      upcomingBookings,
      completedBookings,
      completionRate,
      avgResponseTime,
      avgBookingValue,
      
      // Customer Metrics - REAL DATA
      totalCustomers,
      repeatCustomers,
      newCustomers,
      repeatRate,
      
      // Data
      bookingStatuses,
      upcomingFeatures,
      
      // Methods
      loadDashboardData,
      refreshData,
      navigateTo,
      formatCurrency,
      getTrendClass,
      getTrendIcon,
      getStarClass,
      
      // Notification Methods
      toggleNotifications,
      closeNotifications,
      onNotificationBlur,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      handleNotificationClick,
      refreshNotifications,
      viewAllNotifications,
      getNotificationIcon,
      getNotificationIconClass,
      getDefaultTitle,
      formatNotificationTime,
      getActionFromType
    };
  }
};
</script>



<style scoped>
/* All CSS styles remain exactly the same as in the previous version */
/* They are already optimized for responsive design and compact cards */

/* ===== MAIN DASHBOARD STYLES ===== */
.home-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

/* Header Section */
.dashboard-header {
  background: linear-gradient(135deg, #6a8685 0%, #6d8582 100%);
  color: white;
  padding: 24px;
  border-radius: 0 0 20px 20px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section .title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #eceded, #f4f5fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-section .subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 10px;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.8;
  font-size: 0.85rem;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* ===== COMPACT METRICS GRID ===== */
.metrics-grid.compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  min-height: 100px;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.metric-card.primary::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.metric-card.success::before { background: linear-gradient(90deg, #10b981, #059669); }
.metric-card.revenue::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
.metric-card.info::before { background: linear-gradient(90deg, #0ea5e9, #0284c7); }
.metric-card.warning::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.metric-card.purple::before { background: linear-gradient(90deg, #a855f7, #9333ea); }

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.metric-card.primary .metric-icon { background: #dbeafe; color: #1d4ed8; }
.metric-card.success .metric-icon { background: #d1fae5; color: #059669; }
.metric-card.revenue .metric-icon { background: #ede9fe; color: #7c3aed; }
.metric-card.info .metric-icon { background: #e0f2fe; color: #0284c7; }
.metric-card.warning .metric-icon { background: #fef3c7; color: #d97706; }
.metric-card.purple .metric-icon { background: #f3e8ff; color: #9333ea; }

.metric-content {
  flex: 1;
  min-width: 0;
}

.metric-content h3 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2px;
  line-height: 1;
}

.metric-title {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.metric-trend,
.metric-status,
.metric-rating {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.metric-trend.positive { color: #10b981; }
.metric-trend.negative { color: #ef4444; }

.metric-status {
  color: #64748b;
}

.metric-rating {
  color: #f59e0b;
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  margin-left: 4px;
  color: #64748b;
  font-weight: 600;
}

.metric-detail {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.75rem;
  width: 100%;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.breakdown-label {
  color: #64748b;
}

.breakdown-count {
  color: #1e293b;
  font-weight: 600;
}

.metric-progress {
  width: 100%;
  margin-top: 6px;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
  border-radius: 3px;
  transition: width 1s ease;
}

/* Quick Stats Grid */
.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
}

.stats-header {
  margin-bottom: 16px;
}

.stats-header h3 {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.stats-subtitle {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
}

.stat-row.compact {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-note {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 2px;
}

.customer-chart {
  display: flex;
  height: 30px;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 12px;
  border: 1px solid #e2e8f0;
}

.chart-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.5s ease;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
}

.chart-bar.repeat {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
}

.chart-bar.new {
  background: linear-gradient(90deg, #10b981, #059669);
}

.performance-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.performance-item {
  flex: 1;
}

.performance-label {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.performance-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 6px;
}

.performance-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.performance-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 3px;
}

.performance-detail {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
}

.performance-stats {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.stat-mini {
  text-align: center;
  flex: 1;
}

.stat-mini .stat-value {
  font-size: 1.3rem;
  margin-bottom: 2px;
}

.stat-mini .stat-label {
  font-size: 0.75rem;
}

.status-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.85rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.completed { background: #10b981; }
.status-dot.confirmed { background: #3b82f6; }
.status-dot.pending { background: #f59e0b; }
.status-dot.cancelled { background: #6b7280; }

.status-label {
  flex: 1;
  color: #64748b;
  font-weight: 500;
}

.status-count {
  color: #1e293b;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.status-percentage {
  color: #64748b;
  font-size: 0.8rem;
  min-width: 40px;
  text-align: right;
}

/* Coming Soon Features */
.coming-soon-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.coming-soon-section h3 {
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.features-grid.compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.feature-icon.payment { background: #dbeafe; color: #1d4ed8; }
.feature-icon.reports { background: #fef3c7; color: #d97706; }

.feature-content {
  flex: 1;
}

.feature-content h4 {
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-content p {
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 6px;
  line-height: 1.4;
}

.feature-status {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.feature-status.development {
  background: #d1fae5;
  color: #065f46;
}

.feature-status.planned {
  background: #fef3c7;
  color: #92400e;
}

/* Data Source Indicator */
.data-source-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.source-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.source-badge.real-data {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.last-updated {
  font-size: 0.9rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Notification styles */
.notification-container {
  position: relative;
}

.notification-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 1.1rem;
  backdrop-filter: blur(10px);
}

.notification-btn:hover {
  background: white;
  color: #5b6388;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #5b6388;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: white;
  color: #5b6388;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f97316;
  color: white;
  border: none;
}

.btn-secondary:hover {
  background: #ea580c;
}

/* Loading and Error States */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-content h3 {
  color: #1e293b;
  margin-bottom: 8px;
}

.loading-content p {
  color: #64748b;
}

.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-content i {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 16px;
}

.error-content h3 {
  color: #1e293b;
  margin-bottom: 8px;
}

.error-content p {
  color: #64748b;
  margin-bottom: 20px;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Tablet */
@media (max-width: 1024px) {
  .metrics-grid.compact {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid.compact {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .welcome-section .title {
    font-size: 1.5rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .dashboard-content {
    padding: 0 16px 24px;
  }
  
  .metrics-grid.compact {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .metric-card {
    padding: 16px;
    min-height: 90px;
  }
  
  .metric-icon {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }
  
  .metric-content h3 {
    font-size: 1.5rem;
  }
  
  .quick-stats-grid {
    gap: 16px;
  }
  
  .stats-card {
    padding: 16px;
  }
  
  .stat-row.compact {
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-item {
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stat-value {
    font-size: 1.4rem;
  }
  
  .performance-summary {
    flex-direction: column;
    gap: 16px;
  }
  
  .features-grid.compact {
    grid-template-columns: 1fr;
  }
  
  .coming-soon-section {
    padding: 20px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .dashboard-header {
    padding: 16px;
  }
  
  .welcome-section .title {
    font-size: 1.3rem;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .notification-btn {
    width: 38px;
    height: 38px;
  }
  
  .btn {
    padding: 7px 12px;
    font-size: 0.85rem;
  }
  
  .stat-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>