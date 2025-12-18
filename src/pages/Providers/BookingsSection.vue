<template>
  <div class="bookings-section">
    <!-- Header Section -->
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="title">📅 Bookings Management</h1>
          <p class="subtitle">Manage all your client appointments and service bookings</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="loadBookings">
            <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <div class="spinner-large"></div>
        <h3>Loading Your Bookings</h3>
        <p>Fetching real data from API...</p>
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
        </div>
      </div>
    </div>

    <!-- Success State - No Bookings -->
    <div v-else-if="bookings.length === 0" class="success-empty-state">
      <div class="success-content">
        <div class="success-icon">
          <i class="fa-regular fa-calendar-check"></i>
        </div>
        <h3>No Bookings Yet</h3>
        <p>You don't have any bookings at the moment. When clients book your services, they'll appear here automatically.</p>
        <div class="success-actions">
          <button class="btn btn-primary" @click="promoteServices">
            <i class="fa-solid fa-share"></i> Promote Your Services
          </button>
          <button class="btn btn-outline" @click="loadBookings">
            <i class="fa-solid fa-rotate"></i> Check Again
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content - When Bookings Exist -->
    <div v-else class="main-content">
      <!-- Statistics Overview - COMPACT & AMAZING -->
      <div class="stats-overview-compact">
        <div class="stat-card-compact">
          <div class="stat-icon-compact total">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div class="stat-content-compact">
            <h3>{{ stats.totalBookings }}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div class="stat-card-compact">
          <div class="stat-icon-compact today">
            <i class="fa-solid fa-sun"></i>
          </div>
          <div class="stat-content-compact">
            <h3>{{ stats.today }}</h3>
            <p>Today</p>
          </div>
        </div>
        <div class="stat-card-compact">
          <div class="stat-icon-compact upcoming">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-content-compact">
            <h3>{{ stats.upcoming }}</h3>
            <p>Upcoming</p>
          </div>
        </div>
        <div class="stat-card-compact">
          <div class="stat-icon-compact completed">
            <i class="fa-solid fa-flag-checkered"></i>
          </div>
          <div class="stat-content-compact">
            <h3>{{ stats.completed }}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div class="stat-card-compact">
          <div class="stat-icon-compact revenue">
            <i class="fa-solid fa-money-bill"></i>
          </div>
          <div class="stat-content-compact">
            <h3>ETB {{ stats.revenue }}</h3>
            <p>Revenue</p>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search bookings by customer name, service, or email..."
              class="search-input"
            />
          </div>
          <select v-model="statusFilter" class="filter-select">
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button class="btn btn-outline" @click="clearFilters">
            <i class="fa-solid fa-filter-circle-xmark"></i> Clear Filters
          </button>
        </div>
      </div>

      <!-- Timeline Filter Section - WITHOUT "All Bookings" -->
      <div class="timeline-filter-section">
        <div class="timeline-filter-header">
          <h3><i class="fa-solid fa-filter"></i> Filter by Service Date</h3>
          <p class="timeline-filter-subtitle">Select time period based on when the service will happen</p>
        </div>
        <div class="timeline-filter-buttons">
          <button 
            v-for="period in timelinePeriods" 
            :key="period.id"
            class="timeline-filter-btn"
            :class="{ 'active': selectedPeriod === period.id }"
            @click="selectTimelinePeriod(period.id)"
          >
            <i :class="period.icon"></i>
            {{ period.label }}
          </button>
        </div>
        <!-- Active Filter Display -->
        <div v-if="selectedPeriod !== 'all'" class="timeline-active-filter">
          <div class="active-filter-row">
            <span class="active-filter-badge">
              <i class="fa-solid fa-filter"></i>
              Showing: {{ getActiveFilterLabel() }}
              <button class="clear-period-btn" @click="clearTimelinePeriod">
                <i class="fa-solid fa-times"></i>
              </button>
            </span>
            <span class="filter-count">{{ timelineFilteredBookings.length }} bookings</span>
          </div>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="bookings-container">
        <div class="section-header">
          <h2>
            <span v-if="selectedPeriod !== 'all'">{{ getActiveFilterLabel() }} </span>
            Bookings ({{ displayBookings.length }})
          </h2>
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
            <button class="btn btn-sm btn-outline" @click="exportBookings">
              <i class="fa-solid fa-download"></i> Export
            </button>
          </div>
        </div>

        <!-- AMAZING PROFESSIONAL BOOKING CARDS - ENHANCED -->
        <div v-if="viewMode === 'grid'" class="professional-cards-grid">
          <div 
            v-for="booking in paginatedBookings" 
            :key="booking._id"
            class="professional-card-enhanced"
            :class="{
              'today-card': isTodayBooking(booking),
              'admin-card': booking.isAdminBooking,
              'completed-card': booking.status === 'completed',
              'past-card': isPastBooking(booking)
            }"
          >
            <!-- Card Header with Customer Info - ENHANCED WITH DIRECT PROFILE -->
            <div class="card-header-enhanced">
              <div class="customer-avatar-enhanced">
                <!-- Display Customer Profile Photo or Initials - LARGER & CLEARER -->
                <div v-if="booking.customerProfilePhoto && booking.customerProfilePhoto.trim() !== ''" class="customer-profile-photo-enhanced">
                  <img 
                    :src="booking.customerProfilePhoto" 
                    :alt="booking.customerName"
                    @error="handleImageError(booking, $event)"
                  />
                </div>
                <div v-else class="customer-initials-enhanced" :style="{ backgroundColor: getAvatarColor(booking.customerName) }">
                  {{ getCleanInitials(booking.customerName) }}
                </div>
              </div>
              <div class="customer-info-enhanced">
                <!-- Customer's Name - BOLD & CLEAR -->
                <h4 class="customer-name-enhanced">{{ booking.customerName }}</h4>
                <div class="customer-meta-enhanced">
                  <span v-if="booking.customerEmail && booking.customerEmail.trim() !== ''">
                    <i class="fa-solid fa-envelope"></i> {{ booking.customerEmail }}
                  </span>
                  <span v-if="booking.customerPhone && booking.customerPhone.trim() !== ''">
                    <i class="fa-solid fa-phone"></i> {{ booking.customerPhone }}
                  </span>
                </div>
              </div>
              <div class="booking-status-enhanced">
                <div class="status-badge-enhanced" :class="booking.status">
                  {{ formatStatus(booking.status) }}
                </div>
                <div class="booking-id-enhanced">
                  #{{ booking._id.substring(0, 6) }}
                </div>
              </div>
            </div>

            <!-- Service Details - CLEAN & BRIEF -->
            <div class="service-details-enhanced">
              <div class="service-icon-circle-enhanced">
                <i class="fa-solid" :class="getServiceIcon(booking.serviceCategory)"></i>
              </div>
              <div class="service-info-enhanced">
                <h5 class="service-name-enhanced">{{ formatServiceName(booking.serviceName) }}</h5>
                <div class="service-meta-enhanced">
                  <span class="service-category-enhanced">{{ booking.serviceCategory }}</span>
                  <span class="service-duration-enhanced">{{ calculateDuration(booking.startTime, booking.endTime) }} min</span>
                </div>
              </div>
              <div class="service-amount-enhanced">
                <span class="amount-value-enhanced">ETB {{ booking.actualPrice || booking.servicePrice || booking.amount }}</span>
              </div>
            </div>

            <!-- Date & Time Section - CLEAN LAYOUT -->
            <div class="datetime-section-enhanced">
              <div class="datetime-item">
                <i class="fa-solid fa-calendar-days"></i>
                <span>{{ formatCleanDate(booking.bookingDate) }}</span>
              </div>
              <div class="datetime-item">
                <i class="fa-solid fa-clock"></i>
                <span>{{ formatTimeSlot(booking.startTime, booking.endTime) }}</span>
              </div>
            </div>

            <!-- Additional Info - MINIMAL -->
            <div class="additional-info-minimal">
              <span><i class="fa-solid fa-calendar-plus"></i> Booked {{ formatRelativeTime(booking.createdAt) }}</span>
            </div>

            <!-- Action Buttons - CLEAN -->
            <div class="action-buttons-enhanced">
              <button 
                v-if="!isPastBooking(booking) && booking.status === 'confirmed'"
                class="action-btn-enhanced complete"
                @click="completeBooking(booking)"
              >
                <i class="fa-solid fa-check-circle"></i>
                Complete
              </button>
              <button 
                class="action-btn-enhanced details"
                @click="viewBookingDetailsModal(booking)"
              >
                <i class="fa-solid fa-eye"></i>
                User Details
              </button>
              <button 
                class="action-btn-enhanced contact"
                v-if="!booking.isAdminBooking && booking.customerEmail"
                @click="contactCustomer(booking)"
              >
                <i class="fa-solid fa-message"></i>
                Contact
              </button>
            </div>
          </div>
        </div>

        <!-- Bookings List View -->
        <div v-else class="bookings-list">
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
              :key="booking._id"
              class="table-row"
            >
              <div class="table-cell customer-cell">
                <div class="customer-avatar-list">
                  <div v-if="booking.customerProfilePhoto && booking.customerProfilePhoto.trim() !== ''" class="customer-profile-photo-list">
                    <img 
                      :src="booking.customerProfilePhoto" 
                      :alt="booking.customerName"
                      @error="handleImageError(booking, $event)"
                    />
                  </div>
                  <div v-else class="customer-initials-list" :style="{ backgroundColor: getAvatarColor(booking.customerName) }">
                    {{ getCleanInitials(booking.customerName) }}
                  </div>
                </div>
                <div class="customer-info-list">
                  <div class="customer-main">
                    <strong>{{ booking.customerName }}</strong>
                  </div>
                  <div class="customer-details">
                    <span class="customer-email">{{ booking.customerEmail }}</span>
                  </div>
                </div>
              </div>
              <div class="table-cell service-cell">
                <strong>{{ formatServiceName(booking.serviceName) }}</strong>
                <div class="service-meta-row">
                  <span class="service-category">{{ booking.serviceCategory }}</span>
                </div>
              </div>
              <div class="table-cell datetime-cell">
                <div class="datetime-container">
                  <div class="date-section">
                    <i class="fa-solid fa-calendar"></i>
                    <span class="date">{{ formatCleanDate(booking.bookingDate) }}</span>
                  </div>
                  <div class="time-section">
                    <i class="fa-solid fa-clock"></i>
                    <span class="time">{{ formatTimeSlot(booking.startTime, booking.endTime) }}</span>
                  </div>
                </div>
              </div>
              <div class="table-cell duration-cell">
                <div class="duration-container">
                  <i class="fa-solid fa-hourglass-half"></i>
                  <span>{{ calculateDuration(booking.startTime, booking.endTime) }} mins</span>
                </div>
              </div>
              <div class="table-cell status-cell">
                <span class="status-badge-list" :class="booking.status">
                  {{ formatStatus(booking.status) }}
                </span>
              </div>
              <div class="table-cell amount-cell">
                <div class="amount-container">
                  <i class="fa-solid fa-money-bill"></i>
                  <strong>ETB {{ booking.actualPrice || booking.servicePrice || booking.amount }}</strong>
                </div>
              </div>
              <div class="table-cell actions-cell">
                <div class="action-buttons-list">
                  <button 
                    v-if="!isPastBooking(booking) && booking.status === 'confirmed'"
                    class="btn-action complete"
                    @click="completeBooking(booking)"
                    title="Mark Complete"
                  >
                    <i class="fa-solid fa-check-circle"></i>
                  </button>
                  <button 
                    class="btn-action view"
                    @click="viewBookingDetailsModal(booking)"
                    title="View Details"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="displayBookings.length > itemsPerPage" class="pagination">
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

        <!-- No Results Message -->
        <div v-if="displayBookings.length === 0 && bookings.length > 0" class="no-results">
          <i class="fa-solid fa-search"></i>
          <h4>No bookings match your filters</h4>
          <p>Try changing your search query or filters</p>
          <button class="btn btn-outline" @click="clearFilters">
            <i class="fa-solid fa-filter-circle-xmark"></i> Clear All Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Booking Details</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedBooking" class="booking-details">
            <!-- Customer Information -->
            <div class="customer-section">
              <div class="customer-profile-header">
                <div v-if="selectedBooking.customerProfilePhoto && selectedBooking.customerProfilePhoto.trim() !== ''" 
                     class="customer-profile-photo-modal">
                  <img 
                    :src="selectedBooking.customerProfilePhoto" 
                    :alt="selectedBooking.customerName"
                    @error="handleImageError(selectedBooking, $event)"
                  />
                </div>
                <div v-else class="customer-initials-modal" :style="{ backgroundColor: getAvatarColor(selectedBooking.customerName) }">
                  {{ getCleanInitials(selectedBooking.customerName) }}
                </div>
                <div class="customer-name-info">
                  <h3>{{ selectedBooking.customerName }}</h3>
                  <div v-if="selectedBooking.customerId" class="customer-id-small">
                    <i class="fa-solid fa-id-card"></i>
                    <span>ID: {{ selectedBooking.customerId }}</span>
                  </div>
                </div>
              </div>
              
              <div class="customer-contact-info">
                <div class="contact-item" v-if="selectedBooking.customerEmail">
                  <i class="fa-solid fa-envelope"></i>
                  <div>
                    <div class="contact-label">Email</div>
                    <div class="contact-value">{{ selectedBooking.customerEmail }}</div>
                  </div>
                </div>
                <div class="contact-item" v-if="selectedBooking.customerPhone">
                  <i class="fa-solid fa-phone"></i>
                  <div>
                    <div class="contact-label">Phone</div>
                    <div class="contact-value">{{ selectedBooking.customerPhone }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Service Details -->
            <div class="service-section">
              <h4><i class="fa-solid fa-scissors"></i> Service Details</h4>
              <div class="service-full-details">
                <div class="service-detail-item">
                  <strong>Service:</strong>
                  <span>{{ selectedBooking.serviceName }}</span>
                </div>
                <div class="service-detail-item">
                  <strong>Category:</strong>
                  <span>{{ selectedBooking.serviceCategory }}</span>
                </div>
                <div class="service-detail-item">
                  <strong>Amount:</strong>
                  <span class="service-amount-highlight">ETB {{ selectedBooking.actualPrice || selectedBooking.servicePrice || selectedBooking.amount }}</span>
                </div>
              </div>
            </div>

            <!-- Timing -->
            <div class="timing-section">
              <h4><i class="fa-solid fa-clock"></i> Timing</h4>
              <div class="timing-details">
                <div class="timing-item">
                  <strong>Date:</strong>
                  <span>{{ formatCleanDate(selectedBooking.bookingDate) }}</span>
                </div>
                <div class="timing-item">
                  <strong>Time:</strong>
                  <span>{{ formatTimeSlot(selectedBooking.startTime, selectedBooking.endTime) }}</span>
                </div>
                <div class="timing-item">
                  <strong>Duration:</strong>
                  <span>{{ calculateDuration(selectedBooking.startTime, selectedBooking.endTime) }} minutes</span>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="status-section">
              <h4><i class="fa-solid fa-info-circle"></i> Status</h4>
              <div class="status-details">
                <div class="status-item">
                  <strong>Status:</strong>
                  <span class="status-value" :class="selectedBooking.status">
                    {{ formatStatus(selectedBooking.status) }}
                  </span>
                </div>
                <div class="status-item">
                  <strong>Booked:</strong>
                  <span>{{ formatRelativeTime(selectedBooking.createdAt) }}</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn btn-primary" @click="closeModal">
                <i class="fa-solid fa-check"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
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
    const viewMode = ref("grid");
    const selectedPeriod = ref("today");
    const currentPage = ref(1);
    const itemsPerPage = ref(12);
    const selectedBooking = ref(null);
    const lastUpdatedTime = ref("");

    // Service details cache
    const serviceDetailsCache = ref({});
    const servicesMap = ref({});

    // Customer cache - GLOBAL for immediate display
    const customerCache = ref({});

    // Timeline periods - WITHOUT "All Bookings"
    const timelinePeriods = ref([
      { id: "past", label: "Past Bookings", icon: "fa-solid fa-calendar-minus" },
      { id: "today", label: "Today's Bookings", icon: "fa-solid fa-calendar-day" },
      { id: "tomorrow", label: "Tomorrow", icon: "fa-solid fa-calendar-plus" },
      { id: "next5days", label: "Next 5 Days", icon: "fa-solid fa-calendar-week" }
    ]);

    // Statistics
    const stats = ref({
      totalBookings: 0,
      today: 0,
      upcoming: 0,
      completed: 0,
      revenue: 0
    });

    // ==================== CRITICAL FIX: PRE-LOAD CUSTOMER DETAILS ====================
    // This function runs immediately for each booking to load customer data
    const preloadCustomerDetails = async (booking) => {
      if (!booking.customerId || booking.customerId === 'unknown') return;
      
      // Check cache first
      if (customerCache.value[booking.customerId]) {
        return customerCache.value[booking.customerId];
      }

      try {
        // Try to fetch customer details from API
        const response = await http.get(`/users/customers/by-cid/${booking.customerId}`);
        if (response.data) {
          const user = response.data;
          const customerProfile = user.customerProfile || user;
          const customerData = {
            fullname: customerProfile.fullname || user.fullname || user.name || booking.customerName || 'Customer',
            profilePicture: customerProfile.profilePhoto || user.profilePicture || user.avatar || '',
            email: user.email || booking.customerEmail || '',
            phone: customerProfile.phonenumber || user.phone || booking.customerPhone || ''
          };
          
          // Store in cache
          customerCache.value[booking.customerId] = customerData;
          
          // Update booking with fresh data
          if (customerData.fullname && customerData.fullname !== 'Customer') {
            booking.customerName = customerData.fullname;
          }
          if (customerData.profilePicture) {
            booking.customerProfilePhoto = customerData.profilePicture;
          }
          if (customerData.email) {
            booking.customerEmail = customerData.email;
          }
          if (customerData.phone) {
            booking.customerPhone = customerData.phone;
          }
          
          return customerData;
        }
      } catch (err) {
        console.log(`⚠️ Could not preload customer ${booking.customerId}:`, err.message);
      }
    };

    // ==================== ENHANCED PROCESS SINGLE BOOKING ====================
    const processSingleBooking = async (booking) => {
      try {
        const isAdminBooking = booking.createdBy === 'admin' || booking.adminId || booking.isAdminBooking;
        
        // Extract customer data
        const customer = booking.customer || booking.originalData?.customer || {};
        let customerId = customer.cid || booking.customerId || booking.cid || 'unknown';
        
        // Extract profile photo from multiple possible locations
        let customerProfilePhoto = '';
        if (customer.profilePhoto) {
          customerProfilePhoto = customer.profilePhoto;
        } else if (customer.customerProfile?.profilePhoto) {
          customerProfilePhoto = customer.customerProfile.profilePhoto;
        } else if (customer.profilePicture) {
          customerProfilePhoto = customer.profilePicture;
        } else if (customer.avatar) {
          customerProfilePhoto = customer.avatar;
        } else if (booking.customerProfilePhoto) {
          customerProfilePhoto = booking.customerProfilePhoto;
        }
        
        // Extract customer name
        let customerName = '';
        if (isAdminBooking) {
          customerName = 'Admin';
        } else {
          customerName = customer.fullname || 
                        customer.name || 
                        booking.customerName || 
                        (customerId && customerId !== 'unknown' ? 'Customer' : 'Customer');
        }
        
        // Clean up name
        customerName = customerName
          .replace(/Admin confirmed/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (!customerName || customerName === 'undefined') {
          customerName = isAdminBooking ? 'Admin' : 'Customer';
        }
        
        // Extract email & phone
        let customerEmail = customer.email || booking.customerEmail || '';
        let customerPhone = customer.phone || booking.customerPhone || '';
        
        // Get service details
        const serviceId = booking.serviceId || booking.service?._id || 'unknown';
        let serviceName = booking.serviceName || 'Service';
        let serviceCategory = booking.serviceCategory || 'General';
        let actualPrice = booking.servicePrice || booking.amount || 0;
        
        // Get booking date and times
        let bookingDate = booking.bookingDate || booking.date || '';
        let startTime = booking.startTime || '09:00';
        let endTime = booking.endTime || '10:00';
        
        // Get status
        let status = booking.status ? booking.status.toLowerCase() : 'pending';
        
        // Get created date
        let createdAt = booking.createdAt || new Date().toISOString();
        
        // Create processed booking object
        const processedBooking = {
          _id: booking._id || booking.bookingId || `booking-${Date.now()}`,
          customerId: customerId,
          customerName: customerName,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          customerProfilePhoto: customerProfilePhoto,
          isAdminBooking: isAdminBooking,
          serviceId: serviceId,
          serviceName: serviceName,
          serviceCategory: serviceCategory,
          servicePrice: actualPrice.toFixed(2),
          actualPrice: actualPrice.toFixed(2),
          bookingDate: bookingDate,
          startTime: startTime,
          endTime: endTime,
          status: status,
          amount: actualPrice.toFixed(2),
          createdAt: createdAt,
          originalData: booking
        };
        
        // PRE-LOAD CUSTOMER DETAILS IMMEDIATELY
        if (customerId && customerId !== 'unknown') {
          setTimeout(() => {
            preloadCustomerDetails(processedBooking);
          }, 0);
        }
        
        return processedBooking;
      } catch (err) {
        console.error("❌ Error processing booking:", err);
        return null;
      }
    };

    // ==================== HELPER FUNCTIONS ====================
    const getAvatarColor = (name) => {
      const colors = [
        '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', 
        '#ef4444', '#06b6d4', '#84cc16', '#f97316'
      ];
      const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[index % colors.length];
    };

    const getCleanInitials = (name) => {
      if (!name) return 'C';
      const words = name.split(' ');
      if (words.length === 1 && words[0] === 'Customer') return 'C';
      if (words.length === 1 && words[0] === 'Admin') return 'A';
      return words.map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getServiceIcon = (category) => {
      const icons = {
        'General': 'fa-scissors',
        'Beauty': 'fa-spa',
        'Health': 'fa-heart-pulse',
        'Fitness': 'fa-dumbbell',
        'Education': 'fa-graduation-cap',
        'Home': 'fa-home',
        'Automotive': 'fa-car',
        'Technology': 'fa-laptop-code'
      };
      return icons[category] || 'fa-scissors';
    };

    const formatTimeSlot = (startTime, endTime) => {
      if (!startTime || !endTime) return 'No time';
      const format12Hour = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };
      return `${format12Hour(startTime)} - ${format12Hour(endTime)}`;
    };

    const formatCleanDate = (dateString) => {
      if (!dateString) return 'No date';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } catch (err) {
        return 'Invalid date';
      }
    };

    const formatServiceName = (name) => {
      if (!name) return 'Service';
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const formatStatus = (status) => {
      const statusMap = {
        confirmed: 'Confirmed',
        completed: 'Completed',
        pending: 'Pending',
        cancelled: 'Cancelled'
      };
      return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatRelativeTime = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatCleanDate(dateString);
      } catch (err) {
        return '';
      }
    };

    const calculateDuration = (startTime, endTime) => {
      if (!startTime || !endTime) return 0;
      try {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return Math.round((end - start) / (1000 * 60));
      } catch (err) {
        return 0;
      }
    };

    // ==================== DATE HELPERS ====================
    const getTodayStart = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    };

    const getTomorrowStart = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
    };

    const getNextDayStart = (daysAhead) => {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const isPastBooking = (booking) => {
      if (!booking || !booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const todayStart = getTodayStart();
        return bookingDate < todayStart;
      } catch (err) {
        return false;
      }
    };

    const isTodayBooking = (booking) => {
      if (!booking || !booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const todayStart = getTodayStart();
        const tomorrowStart = getTomorrowStart();
        return bookingDate >= todayStart && bookingDate < tomorrowStart;
      } catch (err) {
        return false;
      }
    };

    const isTomorrowBooking = (booking) => {
      if (!booking || !booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const tomorrowStart = getTomorrowStart();
        const dayAfterTomorrow = getNextDayStart(2);
        return bookingDate >= tomorrowStart && bookingDate < dayAfterTomorrow;
      } catch (err) {
        return false;
      }
    };

    const isNext5DaysBooking = (booking) => {
      if (!booking || !booking.bookingDate) return false;
      try {
        const bookingDate = new Date(booking.bookingDate);
        const todayStart = getTodayStart();
        const fiveDaysFromNow = getNextDayStart(5);
        return bookingDate >= todayStart && bookingDate < fiveDaysFromNow;
      } catch (err) {
        return false;
      }
    };

    // ==================== CORE FUNCTIONS ====================
    const getProviderId = () => {
      const providerId = localStorage.getItem('providerId');
      if (providerId) return providerId;
      
      const loggedProvider = localStorage.getItem('loggedProvider');
      if (loggedProvider) {
        try {
          const parsed = JSON.parse(loggedProvider);
          return parsed.pid || parsed.providerId || parsed._id;
        } catch (e) {
          console.warn("Failed to parse loggedProvider:", e);
        }
      }
      
      return null;
    };

    const loadBookings = async () => {
      console.log("🚀 Loading bookings...");
      loading.value = true;
      loadingProgress.value = 0;
      error.value = "";
      
      try {
        const providerId = getProviderId();
        if (!providerId) {
          error.value = "Unable to authenticate. Please login again.";
          loading.value = false;
          return;
        }
        
        loadingProgress.value = 30;
        
        // Try booking endpoints
        const bookingEndpoints = [
          `/bookings/provider/${providerId}`,
          `/bookings?providerId=${providerId}`,
          `/api/bookings/provider/${providerId}`
        ];
        
        let bookingsData = null;
        for (const endpoint of bookingEndpoints) {
          try {
            const response = await http.get(endpoint);
            if (response.data) {
              bookingsData = response.data;
              break;
            }
          } catch (err) {
            console.log(`Endpoint ${endpoint} failed:`, err.message);
          }
        }
        
        loadingProgress.value = 60;
        
        if (!bookingsData) {
          throw new Error("No bookings data found");
        }
        
        // Process bookings
        let bookingsArray = [];
        if (Array.isArray(bookingsData)) {
          bookingsArray = bookingsData;
        } else if (bookingsData.bookings && Array.isArray(bookingsData.bookings)) {
          bookingsArray = bookingsData.bookings;
        } else if (bookingsData.data && Array.isArray(bookingsData.data)) {
          bookingsArray = bookingsData.data;
        }
        
        // Process all bookings
        const processedBookings = [];
        for (const booking of bookingsArray) {
          const processed = await processSingleBooking(booking);
          if (processed) {
            processedBookings.push(processed);
          }
        }
        
        loadingProgress.value = 90;
        
        // Sort by date (newest first)
        processedBookings.sort((a, b) => {
          const dateA = a.bookingDate ? new Date(a.bookingDate) : new Date();
          const dateB = b.bookingDate ? new Date(b.bookingDate) : new Date();
          return dateB - dateA;
        });
        
        bookings.value = processedBookings;
        calculateStats();
        
        loadingProgress.value = 100;
        console.log(`✅ Loaded ${bookings.value.length} bookings`);
        
      } catch (err) {
        console.error("❌ Load Error:", err);
        error.value = err.response?.data?.message || err.message || "Failed to load bookings";
        bookings.value = [];
        calculateStats();
      } finally {
        loading.value = false;
        setTimeout(() => { loadingProgress.value = 0; }, 500);
      }
    };

    const processBookings = async (bookingsArray) => {
      const processedBookings = [];
      for (const booking of bookingsArray) {
        try {
          const processed = await processSingleBooking(booking);
          if (processed) {
            processedBookings.push(processed);
          }
        } catch (err) {
          console.error("Error processing booking:", err, booking);
        }
      }
      return processedBookings;
    };

    const calculateStats = () => {
      if (bookings.value.length === 0) {
        stats.value = { totalBookings: 0, today: 0, upcoming: 0, completed: 0, revenue: 0 };
        return;
      }
      
      stats.value = {
        totalBookings: bookings.value.length,
        today: bookings.value.filter(b => isTodayBooking(b)).length,
        upcoming: bookings.value.filter(b => !isPastBooking(b) && b.status !== 'cancelled').length,
        completed: bookings.value.filter(b => b.status === 'completed').length,
        revenue: bookings.value
          .filter(b => b.status !== 'cancelled')
          .reduce((sum, booking) => sum + (parseFloat(booking.actualPrice || booking.servicePrice || booking.amount) || 0), 0)
          .toFixed(2)
      };
    };

    // ==================== FILTERING ====================
    const timelineFilteredBookings = computed(() => {
      if (selectedPeriod.value === "all") {
        return bookings.value;
      }
      return bookings.value.filter(booking => {
        switch (selectedPeriod.value) {
          case "past":
            return isPastBooking(booking);
          case "today":
            return isTodayBooking(booking);
          case "tomorrow":
            return isTomorrowBooking(booking);
          case "next5days":
            return isNext5DaysBooking(booking);
          default:
            return true;
        }
      });
    });

    const filteredBookings = computed(() => {
      let filtered = timelineFilteredBookings.value;
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(booking => 
          booking.customerName.toLowerCase().includes(query) ||
          booking.serviceName.toLowerCase().includes(query) ||
          booking.customerEmail.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(booking => booking.status === statusFilter.value);
      }
      
      return filtered;
    });

    const displayBookings = computed(() => filteredBookings.value);
    
    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return displayBookings.value.slice(start, end);
    });

    const totalPages = computed(() => Math.ceil(displayBookings.value.length / itemsPerPage.value));

    // ==================== ACTION FUNCTIONS ====================
    const selectTimelinePeriod = (periodId) => {
      selectedPeriod.value = periodId;
      currentPage.value = 1;
    };

    const clearTimelinePeriod = () => {
      selectedPeriod.value = "all";
      currentPage.value = 1;
    };

    const clearFilters = () => {
      searchQuery.value = "";
      statusFilter.value = "all";
      clearTimelinePeriod();
      currentPage.value = 1;
    };

    const completeBooking = async (booking) => {
      try {
        await http.patch(`/bookings/${booking._id}/status`, { status: 'completed' });
        booking.status = 'completed';
        calculateStats();
        alert("✅ Booking marked as completed!");
      } catch (err) {
        alert("Failed to complete booking. Please try again.");
      }
    };

    const viewBookingDetailsModal = async (booking) => {
      selectedBooking.value = booking;
    };

    const closeModal = () => {
      selectedBooking.value = null;
    };

    const contactCustomer = (booking) => {
      if (booking.customerEmail) {
        window.location.href = `mailto:${booking.customerEmail}`;
      } else {
        alert("No email address available for this customer.");
      }
    };

    const promoteServices = () => {
      alert("🎯 Share your booking link to get more bookings!");
    };

    const getActiveFilterLabel = () => {
      const period = timelinePeriods.value.find(p => p.id === selectedPeriod.value);
      return period ? period.label : "";
    };

    const handleImageError = (booking, event) => {
      event.target.style.display = 'none';
      const parent = event.target.parentElement;
      parent.innerHTML = `<div class="fallback-initials" style="background-color: ${getAvatarColor(booking.customerName)}">${getCleanInitials(booking.customerName)}</div>`;
    };

    const exportBookings = () => {
      if (bookings.value.length === 0) {
        alert("No bookings to export.");
        return;
      }
      
      const csvContent = [
        ['Customer Name', 'Email', 'Service', 'Category', 'Date', 'Time', 'Status', 'Amount'].join(','),
        ...bookings.value.map(b => [
          `"${b.customerName}"`,
          `"${b.customerEmail || ''}"`,
          `"${b.serviceName}"`,
          `"${b.serviceCategory || ''}"`,
          `"${formatCleanDate(b.bookingDate)}"`,
          `"${formatTimeSlot(b.startTime, b.endTime)}"`,
          `"${formatStatus(b.status)}"`,
          `"ETB ${b.actualPrice || b.servicePrice || b.amount}"`
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    // ==================== LIFECYCLE ====================
    onMounted(() => {
      loadBookings();
    });

    return {
      // State
      loading,
      loadingProgress,
      error,
      bookings,
      searchQuery,
      statusFilter,
      viewMode,
      selectedPeriod,
      timelinePeriods,
      currentPage,
      itemsPerPage,
      selectedBooking,
      lastUpdatedTime,
      stats,
      
      // Computed
      displayBookings,
      paginatedBookings,
      totalPages,
      timelineFilteredBookings,
      
      // Methods
      loadBookings,
      clearFilters,
      completeBooking,
      viewBookingDetailsModal,
      closeModal,
      contactCustomer,
      selectTimelinePeriod,
      clearTimelinePeriod,
      promoteServices,
      getActiveFilterLabel,
      exportBookings,
      
      // Formatting
      getAvatarColor,
      getCleanInitials,
      formatCleanDate,
      formatServiceName,
      formatStatus,
      calculateDuration,
      formatTimeSlot,
      formatRelativeTime,
      isTodayBooking,
      isPastBooking,
      getServiceIcon,
      handleImageError
    };
  }
};
</script>

<style scoped>
/* ==================== COMPACT STATS ==================== */
.stats-overview-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card-compact {
  background: white;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.stat-card-compact:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon-compact {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.stat-icon-compact.total { background: linear-gradient(135deg, #dbeafe, #93c5fd); color: #1e40af; }
.stat-icon-compact.today { background: linear-gradient(135deg, #fef3c7, #fcd34d); color: #d97706; }
.stat-icon-compact.upcoming { background: linear-gradient(135deg, #dcfce7, #86efac); color: #16a34a; }
.stat-icon-compact.completed { background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #9333ea; }
.stat-icon-compact.revenue { background: linear-gradient(135deg, #fce7f3, #f9a8d4); color: #db2777; }

.stat-content-compact h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2px;
  line-height: 1;
}

.stat-content-compact p {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ==================== ENHANCED BOOKING CARDS ==================== */
.professional-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 18px;
  margin-bottom: 30px;
}

.professional-card-enhanced {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.professional-card-enhanced:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

/* Card Header Enhanced */
.card-header-enhanced {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.customer-avatar-enhanced {
  position: relative;
}

.customer-profile-photo-enhanced {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customer-profile-photo-enhanced img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.customer-initials-enhanced {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.8rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.customer-info-enhanced {
  flex: 1;
}

.customer-name-enhanced {
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.customer-meta-enhanced {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.customer-meta-enhanced i {
  width: 14px;
  margin-right: 6px;
  color: #9ca3af;
}

.booking-status-enhanced {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.status-badge-enhanced {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.status-badge-enhanced.confirmed {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  color: #1e40af;
}

.status-badge-enhanced.completed {
  background: linear-gradient(135deg, #f3f4f6, #d1d5db);
  color: #374151;
}

.status-badge-enhanced.pending {
  background: linear-gradient(135deg, #fef3c7, #fcd34d);
  color: #92400e;
}

.booking-id-enhanced {
  color: #9ca3af;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Service Details Enhanced */
.service-details-enhanced {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 14px;
  border: 1px solid #f3f4f6;
}

.service-icon-circle-enhanced {
  width: 46px;
  height: 46px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.service-info-enhanced {
  flex: 1;
}

.service-name-enhanced {
  color: #1f2937;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.service-meta-enhanced {
  display: flex;
  gap: 10px;
  align-items: center;
}

.service-category-enhanced {
  background: white;
  color: #6b7280;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #e5e7eb;
}

.service-duration-enhanced {
  color: #d97706;
  font-size: 0.8rem;
  font-weight: 600;
}

.service-amount-enhanced {
  text-align: right;
}

.amount-value-enhanced {
  color: #059669;
  font-size: 1.4rem;
  font-weight: 800;
}

/* Date & Time Enhanced */
.datetime-section-enhanced {
  display: flex;
  gap: 12px;
}

.datetime-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 600;
}

.datetime-item i {
  color: #3b82f6;
  font-size: 1rem;
}

/* Additional Info Minimal */
.additional-info-minimal {
  padding: 10px 14px;
  background: #f9fafb;
  border-radius: 10px;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.additional-info-minimal i {
  color: #9ca3af;
}

/* Action Buttons Enhanced */
.action-buttons-enhanced {
  display: flex;
  gap: 10px;
}

.action-btn-enhanced {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-btn-enhanced.complete {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.action-btn-enhanced.complete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.action-btn-enhanced.details {
  background: #f3f4f6;
  color: #374151;
}

.action-btn-enhanced.details:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.action-btn-enhanced.contact {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.action-btn-enhanced.contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* ==================== LIST VIEW ENHANCEMENTS ==================== */
.customer-avatar-list {
  margin-right: 12px;
}

.customer-profile-photo-list {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customer-profile-photo-list img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.customer-initials-list {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  margin-right: 12px;
}

.status-badge-list {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge-list.confirmed {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  color: #1e40af;
}

.status-badge-list.completed {
  background: linear-gradient(135deg, #f3f4f6, #d1d5db);
  color: #374151;
}

/* ==================== MODAL ENHANCEMENTS ==================== */
.customer-profile-photo-modal {
  width: 90px;
  height: 90px;
  border-radius: 22px;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customer-profile-photo-modal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.customer-initials-modal {
  width: 90px;
  height: 90px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 2.2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* ==================== BASE STYLES (Unchanged) ==================== */
.bookings-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.header {
  background: white;
  border-radius: 16px;
  padding: 20px 28px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.title-section .title {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.title-section .subtitle {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
}

.btn {
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.4);
}

.btn-outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
  font-weight: 600;
}

.btn-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.85rem;
}

/* Filters */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.filters-row {
  display: flex;
  gap: 14px;
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
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 46px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select {
  padding: 12px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 140px;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Timeline Filter */
.timeline-filter-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.timeline-filter-header {
  margin-bottom: 16px;
}

.timeline-filter-header h3 {
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-filter-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.timeline-filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.timeline-filter-btn {
  padding: 9px 18px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.timeline-filter-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.timeline-filter-btn.active {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.timeline-active-filter {
  padding: 14px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.active-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.active-filter-badge {
  background: white;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0369a1;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.1);
}

.clear-period-btn {
  background: #f1f5f9;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  font-size: 0.75rem;
  padding: 0;
  transition: all 0.3s ease;
}

.clear-period-btn:hover {
  background: #e2e8f0;
  color: #ef4444;
}

.filter-count {
  color: #0369a1;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 5px 10px;
  background: white;
  border-radius: 10px;
  border: 1px solid #bae6fd;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 14px;
}

.section-header h2 {
  color: #1e293b;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

.view-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.view-btn {
  padding: 7px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.view-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.view-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Table View */
.bookings-table {
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: white;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 14px 18px;
  font-weight: 700;
  color: #475569;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  padding: 14px 18px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.table-cell {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 25px;
  padding: 18px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.pagination-btn {
  padding: 7px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
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
  width: 34px;
  height: 34px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover {
  border-color: #cbd5e1;
}

.page-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 18px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #f3f4f6;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.3rem;
}

.modal-close {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 20px;
}

.customer-profile-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
  padding-bottom: 18px;
  border-bottom: 2px solid #f3f4f6;
}

.customer-name-info h3 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 1.4rem;
  font-weight: 800;
}

.customer-id-small {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.8rem;
  background: #f8fafc;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.customer-contact-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-bottom: 18px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.contact-item i {
  color: #3b82f6;
  font-size: 1rem;
  margin-top: 2px;
}

.contact-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
}

.contact-value {
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 500;
}

.customer-section,
.service-section,
.timing-section,
.status-section {
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 2px solid #f3f4f6;
}

.customer-section h4,
.service-section h4,
.timing-section h4,
.status-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.service-full-details {
  background: #f9fafb;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.service-detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 7px 0;
  padding: 7px 0;
  border-bottom: 1px solid #f3f4f6;
}

.service-detail-item:last-child {
  border-bottom: none;
}

.service-amount-highlight {
  color: #059669;
  font-weight: 700;
  font-size: 1rem;
}

.timing-details,
.status-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.timing-item,
.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}

.status-value {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-value.confirmed {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  color: #1e40af;
}

.status-value.completed {
  background: linear-gradient(135deg, #f3f4f6, #d1d5db);
  color: #374151;
}

.status-value.pending {
  background: linear-gradient(135deg, #fef3c7, #fcd34d);
  color: #92400e;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* Loading State */
.loading-container {
  min-height: 400px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  max-width: 500px;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-progress {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  width: 300px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1e40af);
  transition: width 0.3s ease;
}

/* Error State */
.error-container {
  min-height: 400px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;
  max-width: 600px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 20px;
}

.error-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

/* Success Empty State */
.success-empty-state {
  min-height: 400px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-content {
  text-align: center;
  max-width: 500px;
}

.success-icon {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 20px;
}

.success-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.professional-card-enhanced {
  animation: fadeIn 0.4s ease forwards;
}

/* Responsive */
@media (max-width: 1200px) {
  .professional-cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
}

@media (max-width: 768px) {
  .professional-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-overview-compact {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .datetime-section-enhanced {
    flex-direction: column;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-cell {
    padding: 6px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .table-cell:last-child {
    border-bottom: none;
  }
  
  .customer-profile-header {
    flex-direction: column;
    text-align: center;
    gap: 14px;
  }
  
  .service-detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
}

@media (max-width: 480px) {
  .stats-overview-compact {
    grid-template-columns: 1fr;
  }
  
  .filters-row {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .card-header-enhanced {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    text-align: center;
  }
  
  .booking-status-enhanced {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  
  .service-details-enhanced {
    flex-direction: column;
    text-align: center;
  }
  
  .action-buttons-enhanced {
    flex-direction: column;
  }
  
  .pagination {
    flex-direction: column;
    gap: 8px;
  }
}
</style>