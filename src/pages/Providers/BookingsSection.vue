<template>
  <div class="bookings-section">
    <!-- Header Section -->
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">📅 Bookings Management</h1>
          <p class="subtitle">Efficiently manage all your client appointments and service bookings</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="refreshBookings">
            <i class="fa-solid fa-rotate"></i> Refresh
          </button>
          <button class="btn btn-secondary" @click="exportBookings">
            <i class="fa-solid fa-download"></i> Export
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Overview -->
    <div class="stats-overview" v-if="!loading && !error">
      <div class="stat-card">
        <div class="stat-icon total">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalBookings }}</h3>
          <p>Total Bookings</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.pending }}</h3>
          <p>Pending</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon confirmed">
          <i class="fa-solid fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.confirmed }}</h3>
          <p>Confirmed</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon completed">
          <i class="fa-solid fa-flag-checkered"></i>
        </div>
        <div class="stat-content">
          <h3>{{ stats.completed }}</h3>
          <p>Completed</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue">
          <i class="fa-solid fa-dollar-sign"></i>
        </div>
        <div class="stat-content">
          <h3>${{ stats.revenue }}</h3>
          <p>Total Revenue</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section" v-if="!loading && !error">
      <div class="filters-row">
        <div class="search-box">
          <i class="fa-solid fa-search"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by customer name, service, or booking ID..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" class="filter-select">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select v-model="dateFilter" class="filter-select">
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <button class="btn btn-outline" @click="clearFilters">
            <i class="fa-solid fa-times"></i> Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <div class="spinner-large"></div>
        <h3>Loading Your Bookings</h3>
        <p>Please wait while we fetch your appointment data...</p>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
          </div>
          <span>{{ loadingProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="fa-solid fa-exclamation-triangle"></i>
        </div>
        <h3>Unable to Load Bookings</h3>
        <p>{{ error }}</p>
        <div class="error-actions">
          <button class="btn btn-primary" @click="loadBookings">
            <i class="fa-solid fa-rotate"></i> Try Again
          </button>
          <button class="btn btn-outline" @click="contactSupport">
            <i class="fa-solid fa-headset"></i> Contact Support
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="main-content">
      <!-- Bookings List -->
      <div class="bookings-container">
        <div class="section-header">
          <h2>Recent Bookings</h2>
          <div class="view-controls">
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="fa-solid fa-list"></i> List
            </button>
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="fa-solid fa-grid"></i> Grid
            </button>
          </div>
        </div>

        <!-- No Bookings State -->
        <div v-if="filteredBookings.length === 0" class="no-bookings-state">
          <div class="empty-illustration">
            <i class="fa-regular fa-calendar-check"></i>
          </div>
          <h3>No Bookings Found</h3>
          <p v-if="hasActiveFilters">
            No bookings match your current filters. Try adjusting your search criteria.
          </p>
          <p v-else>
            When clients book your services, they'll appear here for you to manage.
          </p>
          <div class="empty-actions" v-if="hasActiveFilters">
            <button class="btn btn-primary" @click="clearFilters">
              Clear All Filters
            </button>
          </div>
          <div class="promotion-tips" v-else>
            <div class="tip-card">
              <i class="fa-solid fa-rocket"></i>
              <div>
                <strong>Promote Your Services</strong>
                <p>Share your booking link on social media and with your network</p>
              </div>
            </div>
            <div class="tip-card">
              <i class="fa-solid fa-star"></i>
              <div>
                <strong>Optimize Your Profile</strong>
                <p>Add photos and detailed descriptions to attract more clients</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings List View -->
        <div v-else-if="viewMode === 'list'" class="bookings-list">
          <div class="bookings-table">
            <div class="table-header">
              <div class="table-cell">Customer</div>
              <div class="table-cell">Service</div>
              <div class="table-cell">Date & Time</div>
              <div class="table-cell">Duration</div>
              <div class="table-cell">Status</div>
              <div class="table-cell">Amount</div>
              <div class="table-cell">Actions</div>
            </div>
            <div 
              v-for="booking in paginatedBookings" 
              :key="booking.id"
              class="table-row"
              :class="{
                'highlight-new': isNewBooking(booking),
                'urgent': isUrgentBooking(booking)
              }"
            >
              <div class="table-cell customer-cell">
                <div class="customer-avatar">
                  {{ getInitials(booking.customerName) }}
                </div>
                <div class="customer-info">
                  <strong>{{ booking.customerName }}</strong>
                  <span class="customer-contact">{{ booking.customerEmail }}</span>
                </div>
              </div>
              <div class="table-cell service-cell">
                <strong>{{ booking.serviceName }}</strong>
                <span class="service-category">{{ booking.serviceCategory }}</span>
              </div>
              <div class="table-cell datetime-cell">
                <div class="date">{{ formatDate(booking.date) }}</div>
                <div class="time">{{ booking.startTime }} - {{ booking.endTime }}</div>
              </div>
              <div class="table-cell duration-cell">
                {{ booking.duration }} mins
              </div>
              <div class="table-cell status-cell">
                <span class="status-badge" :class="booking.status">
                  {{ booking.status }}
                </span>
              </div>
              <div class="table-cell amount-cell">
                <strong>${{ booking.amount }}</strong>
              </div>
              <div class="table-cell actions-cell">
                <div class="action-buttons">
                  <button 
                    v-if="booking.status === 'pending'"
                    class="btn-action confirm"
                    @click="confirmBooking(booking)"
                    title="Confirm Booking"
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button 
                    v-if="booking.status === 'confirmed'"
                    class="btn-action complete"
                    @click="completeBooking(booking)"
                    title="Mark Complete"
                  >
                    <i class="fa-solid fa-flag-checkered"></i>
                  </button>
                  <button 
                    class="btn-action view"
                    @click="viewBookingDetails(booking)"
                    title="View Details"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button 
                    class="btn-action more"
                    @click="toggleBookingActions(booking.id)"
                    title="More Actions"
                  >
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </div>
                <div v-if="activeBookingId === booking.id" class="dropdown-menu">
                  <button @click="rescheduleBooking(booking)" class="dropdown-item">
                    <i class="fa-solid fa-calendar-plus"></i> Reschedule
                  </button>
                  <button @click="sendReminder(booking)" class="dropdown-item">
                    <i class="fa-solid fa-bell"></i> Send Reminder
                  </button>
                  <button 
                    v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
                    @click="cancelBooking(booking)"
                    class="dropdown-item cancel"
                  >
                    <i class="fa-solid fa-times"></i> Cancel
                  </button>
                  <button @click="contactCustomer(booking)" class="dropdown-item">
                    <i class="fa-solid fa-message"></i> Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings Grid View -->
        <div v-else class="bookings-grid">
          <div 
            v-for="booking in paginatedBookings" 
            :key="booking.id"
            class="booking-card"
            :class="{
              'new-booking': isNewBooking(booking),
              'urgent-booking': isUrgentBooking(booking)
            }"
          >
            <div class="card-header">
              <div class="customer-avatar large">
                {{ getInitials(booking.customerName) }}
              </div>
              <div class="customer-details">
                <h4>{{ booking.customerName }}</h4>
                <p>{{ booking.customerEmail }}</p>
              </div>
              <div class="booking-status">
                <span class="status-badge" :class="booking.status">
                  {{ booking.status }}
                </span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="service-info">
                <h5>{{ booking.serviceName }}</h5>
                <p class="service-category">{{ booking.serviceCategory }}</p>
              </div>
              
              <div class="booking-datetime">
                <div class="date-time">
                  <i class="fa-solid fa-calendar"></i>
                  <span>{{ formatDate(booking.date) }}</span>
                </div>
                <div class="date-time">
                  <i class="fa-solid fa-clock"></i>
                  <span>{{ booking.startTime }} - {{ booking.endTime }}</span>
                </div>
                <div class="duration">
                  <i class="fa-solid fa-hourglass"></i>
                  <span>{{ booking.duration }} minutes</span>
                </div>
              </div>
              
              <div class="booking-meta">
                <div class="meta-item">
                  <span class="meta-label">Amount:</span>
                  <span class="meta-value">${{ booking.amount }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Booked:</span>
                  <span class="meta-value">{{ formatRelativeTime(booking.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                v-if="booking.status === 'pending'"
                class="btn btn-sm btn-success"
                @click="confirmBooking(booking)"
              >
                <i class="fa-solid fa-check"></i> Confirm
              </button>
              <button 
                v-if="booking.status === 'confirmed'"
                class="btn btn-sm btn-primary"
                @click="completeBooking(booking)"
              >
                <i class="fa-solid fa-flag-checkered"></i> Complete
              </button>
              <button 
                class="btn btn-sm btn-outline"
                @click="viewBookingDetails(booking)"
              >
                <i class="fa-solid fa-eye"></i> View
              </button>
              <button 
                class="btn btn-sm btn-outline"
                @click="toggleCardActions(booking.id)"
              >
                <i class="fa-solid fa-ellipsis"></i>
              </button>
              
              <div v-if="activeCardId === booking.id" class="card-dropdown">
                <button @click="rescheduleBooking(booking)" class="dropdown-item">
                  <i class="fa-solid fa-calendar-plus"></i> Reschedule
                </button>
                <button @click="sendReminder(booking)" class="dropdown-item">
                  <i class="fa-solid fa-bell"></i> Reminder
                </button>
                <button 
                  v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
                  @click="cancelBooking(booking)"
                  class="dropdown-item cancel"
                >
                  <i class="fa-solid fa-times"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredBookings.length > itemsPerPage" class="pagination">
          <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <i class="fa-solid fa-chevron-left"></i> Previous
          </button>
          
          <div class="page-numbers">
            <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Sidebar - Quick Stats & Actions -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>Quick Actions</h3>
          <div class="quick-actions">
            <button class="quick-action-btn" @click="showBookingModal = true">
              <i class="fa-solid fa-plus"></i>
              <span>Add Manual Booking</span>
            </button>
            <button class="quick-action-btn" @click="generateReport">
              <i class="fa-solid fa-chart-bar"></i>
              <span>Generate Report</span>
            </button>
            <button class="quick-action-btn" @click="syncCalendar">
              <i class="fa-solid fa-calendar-sync"></i>
              <span>Sync Calendar</span>
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Today's Schedule</h3>
          <div class="today-bookings">
            <div 
              v-for="booking in todaysBookings" 
              :key="booking.id"
              class="today-booking"
            >
              <div class="time-slot">{{ booking.startTime }}</div>
              <div class="booking-info">
                <strong>{{ booking.customerName }}</strong>
                <span>{{ booking.serviceName }}</span>
              </div>
              <span class="status-indicator" :class="booking.status"></span>
            </div>
            <div v-if="todaysBookings.length === 0" class="no-bookings-today">
              <p>No bookings scheduled for today</p>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Upcoming Reminders</h3>
          <div class="reminders-list">
            <div class="reminder-item">
              <i class="fa-solid fa-bell"></i>
              <span>Send reminders for tomorrow's bookings</span>
              <button class="btn-remind">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="modal-overlay" @click="selectedBooking = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Booking Details</h3>
          <button class="modal-close" @click="selectedBooking = null">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Booking details content here -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import http from "@/api/index.js";

export default {
  name: 'BookingsSection',
  
  setup() {
    // Reactive data
    const loading = ref(true);
    const loadingProgress = ref(0);
    const error = ref("");
    const bookings = ref([]);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const dateFilter = ref("all");
    const viewMode = ref("list");
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const activeBookingId = ref(null);
    const activeCardId = ref(null);
    const selectedBooking = ref(null);
    const showBookingModal = ref(false);

    // Statistics
    const stats = ref({
      totalBookings: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      revenue: 0
    });

    // Get provider ID
    const getProviderId = () => {
      try {
        const providerId = localStorage.getItem("provider_id");
        const loggedProvider = localStorage.getItem("loggedProvider");
        
        console.log("🔍 BookingsSection - Storage check:", {
          provider_id: providerId,
          loggedProvider: loggedProvider
        });

        if (providerId) {
          console.log("✅ Using provider_id:", providerId);
          return providerId;
        }

        if (loggedProvider) {
          const providerData = JSON.parse(loggedProvider);
          if (providerData._id) {
            console.log("✅ Using loggedProvider _id:", providerData._id);
            localStorage.setItem("provider_id", providerData._id);
            return providerData._id;
          }
        }

        const token = localStorage.getItem("provider_token");
        if (token) {
          error.value = "Please refresh the page or login again.";
        } else {
          error.value = "Please login to access your bookings.";
        }

        return null;
      } catch (err) {
        console.error("❌ Error getting provider ID:", err);
        error.value = "Authentication error. Please login again.";
        return null;
      }
    };

    // Load bookings data
    const loadBookings = async () => {
      const providerId = getProviderId();
      
      if (!providerId) {
        loading.value = false;
        return;
      }

      loading.value = true;
      error.value = "";
      loadingProgress.value = 0;

      try {
        console.log("📡 Loading bookings for provider:", providerId);
        
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          if (loadingProgress.value < 90) {
            loadingProgress.value += 10;
          }
        }, 200);

        // Load bookings
        const bookingsResponse = await http.get(`/bookings/provider/${providerId}`);
        
        // Load statistics
        const statsResponse = await http.get(`/bookings/stats/provider/${providerId}`);
        
        clearInterval(progressInterval);
        loadingProgress.value = 100;

        if (Array.isArray(bookingsResponse.data)) {
          bookings.value = bookingsResponse.data.map(booking => ({
            ...booking,
            isNew: isBookingNew(booking.createdAt)
          }));
          console.log("✅ Bookings loaded:", bookings.value.length);
        } else {
          bookings.value = [];
        }

        if (statsResponse.data) {
          stats.value = statsResponse.data;
        }

        // Calculate stats from bookings if no stats endpoint
        calculateStats();

      } catch (err) {
        console.error("❌ Error loading bookings:", err);
        handleLoadError(err);
      } finally {
        loading.value = false;
        setTimeout(() => { loadingProgress.value = 0; }, 500);
      }
    };

    // Calculate statistics from bookings
    const calculateStats = () => {
      if (bookings.value.length === 0) return;

      const calculatedStats = {
        totalBookings: bookings.value.length,
        pending: bookings.value.filter(b => b.status === 'pending').length,
        confirmed: bookings.value.filter(b => b.status === 'confirmed').length,
        completed: bookings.value.filter(b => b.status === 'completed').length,
        cancelled: bookings.value.filter(b => b.status === 'cancelled').length,
        revenue: bookings.value
          .filter(b => b.status !== 'cancelled')
          .reduce((sum, booking) => sum + (parseFloat(booking.amount) || 0), 0)
          .toFixed(2)
      };

      stats.value = { ...stats.value, ...calculatedStats };
    };

    // Handle load errors
    const handleLoadError = (err) => {
      if (err.response?.status === 403) {
        error.value = "Access denied. Please make sure you're logged in as the correct provider.";
        localStorage.removeItem("provider_id");
      } else if (err.response?.status === 404) {
        // Mock data for demonstration
        bookings.value = generateMockBookings();
        calculateStats();
        error.value = "";
      } else if (err.response?.status === 401) {
        error.value = "Session expired. Please login again.";
        setTimeout(() => { window.location.href = '/login'; }, 2000);
      } else {
        error.value = err.response?.data?.message || 
                     "Unable to load bookings. Please try again later.";
      }
    };

    // Generate mock data for demonstration
    const generateMockBookings = () => {
      const services = ['Hair Cut', 'Massage Therapy', 'Yoga Session', 'Consultation', 'Training'];
      const customers = ['John Smith', 'Emma Wilson', 'Mike Johnson', 'Sarah Brown', 'Alex Davis'];
      const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      
      return Array.from({ length: 15 }, (_, i) => ({
        id: `booking_${i + 1}`,
        customerName: customers[i % customers.length],
        customerEmail: `${customers[i % customers.length].toLowerCase().replace(' ', '.')}@email.com`,
        serviceName: services[i % services.length],
        serviceCategory: i % 2 === 0 ? 'Wellness' : 'Beauty',
        date: new Date(Date.now() + (i - 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: `${9 + (i % 8)}:00`,
        endTime: `${10 + (i % 8)}:00`,
        duration: 60,
        status: statuses[i % statuses.length],
        amount: (50 + (i * 10)).toFixed(2),
        createdAt: new Date(Date.now() - (i * 2) * 60 * 60 * 1000).toISOString()
      }));
    };

    // Computed properties
    const filteredBookings = computed(() => {
      let filtered = bookings.value;

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(booking => 
          booking.customerName.toLowerCase().includes(query) ||
          booking.serviceName.toLowerCase().includes(query) ||
          booking.customerEmail.toLowerCase().includes(query) ||
          booking.id.toLowerCase().includes(query)
        );
      }

      // Status filter
      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(booking => booking.status === statusFilter.value);
      }

      // Date filter
      if (dateFilter.value !== 'all') {
        const today = new Date();
        filtered = filtered.filter(booking => {
          const bookingDate = new Date(booking.date);
          switch (dateFilter.value) {
            case 'today':
              return bookingDate.toDateString() === today.toDateString();
            case 'week':
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() - today.getDay());
              return bookingDate >= weekStart;
            case 'month':
              return bookingDate.getMonth() === today.getMonth() && 
                     bookingDate.getFullYear() === today.getFullYear();
            case 'upcoming':
              return bookingDate >= today;
            case 'past':
              return bookingDate < today;
            default:
              return true;
          }
        });
      }

      return filtered;
    });

    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredBookings.value.slice(start, end);
    });

    const totalPages = computed(() => 
      Math.ceil(filteredBookings.value.length / itemsPerPage.value)
    );

    const hasActiveFilters = computed(() => 
      searchQuery.value !== '' || statusFilter.value !== 'all' || dateFilter.value !== 'all'
    );

    const todaysBookings = computed(() => {
      const today = new Date().toISOString().split('T')[0];
      return bookings.value
        .filter(booking => booking.date === today && booking.status !== 'cancelled')
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    // Methods
    const refreshBookings = () => {
      loadBookings();
    };

    const clearFilters = () => {
      searchQuery.value = "";
      statusFilter.value = "all";
      dateFilter.value = "all";
      currentPage.value = 1;
    };

    const confirmBooking = async (booking) => {
      try {
        await http.patch(`/bookings/${booking.id}/confirm`);
        booking.status = 'confirmed';
        calculateStats();
        // Show success message
      } catch (err) {
        console.error('Error confirming booking:', err);
      }
    };

    const completeBooking = async (booking) => {
      try {
        await http.patch(`/bookings/${booking.id}/complete`);
        booking.status = 'completed';
        calculateStats();
        // Show success message
      } catch (err) {
        console.error('Error completing booking:', err);
      }
    };

    const cancelBooking = async (booking) => {
      if (!confirm(`Are you sure you want to cancel this booking with ${booking.customerName}?`)) {
        return;
      }
      try {
        await http.patch(`/bookings/${booking.id}/cancel`);
        booking.status = 'cancelled';
        calculateStats();
        // Show success message
      } catch (err) {
        console.error('Error cancelling booking:', err);
      }
    };

    const viewBookingDetails = (booking) => {
      selectedBooking.value = booking;
    };

    const toggleBookingActions = (bookingId) => {
      activeBookingId.value = activeBookingId.value === bookingId ? null : bookingId;
    };

    const toggleCardActions = (cardId) => {
      activeCardId.value = activeCardId.value === cardId ? null : cardId;
    };

    const rescheduleBooking = (booking) => {
      console.log('Reschedule booking:', booking.id);
      // Implement reschedule logic
    };

    const sendReminder = (booking) => {
      console.log('Send reminder for booking:', booking.id);
      // Implement reminder logic
    };

    const contactCustomer = (booking) => {
      console.log('Contact customer:', booking.customerEmail);
      // Implement contact logic
    };

    const exportBookings = () => {
      console.log('Export bookings');
      // Implement export logic
    };

    const generateReport = () => {
      console.log('Generate report');
      // Implement report generation
    };

    const syncCalendar = () => {
      console.log('Sync calendar');
      // Implement calendar sync
    };

    const contactSupport = () => {
      console.log('Contact support');
      // Implement support contact
    };

    // Utility functions
    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    };

    const formatRelativeTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return formatDate(dateString);
    };

    const isBookingNew = (createdAt) => {
      const created = new Date(createdAt);
      const now = new Date();
      const diffHours = (now - created) / (1000 * 60 * 60);
      return diffHours < 24; // New if created within last 24 hours
    };

    const isNewBooking = (booking) => {
      return booking.isNew;
    };

    const isUrgentBooking = (booking) => {
      if (booking.status !== 'pending') return false;
      const bookingDate = new Date(booking.date);
      const now = new Date();
      const diffHours = (bookingDate - now) / (1000 * 60 * 60);
      return diffHours < 24; // Urgent if pending and within 24 hours
    };

    // Watchers
    watch([searchQuery, statusFilter, dateFilter], () => {
      currentPage.value = 1;
    });

    // Lifecycle
    onMounted(() => {
      console.log("🚀 BookingsSection component mounted");
      loadBookings();
    });

    return {
      // Data
      loading,
      loadingProgress,
      error,
      bookings,
      searchQuery,
      statusFilter,
      dateFilter,
      viewMode,
      currentPage,
      itemsPerPage,
      activeBookingId,
      activeCardId,
      selectedBooking,
      showBookingModal,
      stats,
      
      // Computed
      filteredBookings,
      paginatedBookings,
      totalPages,
      hasActiveFilters,
      todaysBookings,
      
      // Methods
      loadBookings,
      refreshBookings,
      clearFilters,
      confirmBooking,
      completeBooking,
      cancelBooking,
      viewBookingDetails,
      toggleBookingActions,
      toggleCardActions,
      rescheduleBooking,
      sendReminder,
      contactCustomer,
      exportBookings,
      generateReport,
      syncCalendar,
      contactSupport,
      
      // Utility functions
      getInitials,
      formatDate,
      formatRelativeTime,
      isNewBooking,
      isUrgentBooking
    };
  }
};
</script>

