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
          <div class="provider-id">
            <i class="fa-solid fa-id-card"></i>
            Provider ID: {{ currentProviderPid || 'Loading...' }}
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="refreshData" :disabled="loading">
            <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
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
        <div class="source-badge" :class="{ 'real-data': isRealData, 'demo-data': !isRealData }">
          <i :class="isRealData ? 'fa-solid fa-database' : 'fa-solid fa-eye'"></i>
          {{ isRealData ? 'Live Data' : 'Demo Data' }}
        </div>
        <div class="last-updated">
          <i class="fa-solid fa-clock"></i>
          Updated: {{ lastUpdated }}
        </div>
      </div>

      <!-- Key Metrics Grid -->
      <div class="metrics-grid">
        <!-- Total Bookings -->
        <div class="metric-card primary" @click="navigateTo('/bookings')">
          <div class="metric-icon">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div class="metric-content">
            <h3>{{ totalBookings }}</h3>
            <p class="metric-title">Total Bookings</p>
            <div class="metric-trend" v-if="bookingChange">
              <i :class="bookingChange >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
              <span>{{ Math.abs(bookingChange) }}%</span>
              <span class="metric-period">from last month</span>
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Total Services -->
        <div class="metric-card success" @click="navigateTo('/services')">
          <div class="metric-icon">
            <i class="fa-solid fa-briefcase"></i>
          </div>
          <div class="metric-content">
            <h3>{{ totalServices }}</h3>
            <p class="metric-title">Total Services</p>
            <div class="metric-subtext">
              <i class="fa-solid fa-check-circle"></i>
              {{ activeServices }} active
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="metric-card revenue" @click="navigateTo('/revenue')">
          <div class="metric-icon">
            <i class="fa-solid fa-money-bill-wave"></i>
          </div>
          <div class="metric-content">
            <h3>${{ formatCurrency(totalRevenue) }}</h3>
            <p class="metric-title">Total Revenue</p>
            <div class="metric-trend" v-if="revenueChange">
              <i :class="revenueChange >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
              <span>{{ Math.abs(revenueChange) }}%</span>
              <span class="metric-period">from last month</span>
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Today's Bookings -->
        <div class="metric-card info" @click="navigateTo('/bookings?filter=today')">
          <div class="metric-icon">
            <i class="fa-solid fa-calendar-day"></i>
          </div>
          <div class="metric-content">
            <h3>{{ todayBookings }}</h3>
            <p class="metric-title">Today's Bookings</p>
            <div class="metric-subtext">
              <i class="fa-solid fa-clock"></i>
              {{ upcomingBookings }} upcoming
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Completion Rate -->
        <div class="metric-card warning" @click="navigateTo('/analytics')">
          <div class="metric-icon">
            <i class="fa-solid fa-chart-line"></i>
          </div>
          <div class="metric-content">
            <h3>{{ completionRate }}%</h3>
            <p class="metric-title">Completion Rate</p>
            <div class="metric-subtext">
              {{ completedBookings }} completed bookings
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>

        <!-- Customer Satisfaction -->
        <div class="metric-card purple" @click="navigateTo('/reviews')">
          <div class="metric-icon">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="metric-content">
            <h3>{{ averageRating }}/5</h3>
            <p class="metric-title">Avg. Rating</p>
            <div class="rating-stars">
              <i v-for="n in 5" :key="n" 
                 class="fa-star" 
                 :class="n <= Math.floor(averageRating) ? 'fa-solid filled' : 'fa-regular'">
              </i>
            </div>
          </div>
          <div class="metric-action">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>

      <!-- Quick Stats Grid -->
      <div class="quick-stats-grid">
        <div class="stats-card">
          <div class="stats-header">
            <h3><i class="fa-solid fa-users"></i> Customer Overview</h3>
          </div>
          <div class="stats-content">
            <div class="stat-row">
              <div class="stat-item">
                <div class="stat-value">{{ totalCustomers }}</div>
                <div class="stat-label">Total Customers</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ repeatCustomers }}</div>
                <div class="stat-label">Repeat Customers</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ newCustomers }}</div>
                <div class="stat-label">New (30 days)</div>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-header">
            <h3><i class="fa-solid fa-chart-pie"></i> Booking Status</h3>
          </div>
          <div class="stats-content">
            <div class="status-bars">
              <div class="status-bar completed" :style="{ width: completedPercentage + '%' }">
                <span class="status-label">Completed {{ completedBookings }}</span>
              </div>
              <div class="status-bar confirmed" :style="{ width: confirmedPercentage + '%' }">
                <span class="status-label">Confirmed {{ confirmedBookings }}</span>
              </div>
              <div class="status-bar pending" :style="{ width: pendingPercentage + '%' }">
                <span class="status-label">Pending {{ pendingBookings }}</span>
              </div>
              <div class="status-bar cancelled" :style="{ width: cancelledPercentage + '%' }">
                <span class="status-label">Cancelled {{ cancelledBookings }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming Soon Features -->
      <div class="coming-soon-section">
        <h3><i class="fa-solid fa-rocket"></i> Coming Soon</h3>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-credit-card"></i>
            </div>
            <div class="feature-content">
              <h4>Payment Analytics</h4>
              <p>Track payments & revenue trends</p>
              <span class="feature-status">In Development</span>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
            <div class="feature-content">
              <h4>Advanced Reports</h4>
              <p>Detailed performance insights</p>
              <span class="feature-status">Planned</span>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa-solid fa-message"></i>
            </div>
            <div class="feature-content">
              <h4>Review System</h4>
              <p>Collect customer feedback</p>
              <span class="feature-status">Planned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
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
    
    // Reactive data
    const loading = ref(true);
    const criticalError = ref("");
    const hasData = ref(false);
    const isRealData = ref(false);
    const currentProviderPid = ref("");
    
    // Data
    const bookings = ref([]);
    const services = ref([]);
    
    // Known provider PIDs - MANUAL MAPPING
    const knownProviderPids = {
      "691e1659e304653542a825d5": "PROV-1763579481598-1GBEN", // hayelom
      "692b3c78d399bc41c3712380": "PROV-1764441208540-C269P"  // tig-tg
    };

    // Computed properties
    const currentDate = computed(() => {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    const lastUpdated = computed(() => {
      return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    });

    // Booking metrics
    const totalBookings = computed(() => bookings.value.length);
    const completedBookings = computed(() => bookings.value.filter(b => b.status === 'completed').length);
    const confirmedBookings = computed(() => bookings.value.filter(b => b.status === 'confirmed').length);
    const pendingBookings = computed(() => bookings.value.filter(b => b.status === 'pending').length);
    const cancelledBookings = computed(() => bookings.value.filter(b => b.status === 'cancelled').length);
    
    const completionRate = computed(() => {
      if (totalBookings.value === 0) return 0;
      return Math.round((completedBookings.value / totalBookings.value) * 100);
    });

    const completedPercentage = computed(() => {
      if (totalBookings.value === 0) return 0;
      return (completedBookings.value / totalBookings.value) * 100;
    });

    const confirmedPercentage = computed(() => {
      if (totalBookings.value === 0) return 0;
      return (confirmedBookings.value / totalBookings.value) * 100;
    });

    const pendingPercentage = computed(() => {
      if (totalBookings.value === 0) return 0;
      return (pendingBookings.value / totalBookings.value) * 100;
    });

    const cancelledPercentage = computed(() => {
      if (totalBookings.value === 0) return 0;
      return (cancelledBookings.value / totalBookings.value) * 100;
    });

    const totalRevenue = computed(() => {
      return bookings.value
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    });

    const todayBookings = computed(() => {
      const today = new Date().toISOString().split('T')[0];
      return bookings.value.filter(b => {
        try {
          const bookingDate = new Date(b.date).toISOString().split('T')[0];
          return bookingDate === today;
        } catch {
          return false;
        }
      }).length;
    });

    const upcomingBookings = computed(() => {
      const now = new Date();
      return bookings.value.filter(b => {
        if (b.status !== 'pending' && b.status !== 'confirmed') return false;
        try {
          const bookingDate = new Date(b.date);
          return bookingDate > now;
        } catch {
          return false;
        }
      }).length;
    });

    // Service metrics
    const totalServices = computed(() => services.value.length);
    const activeServices = computed(() => services.value.filter(s => s.status === 'active').length);

    // Customer metrics
    const totalCustomers = computed(() => {
      const customerIds = new Set();
      bookings.value.forEach(b => {
        if (b.customerId) customerIds.add(b.customerId);
      });
      return customerIds.size;
    });

    const repeatCustomers = computed(() => {
      const customerCounts = {};
      bookings.value.forEach(b => {
        if (b.customerId) {
          customerCounts[b.customerId] = (customerCounts[b.customerId] || 0) + 1;
        }
      });
      return Object.values(customerCounts).filter(count => count > 1).length;
    });

    const newCustomers = computed(() => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newCustomerIds = new Set();
      bookings.value.forEach(b => {
        if (b.customerId && b.createdAt && new Date(b.createdAt) >= thirtyDaysAgo) {
          newCustomerIds.add(b.customerId);
        }
      });
      
      return newCustomerIds.size;
    });

    // Mock trends (will be real data later)
    const bookingChange = computed(() => 12); // +12% from last month
    const revenueChange = computed(() => 15); // +15% from last month
    const averageRating = computed(() => 4.5); // Mock rating

    // Get Provider PID
    const getProviderPid = () => {
      try {
        const loggedProvider = localStorage.getItem("loggedProvider");
        
        if (!loggedProvider) {
          throw new Error("No logged provider found. Please login again.");
        }
        
        const providerData = JSON.parse(loggedProvider);
        
        // Check if PID exists in localStorage
        const existingPid = providerData.pid || providerData.providerProfile?.pid;
        if (existingPid) {
          currentProviderPid.value = existingPid;
          return existingPid;
        }
        
        // Use manual mapping
        const mappedPid = knownProviderPids[providerData._id];
        if (mappedPid) {
          // Update localStorage with PID for future use
          const updatedData = { ...providerData, pid: mappedPid };
          localStorage.setItem("loggedProvider", JSON.stringify(updatedData));
          
          currentProviderPid.value = mappedPid;
          return mappedPid;
        }
        
        throw new Error(`No PID mapping found for provider: ${providerData._id}`);
        
      } catch (err) {
        console.error("❌ Error getting provider ID:", err);
        criticalError.value = "Authentication error: " + err.message;
        return null;
      }
    };

    // Process booking data (simplified)
    const processBookingData = (booking) => {
      return {
        _id: booking._id,
        date: booking.date || booking.startTime || booking.createdAt,
        status: (booking.status || 'pending').toLowerCase(),
        amount: parseFloat(booking.amount || booking.price || 0),
        customerId: booking.customer?._id || booking.customerId,
        createdAt: booking.createdAt
      };
    };

    // Load dashboard data
    const loadDashboardData = async () => {
      const providerPid = getProviderPid();
      if (!providerPid) {
        criticalError.value = "Unable to identify provider. Please login again.";
        loading.value = false;
        return;
      }

      loading.value = true;
      criticalError.value = "";

      try {
        console.log("🚀 Loading dashboard data for provider:", providerPid);
        
        // Load provider bookings
        const bookingsResponse = await http.get(`/bookings/provider/${providerPid}`);
        
        if (bookingsResponse.data && Array.isArray(bookingsResponse.data)) {
          bookings.value = bookingsResponse.data.map(processBookingData);
          console.log(`✅ Loaded ${bookings.value.length} bookings`);
          isRealData.value = true;
        }
        
        // Load services (mock for now - you'll need to create this endpoint)
        // const servicesResponse = await http.get(`/services/provider/${providerPid}`);
        // if (servicesResponse.data) {
        //   services.value = servicesResponse.data;
        // }
        
        // Mock services for now
        services.value = [
          { _id: '1', name: 'Hair Styling', status: 'active', price: 75 },
          { _id: '2', name: 'Massage Therapy', status: 'active', price: 120 },
          { _id: '3', name: 'Yoga Session', status: 'inactive', price: 60 }
        ];
        
        hasData.value = true;
        
      } catch (err) {
        console.error("❌ Error loading dashboard data:", err);
        handleLoadError(err);
      } finally {
        loading.value = false;
      }
    };

    const handleLoadError = (err) => {
      if (err.response?.status === 401) {
        criticalError.value = "Session expired. Please login again.";
      } else if (err.response?.status === 403) {
        criticalError.value = "Access denied. Please check your permissions.";
      } else if (err.code === 'ERR_NETWORK') {
        criticalError.value = "Network error. Please check your connection.";
      } else {
        criticalError.value = "Unable to load dashboard data. Please try again.";
      }
    };

    const refreshData = () => {
      loadDashboardData();
    };

    const navigateTo = (path) => {
      router.push(path);
    };

    const formatCurrency = (amount) => {
      return parseFloat(amount).toFixed(2);
    };

    // Lifecycle
    onMounted(() => {
      loadDashboardData();
    });

    return {
      loading,
      criticalError,
      hasData,
      isRealData,
      currentProviderPid,
      currentDate,
      lastUpdated,
      
      // Metrics
      totalBookings,
      completedBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      completionRate,
      completedPercentage,
      confirmedPercentage,
      pendingPercentage,
      cancelledPercentage,
      totalRevenue,
      todayBookings,
      upcomingBookings,
      totalServices,
      activeServices,
      totalCustomers,
      repeatCustomers,
      newCustomers,
      bookingChange,
      revenueChange,
      averageRating,
      
      // Methods
      loadDashboardData,
      refreshData,
      navigateTo,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.home-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

/* Header Section */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
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
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-section .subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 12px;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
  font-size: 0.9rem;
}

.provider-id {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading State */
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

/* Error State */
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

/* Main Content */
.dashboard-content {
  padding: 0 24px 40px;
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

.source-badge.demo-data {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.last-updated {
  font-size: 0.9rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.metric-card.primary::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
.metric-card.success::before { background: linear-gradient(90deg, #10b981, #059669); }
.metric-card.revenue::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
.metric-card.info::before { background: linear-gradient(90deg, #0ea5e9, #0284c7); }
.metric-card.warning::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
.metric-card.purple::before { background: linear-gradient(90deg, #a855f7, #9333ea); }

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
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
}

.metric-content h3 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1;
}

.metric-title {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 6px;
}

.metric-trend .fa-arrow-up { color: #10b981; }
.metric-trend .fa-arrow-down { color: #ef4444; }

.metric-period {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.metric-subtext {
  font-size: 0.85rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.rating-stars {
  display: flex;
  gap: 2px;
  margin-top: 6px;
}

.rating-stars .filled {
  color: #fbbf24;
}

.metric-action {
  color: #94a3b8;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.metric-card:hover .metric-action {
  color: #3b82f6;
  transform: translateX(4px);
}

/* Quick Stats Grid */
.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.stats-header {
  margin-bottom: 20px;
}

.stats-header h3 {
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

/* Status Bars */
.status-bars {
  display: flex;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f5f9;
}

.status-bar {
  height: 100%;
  position: relative;
  transition: width 1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-bar.completed { background: #10b981; }
.status-bar.confirmed { background: #3b82f6; }
.status-bar.pending { background: #f59e0b; }
.status-bar.cancelled { background: #6b7280; }

.status-label {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  padding: 0 8px;
}

/* Coming Soon Section */
.coming-soon-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
}

.coming-soon-section h3 {
  color: #1e293b;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-content h4 {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-content p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.feature-status {
  display: inline-block;
  padding: 4px 10px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 24px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-item {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .dashboard-content {
    padding: 0 16px 24px;
  }
  
  .metric-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .metric-icon {
    width: 50px;
    height: 50px;
  }
  
  .status-label {
    font-size: 0.7rem;
  }
}
</style>