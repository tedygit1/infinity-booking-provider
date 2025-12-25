<template>
  <div class="reviews-container">
    <!-- Header with Stats -->
    <div class="reviews-header">
      <div class="header-left">
        <h1><i class="fa-solid fa-star"></i> Customer Reviews</h1>
        <p class="subtitle">Manage and respond to customer feedback</p>
      </div>
      <div class="header-stats">
        <div class="stat-card" :class="{ 'active': filterRating === 0 }" @click="setRatingFilter(0)">
          <div class="stat-number">{{ totalReviews }}</div>
          <div class="stat-label">Total Reviews</div>
        </div>
        <div class="stat-card" :class="{ 'active': filterRating === 5 }" @click="setRatingFilter(5)">
          <div class="stat-number">{{ fiveStarReviews }}</div>
          <div class="stat-label">5★ Reviews</div>
        </div>
        <div class="stat-card" :class="{ 'active': filterRating === 1 }" @click="setRatingFilter(1)">
          <div class="stat-number">{{ oneStarReviews }}</div>
          <div class="stat-label">Needs Attention</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ responseRate }}%</div>
          <div class="stat-label">Response Rate</div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Fetching reviews...</p>
      <p v-if="debugMode && services.length > 0" class="debug-loading">
        Checking {{ services.length }} services for reviews...
      </p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      <i class="fa-solid fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="fetchReviews" class="retry-btn">
        <i class="fa-solid fa-refresh"></i> Try Again
      </button>
    </div>

    <!-- Main Content (Only show when not loading and no error) -->
    <div v-else class="reviews-main">
      <!-- Left Sidebar - Filters -->
      <div class="sidebar">
        <!-- Filter Section -->
        <div class="filter-section">
          <h3><i class="fa-solid fa-filter"></i> Filters</h3>
          
          <!-- Rating Filter -->
          <div class="filter-group">
            <label>Rating</label>
            <div class="rating-filters">
              <button 
                v-for="rating in [5,4,3,2,1]" 
                :key="rating"
                :class="['rating-filter', { 'active': filterRating === rating }]"
                @click="setRatingFilter(rating)"
              >
                <span class="stars">
                  <i v-for="n in 5" :key="n" 
                     :class="n <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                </span>
                <span class="count">({{ ratingCounts[rating] || 0 }})</span>
              </button>
            </div>
          </div>

          <!-- Service Filter -->
          <div class="filter-group">
            <label>Service</label>
            <div class="service-filters">
              <button 
                :class="['service-filter', { 'active': filterService === null }]"
                @click="setServiceFilter(null)"
              >
                All Services
              </button>
              <button 
                v-for="service in availableServices" 
                :key="service.id"
                :class="['service-filter', { 'active': filterService === service.id }]"
                @click="setServiceFilter(service.id)"
              >
                {{ service.title }}
                <span class="count">({{ service.reviewCount || 0 }})</span>
              </button>
            </div>
          </div>

          <!-- Date Filter -->
          <div class="filter-group">
            <label>Date Range</label>
            <div class="date-filters">
              <select v-model="dateRange" @change="applyDateFilter" class="date-select">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div v-if="dateRange === 'custom'" class="custom-date-range">
              <div class="date-input">
                <label>From</label>
                <input type="date" v-model="customDateStart" @change="applyDateFilter">
              </div>
              <div class="date-input">
                <label>To</label>
                <input type="date" v-model="customDateEnd" @change="applyDateFilter">
              </div>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="filter-group">
            <label>Status</label>
            <div class="status-filters">
              <button 
                :class="['status-filter', { 'active': filterStatus === null }]"
                @click="setStatusFilter(null)"
              >
                All Reviews
              </button>
              <button 
                :class="['status-filter', 'replied', { 'active': filterStatus === 'replied' }]"
                @click="setStatusFilter('replied')"
              >
                <i class="fa-solid fa-reply"></i> Replied ({{ repliedCount }})
              </button>
              <button 
                :class="['status-filter', 'pending', { 'active': filterStatus === 'pending' }]"
                @click="setStatusFilter('pending')"
              >
                <i class="fa-solid fa-clock"></i> Pending Reply ({{ pendingReplyCount }})
              </button>
            </div>
          </div>

          <!-- Clear Filters -->
          <div class="filter-actions">
            <button class="btn-clear-filters" @click="clearAllFilters">
              <i class="fa-solid fa-broom"></i> Clear All Filters
            </button>
            <button class="btn-export" @click="exportReviews">
              <i class="fa-solid fa-download"></i> Export
            </button>
          </div>
        </div>

        <!-- Analytics Section -->
        <div class="analytics-section" v-if="reviews.length > 0">
          <h3><i class="fa-solid fa-chart-bar"></i> Analytics</h3>
          <div class="analytics-content">
            <div class="overall-rating">
              <div class="rating-number">{{ averageRating.toFixed(1) }}</div>
              <div class="rating-stars-large">
                <i v-for="n in 5" :key="n" 
                   :class="getStarClass(n, averageRating)"></i>
              </div>
              <div class="rating-count">{{ totalReviews }} reviews</div>
            </div>

            <!-- Rating Distribution Chart -->
            <div class="distribution-chart">
              <div v-for="rating in [5,4,3,2,1]" :key="rating" class="distribution-row">
                <div class="rating-label">
                  <span>{{ rating }}★</span>
                  <span class="percentage">{{ getPercentage(rating) }}%</span>
                </div>
                <div class="distribution-bar">
                  <div class="bar-fill" :style="{ width: getPercentage(rating) + '%' }"></div>
                </div>
                <div class="rating-count-small">{{ ratingCounts[rating] || 0 }}</div>
              </div>
            </div>

            <!-- Response Rate -->
            <div class="response-rate">
              <div class="response-label">Response Rate</div>
              <div class="response-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: responseRate + '%' }"></div>
                </div>
                <div class="response-percentage">{{ responseRate }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- No Reviews State -->
        <div v-if="reviews.length === 0" class="no-reviews">
          <div class="empty-state">
            <div class="empty-icon">⭐</div>
            <h3>No Reviews Yet</h3>
            <p>You haven't received any reviews for your services yet.</p>
            <p class="hint">Reviews will appear here once customers complete their bookings and leave feedback.</p>
            
            <div class="services-list" v-if="services.length > 0">
              <h4>Your Services ({{ services.length }})</h4>
              <div class="service-items">
                <div v-for="service in services" :key="service.serviceId" class="service-item">
                  <i class="fa-solid fa-scissors"></i>
                  <div class="service-details">
                    <span class="service-title">{{ service.title }}</span>
                    <span class="service-id">{{ service.serviceId }}</span>
                  </div>
                </div>
              </div>
              <p class="check-hint">Checking these services for reviews...</p>
            </div>
            
            <div v-else class="no-services">
              <i class="fa-solid fa-box-open"></i>
              <p>No services found. Create services first to receive reviews.</p>
            </div>
          </div>
        </div>

        <!-- Reviews Content (when we have reviews) -->
        <div v-else>
          <!-- Controls Bar -->
          <div class="controls-bar">
            <div class="search-box">
              <i class="fa-solid fa-search"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search reviews..." 
                @input="onSearch"
                debounce="300"
              >
            </div>
            
            <div class="sort-controls">
              <label>Sort by:</label>
              <select v-model="sortBy" @change="sortReviews">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
              
              <div class="view-toggle">
                <button :class="['view-btn', { 'active': viewMode === 'list' }]" @click="viewMode = 'list'">
                  <i class="fa-solid fa-list"></i>
                </button>
                <button :class="['view-btn', { 'active': viewMode === 'grid' }]" @click="viewMode = 'grid'">
                  <i class="fa-solid fa-grip"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div v-if="hasActiveFilters" class="active-filters">
            <div class="filters-tags">
              <span class="filter-tag" v-if="filterRating">
                {{ filterRating }}★ Rating
                <i class="fa-solid fa-times" @click="setRatingFilter(0)"></i>
              </span>
              <span class="filter-tag" v-if="filterService">
                {{ getServiceName(filterService) }}
                <i class="fa-solid fa-times" @click="setServiceFilter(null)"></i>
              </span>
              <span class="filter-tag" v-if="filterStatus">
                {{ filterStatus === 'replied' ? 'Replied' : 'Pending Reply' }}
                <i class="fa-solid fa-times" @click="setStatusFilter(null)"></i>
              </span>
              <span class="filter-tag" v-if="dateRange !== 'all'">
                {{ dateRangeLabels[dateRange] }}
                <i class="fa-solid fa-times" @click="dateRange = 'all'; applyDateFilter()"></i>
              </span>
              <span class="filter-tag" v-if="searchQuery">
                Search: "{{ searchQuery }}"
                <i class="fa-solid fa-times" @click="searchQuery = ''; onSearch()"></i>
              </span>
            </div>
            <div class="results-count">
              Showing {{ filteredReviews.length }} of {{ totalReviews }} reviews
            </div>
          </div>

          <!-- Empty Filter State -->
          <div v-if="filteredReviews.length === 0 && hasActiveFilters" class="empty-state">
            <div class="empty-icon">
              <i class="fa-solid fa-filter-circle-xmark"></i>
            </div>
            <h3>No Reviews Match Your Filters</h3>
            <p>Try adjusting your filter criteria to see more results.</p>
            <button class="btn-clear" @click="clearAllFilters">
              Clear All Filters
            </button>
          </div>

          <!-- Reviews Grid/List -->
          <div v-else class="reviews-display" :class="viewMode">
            <div v-for="review in paginatedReviews" :key="review.id" class="review-item">
              <div class="review-card">
                <!-- Review Header -->
                <div class="review-header">
                  <div class="reviewer-avatar">
                    <img :src="getAvatar(review)" :alt="review.userName" @error="handleImageError">
                  </div>
                  <div class="reviewer-info">
                    <!-- FIXED: Show actual reviewer details -->
                    <div class="reviewer-name">{{ review.userName || 'Customer' }}</div>
                    <div class="reviewer-contact" v-if="review.customerDetails">
                      <span class="reviewer-email" v-if="review.customerDetails.email">
                        <i class="fa-solid fa-envelope"></i> {{ review.customerDetails.email }}
                      </span>
                      <span class="reviewer-phone" v-if="review.customerDetails.phonenumber">
                        <i class="fa-solid fa-phone"></i> {{ review.customerDetails.phonenumber }}
                      </span>
                    </div>
                    <div class="review-meta">
                      <span class="review-date">
                        <i class="fa-solid fa-calendar"></i> {{ formatDate(review.date) }}
                      </span>
                      <span class="review-service">
                        <i class="fa-solid fa-scissors"></i> {{ review.serviceName }}
                      </span>
                    </div>
                  </div>
                  <div class="review-rating">
                    <div class="stars">
                      <i v-for="n in 5" :key="n" 
                         :class="n <= review.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                    </div>
                    <div class="rating-value">{{ review.rating }}.0</div>
                  </div>
                </div>

                <!-- Review Content -->
                <div class="review-content">
                  <div class="review-text">{{ review.text }}</div>
                  
                  <!-- Customer Details Box (Collapsible) -->
                  <div v-if="review.customerDetails" class="customer-details-box">
                    <div class="customer-details-header" @click="toggleCustomerDetails(review.id)">
                      <i class="fa-solid fa-user-circle"></i>
                      <span>Customer Details</span>
                      <i class="fa-solid" :class="expandedCustomer === review.id ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                    </div>
                    
                    <div v-if="expandedCustomer === review.id" class="customer-details-content">
                      <div class="customer-info-grid">
                        <div class="customer-info-item">
                          <span class="label">Full Name:</span>
                          <span class="value">{{ review.customerDetails.fullname || 'Not available' }}</span>
                        </div>
                        <div class="customer-info-item">
                          <span class="label">Email:</span>
                          <span class="value">{{ review.customerDetails.email || 'Not available' }}</span>
                        </div>
                        <div class="customer-info-item" v-if="review.customerDetails.phonenumber">
                          <span class="label">Phone:</span>
                          <span class="value">{{ review.customerDetails.phonenumber }}</span>
                        </div>
                        <div class="customer-info-item" v-if="review.customerDetails.address">
                          <span class="label">Address:</span>
                          <span class="value">{{ review.customerDetails.address }}</span>
                        </div>
                        <div class="customer-info-item" v-if="review.customerDetails.cid">
                          <span class="label">Customer ID:</span>
                          <span class="value customer-id">{{ review.customerDetails.cid }}</span>
                        </div>
                        <div class="customer-info-item" v-if="review.customerDetails.status">
                          <span class="label">Status:</span>
                          <span class="value status-badge" :class="review.customerDetails.status">
                            {{ review.customerDetails.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Review Actions -->
                <div class="review-actions">
                  <div class="action-buttons">
                    <button v-if="!review.reply" class="btn-reply" @click="openReplyModal(review)">
                      <i class="fa-solid fa-reply"></i> Reply
                    </button>
                    <button v-else class="btn-view-reply" @click="viewReply(review)">
                      <i class="fa-solid fa-eye"></i> View Reply
                    </button>
                    <button class="btn-helpful" @click="toggleHelpful(review)">
                      <i class="fa-solid fa-thumbs-up"></i> 
                      {{ review.helpfulCount || 0 }}
                    </button>
                    <button class="btn-report" @click="reportReview(review)">
                      <i class="fa-solid fa-flag"></i> Report
                    </button>
                  </div>
                  
                  <div v-if="review.reply" class="reply-indicator">
                    <i class="fa-solid fa-check-circle"></i> Replied
                  </div>
                </div>

                <!-- Reply Section (Expanded) -->
                <div v-if="expandedReply === review.id" class="reply-section">
                  <div class="reply-header">
                    <i class="fa-solid fa-reply"></i>
                    <span>Your Reply</span>
                    <span class="reply-date">{{ formatDate(review.replyDate) }}</span>
                  </div>
                  <div class="reply-content">
                    {{ review.reply }}
                  </div>
                  <div class="reply-actions">
                    <button class="btn-edit" @click="openReplyModal(review)">
                      <i class="fa-solid fa-edit"></i> Edit Reply
                    </button>
                    <button class="btn-delete" @click="deleteReply(review)">
                      <i class="fa-solid fa-trash"></i> Delete Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 1" 
              @click="prevPage"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                :class="['page-btn', { 'active': page === currentPage }]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              
              <span v-if="showEllipsis" class="ellipsis">...</span>
              
              <button 
                v-if="totalPages > 1"
                :class="['page-btn', { 'active': currentPage === totalPages }]"
                @click="goToPage(totalPages)"
              >
                {{ totalPages }}
              </button>
            </div>
            
            <button 
              class="pagination-btn" 
              :disabled="currentPage === totalPages" 
              @click="nextPage"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            
            <div class="page-info">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
          </div>

          <!-- Load More Button (Alternative to Pagination) -->
          <div v-if="viewMode === 'grid' && hasMoreReviews" class="load-more">
            <button class="btn-load-more" @click="loadMoreReviews" :disabled="loadingMore">
              <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loadingMore }"></i>
              {{ loadingMore ? 'Loading...' : 'Load More Reviews' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <div v-if="showReplyModal" class="modal-overlay" @click.self="closeReplyModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Reply to Review</h3>
          <button class="btn-close" @click="closeReplyModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="review-preview">
            <div class="reviewer">
              <img :src="getAvatar(selectedReview)" :alt="selectedReview.userName">
              <div>
                <div class="name">{{ selectedReview.userName }}</div>
                <div class="customer-details-small" v-if="selectedReview.customerDetails">
                  <div class="detail">
                    <i class="fa-solid fa-user"></i>
                    {{ selectedReview.customerDetails.fullname }}
                  </div>
                  <div class="detail">
                    <i class="fa-solid fa-envelope"></i>
                    {{ selectedReview.customerDetails.email }}
                  </div>
                </div>
                <div class="rating">
                  <i v-for="n in 5" :key="n" 
                     :class="n <= selectedReview.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
                </div>
              </div>
            </div>
            <div class="review-text-preview">"{{ selectedReview.text }}"</div>
          </div>
          
          <div class="reply-editor">
            <label>Your Reply</label>
            <textarea 
              v-model="replyText" 
              placeholder="Write your response here..."
              rows="6"
              maxlength="1000"
            ></textarea>
            <div class="editor-footer">
              <div class="char-count">{{ replyText.length }}/1000 characters</div>
              <div class="tips">
                <i class="fa-solid fa-lightbulb"></i>
                Tips: Be professional, thank the customer, and address their concerns directly.
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeReplyModal">Cancel</button>
          <button class="btn-save" @click="saveReply" :disabled="!replyText.trim()">
            <i class="fa-solid fa-paper-plane"></i> Send Reply
          </button>
        </div>
      </div>
    </div>

    <!-- Debug Toggle -->
    <div class="debug-toggle" @click="debugMode = !debugMode">
      <i class="fa-solid fa-bug"></i>
      {{ debugMode ? 'Hide Debug' : 'Show Debug' }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import http from "@/api/index.js";

// ========== STATE ==========
const reviews = ref([]);
const loading = ref(true);
const error = ref(null);
const services = ref([]);
const providerId = ref(null);
const debugMode = ref(false);
const expandedCustomer = ref(null); // NEW: For toggling customer details

// Filter State
const filterRating = ref(0);
const filterService = ref(null);
const filterStatus = ref(null);
const dateRange = ref('all');
const customDateStart = ref('');
const customDateEnd = ref('');
const searchQuery = ref('');
const sortBy = ref('newest');
const viewMode = ref('grid');

// Pagination State
const currentPage = ref(1);
const pageSize = ref(12);
const loadingMore = ref(false);
const expandedReply = ref(null);

// Modal State
const showReplyModal = ref(false);
const selectedReview = ref(null);
const replyText = ref('');

// Date range labels
const dateRangeLabels = {
  all: 'All Time',
  today: 'Today',
  week: 'Last 7 Days',
  month: 'Last 30 Days',
  quarter: 'Last 3 Months',
  year: 'Last Year',
  custom: 'Custom Range'
};

// ========== COMPUTED PROPERTIES ==========
const totalReviews = computed(() => reviews.value.length);

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((total, review) => total + (review.rating || 0), 0);
  return Math.round((sum / reviews.value.length) * 10) / 10;
});

const ratingCounts = computed(() => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.value.forEach(review => {
    const rating = Math.round(review.rating) || 0;
    if (rating >= 1 && rating <= 5) counts[rating]++;
  });
  return counts;
});

const fiveStarReviews = computed(() => ratingCounts.value[5] || 0);
const oneStarReviews = computed(() => ratingCounts.value[1] || 0);

const repliedCount = computed(() => 
  reviews.value.filter(r => r.reply && r.reply.trim()).length
);

const pendingReplyCount = computed(() => 
  reviews.value.filter(r => !r.reply || !r.reply.trim()).length
);

const responseRate = computed(() => {
  if (reviews.value.length === 0) return 0;
  return Math.round((repliedCount.value / reviews.value.length) * 100);
});

const availableServices = computed(() => {
  const serviceMap = new Map();
  
  reviews.value.forEach(review => {
    if (review.serviceId && review.serviceName) {
      if (!serviceMap.has(review.serviceId)) {
        serviceMap.set(review.serviceId, {
          id: review.serviceId,
          title: review.serviceName,
          reviewCount: 0
        });
      }
      const service = serviceMap.get(review.serviceId);
      service.reviewCount++;
    }
  });
  
  return Array.from(serviceMap.values());
});

// Filtered Reviews
const filteredReviews = computed(() => {
  let filtered = [...reviews.value];

  // Apply rating filter
  if (filterRating.value > 0) {
    filtered = filtered.filter(review => Math.round(review.rating) === filterRating.value);
  }

  // Apply service filter
  if (filterService.value) {
    filtered = filtered.filter(review => review.serviceId === filterService.value);
  }

  // Apply status filter
  if (filterStatus.value === 'replied') {
    filtered = filtered.filter(review => review.reply && review.reply.trim());
  } else if (filterStatus.value === 'pending') {
    filtered = filtered.filter(review => !review.reply || !review.reply.trim());
  }

  // Apply date filter
  if (dateRange.value !== 'all') {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange.value) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'custom':
        if (customDateStart.value) {
          startDate = new Date(customDateStart.value);
        }
        break;
    }

    filtered = filtered.filter(review => {
      const reviewDate = new Date(review.date);
      return reviewDate >= startDate;
    });

    // Custom end date
    if (dateRange.value === 'custom' && customDateEnd.value) {
      const endDate = new Date(customDateEnd.value);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(review => {
        const reviewDate = new Date(review.date);
        return reviewDate <= endDate;
      });
    }
  }

  // Apply search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(review => 
      review.text.toLowerCase().includes(query) ||
      review.userName.toLowerCase().includes(query) ||
      review.serviceName.toLowerCase().includes(query) ||
      (review.reply && review.reply.toLowerCase().includes(query)) ||
      (review.customerDetails && 
        (review.customerDetails.fullname?.toLowerCase().includes(query) ||
         review.customerDetails.email?.toLowerCase().includes(query)))
    );
  }

  // Apply sorting
  return sortReviewsList(filtered);
});

