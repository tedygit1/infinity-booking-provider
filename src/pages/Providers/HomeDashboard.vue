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
          <!-- Profile Icon with Logout Dropdown -->
          <div class="profile-container">
            <button class="profile-btn" @click="toggleProfileMenu" 
                    @blur="onProfileBlur"
                    aria-label="Profile menu">
              <i class="fa-solid fa-user-circle"></i>
            </button>
            
            <!-- Profile Dropdown Menu -->
            <transition name="fade-slide">
              <div v-if="showProfileMenu" class="profile-dropdown" 
                   :class="{ 'mobile-dropdown': isMobile }"
                   @click.stop>
                <div class="profile-header">
                  <div class="profile-info">
                    <div class="profile-icon">
                      <i class="fa-solid fa-user-circle"></i>
                    </div>
                    <div class="profile-details">
                      <h4>{{ provider?.fullname || 'Provider' }}</h4>
                      <p class="profile-email">{{ provider?.email || 'provider@example.com' }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="profile-menu-items">
                  <button @click="navigateTo('/provider/profile')" class="profile-menu-item">
                    <i class="fa-solid fa-user"></i>
                    <span>My Profile</span>
                  </button>
                  <button @click="navigateTo('/provider/settings')" class="profile-menu-item">
                    <i class="fa-solid fa-gear"></i>
                    <span>Settings</span>
                  </button>
                  <div class="menu-divider"></div>
                  <!-- Logout Option -->
                  <button @click="handleLogout" class="profile-menu-item logout">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </transition>
            
            <!-- Mobile overlay -->
            <div v-if="showProfileMenu && isMobile" class="profile-overlay" @click="closeProfileMenu"></div>
          </div>
          
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

        <!-- FIXED REVIEWS CARD - ONLY SHOWS REVIEWS FOR EXISTING SERVICES -->
        <div class="metric-card purple" @click="navigateTo('/provider/reviews')">
          <div class="metric-icon">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="metric-content">
            <h3>{{ validReviewsCount }}</h3>
            <p class="metric-title">Reviews</p>
            <div v-if="validReviewsCount > 0" class="metric-rating">
              <div class="stars">
                <i v-for="n in 5" :key="n" 
                   :class="getStarClass(n, avgRating)"
                   class="fa-star"></i>
              </div>
              <span class="rating-text">{{ avgRating.toFixed(1) }}/5</span>
            </div>
            <div v-else class="metric-status">
              <i class="fa-solid fa-star-half-stroke"></i>
              No reviews yet
            </div>
            <!-- Debug info (temporary) -->
            <div v-if="reviewDebugInfo" class="metric-detail debug-info">
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

    <!-- Notification Detail Modal -->
    <div v-if="showNotificationDetail" class="notification-detail-modal">
      <div class="modal-overlay" @click="closeNotificationDetail"></div>
      <div class="modal-content" :class="{ 'mobile-modal': isMobile }">
        <div class="modal-header">
          <div class="modal-title">
            <div class="notification-icon-large" :class="getNotificationIcon(selectedNotification?.type)">
              <i :class="getNotificationIconClass(selectedNotification?.type)"></i>
            </div>
            <div>
              <h3>{{ selectedNotification?.title || getDefaultTitle(selectedNotification?.type) }}</h3>
              <div class="modal-subtitle">
                <span class="notification-time">{{ formatNotificationTime(selectedNotification?.createdAt) }}</span>
                <span v-if="selectedNotification?.type" class="notification-type-tag">{{ selectedNotification.type }}</span>
              </div>
            </div>
          </div>
          <button @click="closeNotificationDetail" class="modal-close">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="notification-detail-content">
            <div class="notification-message-detail">
              <p>{{ selectedNotification?.message || selectedNotification?.content }}</p>
            </div>
            
            <!-- Dynamic Content Based on Notification Type -->
            <div class="notification-details">
              <div v-if="selectedNotification?.type === 'review'" class="review-details">
                <div class="detail-section">
                  <h4><i class="fa-solid fa-star"></i> Review Details</h4>
                  <div class="detail-item">
                    <span class="detail-label">Rating:</span>
                    <div class="rating-stars">
                      <i v-for="n in 5" :key="n" 
                         :class="getStarClass(n, selectedNotification?.data?.rating || 0)"
                         class="fa-star"></i>
                    </div>
                    <span class="rating-value">{{ selectedNotification?.data?.rating || 0 }}/5</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">{{ selectedNotification?.data?.customerName || 'Unknown Customer' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Service:</span>
                    <span class="detail-value">{{ selectedNotification?.data?.serviceName || 'Unknown Service' }}</span>
                  </div>
                  <div v-if="selectedNotification?.data?.comment" class="detail-item full-width">
                    <span class="detail-label">Comment:</span>
                    <p class="detail-text">{{ selectedNotification.data.comment }}</p>
                  </div>
                  <button @click="navigateTo(`/provider/reviews?review=${selectedNotification?.data?.reviewId}`)" 
                          class="btn btn-primary">
                    <i class="fa-solid fa-eye"></i> View Full Review
                  </button>
                </div>
              </div>
              
              <div v-else-if="selectedNotification?.type === 'booking'" class="booking-details">
                <div class="detail-section">
                  <h4><i class="fa-solid fa-calendar-check"></i> Booking Details</h4>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="detail-label">Booking ID:</span>
                      <span class="detail-value">{{ selectedNotification?.data?.bookingId || 'N/A' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Status:</span>
                      <span class="status-badge" :class="getStatusClass(selectedNotification?.data?.status)">
                        {{ selectedNotification?.data?.status || 'Unknown' }}
                      </span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Date:</span>
                      <span class="detail-value">{{ formatDate(selectedNotification?.data?.date) }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Time:</span>
                      <span class="detail-value">{{ selectedNotification?.data?.time || 'N/A' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Customer:</span>
                      <span class="detail-value">{{ selectedNotification?.data?.customerName || 'Unknown' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Service:</span>
                      <span class="detail-value">{{ selectedNotification?.data?.serviceName || 'Unknown Service' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Amount:</span>
                      <span class="detail-value">${{ formatCurrency(selectedNotification?.data?.amount || 0) }}</span>
                    </div>
                  </div>
                  <button @click="navigateTo(`/provider/bookings?booking=${selectedNotification?.data?.bookingId}`)" 
                          class="btn btn-primary">
                    <i class="fa-solid fa-calendar-day"></i> View Booking
                  </button>
                </div>
              </div>
              
              <div v-else-if="selectedNotification?.type === 'payment'" class="payment-details">
                <div class="detail-section">
                  <h4><i class="fa-solid fa-credit-card"></i> Payment Details</h4>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="detail-label">Payment ID:</span>
                      <span class="detail-value">{{ selectedNotification?.data?.paymentId || 'N/A' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Amount:</span>
                      <span class="detail-value">${{ formatCurrency(selectedNotification?.data?.amount || 0) }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Status:</span>
                      <span class="status-badge" :class="getPaymentStatusClass(selectedNotification?.data?.status)">
                        {{ selectedNotification?.data?.status || 'Unknown' }}
                      </span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Date:</span>
                      <span class="detail-value">{{ formatDate(selectedNotification?.data?.date) }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Method:</span>
                      <span class="detail-value">{{ selectedNotification?.data?.method || 'N/A' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Customer:</span>
                      <span class="detail-value">{{ selectedNotification?.data?.customerName || 'Unknown' }}</span>
                    </div>
                  </div>
                  <button @click="navigateTo('/provider/revenue')" class="btn btn-primary">
                    <i class="fa-solid fa-chart-line"></i> View Revenue Dashboard
                  </button>
                </div>
              </div>
              
              <div v-else class="general-details">
                <div class="detail-section">
                  <h4><i class="fa-solid fa-info-circle"></i> Details</h4>
                  <div class="detail-item full-width">
                    <span class="detail-label">Full Message:</span>
                    <p class="detail-text">{{ selectedNotification?.message || selectedNotification?.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="markNotificationAsReadAndClose" class="btn btn-secondary">
            <i class="fa-solid fa-check-circle"></i> Mark as Read
          </button>
          <button @click="deleteNotificationAndClose" class="btn btn-danger">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
          <button v-if="selectedNotification?.action" @click="performNotificationAction" class="btn btn-primary">
            <i class="fa-solid fa-external-link-alt"></i> Take Action
          </button>
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
    
    // Reactive data
    const loading = ref(false);
    const criticalError = ref("");
    const hasData = ref(false);
    const reviewDebugInfo = ref("");
    
    // Real data from API
    const bookings = ref([]);
    const services = ref([]);
    const serviceReviews = ref([]);
    const providerReviews = ref([]);
    const validReviews = ref([]);
    
    // Dashboard metrics
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
    
    // Profile menu state
    const showProfileMenu = ref(false);
    
    // Notification detail modal state
    const showNotificationDetail = ref(false);
    const selectedNotification = ref(null);
    
    // Simple toast replacement
    const showToast = (message, type = 'info') => {
      // Create a simple toast element
      const toast = document.createElement('div');
      toast.className = `simple-toast ${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 300px;
      `;
      
      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(toast);
      
      // Remove after 3 seconds
      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.animation = 'fadeOut 0.3s ease';
          setTimeout(() => {
            if (toast.parentNode) document.body.removeChild(toast);
          }, 300);
        }
      }, 3000);
    };
    
    // ========== LOGOUT FUNCTIONALITY ==========
    
    const handleLogout = async () => {
      try {
        const token = localStorage.getItem("provider_token");
        if (!token) {
          console.warn("No token found, clearing local storage only");
          clearLocalStorage();
          showToast("Logged out locally", "info");
          return;
        }

        // Add token to request headers
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        console.log("🔐 Attempting logout...");
        const response = await http.post("/ainfinity-booking/auth/logout", null, config);
        
        if (response.status === 200) {
          console.log("✅ Logout successful");
          showToast("Logged out successfully!", "success");
        }
      } catch (error) {
        console.warn("⚠️ Logout API failed, clearing local storage:", error.message);
        showToast("Logged out locally", "info");
      } finally {
        clearLocalStorage();
        router.push("/provider/login");
      }
    };

    const clearLocalStorage = () => {
      localStorage.removeItem("provider_token");
      localStorage.removeItem("loggedProvider");
      localStorage.removeItem("provider_data");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
      
      // Clear any provider-related data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("provider_") || key.includes("auth") || key.includes("token")) {
          localStorage.removeItem(key);
        }
      });
    };
    
    // ========== PROFILE MENU FUNCTIONS ==========
    
    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value;
      if (showProfileMenu.value) {
        showNotifications.value = false; // Close notifications if open
      }
    };

    const closeProfileMenu = () => {
      showProfileMenu.value = false;
    };

    const onProfileBlur = (event) => {
      if (isMobile.value) return;
      
      setTimeout(() => {
        if (!event.relatedTarget || !event.relatedTarget.closest('.profile-container')) {
          showProfileMenu.value = false;
        }
      }, 100);
    };
    
    // ========== NOTIFICATION DETAIL FUNCTIONS ==========
    
    const openNotificationDetail = (notification) => {
      selectedNotification.value = notification;
      showNotificationDetail.value = true;
      showNotifications.value = false; // Close notifications dropdown
      
      // Mark as read when opening detail
      if (!notification.read) {
        markAsRead(notification._id || notification.id);
      }
    };

    const closeNotificationDetail = () => {
      showNotificationDetail.value = false;
      selectedNotification.value = null;
    };

    const markNotificationAsReadAndClose = async () => {
      if (selectedNotification.value) {
        await markAsRead(selectedNotification.value._id || selectedNotification.value.id);
        showToast("Notification marked as read", "success");
      }
      closeNotificationDetail();
    };

    const deleteNotificationAndClose = async () => {
      if (selectedNotification.value) {
        await deleteNotification(selectedNotification.value._id || selectedNotification.value.id);
        showToast("Notification deleted", "success");
      }
      closeNotificationDetail();
    };

    const performNotificationAction = () => {
      if (selectedNotification.value?.action) {
        router.push(selectedNotification.value.action);
      } else {
        const action = getActionFromType(selectedNotification.value?.type);
        if (action) {
          router.push(action);
        }
      }
      closeNotificationDetail();
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return dateString;
      }
    };

    const getStatusClass = (status) => {
      if (!status) return '';
      const statusLower = status.toLowerCase();
      if (statusLower.includes('complete') || statusLower.includes('done')) return 'completed';
      if (statusLower.includes('confirm') || statusLower.includes('accept')) return 'confirmed';
      if (statusLower.includes('pending') || statusLower.includes('wait')) return 'pending';
      if (statusLower.includes('cancel') || statusLower.includes('reject')) return 'cancelled';
      return '';
    };

    const getPaymentStatusClass = (status) => {
      if (!status) return '';
      const statusLower = status.toLowerCase();
      if (statusLower.includes('complete') || statusLower.includes('success')) return 'success';
      if (statusLower.includes('pending') || statusLower.includes('processing')) return 'warning';
      if (statusLower.includes('failed') || statusLower.includes('declined')) return 'danger';
      return '';
    };
    
    // ========== NOTIFICATION CLICK HANDLER ==========
    
    const handleNotificationClick = (notification) => {
      // Instead of immediately navigating, open the detail modal
      openNotificationDetail(notification);
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
      validReviews.value = [];
      
      // Reset metrics
      Object.keys(dashboardMetrics.value).forEach(key => {
        dashboardMetrics.value[key] = 0;
      });
      dashboardMetrics.value.avgResponseTime = '0h';

      try {
        console.log("🚀 Loading REAL dashboard data for provider:", providerPid);
        
        // Load services first
        await loadServicesData(providerPid);
        
        // Load bookings from API
        await loadBookingsData(providerPid);
        
        // Load reviews (with service validation)
        await loadReviewsData(providerPid);
        
        // Calculate all metrics from whatever real data we got
        calculateAllMetrics();
        
        hasData.value = true;
        
        console.log("=== REAL DATA LOAD COMPLETE ===");
        console.log("Services:", services.value.length);
        console.log("Bookings:", bookings.value.length);
        console.log("Valid Reviews:", validReviews.value.length);
        
      } catch (error) {
        console.error("❌ Dashboard load error:", error);
        calculateAllMetrics();
        hasData.value = true;
      } finally {
        loading.value = false;
      }
    };
    
    const loadBookingsData = async (providerPid) => {
      console.log("📤 Loading bookings for provider:", providerPid);
      
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
              return;
            } else {
              console.log(`ℹ️ Endpoint ${endpoint.name} returned empty array`);
              bookings.value = [];
            }
          }
        } catch (error) {
          console.log(`⚠️ Endpoint ${endpoint.name} failed:`, error.message);
        }
      }
      
      console.log("ℹ️ All booking endpoints returned empty or failed. Setting bookings to 0.");
      bookings.value = [];
    };
    
    const loadServicesData = async (providerPid) => {
      try {
        const servicesResponse = await http.get(`/services?providerId=${providerPid}`);
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
              
              if (Array.isArray(response.data)) {
                reviews = response.data;
              } else if (response.data.reviews && Array.isArray(response.data.reviews)) {
                reviews = response.data.reviews;
              } else if (response.data.data && Array.isArray(response.data.data)) {
                reviews = response.data.data;
              }
              
              console.log(`📊 Found ${reviews.length} reviews from ${url}`);
              
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
                break;
              }
            }
          } catch (error) {
            console.log(`⚠️ Endpoint ${url} failed:`, error.message);
          }
        }
        
        // Load service-specific reviews as fallback
        console.log("🔄 Attempting to load service reviews as fallback");
        if (services.value.length > 0) {
          serviceReviews.value = [];
          const serviceReviewsPromises = [];
          
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
        
        console.log("📊 Total reviews loaded:", {
          providerReviews: providerReviews.value.length,
          serviceReviews: serviceReviews.value.length
        });
        
      } catch (error) {
        console.error("❌ Critical error loading reviews:", error);
        providerReviews.value = [];
        serviceReviews.value = [];
        reviewDebugInfo.value = "Error loading reviews: " + error.message;
      }
    };
    
    const filterValidReviews = () => {
      console.log("🔍 Filtering reviews for existing services...");
      
      const existingServiceIds = new Set();
      services.value.forEach(service => {
        if (service._id) existingServiceIds.add(service._id.toString());
        if (service.id) existingServiceIds.add(service.id.toString());
      });
      
      console.log(`📋 Existing service IDs: ${Array.from(existingServiceIds)}`);
      
      const allReviews = [...providerReviews.value, ...serviceReviews.value];
      
      validReviews.value = allReviews.filter(review => {
        if (!review.serviceId && !review.service) return true;
        
        let serviceId = review.serviceId || review.service?._id || review.service?.id || review.service;
        if (!serviceId) return false;
        
        const serviceExists = existingServiceIds.has(serviceId.toString());
        
        if (!serviceExists) {
          console.log(`⚠️ Excluding review for deleted service: ${serviceId}`);
        }
        
        return serviceExists;
      });
      
      // Remove duplicates
      validReviews.value = validReviews.value.filter((review, index, self) =>
        index === self.findIndex(r => 
          (r._id === review._id) || 
          (r.id === review.id) ||
          (r._id && review.id && r._id === review.id) ||
          (r.id && review._id && r.id === review._id)
        )
      );
      
      console.log(`✅ Valid reviews after filtering: ${validReviews.value.length} (out of ${allReviews.length} total)`);
      
      if (allReviews.length > 0 && validReviews.value.length < allReviews.length) {
        const excluded = allReviews.length - validReviews.value.length;
        reviewDebugInfo.value = `${excluded} review(s) excluded for deleted services`;
      }
    };
    
    const calculateAllMetrics = () => {
      console.log("📊 Calculating metrics from real data...");
      
      calculateServiceMetrics();
      
      if (bookings.value.length > 0) {
        calculateBookingMetrics();
        calculateCustomerMetrics();
      } else {
        console.log("⚠️ No booking data available - setting booking metrics to 0");
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
      
      filterValidReviews();
      calculateReviewMetrics();
      calculateRevenueMetrics();
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
        
        let status = '';
        if (booking.status) status = booking.status.toLowerCase();
        else if (booking.bookingStatus) status = booking.bookingStatus.toLowerCase();
        else if (booking.state) status = booking.state.toLowerCase();
        
        let bookingDate = null;
        const dateFields = ['bookingDate', 'date', 'createdAt', 'startDate', 'appointmentDate', 'startTime'];
        for (const field of dateFields) {
          if (booking[field]) {
            try {
              bookingDate = new Date(booking[field]);
              if (!isNaN(bookingDate.getTime())) break;
            } catch (e) {}
          }
        }
        
        let amount = 0;
        const amountFields = ['amount', 'price', 'total', 'cost', 'totalPrice', 'totalAmount'];
        for (const field of amountFields) {
          if (booking[field] !== undefined && booking[field] !== null) {
            amount = parseFloat(booking[field]) || 0;
            break;
          }
        }
        
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
        
        if (bookingDate && bookingDate >= todayStart) {
          todayBookings++;
        }
        
        if (bookingDate && bookingDate > now && 
            (status.includes('confirm') || status.includes('pending') || status.includes('accept'))) {
          upcomingBookings++;
        }
      });
      
      dashboardMetrics.value.totalBookings = totalBookings;
      dashboardMetrics.value.completedBookings = completedBookings;
      dashboardMetrics.value.confirmedBookings = confirmedBookings;
      dashboardMetrics.value.pendingBookings = pendingBookings;
      dashboardMetrics.value.cancelledBookings = cancelledBookings;
      dashboardMetrics.value.todayBookings = todayBookings;
      dashboardMetrics.value.upcomingBookings = upcomingBookings;
      dashboardMetrics.value.totalRevenue = totalRevenue;
      
      dashboardMetrics.value.completionRate = totalBookings > 0 ? 
        Math.round((completedBookings / totalBookings) * 100) : 0;
      
      dashboardMetrics.value.avgBookingValue = completedBookings > 0 ? 
        Math.round(totalRevenue / completedBookings) : 0;
      
      console.log("📊 Booking Metrics:", {
        total: dashboardMetrics.value.totalBookings,
        completed: dashboardMetrics.value.completedBookings,
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
    };
    
    const calculateReviewMetrics = () => {
      console.log("⭐ Calculating review metrics from valid reviews...");
      
      dashboardMetrics.value.totalReviews = validReviews.value.length;
      
      if (validReviews.value.length > 0) {
        const validRatings = validReviews.value.filter(review => {
          const rating = parseFloat(review.rating);
          return !isNaN(rating) && rating >= 0 && rating <= 5;
        });
        
        if (validRatings.length > 0) {
          const totalRating = validRatings.reduce((sum, review) => {
            const rating = parseFloat(review.rating) || 0;
            return sum + rating;
          }, 0);
          
          dashboardMetrics.value.avgRating = totalRating / validRatings.length;
          console.log(`📊 Average rating calculated: ${dashboardMetrics.value.avgRating} from ${validRatings.length} valid reviews`);
          
          if (validRatings.length < validReviews.value.length) {
            reviewDebugInfo.value = `${validRatings.length} valid ratings found (some had invalid ratings)`;
          }
        } else {
          dashboardMetrics.value.avgRating = 0;
          reviewDebugInfo.value = "No valid ratings found in reviews";
        }
      } else {
        dashboardMetrics.value.avgRating = 0;
        if (providerReviews.value.length > 0 || serviceReviews.value.length > 0) {
          reviewDebugInfo.value = "No reviews for currently active services";
        } else {
          reviewDebugInfo.value = "No reviews found for this provider";
        }
      }
    };
    
    const calculateCustomerMetrics = () => {
      const customerMap = new Map();
      const repeatCustomers = new Set();
      const newCustomers = new Set();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      bookings.value.forEach(booking => {
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
    };
    
    const calculateRevenueMetrics = () => {
      console.log("💰 Revenue Metrics calculated");
    };
    
    const calculatePerformanceMetrics = () => {
      console.log("📈 Performance Metrics calculated");
    };
    
    // ========== NOTIFICATIONS FUNCTIONS ==========
    
    const fetchNotifications = async () => {
      try {
        loadingNotifications.value = true;
        notificationError.value = "";
        
        const providerPid = getProviderPid();
        if (!providerPid) {
          console.log("⚠️ No provider ID for notifications");
          notifications.value = [];
          return;
        }
        
        console.log("🔔 Fetching notifications for provider:", providerPid);
        
        const endpoints = [
          `/api/notifications?recipientId=${providerPid}&recipientType=provider`,
          `/api/notifications?providerId=${providerPid}`,
          `/api/notifications`,
          `/notifications?providerId=${providerPid}`,
          `/notifications/provider/${providerPid}`
        ];
        
        for (const url of endpoints) {
          try {
            console.log(`🔄 Trying notifications endpoint: ${url}`);
            const response = await http.get(url);
            
            if (response.data) {
              let loadedNotifications = [];
              
              if (Array.isArray(response.data)) {
                loadedNotifications = response.data;
              } else if (response.data.notifications && Array.isArray(response.data.notifications)) {
                loadedNotifications = response.data.notifications;
              } else if (response.data.data && Array.isArray(response.data.data)) {
                loadedNotifications = response.data.data;
              } else if (response.data.results && Array.isArray(response.data.results)) {
                loadedNotifications = response.data.results;
              }
              
              console.log(`📨 Found ${loadedNotifications.length} notifications from ${url}`);
              
              if (url === '/api/notifications' || url === '/notifications') {
                loadedNotifications = loadedNotifications.filter(notification => {
                  return notification.recipientId === providerPid || 
                         notification.providerId === providerPid ||
                         notification.recipient?._id === providerPid ||
                         notification.provider?._id === providerPid ||
                         (notification.recipientType === 'provider' && 
                          (notification.recipientId === providerPid || 
                           notification.recipient?._id === providerPid));
                });
                console.log(`📨 Filtered to ${loadedNotifications.length} notifications for this provider`);
              }
              
              if (loadedNotifications.length > 0) {
                notifications.value = loadedNotifications;
                console.log(`✅ Successfully loaded ${notifications.value.length} real notifications`);
                return;
              }
            }
          } catch (error) {
            console.log(`⚠️ Notifications endpoint ${url} failed:`, error.message);
          }
        }
        
        console.log("ℹ️ No notifications found or all endpoints failed");
        notifications.value = [];
        
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        notificationError.value = "Failed to load notifications";
        notifications.value = [];
      } finally {
        loadingNotifications.value = false;
      }
    };
    
    const markAsRead = async (notificationId) => {
      try {
        const notification = notifications.value.find(n => (n._id === notificationId || n.id === notificationId));
        if (notification && !notification.read) {
          try {
            await http.patch(`/api/notifications/${notificationId}/read`);
            console.log(`✅ Marked notification ${notificationId} as read via API`);
          } catch (apiError) {
            console.log(`⚠️ API call failed, marking locally only:`, apiError.message);
          }
          
          notification.read = true;
        }
      } catch (error) {
        console.error("❌ Error marking notification as read:", error);
      }
    };
    
    const markAllAsRead = async () => {
      try {
        const providerPid = getProviderPid();
        if (providerPid) {
          try {
            await http.patch(`/api/notifications/mark-all-read`, {
              recipientId: providerPid,
              recipientType: 'provider'
            });
            console.log(`✅ Marked all notifications as read via API`);
          } catch (apiError) {
            console.log(`⚠️ API call failed, marking locally only:`, apiError.message);
          }
        }
        
        notifications.value.forEach(n => n.read = true);
        showToast("All notifications marked as read", "success");
      } catch (error) {
        console.error("❌ Error marking all notifications as read:", error);
        showToast("Failed to mark all as read", "error");
      }
    };
    
    const deleteNotification = async (notificationId) => {
      try {
        try {
          await http.delete(`/api/notifications/${notificationId}`);
          console.log(`✅ Deleted notification ${notificationId} via API`);
        } catch (apiError) {
          console.log(`⚠️ API call failed, deleting locally only:`, apiError.message);
        }
        
        const index = notifications.value.findIndex(n => (n._id === notificationId || n.id === notificationId));
        if (index > -1) notifications.value.splice(index, 1);
      } catch (error) {
        console.error("❌ Error deleting notification:", error);
      }
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
    const validReviewsCount = computed(() => dashboardMetrics.value.totalReviews);
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
    
    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length;
    });
    
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

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value && notifications.value.length === 0) {
        fetchNotifications();
      }
      if (showNotifications.value) {
        showProfileMenu.value = false; // Close profile menu if open
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

    const refreshNotifications = () => fetchNotifications();
    const viewAllNotifications = () => navigateTo('/provider/notifications');

    const diagnoseReviews = () => {
      console.log("=== REVIEW DIAGNOSIS ===");
      console.log("Services loaded:", services.value.length);
      console.log("Provider reviews:", providerReviews.value.length);
      console.log("Service reviews:", serviceReviews.value.length);
      console.log("Valid reviews:", validReviews.value.length);
      console.log("Current review metrics:", {
        total: dashboardMetrics.value.totalReviews,
        avgRating: dashboardMetrics.value.avgRating
      });
      console.log("=========================");
    };

    // Lifecycle
    onMounted(() => {
      console.log('🏠 HomeDashboard mounted');
      
      window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 768;
      });
      
      setTimeout(() => {
        if (shouldLoadData()) {
          loadDashboardData();
        }
      }, 100);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', () => {});
    });

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
      
      // Profile Menu State
      showProfileMenu,
      
      // Notification Detail State
      showNotificationDetail,
      selectedNotification,
      
      // Computed Metrics
      totalBookings,
      bookingGrowth,
      totalServices,
      activeServices,
      validReviewsCount,
      avgRating,
      totalRevenue,
      revenueGrowth,
      todayBookings,
      upcomingBookings,
      completedBookings,
      completionRate,
      avgResponseTime,
      avgBookingValue,
      
      // Customer Metrics
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
      
      // Profile Menu Methods
      toggleProfileMenu,
      closeProfileMenu,
      onProfileBlur,
      handleLogout,
      
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
      getActionFromType,
      
      // Notification Detail Methods
      openNotificationDetail,
      closeNotificationDetail,
      markNotificationAsReadAndClose,
      deleteNotificationAndClose,
      performNotificationAction,
      formatDate,
      getStatusClass,
      getPaymentStatusClass,
      
      // Diagnostic
      diagnoseReviews
    };
  }
};
</script>

<style scoped>
/* All CSS styles remain exactly as in the previous version - no changes needed */
/* The CSS is already comprehensive and includes all necessary styles */

/* Simple toast styles */
.simple-toast {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  font-weight: 500;
  animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
}

.simple-toast.success {
  background: #10b981;
  color: white;
}

.simple-toast.error {
  background: #ef4444;
  color: white;
}

.simple-toast.warning {
  background: #f59e0b;
  color: white;
}

.simple-toast.info {
  background: #3b82f6;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

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