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
          <button class="btn btn-outline" @click="showDebugInfo">
            <i class="fa-solid fa-bug"></i> Debug Info
          </button>
        </div>
        <div v-if="showDebug" class="debug-info">
          <h4>Debug Information:</h4>
          <p><strong>Provider ID Found:</strong> {{ debugProviderId || 'None' }}</p>
          <p><strong>Token Exists:</strong> {{ debugHasToken }}</p>
          <p><strong>API Endpoint:</strong> {{ debugApiEndpoint }}</p>
          <p><strong>LocalStorage Keys:</strong> {{ debugLocalStorageKeys }}</p>
          <button class="btn btn-sm" @click="copyDebugInfo">Copy Debug Info</button>
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
      <!-- Statistics Overview -->
      <div class="stats-overview">
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
          <div class="stat-icon today">
            <i class="fa-solid fa-sun"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.today }}</h3>
            <p>Today</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon upcoming">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>{{ stats.upcoming }}</h3>
            <p>Upcoming</p>
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
            <i class="fa-solid fa-money-bill"></i>
          </div>
          <div class="stat-content">
            <h3>ETB {{ stats.revenue }}</h3>
            <p>Revenue</p>
          </div>
        </div>
      </div>
      <!-- API Status -->
      <div class="api-status success" v-if="bookings.length > 0">
        <i class="fa-solid fa-circle-check"></i>
        <span>Connected • {{ bookings.length }} bookings loaded • Last updated: {{ lastUpdatedTime }}</span>
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
      <!-- Timeline Filter Section -->
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
        <!-- AMAZING PROFESSIONAL BOOKING CARDS -->
        <div v-if="viewMode === 'grid'" class="professional-cards-grid">
          <div 
            v-for="booking in paginatedBookings" 
            :key="booking._id"
            class="professional-card"
            :class="{
              'today-card': isTodayBooking(booking),
              'admin-card': booking.isAdminBooking,
              'completed-card': booking.status === 'completed',
              'past-card': isPastBooking(booking)
            }"
          >
            <!-- Card Header with Customer Info -->
            <div class="card-header-section">
              <div class="customer-avatar-section">
                <!-- Display Customer Profile Photo or Initials -->
                <div v-if="booking.customerProfilePhoto && booking.customerProfilePhoto.trim() !== ''" class="customer-profile-photo">
                  <img 
                    :src="booking.customerProfilePhoto" 
                    :alt="booking.customerName || 'Customer'"
                    @error="handleImageError"
                  />
                </div>
                <div v-else class="customer-initials-large">
                  {{ getCleanInitials(getCustomerDisplayName(booking)) }}
                </div>
                <div class="customer-type-indicator" :class="{ 'admin': booking.isAdminBooking }">
                  {{ booking.isAdminBooking ? 'Admin' : 'Client' }}
                </div>
              </div>
              <div class="customer-info-section">
                <!-- Display Customer's Real Name (Not ID) -->
                <h4 class="customer-name">{{ getCustomerDisplayName(booking) }}</h4>
                <p class="customer-meta">
                  <span v-if="booking.customerEmail">
                    <i class="fa-solid fa-envelope"></i> {{ booking.customerEmail }}
                  </span>
                  <span v-if="booking.customerPhone">
                    <i class="fa-solid fa-phone"></i> {{ booking.customerPhone }}
                  </span>
                </p>
              </div>
              <div class="booking-status-section">
                <!-- Don't show status for past bookings -->
                <div v-if="!isPastBooking(booking)" class="status-badge" :class="booking.status">
                  {{ formatStatus(booking.status) }}
                </div>
                <div v-else class="past-badge">
                  Past Booking
                </div>
                <div class="booking-id">
                  #{{ booking._id.substring(0, 6) }}
                </div>
              </div>
            </div>
            <!-- Service Details - ENHANCED -->
            <div class="service-details-section">
              <div class="service-icon-circle">
                <i class="fa-solid" :class="getServiceIcon(booking.serviceCategory)"></i>
              </div>
              <div class="service-info">
                <h5 class="service-name">{{ formatServiceName(booking.serviceName) }}</h5>
                <div class="service-meta">
                  <span class="service-category">{{ booking.serviceCategory }}</span>
                  <span v-if="booking.serviceSubcategory" class="service-subcategory">{{ booking.serviceSubcategory }}</span>
                  <span class="service-duration">{{ calculateDuration(booking.startTime, booking.endTime) }} min</span>
                </div>
                <!-- Service ID Display -->
                <div v-if="booking.serviceId" class="service-id-small">
                  <i class="fa-solid fa-hashtag"></i>
                  ID: {{ booking.serviceId.substring(0, 8) }}
                </div>
              </div>
              <div class="service-amount">
                <span class="amount-label">Price</span>
                <span class="amount-value">ETB {{ booking.actualPrice || booking.servicePrice || booking.amount }}</span>
              </div>
            </div>
            <!-- Date & Time Section -->
            <div class="datetime-section">
              <div class="date-time-card">
                <div class="date-section">
                  <div class="date-icon">
                    <i class="fa-solid fa-calendar-days"></i>
                  </div>
                  <div class="date-content">
                    <div class="date-label">Service Date</div>
                    <div class="date-value">{{ formatCleanDate(booking.bookingDate) }}</div>
                  </div>
                </div>
                <div class="time-section">
                  <div class="time-icon">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div class="time-content">
                    <div class="time-label">Time Slot</div>
                    <div class="time-value">{{ formatTimeSlot(booking.startTime, booking.endTime) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Additional Info -->
            <div class="additional-info-section">
              <div class="info-item">
                <i class="fa-solid fa-calendar-plus"></i>
                <span>Booked {{ formatRelativeTime(booking.createdAt) }}</span>
              </div>
              <div class="info-item">
                <i class="fa-solid fa-user-clock"></i>
                <span>{{ getTimeUntilBooking(booking.bookingDate) }}</span>
              </div>
            </div>
            <!-- Action Buttons -->
            <div class="action-buttons-section">
              <button 
                v-if="!isPastBooking(booking) && booking.status === 'confirmed'"
                class="action-btn mark-complete-btn"
                @click="completeBooking(booking)"
              >
                <i class="fa-solid fa-check-circle"></i>
                Mark Complete
              </button>
              <button 
                class="action-btn view-details-btn"
                @click="viewBookingDetailsModal(booking)"
              >
                <i class="fa-solid fa-eye"></i>
                User Details
              </button>
              <button 
                class="action-btn contact-btn"
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
                <!-- Customer with Profile Photo -->
                <div class="customer-avatar">
                  <div v-if="booking.customerProfilePhoto && booking.customerProfilePhoto.trim() !== ''" class="customer-profile-photo-small">
                    <img 
                      :src="booking.customerProfilePhoto" 
                      :alt="booking.customerName || 'Customer'"
                      @error="handleImageError"
                    />
                  </div>
                  <div v-else class="customer-initials-small">
                    {{ getCleanInitials(getCustomerDisplayName(booking)) }}
                  </div>
                </div>
                <div class="customer-info">
                  <div class="customer-main">
                    <strong>{{ getCustomerDisplayName(booking) }}</strong>
                    <span v-if="booking.isAdminBooking" class="type-badge admin">
                      Admin
                    </span>
                    <span v-else class="type-badge client">
                      Client
                    </span>
                  </div>
                  <div class="customer-details">
                    <span class="customer-email">{{ booking.customerEmail }}</span>
                    <span class="customer-phone">{{ booking.customerPhone }}</span>
                  </div>
                </div>
              </div>
              <div class="table-cell service-cell">
                <strong>{{ formatServiceName(booking.serviceName) }}</strong>
                <div class="service-meta-row">
                  <span class="service-category">{{ booking.serviceCategory }}</span>
                  <span v-if="booking.serviceSubcategory" class="service-subcategory">{{ booking.serviceSubcategory }}</span>
                  <span class="service-price">ETB {{ booking.actualPrice || booking.servicePrice || booking.amount }}</span>
                </div>
                <div v-if="booking.serviceId" class="service-id-tiny">
                  ID: {{ booking.serviceId.substring(0, 6) }}
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
                <!-- Don't show status for past bookings -->
                <span v-if="!isPastBooking(booking)" class="status-badge" :class="booking.status">
                  {{ formatStatus(booking.status) }}
                </span>
                <span v-else class="past-badge">
                  Past Booking
                </span>
              </div>
              <div class="table-cell amount-cell">
                <div class="amount-container">
                  <i class="fa-solid fa-money-bill"></i>
                  <strong>ETB {{ booking.actualPrice || booking.servicePrice || booking.amount }}</strong>
                </div>
              </div>
              <div class="table-cell actions-cell">
                <div class="action-buttons">
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
                  <button 
                    class="btn-action contact"
                    v-if="!booking.isAdminBooking && booking.customerEmail"
                    @click="contactCustomer(booking)"
                    title="Contact Customer"
                  >
                    <i class="fa-solid fa-message"></i>
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
            <!-- Customer Information Section -->
            <div class="customer-section">
              <h4>
                <i class="fa-solid fa-user"></i>
                Customer Information
                <span v-if="loadingCustomerDetails" class="loading-indicator">
                  <i class="fa-solid fa-spinner fa-spin"></i> Loading...
                </span>
                <span v-if="customerDetailsError" class="error-indicator">
                  <i class="fa-solid fa-exclamation-triangle"></i> {{ customerDetailsError }}
                </span>
              </h4>
              <!-- Display customer details if available -->
              <div v-if="customerDetails && customerDetails.cid" class="customer-full-details">
                <!-- Profile Picture and Name Section -->
                <div class="customer-profile-header">
                  <div v-if="customerDetails.profilePicture && customerDetails.profilePicture.trim() !== ''" class="customer-profile-photo-large">
                    <img 
                      :src="customerDetails.profilePicture" 
                      :alt="customerDetails.fullname" 
                      @error="handleImageError"
                    />
                  </div>
                  <div v-else class="customer-initials-large">
                    {{ getCleanInitials(customerDetails.fullname) }}
                  </div>
                  <div class="customer-name-info">
                    <h3>{{ customerDetails.fullname }}</h3>
                    <div class="customer-id-small">
                      <i class="fa-solid fa-id-card"></i>
                      <span>ID: {{ customerDetails.cid }}</span>
                    </div>
                  </div>
                </div>
                <!-- Contact Information -->
                <div class="customer-contact-info">
                  <div class="contact-item" v-if="customerDetails.email">
                    <i class="fa-solid fa-envelope"></i>
                    <div>
                      <div class="contact-label">Email</div>
                      <div class="contact-value">{{ customerDetails.email }}</div>
                    </div>
                  </div>
                  <div class="contact-item" v-if="customerDetails.phone">
                    <i class="fa-solid fa-phone"></i>
                    <div>
                      <div class="contact-label">Phone</div>
                      <div class="contact-value">{{ customerDetails.phone }}</div>
                    </div>
                  </div>
                  <div class="contact-item" v-if="customerDetails.address">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                      <div class="contact-label">Address</div>
                      <div class="contact-value">{{ customerDetails.address }}</div>
                    </div>
                  </div>
                  <div class="contact-item" v-if="customerDetails.status">
                    <i class="fa-solid fa-circle-check"></i>
                    <div>
                      <div class="contact-label">Status</div>
                      <div class="contact-value status-active">{{ customerDetails.status }}</div>
                    </div>
                  </div>
                </div>
                <!-- Source Info -->
                <div v-if="customerDetails.note" class="info-note">
                  <i class="fa-solid fa-info-circle"></i> {{ customerDetails.note }}
                </div>
              </div>
              <!-- Show loading state -->
              <div v-else-if="loadingCustomerDetails" class="loading-state">
                <p><i class="fa-solid fa-spinner fa-spin"></i> Loading customer details...</p>
                <div class="loading-bar"></div>
              </div>
              <!-- Fallback to booking data -->
              <div v-else class="customer-basic-details">
                <div class="customer-profile-header">
                  <div v-if="selectedBooking.customerProfilePhoto && selectedBooking.customerProfilePhoto.trim() !== ''" class="customer-profile-photo-large">
                    <img 
                      :src="selectedBooking.customerProfilePhoto" 
                      :alt="getCustomerDisplayName(selectedBooking)"
                      @error="handleImageError"
                    />
                  </div>
                  <div v-else class="customer-initials-large">
                    {{ getCleanInitials(getCustomerDisplayName(selectedBooking)) }}
                  </div>
                  <div class="customer-name-info">
                    <h3>{{ getCustomerDisplayName(selectedBooking) }}</h3>
                    <div v-if="selectedBooking.customerId && selectedBooking.customerId !== 'unknown'" class="customer-id-small">
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
                <p class="info-note">
                  <i class="fa-solid fa-info-circle"></i> 
                  Detailed customer information not available
                </p>
              </div>
            </div>
            <!-- Enhanced Service Details Section -->
            <div class="service-section">
              <h4>
                <i class="fa-solid fa-scissors"></i>
                Service Details
              </h4>
              <div class="service-full-details">
                <div class="service-detail-item">
                  <strong>Service:</strong>
                  <span>{{ selectedBooking.serviceName }}</span>
                </div>
                <div class="service-detail-item" v-if="selectedBooking.serviceCategory">
                  <strong>Category:</strong>
                  <span>{{ selectedBooking.serviceCategory }}</span>
                </div>
                <div class="service-detail-item" v-if="selectedBooking.serviceSubcategory">
                  <strong>Subcategory:</strong>
                  <span>{{ selectedBooking.serviceSubcategory }}</span>
                </div>
                <div class="service-detail-item">
                  <strong>Amount:</strong>
                  <span class="service-amount-highlight">ETB {{ selectedBooking.actualPrice || selectedBooking.servicePrice || selectedBooking.amount }}</span>
                </div>
                <div class="service-detail-item" v-if="selectedBooking.serviceId">
                  <strong>Service ID:</strong>
                  <span class="service-id-badge">{{ selectedBooking.serviceId }}</span>
                </div>
              </div>
            </div>
            <!-- Timing Section -->
            <div class="timing-section">
              <h4>
                <i class="fa-solid fa-clock"></i>
                Timing
              </h4>
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
            <!-- Status Section -->
            <div class="status-section">
              <h4>
                <i class="fa-solid fa-info-circle"></i>
                Status
              </h4>
              <div class="status-details">
                <div class="status-item">
                  <strong>Current Status:</strong>
                  <span v-if="!isPastBooking(selectedBooking)" class="status-value" :class="selectedBooking.status">
                    {{ formatStatus(selectedBooking.status) }}
                  </span>
                  <span v-else class="status-value past">Past Booking</span>
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
    const showDebug = ref(false);
    const lastUpdatedTime = ref("");
    // Service details cache
    const serviceDetailsCache = ref({});
    const servicesMap = ref({});
    // Customer details state
    const customerDetails = ref(null);
    const loadingCustomerDetails = ref(false);
    const customerDetailsError = ref("");
    // Debug info
    const debugProviderId = ref("");
    const debugHasToken = ref(false);
    const debugApiEndpoint = ref("");
    const debugLocalStorageKeys = ref("");
    // Timeline periods
    const timelinePeriods = ref([
      { id: "all", label: "All Bookings", icon: "fa-solid fa-calendar" },
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
    // ==================== ENHANCED SERVICE HELPER FUNCTIONS ====================
    const getServiceIcon = (category) => {
      const icons = {
        'General': 'fa-scissors',
        'Beauty Services': 'fa-spa',
        'Beauty': 'fa-spa',
        'Health': 'fa-heart-pulse',
        'Fitness': 'fa-dumbbell',
        'Education': 'fa-graduation-cap',
        'Home Services': 'fa-home',
        'Automotive': 'fa-car',
        'Technology': 'fa-laptop-code',
        'Business': 'fa-briefcase',
        'Repair': 'fa-tools',
        'Cleaning': 'fa-broom',
        'Consultation': 'fa-comments',
        'Wellness': 'fa-heart',
        'Design': 'fa-paint-brush'
      };
      return icons[category] || 'fa-scissors';
    };
    // ==================== ENHANCED FETCH ALL SERVICES FOR PROVIDER ====================
    const fetchAllServices = async (providerId) => {
      if (!providerId) {
        console.warn("❌ No provider ID for fetching services");
        return;
      }
      console.log("🛠️ Fetching all services for provider:", providerId);
      try {
        // Clear cache before fetching new services
        servicesMap.value = {};
        serviceDetailsCache.value = {};
        // First try the main services endpoint
        try {
          const response = await http.get(`/services?provider=${providerId}`);
          if (response.data) {
            let servicesArray = [];
            if (Array.isArray(response.data)) {
              servicesArray = response.data;
            } else if (response.data.services && Array.isArray(response.data.services)) {
              servicesArray = response.data.services;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              servicesArray = response.data.data;
            }
            console.log(`📊 Found ${servicesArray.length} services`);
            // Create comprehensive services map
            servicesArray.forEach(service => {
              try {
                const serviceId = service.serviceId || service._id || service.id;
                if (serviceId) {
                  // Extract all service details
                  const serviceDetails = {
                    id: serviceId,
                    serviceId: serviceId,
                    title: service.title || service.name || service.serviceName || 'Service',
                    name: service.title || service.name || service.serviceName || 'Service',
                    category: service.categoryName || service.category || service.serviceCategory || 'General',
                    categoryName: service.categoryName || service.category || service.serviceCategory || 'General',
                    subcategory: service.subcategory || service.serviceSubcategory || '',
                    subcategoryName: service.subcategory || service.serviceSubcategory || '',
                    price: service.price || service.bookingPrice || service.totalPrice || service.amount || service.servicePrice || 0,
                    bookingPrice: service.bookingPrice || service.totalPrice || service.price || service.amount || service.servicePrice || 0,
                    description: service.description || '',
                    status: service.status || 'published',
                    serviceType: service.serviceType || 'fixed',
                    duration: service.duration || 60, // Default 60 minutes
                    banner: service.banner || '',
                    provider: service.provider || {}
                  };
                  // Store in map with multiple keys for easy lookup
                  servicesMap.value[serviceId] = serviceDetails;
                  serviceDetailsCache.value[serviceId] = serviceDetails;
                  console.log(`✅ Cached service ${serviceId}:`, {
                    name: serviceDetails.name,
                    category: serviceDetails.category,
                    subcategory: serviceDetails.subcategory,
                    price: serviceDetails.price
                  });
                }
              } catch (err) {
                console.error(`❌ Error processing service:`, err, service);
              }
            });
            console.log(`✅ Loaded ${Object.keys(servicesMap.value).length} services into cache`);
            return;
          }
        } catch (mainError) {
          console.log("❌ Main services endpoint failed, trying alternatives...");
        }
        // Fallback to alternative endpoints if needed
        const fallbackEndpoints = [
          `/services/provider/${providerId}`,
          `/provider/services/${providerId}`,
          `/api/services?providerId=${providerId}`
        ];
        for (const endpoint of fallbackEndpoints) {
          try {
            console.log(`📡 Trying services endpoint: ${endpoint}`);
            const response = await http.get(endpoint);
            if (response.data) {
              let servicesArray = [];
              if (Array.isArray(response.data)) {
                servicesArray = response.data;
              } else if (response.data.services && Array.isArray(response.data.services)) {
                servicesArray = response.data.services;
              } else if (response.data.data && Array.isArray(response.data.data)) {
                servicesArray = response.data.data;
              }
              console.log(`📊 Found ${servicesArray.length} services from ${endpoint}`);
              servicesArray.forEach(service => {
                try {
                  const serviceId = service.serviceId || service._id || service.id;
                  if (serviceId) {
                    const serviceDetails = {
                      id: serviceId,
                      serviceId: serviceId,
                      title: service.title || service.name || service.serviceName || 'Service',
                      name: service.title || service.name || service.serviceName || 'Service',
                      category: service.categoryName || service.category || service.serviceCategory || 'General',
                      categoryName: service.categoryName || service.category || service.serviceCategory || 'General',
                      subcategory: service.subcategory || service.serviceSubcategory || '',
                      subcategoryName: service.subcategory || service.serviceSubcategory || '',
                      price: service.price || service.bookingPrice || service.totalPrice || service.amount || service.servicePrice || 0,
                      description: service.description || '',
                      status: service.status || 'published'
                    };
                    servicesMap.value[serviceId] = serviceDetails;
                    serviceDetailsCache.value[serviceId] = serviceDetails;
                  }
                } catch (err) {
                  console.error(`❌ Error processing service:`, err);
                }
              });
              console.log(`✅ Loaded ${Object.keys(servicesMap.value).length} services from fallback`);
              break;
            }
          } catch (endpointError) {
            console.log(`❌ Endpoint ${endpoint} failed:`, endpointError.message);
          }
        }
      } catch (err) {
        console.error("❌ Error in fetchAllServices:", err);
      }
    };
    // ==================== ENHANCED CUSTOMER DETAILS FETCH ====================
    const fetchCustomerDetails = async (booking) => {
      console.log("👤 Fetching customer details for booking:", booking._id);
      loadingCustomerDetails.value = true;
      customerDetailsError.value = "";
      customerDetails.value = null;
      try {
        const fullCID = booking.customerId || 'unknown';
        console.log("🎯 Customer ID:", fullCID);
        // ==================== STEP 1: CHECK FOR EMBEDDED DATA ====================
        if (booking.originalData?.customer) {
          const customer = booking.originalData.customer;
          console.log("✅ Found customer in originalData:", customer);
          const customerProfile = customer.customerProfile || customer;
          const profilePhoto = customerProfile.profilePhoto || 
                              customerProfile.profilephoto || 
                              customer.profilePicture || 
                              customer.avatar ||
                              customer.profileImage ||
                              customer.image;
          customerDetails.value = {
            role: 'customer',
            isCustomer: true,
            bookerType: booking.isAdminBooking ? 'Admin' : 'Customer',
            cid: customer.cid || customer._id || fullCID,
            id: customer._id || customer.id || fullCID,
            fullname: customerProfile.fullname || 
                     customer.fullname || 
                     customer.name || 
                     booking.customerName || 
                     'Customer',
            email: customer.email || booking.customerEmail || '',
            phone: customerProfile.phonenumber || 
                  customer.phone || 
                  customer.phonenumber || 
                  customer.mobile || 
                  booking.customerPhone || '',
            address: customerProfile.address || 
                    customer.address || 
                    customer.location || 
                    customer.city || '',
            profilePicture: profilePhoto,
            username: customer.username || '',
            status: customerProfile.status || customer.status || 'active',
            source: 'booking.originalData.customer',
            hasContactInfo: !!(customer.email || customerProfile.phonenumber || customer.phone),
            note: booking.isAdminBooking ? 'Admin booking' : 'Customer booking'
          };
          console.log("✅ Set customer details from original data");
          return;
        }
        // ==================== STEP 2: CHECK IF ADMIN BOOKING ====================
        if (booking.isAdminBooking) {
          const admin = booking.adminDetails || booking.originalData?.adminDetails || {};
          customerDetails.value = {
            role: 'admin',
            isCustomer: false,
            bookerType: 'Admin',
            cid: admin.adminId || admin._id || fullCID,
            id: admin._id || admin.id || fullCID,
            fullname: admin.fullname || admin.name || 'Admin',
            email: admin.email || booking.customerEmail || '',
            phone: admin.phone || admin.phonenumber || booking.customerPhone || '',
            address: admin.address || '',
            profilePicture: admin.profilePicture || admin.avatar || '',
            username: admin.username || '',
            status: 'active',
            source: 'Admin booking',
            hasContactInfo: !!(admin.email || admin.phone),
            note: 'Admin created this booking'
          };
          console.log("✅ Set admin details");
          return;
        }
        // ==================== STEP 3: FETCH FROM CUSTOMER API ====================
        if (fullCID && fullCID.startsWith('CUST-') && fullCID !== 'unknown') {
          console.log(`🔍 Fetching customer with CID: ${fullCID}`);
          // Try without /api prefix first (correct endpoint)
          const endpoint = `/users/customers/by-cid/${fullCID}`;
          console.log("📡 Calling endpoint:", endpoint);
          try {
            const response = await http.get(endpoint);
            if (response.data) {
              const user = response.data;
              console.log("✅ Customer API response:", user);
              const customerProfile = user.customerProfile || user;
              const profilePhoto = customerProfile.profilePhoto || 
                                  customerProfile.profilephoto || 
                                  user.profilePicture || 
                                  user.avatar ||
                                  user.profileImage;
              customerDetails.value = {
                role: 'customer',
                isCustomer: true,
                bookerType: 'Customer',
                cid: user.cid || fullCID,
                id: user._id || user.id || fullCID,
                fullname: customerProfile.fullname || 
                         user.fullname || 
                         user.name || 
                         user.username || 
                         booking.customerName || 
                         'Customer',
                email: user.email || booking.customerEmail || '',
                phone: customerProfile.phonenumber || 
                      user.phone || 
                      user.phonenumber || 
                      user.mobile || 
                      booking.customerPhone || '',
                address: customerProfile.address || 
                        user.address || 
                        user.location || 
                        user.city || '',
                profilePicture: profilePhoto,
                username: user.username || '',
                status: customerProfile.status || user.status || 'active',
                customerProfile: customerProfile,
                source: '/users/customers/by-cid/ endpoint',
                hasContactInfo: !!(user.email || customerProfile.phonenumber || user.phone),
                note: 'Customer profile fetched successfully'
              };
              console.log("📋 Extracted customer details:", {
                fullname: customerDetails.value.fullname,
                email: customerDetails.value.email,
                phone: customerDetails.value.phone,
                profilePicture: customerDetails.value.profilePicture
              });
              return;
            }
          } catch (error) {
            console.error("❌ Customer API failed:", error.message);
            // Try with /api prefix if first one fails
            try {
              console.log("🔄 Trying endpoint with /api prefix...");
              const altEndpoint = `/api/users/customers/by-cid/${fullCID}`;
              const altResponse = await http.get(altEndpoint);
              if (altResponse.data) {
                const user = altResponse.data;
                const customerProfile = user.customerProfile || user;
                const profilePhoto = customerProfile.profilePhoto || 
                                    customerProfile.profilephoto || 
                                    user.profilePicture || 
                                    user.avatar;
                customerDetails.value = {
                  role: 'customer',
                  isCustomer: true,
                  bookerType: 'Customer',
                  cid: user.cid || fullCID,
                  id: user._id || user.id || fullCID,
                  fullname: customerProfile.fullname || 
                           user.fullname || 
                           booking.customerName || 
                           'Customer',
                  email: user.email || booking.customerEmail || '',
                  phone: customerProfile.phonenumber || 
                        user.phone || 
                        booking.customerPhone || '',
                  address: customerProfile.address || user.address || '',
                  profilePicture: profilePhoto,
                  status: customerProfile.status || user.status || 'active',
                  customerProfile: customerProfile,
                  source: '/api/users/customers/by-cid/ endpoint',
                  hasContactInfo: !!(user.email || customerProfile.phonenumber),
                  note: 'Customer fetched successfully'
                };
                return;
              }
            } catch (altError) {
              console.log("❌ Alternative endpoint also failed:", altError.message);
            }
          }
        }
        // ==================== STEP 4: FALLBACK TO BOOKING DATA ====================
        console.log("📊 Using booking data as fallback");
        let cleanName = getCustomerDisplayName(booking);
        const hasContactInfo = !!(booking.customerEmail || booking.customerPhone);
        // Try to get profile photo from customer object if available
        let profilePicture = '';
        if (booking.customerObject) {
          const customer = booking.customerObject;
          profilePicture = customer.profilePhoto || 
                          customer.profilepicture || 
                          customer.avatar || 
                          customer.profileImage ||
                          '';
        }
        customerDetails.value = {
          role: 'customer',
          isCustomer: true,
          bookerType: booking.isAdminBooking ? 'Admin' : 'Customer',
          cid: fullCID,
          id: fullCID,
          fullname: cleanName,
          email: booking.customerEmail || '',
          phone: booking.customerPhone || '',
          address: '',
          profilePicture: profilePicture || booking.customerProfilePhoto || '',
          source: 'Booking data',
          hasContactInfo: hasContactInfo,
          note: booking.isAdminBooking ? 'Admin booking' : `Customer ID: ${fullCID}`
        };
        console.log("✅ Set fallback customer details");
      } catch (err) {
        console.error("❌ Error in fetchCustomerDetails:", err);
        customerDetailsError.value = `Error: ${err.message}`;
        customerDetails.value = {
          role: booking.isAdminBooking ? 'admin' : 'customer',
          bookerType: booking.isAdminBooking ? 'Admin' : 'Customer',
          fullname: booking.customerName || (booking.isAdminBooking ? 'Admin' : 'Customer'),
          email: booking.customerEmail || '',
          phone: booking.customerPhone || '',
          cid: booking.customerId || 'unknown',
          profilePicture: booking.customerProfilePhoto || '',
          source: 'Error',
          warning: 'Failed to fetch customer details'
        };
      } finally {
        loadingCustomerDetails.value = false;
      }
    };
    // ==================== ENHANCED HELPER FUNCTIONS ====================
    const getCustomerDisplayName = (booking) => {
      console.log("🔍 Getting display name for booking:", booking._id);
      console.log("📊 Booking data:", {
        customerName: booking.customerName,
        isAdminBooking: booking.isAdminBooking,
        customerObject: booking.customerObject,
        originalData: booking.originalData?.customer
      });
      
      // If booking has customerName, use it directly
      if (booking.customerName && 
          booking.customerName.trim() !== '' && 
          booking.customerName.trim() !== 'Customer' &&
          booking.customerName.trim() !== 'undefined') {
        console.log("✅ Using booking.customerName:", booking.customerName);
        return booking.customerName.trim();
      }
      
      // Check original data for customer name
      if (booking.originalData?.customer?.fullname) {
        console.log("✅ Using originalData.customer.fullname:", booking.originalData.customer.fullname);
        return booking.originalData.customer.fullname.trim();
      }
      
      if (booking.originalData?.customer?.name) {
        console.log("✅ Using originalData.customer.name:", booking.originalData.customer.name);
        return booking.originalData.customer.name.trim();
      }
      
      // Check customer object
      if (booking.customerObject?.fullname) {
        console.log("✅ Using customerObject.fullname:", booking.customerObject.fullname);
        return booking.customerObject.fullname.trim();
      }
      
      if (booking.customerObject?.name) {
        console.log("✅ Using customerObject.name:", booking.customerObject.name);
        return booking.customerObject.name.trim();
      }
      
      // For admin bookings
      if (booking.isAdminBooking) {
        console.log("✅ Admin booking detected");
        return 'Admin';
      }
      
      // Check for CUST- ID to indicate it's a real customer
      if (booking.customerId && booking.customerId.startsWith('CUST-')) {
        console.log("✅ Customer ID detected:", booking.customerId);
        return 'Customer';
      }
      
      // Fallback
      console.log("⚠️ Using fallback 'Customer'");
      return 'Customer';
    };
    
    const formatCustomerName = (name) => {
      return getCustomerDisplayName({ customerName: name });
    };
    
    const getCleanInitials = (name) => {
      const cleanName = formatCustomerName(name);
      if (!cleanName) return 'C';
      const words = cleanName.split(' ');
      if (words.length === 1 && words[0] === 'Customer') {
        return 'C';
      }
      if (words.length === 1 && words[0] === 'Admin') {
        return 'A';
      }
      return words.map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };
    
    // ==================== TIME FORMAT CONVERSION ====================
    const convertTo12HourFormat = (time24) => {
      if (!time24) return '';
      try {
        let [hours, minutes] = time24.split(':');
        hours = parseInt(hours, 10);
        minutes = minutes ? parseInt(minutes, 10) : 0;
        if (isNaN(hours) || isNaN(minutes)) return time24;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours12}:${minutesStr} ${ampm}`;
      } catch (err) {
        console.error("Error converting time:", err, time24);
        return time24;
      }
    };
    
    const formatTimeSlot = (startTime, endTime) => {
      if (!startTime || !endTime) return 'No time';
      const formattedStart = convertTo12HourFormat(startTime);
      const formattedEnd = convertTo12HourFormat(endTime);
      return `${formattedStart} - ${formattedEnd}`;
    };
    
    // ==================== DATE HELPER FUNCTIONS ====================
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
        console.error("Error checking past booking:", err);
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
        console.error("Error checking today booking:", err);
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
        console.error("Error checking tomorrow booking:", err);
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
        console.error("Error checking next 5 days booking:", err);
        return false;
      }
    };
    
    // Helper function for date formatting
    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });
      } catch (err) {
        console.error("Error formatting date:", err);
        return '';
      }
    };
    
    // Handle image loading errors
    const handleImageError = (event) => {
      console.log("Image failed to load, hiding...");
      event.target.style.display = 'none';
      // Show initials instead
      const parent = event.target.parentElement;
      const bookingId = parent.closest('.professional-card')?.querySelector('.booking-id')?.textContent || '';
      const initials = parent.getAttribute('data-initials') || 'C';
      parent.innerHTML = `<div class="fallback-initials">${initials}</div>`;
    };
    
    // ==================== GET PROVIDER ID ====================
    const getProviderId = () => {
      console.log("🔍 Getting provider ID for bookings...");
      const possibleSources = [
        () => {
          const providerId = localStorage.getItem('providerId');
          console.log("🔍 Checking localStorage.providerId:", providerId);
          return providerId;
        },
        () => {
          const loggedProvider = localStorage.getItem('loggedProvider');
          if (loggedProvider) {
            try {
              const parsed = JSON.parse(loggedProvider);
              console.log("🔍 Checking loggedProvider:", parsed);
              return parsed.pid || parsed.providerId || parsed._id || parsed.id;
            } catch (e) {
              console.warn("❌ Failed to parse loggedProvider:", e);
            }
          }
          return null;
        },
        () => {
          const providerProfile = localStorage.getItem('providerProfile');
          if (providerProfile) {
            try {
              const parsed = JSON.parse(providerProfile);
              console.log("🔍 Checking providerProfile:", parsed);
              return parsed.pid || parsed._id || parsed.id;
            } catch (e) {
              console.warn("❌ Failed to parse providerProfile:", e);
            }
          }
          return null;
        }
      ];
      for (const source of possibleSources) {
        const providerId = source();
        if (providerId) {
          console.log("✅ Found provider ID:", providerId);
          debugProviderId.value = providerId;
          return providerId;
        }
      }
      console.warn("❌ No provider ID found locally");
      return null;
    };
    
    // ==================== ENHANCED PROCESS SINGLE BOOKING ====================
    const processSingleBooking = async (booking) => {
      try {
        const isAdminBooking = booking.createdBy === 'admin' || booking.adminId || booking.isAdminBooking;
        
        // ✅ ENHANCED: Get customer from multiple possible locations
        const customer = booking.customer || 
                        booking.originalData?.customer || 
                        booking.customerDetails || 
                        booking.booker || 
                        booking.user || 
                        {};
        
        // Get customer ID
        let customerId = customer.cid || 
                        customer._id || 
                        booking.customerId || 
                        booking.cid ||
                        'unknown';
        
        // ✅ ENHANCED PROFILE PHOTO EXTRACTION - Check more locations
        let customerProfilePhoto = '';
        
        // Check customer object first
        if (customer.profilePhoto) {
          customerProfilePhoto = customer.profilePhoto;
        } else if (customer.customerProfile?.profilePhoto) {
          customerProfilePhoto = customer.customerProfile.profilePhoto;
        } else if (customer.profilePicture) {
          customerProfilePhoto = customer.profilePicture;
        } else if (customer.avatar) {
          customerProfilePhoto = customer.avatar;
        } else if (customer.profileImage) {
          customerProfilePhoto = customer.profileImage;
        } else if (customer.image) {
          customerProfilePhoto = customer.image;
        } else if (customer.photo) {
          customerProfilePhoto = customer.photo;
        }
        
        // Check booking object if not found in customer
        if (!customerProfilePhoto && booking.customerProfilePhoto) {
          customerProfilePhoto = booking.customerProfilePhoto;
        }
        
        // Check booking originalData
        if (!customerProfilePhoto && booking.originalData?.customerProfilePhoto) {
          customerProfilePhoto = booking.originalData.customerProfilePhoto;
        }
        
        // ✅ ENHANCED CUSTOMER NAME EXTRACTION
        let customerName = '';
        
        if (isAdminBooking) {
            const admin = booking.adminDetails || {};
            customerName = admin.fullname || 
                          admin.name || 
                          admin.username || 
                          booking.customerName || 
                          'Admin Booking';
        } else {
            // Try multiple sources for customer name
            customerName = customer.fullname || 
                          customer.name || 
                          customer.username ||
                          booking.customerName || 
                          booking.name ||
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
        
        // ✅ ENHANCED: Get customer email & phone with more fallbacks
        let customerEmail = '';
        let customerPhone = '';
        
        if (isAdminBooking) {
          const admin = booking.adminDetails || {};
          customerEmail = admin.email || 
                         booking.adminEmail || 
                         booking.customerEmail || 
                         '';
          customerPhone = admin.phone || 
                         admin.phonenumber || 
                         booking.adminPhone || 
                         booking.customerPhone || 
                         '';
        } else {
          customerEmail = customer.email || 
                         customer.emailAddress || 
                         booking.customerEmail || 
                         '';
          customerPhone = customer.phone || 
                         customer.phonenumber || 
                         customer.phoneNumber || 
                         customer.mobile || 
                         booking.customerPhone || 
                         '';
        }
        
        // ==================== ENHANCED SERVICE ENRICHMENT ====================
        // Get service ID from booking
        const serviceId = booking.serviceId || 
                         booking.service?._id || 
                         booking.service?.serviceId || 
                         'unknown';
        let serviceName = 'Service';
        let serviceCategory = 'General';
        let serviceSubcategory = '';
        let serviceCategoryName = 'General';
        let serviceSubcategoryName = '';
        let actualPrice = 0;
        let serviceDescription = '';
        let serviceDuration = 60; // Default 60 minutes
        
        // ENRICH SERVICE DETAILS FROM SERVICES MAP
        if (serviceId && serviceId !== 'unknown') {
          const serviceDetails = servicesMap.value[serviceId];
          if (serviceDetails) {
            // Found in cache - use enriched details
            console.log(`✅ Found enriched service details for ${serviceId}:`, serviceDetails);
            serviceName = serviceDetails.title || serviceDetails.name || booking.serviceName || 'Service';
            serviceCategory = serviceDetails.category || serviceDetails.categoryName || booking.serviceCategory || 'General';
            serviceCategoryName = serviceDetails.categoryName || serviceDetails.category || booking.serviceCategory || 'General';
            serviceSubcategory = serviceDetails.subcategory || serviceDetails.subcategoryName || booking.serviceSubcategory || '';
            serviceSubcategoryName = serviceDetails.subcategoryName || serviceDetails.subcategory || booking.serviceSubcategory || '';
            // USE CORRECT PRICE FROM SERVICE DETAILS
            actualPrice = serviceDetails.price || serviceDetails.bookingPrice || booking.serviceCost || booking.amount || 0;
            serviceDescription = serviceDetails.description || '';
            serviceDuration = serviceDetails.duration || 60;
          } else {
            // Not in cache - use booking data
            console.log(`⚠️ Service ${serviceId} not found in cache, using booking data`);
            const service = booking.service || {};
            serviceName = service.title || service.name || booking.serviceName || 'Service';
            serviceCategory = service.categoryName || service.category || booking.serviceCategory || 'General';
            serviceCategoryName = service.categoryName || service.category || booking.serviceCategory || 'General';
            serviceSubcategory = service.subcategory || booking.serviceSubcategory || '';
            // USE CORRECT PRICE FROM BOOKING
            actualPrice = service.bookingPrice || service.totalPrice || service.price || booking.serviceCost || booking.amount || 0;
            // Add to cache for future use
            if (serviceName !== 'Service') {
              servicesMap.value[serviceId] = {
                id: serviceId,
                serviceId: serviceId,
                title: serviceName,
                name: serviceName,
                category: serviceCategory,
                categoryName: serviceCategoryName,
                subcategory: serviceSubcategory,
                subcategoryName: serviceSubcategory,
                price: actualPrice,
                bookingPrice: actualPrice
              };
            }
          }
        } else {
          // No service ID available
          const service = booking.service || {};
          serviceName = service.title || service.name || booking.serviceName || 'Service';
          serviceCategory = service.categoryName || service.category || booking.serviceCategory || 'General';
          serviceCategoryName = service.categoryName || service.category || booking.serviceCategory || 'General';
          serviceSubcategory = service.subcategory || booking.serviceSubcategory || '';
          // USE CORRECT PRICE
          actualPrice = service.bookingPrice || service.totalPrice || service.price || booking.serviceCost || booking.amount || 0;
        }
        
        // Get booking date
        let bookingDate = booking.bookingDate || booking.date || booking.appointmentDate || '';
        
        // Get times - if no end time, calculate based on duration
        let startTime = booking.startTime || booking.time || booking.start || '09:00';
        let endTime = booking.endTime || booking.end || '';
        
        // Calculate end time if not provided
        if (!endTime && startTime) {
          try {
            const [hours, minutes] = startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);
            const endDate = new Date(startDate.getTime() + (serviceDuration * 60000));
            endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
          } catch (err) {
            console.log("❌ Error calculating end time:", err);
            endTime = '10:00'; // Default 1 hour
          }
        } else if (!endTime) {
          endTime = '10:00'; // Default 1 hour
        }
        
        // Get amount
        let amount = 0;
        if (booking.totalPrice !== undefined) {
          amount = parseFloat(booking.totalPrice);
        } else if (booking.amount !== undefined) {
          amount = parseFloat(booking.amount);
        } else if (booking.price !== undefined) {
          amount = parseFloat(booking.price);
        } else if (booking.serviceCost !== undefined) {
          amount = parseFloat(booking.serviceCost);
        }
        
        // Use actual price if available, otherwise use booking amount
        if (actualPrice === 0 && amount > 0) {
          actualPrice = amount;
        }
        
        // Get status
        let status = 'pending';
        if (booking.status) {
          status = booking.status.toLowerCase();
        }
        
        // Get created date
        let createdAt = new Date().toISOString();
        if (booking.createdAt) {
          createdAt = booking.createdAt;
        } else if (booking.createdDate) {
          createdAt = booking.createdDate;
        }
        
        console.log("✅ Processed booking with customer data:", {
          customerName: customerName,
          customerProfilePhoto: customerProfilePhoto,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          customerId: customerId
        });
        
        return {
          _id: booking._id || booking.bookingId || booking.id || `booking-${Date.now()}-${Math.random()}`,
          bookingId: booking.bookingId || '',
          customerId: customerId,
          customerName: customerName,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          customerProfilePhoto: customerProfilePhoto,
          isAdminBooking: isAdminBooking,
          serviceId: serviceId,
          serviceName: serviceName,
          serviceCategory: serviceCategory,
          serviceCategoryName: serviceCategoryName,
          serviceSubcategory: serviceSubcategory,
          serviceSubcategoryName: serviceSubcategoryName,
          servicePrice: actualPrice ? actualPrice.toFixed(2) : amount.toFixed(2),
          actualPrice: actualPrice ? actualPrice.toFixed(2) : amount.toFixed(2),
          serviceCost: actualPrice ? actualPrice.toFixed(2) : amount.toFixed(2),
          bookingDate: bookingDate,
          startTime: startTime,
          endTime: endTime,
          status: status,
          amount: amount.toFixed(2),
          createdAt: createdAt,
          originalData: booking,
          customerObject: customer,
          adminDetails: booking.adminDetails || null,
          serviceDescription: serviceDescription,
          serviceDuration: serviceDuration
        };
      } catch (err) {
        console.error("❌ Error processing booking:", err, booking);
        return null;
      }
    };
    
    // ==================== LOAD BOOKINGS FUNCTION ====================
    const loadBookings = async () => {
      console.log("🚀 Starting bookings load...");
      loading.value = true;
      loadingProgress.value = 0;
      error.value = "";
      debugProviderId.value = "";
      debugHasToken.value = false;
      debugApiEndpoint.value = "";
      try {
        let providerId = getProviderId();
        debugProviderId.value = providerId || "Not found";
        if (!providerId) {
          console.log("🔄 No provider ID found locally, trying to fetch from API...");
          try {
            const userResponse = await http.get('/users/profile');
            const userData = userResponse.data;
            console.log("👤 User profile ", userData);
            providerId = userData.providerId || userData.pid || userData._id || userData.id;
            if (providerId) {
              console.log("✅ Got provider ID from API:", providerId);
              debugProviderId.value = providerId;
              localStorage.setItem('providerId', providerId);
            } else {
              throw new Error("No provider ID in user profile");
            }
          } catch (apiErr) {
            console.error("❌ Failed to fetch user profile:", apiErr);
            error.value = "Unable to authenticate. Please login again.";
            loading.value = false;
            return;
          }
        }
        loadingProgress.value = 30;
        // Start services fetch in background
        fetchAllServices(providerId).then(() => {
          console.log("✅ Background services fetch completed");
        }).catch(err => {
          console.log("⚠️ Background services fetch failed:", err);
        });
        loadingProgress.value = 50;
        // Try different booking endpoints
        const bookingEndpoints = [
          `/bookings/provider/${providerId}`,
          `/bookings?providerId=${providerId}`,
          `/api/bookings/provider/${providerId}`
        ];
        let bookingsData = null;
        for (const endpoint of bookingEndpoints) {
          try {
            console.log(`📡 Trying bookings endpoint: ${endpoint}`);
            debugApiEndpoint.value = endpoint;
            const response = await http.get(endpoint);
            if (response.data && (Array.isArray(response.data) || response.data.bookings || response.data.data)) {
              bookingsData = response.data;
              console.log("✅ Bookings data found from endpoint:", endpoint);
              break;
            }
          } catch (endpointError) {
            console.log(`❌ Bookings endpoint ${endpoint} failed:`, endpointError.message);
          }
        }
        loadingProgress.value = 70;
        if (!bookingsData) {
          throw new Error("No bookings data found from any endpoint");
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
        bookings.value = await processBookings(bookingsArray);
        calculateStats();
        loadingProgress.value = 100;
        lastUpdatedTime.value = new Date().toLocaleTimeString();
        console.log(`✅ Loaded ${bookings.value.length} bookings`);
      } catch (err) {
        console.error("❌ Load Error:", err);
        error.value = err.response?.data?.message || err.message || "Failed to load bookings";
        debugLocalStorageKeys.value = Array.from({length: localStorage.length}, (_, i) => 
          localStorage.key(i)
        ).join(", ");
        bookings.value = [];
        calculateStats();
      } finally {
        loading.value = false;
        setTimeout(() => { loadingProgress.value = 0; }, 500);
      }
    };
    
    // ==================== PROCESS BOOKINGS ====================
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
      console.log(`✅ Processed ${processedBookings.length} bookings`);
      // Sort by date (newest first)
      processedBookings.sort((a, b) => {
        const dateA = a.bookingDate ? new Date(a.bookingDate) : new Date();
        const dateB = b.bookingDate ? new Date(b.bookingDate) : new Date();
        return dateB - dateA;
      });
      return processedBookings;
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
      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(booking => 
          getCustomerDisplayName(booking).toLowerCase().includes(query) ||
          booking.serviceName.toLowerCase().includes(query) ||
          booking.customerEmail.toLowerCase().includes(query) ||
          booking.serviceCategory.toLowerCase().includes(query)
        );
      }
      // Status filter
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
    
    // ==================== FORMATTING FUNCTIONS ====================
    const formatServiceName = (name) => {
      if (!name) return 'Service';
      return name
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
    const formatCleanDate = (dateString) => {
      if (!dateString) return 'No date';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
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
    
    const formatStatus = (status) => {
      const statusMap = {
        confirmed: 'Confirmed',
        completed: 'Completed',
        pending: 'Pending',
        cancelled: 'Cancelled'
      };
      return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
    };
    
    const getTimeUntilBooking = (bookingDate) => {
      if (!bookingDate) return '';
      try {
        const now = new Date();
        const booking = new Date(bookingDate);
        const diffMs = booking - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Past booking';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `${diffDays} days`;
        return 'Later';
      } catch (err) {
        return '';
      }
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
    
    // ==================== CORE FUNCTIONS ====================
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
        console.error('Error completing booking:', err);
        alert("Failed to complete booking. Please try again.");
      }
    };
    
    const viewBookingDetailsModal = async (booking) => {
      selectedBooking.value = booking;
      customerDetails.value = null;
      loadingCustomerDetails.value = false;
      customerDetailsError.value = "";
      await fetchCustomerDetails(booking);
    };
    
    const closeModal = () => {
      selectedBooking.value = null;
      customerDetails.value = null;
      loadingCustomerDetails.value = false;
      customerDetailsError.value = "";
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
      if (selectedPeriod.value === "all") return "All Bookings";
      const period = timelinePeriods.value.find(p => p.id === selectedPeriod.value);
      return period ? period.label : "";
    };
    
    const showDebugInfo = () => {
      showDebug.value = !showDebug.value;
      debugLocalStorageKeys.value = Array.from({length: localStorage.length}, (_, i) => 
        localStorage.key(i)
      ).join(", ");
    };
    
    const copyDebugInfo = () => {
      const debugText = `Provider ID: ${debugProviderId.value}
Token Exists: ${debugHasToken.value}
Endpoint: ${debugApiEndpoint.value}
LocalStorage Keys: ${debugLocalStorageKeys.value}`;
      navigator.clipboard.writeText(debugText);
      alert("Debug info copied to clipboard!");
    };
    
    const exportBookings = () => {
      if (bookings.value.length === 0) {
        alert("No bookings to export.");
        return;
      }
      const csvContent = [
        ['Customer Name', 'Email', 'Service', 'Category', 'Subcategory', 'Date', 'Time', 'Status', 'Amount'].join(','),
        ...bookings.value.map(b => [
          `"${getCustomerDisplayName(b)}"`,
          `"${b.customerEmail || ''}"`,
          `"${b.serviceName}"`,
          `"${b.serviceCategory || ''}"`,
          `"${b.serviceSubcategory || ''}"`,
          `"${formatCleanDate(b.bookingDate)}"`,
          `"${formatTimeSlot(b.startTime, b.endTime)}"`,
          `"${isPastBooking(b) ? 'Past Booking' : formatStatus(b.status)}"`,
          `"ETB ${b.actualPrice || b.servicePrice || b.amount}"`
        ].join(','))
      ].join('\n'); // ✅ FIXED: \n instead of literal newline
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
      console.log("📅 BookingsSection mounted");
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
      showDebug,
      lastUpdatedTime,
      // Customer details state
      customerDetails,
      loadingCustomerDetails,
      customerDetailsError,
      // Debug
      debugProviderId,
      debugHasToken,
      debugApiEndpoint,
      debugLocalStorageKeys,
      // Stats
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
      showDebugInfo,
      copyDebugInfo,
      exportBookings,
      // Formatting
      getCleanInitials,
      formatCleanDate,
      getCustomerDisplayName,
      formatCustomerName,
      formatServiceName,
      formatStatus,
      calculateDuration,
      formatTimeSlot,
      getTimeUntilBooking,
      formatRelativeTime,
      isTodayBooking,
      isPastBooking,
      // Service helpers
      getServiceIcon,
      // Modal helpers
      formatDate,
      handleImageError
    };
  }
};
</script>
<style scoped>
/* IMPROVED CUSTOMER PROFILE PHOTO STYLES */
.customer-profile-photo {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.customer-profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.customer-profile-photo-small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12px;
}
.customer-profile-photo-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.customer-profile-photo-large {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.customer-profile-photo-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* Initials fallback styles */
.customer-initials-large {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.customer-initials-small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  margin-right: 12px;
  flex-shrink: 0;
}
.fallback-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}
/* NEW CUSTOMER PROFILE HEADER IN MODAL */
.customer-profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}
.customer-name-info h3 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
}
.customer-id-small {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.85rem;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.customer-id-small i {
  color: #3b82f6;
}
/* NEW CONTACT INFO LAYOUT */
.customer-contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}
.contact-item i {
  color: #3b82f6;
  font-size: 1.1rem;
  margin-top: 2px;
  flex-shrink: 0;
}
.contact-label {
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.contact-value {
  color: #1f2937;
  font-size: 0.95rem;
  font-weight: 500;
}
.status-active {
  color: #10b981;
  font-weight: 600;
}
.customer-full-details,
.customer-basic-details {
  animation: fadeIn 0.5s ease;
}
/* Customer avatar section */
.customer-avatar-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.customer-type-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.customer-type-indicator.admin {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}
.customer-type-indicator.client {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}
/* Table view customer cell */
.customer-cell {
  align-items: center;
}
.customer-info {
  flex: 1;
}
.customer-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.type-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.type-badge.admin {
  background: #ede9fe;
  color: #7c3aed;
}
.type-badge.client {
  background: #d1fae5;
  color: #059669;
}
.customer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.customer-email {
  color: #6b7280;
  font-size: 0.85rem;
}
.customer-phone {
  color: #6b7280;
  font-size: 0.85rem;
}
/* Error and loading indicators */
.error-indicator {
  font-size: 0.8rem;
  color: #ef4444;
  margin-left: 10px;
  font-weight: normal;
}
.info-note {
  font-size: 0.85rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 10px;
  border-left: 3px solid #3b82f6;
}
.info-note i {
  color: #3b82f6;
  margin-right: 6px;
}
.loading-indicator {
  font-size: 0.8rem;
  color: #64748b;
  margin-left: 10px;
  font-weight: normal;
}
.customer-section,
.service-section,
.timing-section,
.status-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}
.customer-section h4,
.service-section h4,
.timing-section h4,
.status-section h4 {
  display: flex;
  align-items: center;
  gap: 10px;
}
/* Service Details Enhancements */
.service-full-details {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}
.service-detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}
.service-detail-item:last-child {
  border-bottom: none;
}
.service-detail-item strong {
  min-width: 120px;
  color: #4b5563;
}
.service-detail-item span {
  color: #1f2937;
  font-weight: 500;
}
.service-amount-highlight {
  color: #059669;
  font-weight: 700;
  font-size: 1.1rem;
}
.service-id-badge {
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #374151;
  border: 1px solid #e5e7eb;
}
/* Service ID Display in Cards */
.service-id-small {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}
.service-id-small i {
  color: #9ca3af;
}
.service-id-tiny {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 2px;
  font-family: monospace;
}
/* Timing and Status Sections */
.timing-details,
.status-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}
.timing-item,
.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}
.status-value {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
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
.status-value.past {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #64748b;
}
/* Loading state */
.loading-state {
  margin: 15px 0;
}
.loading-state .loading-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
}
.loading-state .loading-bar::after {
  content: '';
  display: block;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1e40af);
  animation: loading 1.5s infinite ease-in-out;
}
@keyframes loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
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
/* Service meta row */
.service-meta-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.service-subcategory {
  background: #e0f2fe;
  color: #0369a1;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid #bae6fd;
}
/* The rest of your existing styles remain exactly the same below */
.bookings-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}
/* Header */
.header {
  background: white;
  border-radius: 16px;
  padding: 24px 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}
.title-section .title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}
.title-section .subtitle {
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}
.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
.debug-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 10px;
  text-align: left;
  font-size: 0.9rem;
}
.debug-info h4 {
  margin-top: 0;
  color: #1e293b;
}
.debug-info p {
  margin: 5px 0;
  color: #64748b;
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
/* Statistics */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}
.stat-icon.total { background: linear-gradient(135deg, #dbeafe, #93c5fd); color: #1e40af; }
.stat-icon.today { background: linear-gradient(135deg, #fef3c7, #fcd34d); color: #d97706; }
.stat-icon.upcoming { background: linear-gradient(135deg, #dcfce7, #86efac); color: #16a34a; }
.stat-icon.completed { background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #9333ea; }
.stat-icon.revenue { background: linear-gradient(135deg, #fce7f3, #f9a8d4); color: #db2777; }
.stat-content h3 {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1;
}
.stat-content p {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
/* API Status */
.api-status {
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.95rem;
}
.api-status.success {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
  border: 1px solid #86efac;
}
/* Filters */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
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
  font-size: 1rem;
}
.search-input {
  width: 100%;
  padding: 14px 20px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}
.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.filter-select {
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 0.95rem;
  font-weight: 500;
  min-width: 150px;
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
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}
.timeline-filter-header {
  margin-bottom: 20px;
}
.timeline-filter-header h3 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.timeline-filter-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}
.timeline-filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.timeline-filter-btn {
  padding: 10px 20px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #475569;
  font-size: 0.9rem;
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
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-radius: 12px;
  border: 1px solid #bae6fd;
}
.active-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.active-filter-badge {
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  font-size: 0.8rem;
  padding: 0;
  transition: all 0.3s ease;
}
.clear-period-btn:hover {
  background: #e2e8f0;
  color: #ef4444;
}
.filter-count {
  color: #0369a1;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 6px 12px;
  background: white;
  border-radius: 10px;
  border: 1px solid #bae6fd;
}
/* Bookings Container */
.bookings-container {
  margin-top: 24px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}
.section-header h2 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
.view-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}
.view-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 0.9rem;
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
/* PROFESSIONAL BOOKING CARDS */
.professional-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.professional-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.professional-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}
.professional-card.today-card {
  border-left: 4px solid #10b981;
}
.professional-card.admin-card {
  border-left: 4px solid #8b5cf6;
}
.professional-card.completed-card {
  border-left: 4px solid #6b7280;
}
.professional-card.past-card {
  border-left: 4px solid #94a3b8;
  opacity: 0.9;
}
/* Card Header */
.card-header-section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}
.customer-avatar-section {
  position: relative;
}
.customer-info-section {
  flex: 1;
}
.customer-name {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.3;
}
.customer-meta {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.customer-meta i {
  width: 16px;
  margin-right: 6px;
  color: #9ca3af;
}
.booking-status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}
.status-badge.confirmed {
  background: linear-gradient(135deg, #dbeafe, #93c5fd);
  color: #1e40af;
}
.status-badge.completed {
  background: linear-gradient(135deg, #f3f4f6, #d1d5db);
  color: #374151;
}
.status-badge.pending {
  background: linear-gradient(135deg, #fef3c7, #fcd34d);
  color: #92400e;
}
.status-badge.cancelled {
  background: linear-gradient(135deg, #fee2e2, #fca5a5);
  color: #dc2626;
}
.past-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #64748b;
  border: 1px solid #cbd5e1;
}
.booking-id {
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
/* Service Details */
.service-details-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 14px;
  border: 1px solid #f3f4f6;
}
.service-icon-circle {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.service-info {
  flex: 1;
}
.service-name {
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.3;
}
.service-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}
.service-category {
  background: white;
  color: #6b7280;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #e5e7eb;
}
.service-duration {
  color: #d97706;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.service-amount {
  text-align: right;
}
.amount-label {
  display: block;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.amount-value {
  display: block;
  color: #059669;
  font-size: 1.5rem;
  font-weight: 800;
}
/* Date & Time Section */
.datetime-section {
  margin-bottom: 20px;
}
.date-time-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
}
.date-section, .time-section {
  display: flex;
  align-items: center;
  gap: 12px;
}
.date-icon, .time-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.date-content, .time-content {
  flex: 1;
}
.date-label, .time-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.date-value, .time-value {
  color: #1f2937;
  font-size: 1rem;
  font-weight: 700;
}
/* Additional Info */
.additional-info-section {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #f3f4f6;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 500;
}
.info-item i {
  color: #9ca3af;
}
/* Action Buttons */
.action-buttons-section {
  display: flex;
  gap: 10px;
}
.action-btn {
  flex: 1;
  padding: 12px;
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
.mark-complete-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}
.mark-complete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
.view-details-btn {
  background: #f3f4f6;
  color: #374151;
}
.view-details-btn:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}
.contact-btn {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
/* Bookings List View */
.bookings-list {
  margin-bottom: 30px;
}
.bookings-table {
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: white;
}
.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 16px 20px;
  font-weight: 700;
  color: #475569;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
}
.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1.2fr 0.8fr 1fr 0.8fr 1fr;
  padding: 16px 20px;
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
.datetime-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.date-section, .time-section {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.9rem;
}
.date-section i, .time-section i {
  width: 16px;
  color: #9ca3af;
}
.duration-container, .amount-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.duration-container i, .amount-container i {
  color: #9ca3af;
}
.action-buttons {
  display: flex;
  gap: 8px;
}
.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.btn-action.complete {
  background: #d1fae5;
  color: #059669;
}
.btn-action.complete:hover {
  background: #a7f3d0;
  transform: translateY(-2px);
}
.btn-action.view {
  background: #e0f2fe;
  color: #0284c7;
}
.btn-action.view:hover {
  background: #bae6fd;
  transform: translateY(-2px);
}
.btn-action.contact {
  background: #f3e8ff;
  color: #7c3aed;
}
.btn-action.contact:hover {
  background: #ddd6fe;
  transform: translateY(-2px);
}
/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.pagination-btn {
  padding: 8px 16px;
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
  width: 36px;
  height: 36px;
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
/* No Results */
.no-results {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.no-results i {
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 16px;
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
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #f3f4f6;
}
.modal-header h3 {
  margin: 0;
  color: #1e293b;
}
.modal-close {
  width: 36px;
  height: 36px;
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
  padding: 24px;
}
.booking-details h4 {
  color: #1e293b;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}
.booking-details p {
  color: #4b5563;
  margin: 8px 0;
}
.booking-details strong {
  color: #1f2937;
  font-weight: 600;
}
.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
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
.professional-card {
  animation: fadeIn 0.5s ease forwards;
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
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  .date-time-card {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .action-buttons-section {
    flex-direction: column;
  }
  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .table-cell {
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  .table-cell:last-child {
    border-bottom: none;
  }
  .customer-contact-info {
    grid-template-columns: 1fr;
  }
  .customer-profile-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  .service-detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  .filters-row {
    flex-direction: column;
  }
  .search-box {
    min-width: 100%;
  }
  .card-header-section {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .booking-status-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}
</style>