const hasActiveFilters = computed(() => {
  return filterRating.value > 0 || 
         filterService.value || 
         filterStatus.value || 
         dateRange.value !== 'all' || 
         searchQuery.value.trim();
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredReviews.value.length / pageSize.value));
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredReviews.value.slice(start, end);
});

const hasMoreReviews = computed(() => {
  return currentPage.value < totalPages.value;
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const showEllipsis = computed(() => {
  return totalPages.value > 5 && currentPage.value < totalPages.value - 2;
});

// ========== FETCHING FUNCTIONS ==========
const getProviderId = () => {
  try {
    const providerJson = localStorage.getItem("loggedProvider");
    if (!providerJson) {
      console.error("❌ No provider found in localStorage");
      return null;
    }
    
    const provider = JSON.parse(providerJson);
    const id = provider?._id || provider?.id;
    
    if (!id) {
      console.error("❌ No provider ID found in provider object:", provider);
      return null;
    }
    
    console.log("✅ Provider ID found:", id);
    return id;
  } catch (err) {
    console.error("❌ Error getting provider ID:", err);
    return null;
  }
};

const fetchServices = async () => {
  try {
    console.log("📡 Fetching services...");
    const response = await http.get('/services');
    
    const data = response.data;
    services.value = Array.isArray(data) ? data : [];
    console.log(`✅ Loaded ${services.value.length} services`);
    
    if (services.value.length === 0) {
      console.log("📭 No services found for this provider");
    } else {
      console.log("📋 Services list:");
      services.value.forEach((service, index) => {
        const serviceId = service.serviceId || service._id || service.id;
        console.log(`  ${index + 1}. "${service.title || 'No title'}" - ID: ${serviceId}`);
      });
    }
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    if (err.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    }
    throw new Error(`Failed to load services: ${err.message}`);
  }
};

// NEW: Function to fetch customer details
const fetchCustomerDetails = async (customerId) => {
  try {
    console.log(`👤 Fetching customer details for ID: ${customerId}`);
    const response = await http.get(`/customers/${customerId}`);
    
    if (response.data) {
      const customer = response.data;
      console.log(`✅ Found customer:`, {
        fullname: customer.fullname,
        email: customer.email,
        phonenumber: customer.phonenumber
      });
      return customer;
    }
  } catch (err) {
    console.log(`ℹ️ Could not fetch customer details for ${customerId}:`, err.message);
    return null;
  }
  return null;
};

const fetchServiceReviews = async (service) => {
  const serviceId = service.serviceId || service._id || service.id;
  if (!serviceId) {
    console.warn(`⚠️ Service has no ID:`, service);
    return [];
  }
  
  try {
    console.log(`🔍 Checking reviews for service: "${service.title}" (${serviceId})`);
    
    const response = await http.get(`/reviews/service/${serviceId}`);
    const data = response.data;
    
    let serviceReviews = [];
    
    // Handle different response formats
    if (Array.isArray(data)) {
      serviceReviews = data;
    } else if (data && Array.isArray(data.reviews)) {
      serviceReviews = data.reviews;
    } else if (data && Array.isArray(data.data)) {
      serviceReviews = data.data;
    } else if (data && data.reviews && typeof data.reviews === 'object') {
      serviceReviews = Object.values(data.reviews);
    }
    
    console.log(`📝 Found ${serviceReviews.length} reviews for "${service.title}"`);
    
    // Transform reviews to consistent format WITH CUSTOMER DETAILS
    const transformedReviews = [];
    
    for (const review of serviceReviews) {
      // Extract customer ID from review
      const customerId = review.customerId || 
                        review.user?._id || 
                        review.user?.id ||
                        review.customer?._id ||
                        review.customer?.cid;
      
      let customerDetails = null;
      
      // Try to get customer details if we have customer ID
      if (customerId) {
        customerDetails = await fetchCustomerDetails(customerId);
      }
      
      // If no customer details from API, use what's in the review
      if (!customerDetails && review.customer) {
        customerDetails = {
          fullname: review.customer.fullname || review.customer.name,
          email: review.customer.email,
          phonenumber: review.customer.phonenumber,
          address: review.customer.address,
          cid: review.customer.cid,
          status: review.customer.status,
          profilePhoto: review.customer.profilePhoto
        };
      }
      
      // Determine reviewer name
      let userName = 'Customer';
      if (customerDetails?.fullname) {
        userName = customerDetails.fullname;
      } else if (review.customerName) {
        userName = review.customerName;
      } else if (review.user?.name) {
        userName = review.user.name;
      }
      
      // Create transformed review
      const transformedReview = {
        id: review.id || review._id || `review-${serviceId}-${Date.now()}`,
        serviceId: serviceId,
        serviceName: service.title || service.serviceName || 'Service',
        userName: userName,
        rating: review.rating || review.stars || 0,
        text: review.review || 
              review.message || 
              review.comment || 
              review.content || 
              review.feedback ||
              'No review text',
        date: review.date || 
              review.createdAt || 
              review.updatedAt || 
              review.timestamp ||
              new Date().toISOString(),
        avatar: customerDetails?.profilePhoto || 
                review.avatar || 
                review.user?.avatar ||
                review.customer?.avatar,
        reply: review.reply || review.response || '',
        replyDate: review.replyDate || review.updatedAt,
        customerDetails: customerDetails,
        source: 'service'
      };
      
      console.log(`👤 Review by: ${userName} (Rating: ${transformedReview.rating}★)`);
      if (customerDetails) {
        console.log(`   📧 Email: ${customerDetails.email}`);
        console.log(`   📞 Phone: ${customerDetails.phonenumber}`);
      }
      
      transformedReviews.push(transformedReview);
    }
    
    return transformedReviews;
    
  } catch (err) {
    console.log(`ℹ️ No reviews found for service ${serviceId}:`, err.message);
    return [];
  }
};

const fetchAllServiceReviews = async () => {
  const allReviews = [];
  
  for (const service of services.value) {
    const serviceReviews = await fetchServiceReviews(service);
    allReviews.push(...serviceReviews);
    
    // Small delay to prevent overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return allReviews;
};

const fetchReviews = async () => {
  try {
    loading.value = true;
    error.value = null;
    reviews.value = [];
    services.value = [];
    
    console.log("=".repeat(50));
    console.log("🔍 STARTING REVIEW FETCH PROCESS");
    console.log("=".repeat(50));
    
    // 1. Get provider ID
    providerId.value = getProviderId();
    if (!providerId.value) {
      throw new Error("Please log in to view reviews.");
    }
    
    console.log("👤 Provider ID:", providerId.value);
    
    // 2. Fetch all services
    await fetchServices();
    
    if (services.value.length === 0) {
      console.log("📭 No services to check for reviews");
      loading.value = false;
      return;
    }
    
    console.log(`🔄 Checking ${services.value.length} services for reviews...`);
    
    // 3. Fetch reviews for each service WITH CUSTOMER DETAILS
    const allReviews = await fetchAllServiceReviews();
    
    // 4. Remove duplicates (by ID)
    const uniqueReviews = [];
    const seenIds = new Set();
    
    allReviews.forEach(review => {
      if (review.id && !seenIds.has(review.id)) {
        seenIds.add(review.id);
        uniqueReviews.push(review);
      }
    });
    
    // 5. Sort by date (newest first)
    uniqueReviews.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });
    
    reviews.value = uniqueReviews;
    
    console.log("=".repeat(50));
    console.log("📊 FETCH RESULTS");
    console.log("=".repeat(50));
    console.log(`✅ Services checked: ${services.value.length}`);
    console.log(`✅ Reviews found: ${reviews.value.length}`);
    console.log(`✅ Services with reviews: ${availableServices.value.length}`);
    
    // Log customer details found
    const reviewsWithCustomerDetails = reviews.value.filter(r => r.customerDetails);
    console.log(`✅ Reviews with customer details: ${reviewsWithCustomerDetails.length}`);
    
    if (reviews.value.length > 0) {
      console.log("\n📋 Reviews found with customer details:");
      reviews.value.forEach((review, index) => {
        console.log(`\n${index + 1}. ${review.serviceName}`);
        console.log(`   Rating: ${review.rating}★`);
        console.log(`   Customer: ${review.userName}`);
        if (review.customerDetails) {
          console.log(`   Email: ${review.customerDetails.email}`);
          console.log(`   Phone: ${review.customerDetails.phonenumber}`);
        }
        console.log(`   Review: "${review.text.substring(0, 50)}${review.text.length > 50 ? '...' : ''}"`);
        console.log(`   Date: ${formatDate(review.date)}`);
      });
    } else {
      console.log("\n📭 No reviews found for any services");
    }
    
    console.log("=".repeat(50));
    
  } catch (err) {
    console.error("❌ ERROR FETCHING REVIEWS:", err);
    
    if (err.response?.status === 401) {
      error.value = "Authentication failed. Please log in again.";
    } else if (err.message.includes("Failed to load services")) {
      error.value = "Could not load your services. Please try again.";
    } else {
      error.value = err.message || "Failed to load reviews. Please try again.";
    }
    
  } finally {
    loading.value = false;
  }
};

// ========== HELPER METHODS ==========
const sortReviewsList = (reviewsList) => {
  const sorted = [...reviewsList];
  
  switch (sortBy.value) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'highest':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'lowest':
      sorted.sort((a, b) => a.rating - b.rating);
      break;
  }
  
  return sorted;
};