<style scoped>
/* Base Styles */
.bookings-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  font-family: "Poppins", sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header */
.header {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section .title {
  font-size: 2.25rem;
  color: #1e293b;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-section .subtitle {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Statistics Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.total { background: #dbeafe; color: #1e40af; }
.stat-icon.pending { background: #fef3c7; color: #d97706; }
.stat-icon.confirmed { background: #dcfce7; color: #16a34a; }
.stat-icon.completed { background: #f3e8ff; color: #9333ea; }
.stat-icon.revenue { background: #fce7f3; color: #db2777; }

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-content p {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.filters-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 0.9rem;
  min-width: 140px;
}

.btn {
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #64748b;
  color: white;
}

.btn-secondary:hover {
  background: #475569;
}

.btn-outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
}

.btn-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.8rem;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

/* Loading State */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.loading-content {
  text-align: center;
  padding: 48px;
}

.spinner-large {
  width: 64px;
  height: 64px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

.loading-content h3 {
  color: #1e293b;
  margin-bottom: 12px;
}

.loading-content p {
  color: #64748b;
  margin-bottom: 24px;
}

.loading-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 300px;
  margin: 0 auto;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Error State */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.error-content {
  text-align: center;
  padding: 48px;
  max-width: 500px;
}

.error-icon {
  width: 80px;
  height: 80px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #dc2626;
  font-size: 2rem;
}

.error-content h3 {
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.error-content p {
  color: #64748b;
  margin-bottom: 32px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Main Content Layout */
.main-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

/* Bookings Container */
.bookings-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.view-controls {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
}

.view-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* No Bookings State */
.no-bookings-state {
  text-align: center;
  padding: 60px 24px;
}

.empty-illustration {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  color: #1e40af;
  font-size: 3rem;
}

.no-bookings-state h3 {
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.no-bookings-state p {
  color: #64748b;
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto 32px;
  line-height: 1.6;
}

.empty-actions {
  margin-bottom: 32px;
}

.promotion-tips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.tip-card i {
  color: #3b82f6;
  font-size: 1.2rem;
  margin-top: 2px;
}

.tip-card strong {
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.tip-card p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

/* Bookings Table */
.bookings-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  background: #f8fafc;
  padding: 16px 20px;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
  position: relative;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row.highlight-new {
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
}

.table-row.urgent {
  background: #fef3c7;
  border-left: 4px solid #d97706;
}

.table-cell {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

/* Customer Cell */
.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.customer-avatar.large {
  width: 48px;
  height: 48px;
  font-size: 1rem;
}

.customer-info strong {
  color: #1e293b;
  display: block;
  margin-bottom: 2px;
}

.customer-contact {
  color: #64748b;
  font-size: 0.8rem;
}

/* Service Cell */
.service-cell strong {
  color: #1e293b;
  display: block;
  margin-bottom: 2px;
}

.service-category {
  color: #64748b;
  font-size: 0.8rem;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 12px;
}

/* Date Time Cell */
.datetime-cell .date {
  color: #1e293b;
  font-weight: 500;
  margin-bottom: 2px;
}

.datetime-cell .time {
  color: #64748b;
  font-size: 0.9rem;
}

/* Status Badges */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.confirmed {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.completed {
  background: #f3e8ff;
  color: #9333ea;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #dc2626;
}

/* Action Buttons */
.actions-cell {
  position: relative;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.btn-action {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.btn-action.confirm {
  background: #dcfce7;
  color: #16a34a;
}

.btn-action.confirm:hover {
  background: #bbf7d0;
}

.btn-action.complete {
  background: #dbeafe;
  color: #1e40af;
}

.btn-action.complete:hover {
  background: #bfdbfe;
}

.btn-action.view {
  background: #f1f5f9;
  color: #64748b;
}

.btn-action.view:hover {
  background: #e2e8f0;
}

.btn-action.more {
  background: #f1f5f9;
  color: #64748b;
}

.btn-action.more:hover {
  background: #e2e8f0;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 160px;
}

.dropdown-item {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-item.cancel {
  color: #dc2626;
}

.dropdown-item.cancel:hover {
  background: #fee2e2;
}

/* Bookings Grid */
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.booking-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.booking-card.new-booking {
  border-left: 4px solid #0ea5e9;
  background: #f0f9ff;
}

.booking-card.urgent-booking {
  border-left: 4px solid #d97706;
  background: #fef3c7;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.customer-details h4 {
  color: #1e293b;
  margin-bottom: 4px;
  font-size: 1.1rem;
}

.customer-details p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.booking-status {
  margin-left: auto;
}

.card-body {
  space-y: 12px;
}

.service-info h5 {
  color: #1e293b;
  margin-bottom: 4px;
  font-size: 1rem;
}

.booking-datetime {
  space-y: 8px;
}

.date-time, .duration {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
}

.date-time i, .duration i {
  width: 16px;
  color: #94a3b8;
}

.booking-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 0.8rem;
  color: #64748b;
}

.meta-value {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
}

.card-footer {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  position: relative;
}

.card-dropdown {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 140px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Sidebar */
.sidebar {
  space-y: 24px;
}

.sidebar-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.sidebar-section h3 {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.quick-actions {
  space-y: 8px;
}

.quick-action-btn {
  width: 100%;
  padding: 12px 16px;
  border: 2px dashed #e2e8f0;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f0f9ff;
}

.quick-action-btn i {
  font-size: 1.1rem;
}

.today-bookings {
  space-y: 12px;
}

.today-booking {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.today-booking:hover {
  background: #f1f5f9;
}

.time-slot {
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
  min-width: 60px;
  text-align: center;
}

.booking-info {
  flex: 1;
}

.booking-info strong {
  color: #1e293b;
  display: block;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.booking-info span {
  color: #64748b;
  font-size: 0.8rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.pending { background: #f59e0b; }
.status-indicator.confirmed { background: #10b981; }
.status-indicator.completed { background: #8b5cf6; }

.no-bookings-today {
  text-align: center;
  padding: 20px;
  color: #64748b;
  font-size: 0.9rem;
}

.reminders-list {
  space-y: 8px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fef3c7;
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.reminder-item i {
  color: #d97706;
}

.reminder-item span {
  flex: 1;
  color: #92400e;
  font-size: 0.9rem;
}

.btn-remind {
  padding: 4px 8px;
  background: #d97706;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
}

.btn-remind:hover {
  background: #b45309;
}

/* Modal */
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
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #e2e8f0;
}

.modal-body {
  padding: 24px;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .bookings-section {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-controls {
    justify-content: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-cell {
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .table-cell:last-child {
    border-bottom: none;
  }
  
  .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: #475569;
    font-size: 0.9rem;
  }
  
  .bookings-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .title-section .title {
    font-size: 1.8rem;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .header-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>