const onSearch = () => {
  currentPage.value = 1;
};

const setRatingFilter = (rating) => {
  filterRating.value = filterRating.value === rating ? 0 : rating;
  currentPage.value = 1;
};

const setServiceFilter = (serviceId) => {
  filterService.value = filterService.value === serviceId ? null : serviceId;
  currentPage.value = 1;
};

const setStatusFilter = (status) => {
  filterStatus.value = filterStatus.value === status ? null : status;
  currentPage.value = 1;
};

const applyDateFilter = () => {
  currentPage.value = 1;
};

const clearAllFilters = () => {
  filterRating.value = 0;
  filterService.value = null;
  filterStatus.value = null;
  dateRange.value = 'all';
  customDateStart.value = '';
  customDateEnd.value = '';
  searchQuery.value = '';
  currentPage.value = 1;
};

const getPercentage = (rating) => {
  const count = ratingCounts.value[rating] || 0;
  if (totalReviews.value === 0) return 0;
  return Math.round((count / totalReviews.value) * 100);
};

const getStarClass = (index, rating) => {
  const starValue = index - 0.5;
  if (rating >= index) return 'fa-solid fa-star';
  if (rating >= starValue) return 'fa-solid fa-star-half-alt';
  return 'fa-regular fa-star';
};

const getServiceName = (serviceId) => {
  const service = availableServices.value.find(s => s.id === serviceId);
  return service ? service.title : 'Unknown Service';
};

const getAvatar = (review) => {
  // Use customer's profile photo if available
  if (review.customerDetails?.profilePhoto) {
    return review.customerDetails.profilePhoto;
  }
  if (review.avatar) return review.avatar;
  
  // Generate avatar based on customer name
  const seed = review.userName || review.id || Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const handleImageError = (event) => {
  const seed = Math.random().toString(36).substring(7);
  event.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

// NEW: Toggle customer details
const toggleCustomerDetails = (reviewId) => {
  expandedCustomer.value = expandedCustomer.value === reviewId ? null : reviewId;
};

// Pagination Methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

const loadMoreReviews = () => {
  loadingMore.value = true;
  setTimeout(() => {
    currentPage.value++;
    loadingMore.value = false;
  }, 500);
};

// Review Actions
const openReplyModal = (review) => {
  selectedReview.value = review;
  replyText.value = review.reply || '';
  showReplyModal.value = true;
};

const closeReplyModal = () => {
  showReplyModal.value = false;
  selectedReview.value = null;
  replyText.value = '';
};

const saveReply = async () => {
  if (!selectedReview.value || !replyText.value.trim()) return;
  
  try {
    console.log('Saving reply:', {
      reviewId: selectedReview.value.id,
      reply: replyText.value
    });
    
    // Update local state
    const reviewIndex = reviews.value.findIndex(r => r.id === selectedReview.value.id);
    if (reviewIndex !== -1) {
      reviews.value[reviewIndex].reply = replyText.value;
      reviews.value[reviewIndex].replyDate = new Date().toISOString();
    }
    
    closeReplyModal();
  } catch (error) {
    console.error('Error saving reply:', error);
  }
};

const viewReply = (review) => {
  expandedReply.value = expandedReply.value === review.id ? null : review.id;
};

const deleteReply = async (review) => {
  if (!confirm('Are you sure you want to delete this reply?')) return;
  
  try {
    console.log('Deleting reply for review:', review.id);
    
    const reviewIndex = reviews.value.findIndex(r => r.id === review.id);
    if (reviewIndex !== -1) {
      reviews.value[reviewIndex].reply = '';
      reviews.value[reviewIndex].replyDate = null;
    }
    
    expandedReply.value = null;
  } catch (error) {
    console.error('Error deleting reply:', error);
  }
};

const toggleHelpful = (review) => {
  if (!review.helpfulCount) review.helpfulCount = 0;
  review.helpfulCount++;
};

const reportReview = (review) => {
  const reason = prompt('Please enter the reason for reporting this review:');
  if (reason) {
    console.log('Reporting review:', { reviewId: review.id, reason });
    alert('Review reported successfully.');
  }
};

const exportReviews = () => {
  console.log('Exporting reviews:', filteredReviews.value.length);
  alert(`Export functionality would download ${filteredReviews.value.length} reviews.`);
};

// Initialize
onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
/* Combined CSS - Your original styles + enhanced styles */
.reviews-container {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

/* Header */
.reviews-header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.header-left h1 {
  color: #1e293b;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-left h1 i {
  color: #f59e0b;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.stat-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-label {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0077ff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  color: #666;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.debug-loading {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
}

/* Error */
.error {
  text-align: center;
  padding: 2.5rem;
  background: #fff5f5;
  border: 1px solid #ffcccc;
  border-radius: 12px;
  color: #d32f2f;
}

.error i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.error p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

.retry-btn {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #b71c1c;
  transform: translateY(-1px);
}

/* No Reviews */
.no-reviews {
  text-align: center;
  padding: 2rem;
}

.empty-state {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 700px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.empty-state h3 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 0.75rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.hint {
  font-size: 0.95rem;
  font-style: italic;
  color: #868e96;
  margin-top: 1rem;
}

.services-list {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  text-align: left;
}

.services-list h4 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
}

.service-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f1f3f4;
  transition: background 0.2s;
}

.service-item:hover {
  background: #f8f9fa;
}

.service-item:last-child {
  border-bottom: none;
}

.service-item i {
  color: #0077ff;
  margin-right: 1rem;
  font-size: 1.1rem;
}

.service-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.service-id {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #666;
  background: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  align-self: flex-start;
}

.check-hint {
  font-size: 0.9rem;
  color: #868e96;
  font-style: italic;
  margin-top: 1rem;
  text-align: center;
}

.no-services {
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.no-services i {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 1rem;
  display: block;
}

.no-services p {
  color: #6c757d;
  margin: 0;
}

/* Main Layout */
.reviews-main {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  min-height: calc(100vh - 200px);
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-section,
.analytics-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-section h3,
.analytics-section h3 {
  color: #1e293b;
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group label {
  display: block;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.rating-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.rating-filter:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.rating-filter.active {
  background: #fff7ed;
  border-color: #f59e0b;
  color: #ea580c;
}

.rating-filter .stars {
  display: flex;
  gap: 0.15rem;
}

.rating-filter .stars i {
  font-size: 0.9rem;
}

.rating-filter .count {
  font-weight: 600;
  font-size: 0.85rem;
}

.service-filters,
.status-filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-filter,
.status-filter {
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  text-align: left;
}

.service-filter:hover,
.status-filter:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.service-filter.active,
.status-filter.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
}

.service-filter.replied.active {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #15803d;
}

.service-filter.pending.active {
  background: #fff7ed;
  border-color: #f59e0b;
  color: #ea580c;
}

.service-filter .count {
  float: right;
  font-weight: 600;
  font-size: 0.85rem;
}

.date-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #334155;
  font-size: 0.95rem;
  cursor: pointer;
}

.custom-date-range {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
}

.date-input {
  flex: 1;
}

.date-input label {
  display: block;
  color: #64748b;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.date-input input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.filter-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-clear-filters,
.btn-export {
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-clear-filters {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-clear-filters:hover {
  background: #e2e8f0;
  color: #475569;
}

.btn-export {
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.btn-export:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Analytics */
.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overall-rating {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.rating-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.rating-stars-large {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin: 0.75rem 0;
}

.rating-stars-large i {
  font-size: 1.5rem;
  color: #f59e0b;
}

.rating-count {
  color: #64748b;
  font-size: 0.9rem;
}

.distribution-chart {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.distribution-row {
  display: grid;
  grid-template-columns: 50px 1fr 40px;
  align-items: center;
  gap: 0.75rem;
}

.rating-label {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 0.9rem;
}

.rating-label .percentage {
  font-weight: 600;
  color: #334155;
}

.distribution-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #ea580c);
  border-radius: 4px;
}

.rating-count-small {
  text-align: right;
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
}

.response-rate {
  margin-top: 0.5rem;
}

.response-label {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.response-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.response-percentage {
  font-weight: 700;
  color: #16a34a;
  font-size: 0.95rem;
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.search-box {
  flex: 1;
  position: relative;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #334155;
  background: #f8fafc;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-controls label {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.sort-controls select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #334155;
  font-size: 0.9rem;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
  background: #f8fafc;
  padding: 0.25rem;
  border-radius: 8px;
}

.view-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #e2e8f0;
  color: #64748b;
}

.view-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Active Filters */
.active-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filters-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #3b82f6;
  border-radius: 20px;
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 500;
}

.filter-tag i {
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.7;
}

.filter-tag i:hover {
  opacity: 1;
}

.results-count {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Reviews Display */
.reviews-display {
  display: grid;
  gap: 1.5rem;
}

.reviews-display.list {
  grid-template-columns: 1fr;
}

.reviews-display.grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.review-item {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.review-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.review-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.reviewer-avatar {
  flex-shrink: 0;
  margin-right: 1rem;
}

.reviewer-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.reviewer-info {
  flex: 1;
  min-width: 0;
}

.reviewer-name {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  font-size: 1.05rem;
}

/* NEW: Customer contact info */
.reviewer-contact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.reviewer-email,
.reviewer-phone {
  color: #64748b;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.reviewer-email i,
.reviewer-phone i {
  font-size: 0.7rem;
}

.review-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.review-date,
.review-service {
  color: #64748b;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.review-date i,
.review-service i {
  font-size: 0.75rem;
}

.review-rating {
  flex-shrink: 0;
  text-align: right;
}

.review-rating .stars {
  display: flex;
  gap: 0.15rem;
  margin-bottom: 0.25rem;
}

.review-rating .stars i {
  font-size: 0.9rem;
  color: #f59e0b;
}

.rating-value {
  font-weight: 800;
  color: #1e293b;
  font-size: 1.1rem;
}

.review-content {
  flex: 1;
  margin-bottom: 1.25rem;
}

.review-text {
  color: #334155;
  line-height: 1.6;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* NEW: Customer Details Box */
.customer-details-box {
  margin-top: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.customer-details-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.customer-details-header:hover {
  background: #e2e8f0;
}

.customer-details-header i:first-child {
  color: #3b82f6;
  margin-right: 0.5rem;
}

.customer-details-header i:last-child {
  transition: transform 0.3s ease;
}

.customer-details-content {
  padding: 1rem;
  background: white;
}

.customer-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.customer-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-info-item .label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.customer-info-item .value {
  font-size: 0.9rem;
  color: #334155;
  font-weight: 600;
}

.customer-id {
  font-family: 'Courier New', monospace;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.review-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-reply,
.btn-view-reply,
.btn-helpful,
.btn-report {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: none;
}

.btn-reply {
  background: #3b82f6;
  color: white;
}

.btn-reply:hover {
  background: #2563eb;
}

.btn-view-reply {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-view-reply:hover {
  background: #e2e8f0;
  color: #475569;
}

.btn-helpful {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-helpful:hover {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}

.btn-report {
  background: transparent;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.btn-report:hover {
  background: #fef2f2;
}

.reply-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #22c55e;
  font-size: 0.85rem;
  font-weight: 600;
}

.reply-indicator i {
  font-size: 0.9rem;
}

.reply-section {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #15803d;
  font-weight: 600;
}

.reply-header .reply-date {
  margin-left: auto;
  font-size: 0.85rem;
  font-weight: normal;
  color: #64748b;
}

.reply-content {
  color: #166534;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  cursor: pointer;
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
  gap: 0.5rem;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  cursor: pointer;
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

.ellipsis {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  color: #94a3b8;
}

.page-info {
  margin-left: auto;
  color: #64748b;
  font-size: 0.9rem;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.btn-load-more {
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.btn-load-more:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-load-more:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.btn-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #e2e8f0;
  color: #475569;
}

.modal-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.review-preview {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.reviewer img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer .name {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

/* NEW: Customer details in modal */
.customer-details-small {
  margin-bottom: 0.5rem;
}

.customer-details-small .detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.customer-details-small .detail i {
  font-size: 0.75rem;
  width: 16px;
  text-align: center;
}

.reviewer .rating {
  display: flex;
  gap: 0.15rem;
}

.reviewer .rating i {
  font-size: 0.9rem;
  color: #f59e0b;
}

.review-text-preview {
  color: #334155;
  font-style: italic;
  line-height: 1.5;
  padding-left: 0.5rem;
  border-left: 3px solid #3b82f6;
}

.reply-editor {
  margin-top: 1.5rem;
}

.reply-editor label {
  display: block;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.reply-editor textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  color: #334155;
  resize: vertical;
  transition: all 0.2s ease;
}

.reply-editor textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

.char-count {
  color: #94a3b8;
  font-size: 0.85rem;
}

.tips {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.85rem;
}

.tips i {
  color: #f59e0b;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-save {
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save:hover:not(:disabled) {
  background: #2563eb;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Debug Toggle */
.debug-toggle {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: #6c757d;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  font-size: 0.85rem;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.debug-toggle:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 1200px) {
  .reviews-main {
    grid-template-columns: 240px 1fr;
  }
}

@media (max-width: 992px) {
  .reviews-main {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: sticky;
    top: 1rem;
    z-index: 10;
  }
  
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-box {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .reviews-container {
    padding: 1rem;
  }
  
  .reviews-header h1 {
    font-size: 1.5rem;
  }
  
  .header-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .reviews-display.grid {
    grid-template-columns: 1fr;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .review-rating {
    align-self: flex-start;
  }
  
  .review-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .reply-indicator {
    justify-content: center;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .page-info {
    width: 100%;
    text-align: center;
    margin-top: 0.5rem;
  }
  
  .customer-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .rating-filters {
    grid-template-columns: 1fr;
  }
  
  .filter-tag {
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
  }
  
  .modal-content {
    margin: 0.5rem;
  }
}
</style>