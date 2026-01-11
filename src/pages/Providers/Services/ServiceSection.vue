<!-- src/pages/Providers/Services/ServiceSection.vue -->
<template>
  <div class="services-section">
    <!-- Header Section -->
    <div class="section-header">
      <h1 class="section-title">My Services</h1>
      <p class="section-subtitle">Manage your service offerings and availability</p>
    </div>

    <!-- Status Summary Card -->
    <div class="status-summary-card">
      <div class="status-stats">
        <div class="status-stat">
          <div class="stat-icon total">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ services.length }}</span>
            <span class="stat-label">Total Services</span>
          </div>
        </div>
        <div class="status-stat">
          <div class="stat-icon active">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ activeServicesCount }}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>
        <div class="status-stat">
          <div class="stat-icon draft">
            <i class="fa-solid fa-pen-to-square"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ draftServicesCount }}</span>
            <span class="stat-label">Draft</span>
          </div>
        </div>
        <!-- Reviews Summary -->
        <div class="status-stat">
          <div class="stat-icon reviews">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ reviewsStats.total || 0 }}</span>
            <span class="stat-label">Reviews</span>
          </div>
        </div>
      </div>
      
      <!-- Controls Bar -->
      <div class="controls-bar">
        <div class="controls-left">
          <div class="search-input">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search services..."
            />
          </div>
          <div class="status-filter">
            <select v-model="statusFilter" class="form-control">
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>
        </div>
        <div class="controls-right">
          <button class="btn debug-btn" @click="debugMode = !debugMode">
            <i class="fa-solid fa-bug"></i> {{ debugMode ? 'Hide Debug' : 'Show Debug' }}
          </button>
          <button class="btn add-service-btn" @click="openForm(null)">
            <i class="fa-solid fa-plus"></i> Add New Service
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ errorMessage }}</span>
      <button class="close-error" @click="errorMessage = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-message">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ successMessage }}</span>
      <button class="close-success" @click="successMessage = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading your services...</p>
      <p v-if="debugMode" class="debug-info">Fetching from backend...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="services.length === 0" class="empty-state">
      <i class="fa-solid fa-box-open"></i>
      <h3>No services found</h3>
      <p>You haven't added any services yet.<br />Start by creating your first service!</p>
      <button class="btn primary-btn" @click="openForm(null)">Create Service</button>
    </div>

    <!-- Services Grid - COMPACT -->
    <div v-else class="services-grid compact">
      <div
        v-for="service in filteredServices"
        :key="getServiceKey(service)"
        class="service-card compact"
        :class="{ 'draft-service': getServiceStatus(service) === 'draft' }"
      >
        <!-- Status Badge -->
        <div class="service-status-badge" :class="getServiceStatus(service)">
          <i :class="getServiceStatus(service) === 'draft' ? 'fa-solid fa-clock' : 'fa-solid fa-check-circle'"></i>
          {{ getServiceStatus(service) === 'draft' ? 'Draft' : 'Active' }}
        </div>

        <!-- Banner - FULL WIDTH with improved visibility -->
        <div class="card-banner full-width" @click="previewBanner(service)">
          <img
            v-if="getBannerUrl(service)"
            :src="getBannerUrl(service)"
            :alt="service?.title || 'Service'"
            class="banner-img"
            @error="handleBannerError"
          />
          <div v-else class="banner-placeholder">
            <i class="fa-solid fa-scissors"></i>
          </div>
        </div>

        <!-- Content -->
        <div class="card-content compact">
          <!-- View Mode -->
          <div class="view-mode compact">
            <div class="card-header compact">
              <h3 class="service-title compact">{{ service?.title || 'Untitled Service' }}</h3>
              
              <!-- Category Section -->
              <div class="categories-section compact">
                <div class="category-tag compact">
                  <i class="fa-solid fa-tag"></i>
                  {{ getCategoryName(service?.categoryId || service?.category) }}
                </div>
              </div>

              <!-- Debug: Show Service ID -->
              <div class="service-id-debug" v-if="debugMode">
                <small>ID: {{ getServiceId(service) || 'No ID' }}</small>
                <small>Status: {{ getServiceStatus(service) }}</small>
              </div>
            </div>
            <p class="service-description compact">
              {{ truncateDescription(service?.description || 'No description available') }}
            </p>
            <div class="service-meta compact">
              <div class="price compact">
                <div class="price-label">Price</div>
                <div class="price-amount compact">
                  <span class="total-price compact">{{ service?.totalPrice || 0 }} ETB</span>
                  <span v-if="service?.bookingPrice" class="booking-price">({{ service.bookingPrice }} ETB deposit)</span>
                </div>
              </div>
              <div class="payment compact" v-if="service?.paymentMethod">
                <i class="fa-solid fa-wallet"></i> {{ service.paymentMethod }}
              </div>
            </div>
            
            <!-- Reviews Section -->
            <div class="reviews-summary compact" @click="viewServiceReviews(service)">
              <div class="reviews-header compact">
                <i class="fa-solid fa-star"></i>
                <span class="reviews-title">Reviews</span>
                <span class="reviews-count" v-if="serviceReviews[getServiceId(service)]?.count > 0">
                  {{ serviceReviews[getServiceId(service)]?.count || 0 }}
                </span>
              </div>
              <div class="reviews-preview" v-if="serviceReviews[getServiceId(service)]?.count > 0">
                <div class="reviews-rating">
                  <span class="rating-value">{{ serviceReviews[getServiceId(service)]?.averageRating?.toFixed(1) || '0.0' }}</span>
                </div>
              </div>
              <div class="no-reviews compact" v-else>
                <span>No reviews</span>
              </div>
            </div>
            
            <!-- Availability Summary -->
            <div class="availability-summary compact">
              <template v-if="getServiceStatus(service) === 'active'">
                <div class="availability-header compact">
                  <span class="availability-badge" :class="{ available: hasAnyRealAvailability(service) }">
                    <i :class="hasAnyRealAvailability(service) ? 'fa-solid fa-calendar-check' : 'fa-solid fa-calendar-xmark'"></i>
                    {{ hasAnyRealAvailability(service) ? 'Available' : 'Not Available' }}
                    <span class="days-count" v-if="hasAnyRealAvailability(service)">
                      ({{ getAccurateAvailableDaysCount(service) }} days)
                    </span>
                  </span>
                </div>
              </template>
              <template v-else>
                <div class="draft-notice compact">
                  <i class="fa-solid fa-clock"></i>
                  <span>Add time slots to activate</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Edit Mode - SIMPLIFIED BANNER SECTION -->
          <div v-if="editingServiceId === getServiceId(service)" class="edit-mode compact">
            <div class="edit-header">
              <h3>Edit Service</h3>
              <button class="btn cancel-btn" @click="cancelEdit()">
                Cancel
              </button>
            </div>
            <!-- Title -->
            <div class="form-group compact">
              <label>Title</label>
              <input
                v-model="editingServiceData.title"
                type="text"
                class="form-control compact"
                placeholder="Service title"
              />
            </div>
            <!-- Description -->
            <div class="form-group compact">
              <label>Description</label>
              <textarea
                v-model="editingServiceData.description"
                class="form-control compact"
                rows="2"
                placeholder="Service description"
              ></textarea>
            </div>
            <!-- Pricing -->
            <div class="form-group compact">
              <label>Total Price (ETB)</label>
              <input
                v-model.number="editingServiceData.totalPrice"
                type="number"
                class="form-control compact"
                min="0"
                step="1"
              />
            </div>
            <div class="form-group compact">
              <label>Booking Deposit (ETB)</label>
              <input
                v-model.number="editingServiceData.bookingPrice"
                type="number"
                class="form-control compact"
                min="0"
                step="1"
              />
            </div>
            <!-- Payment Method -->
            <div class="form-group compact">
              <label>Payment Method</label>
              <select v-model="editingServiceData.paymentMethod" class="form-control compact">
                <option value="">Select payment method</option>
                <option value="Telebirr">Telebirr</option>
                <option value="Chapa">Chapa</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            
            <!-- BANNER INFO SECTION - SIMPLIFIED -->
           <!-- BANNER UPLOAD SECTION - ADDED -->
<div class="form-group banner-upload-section">
  <label>Service Banner</label>
  
  <!-- Current Banner Display -->
  <div v-if="getBannerUrl(editingServiceData)" class="current-banner-display">
    <span class="current-banner-label">Current Banner:</span>
    <img :src="getBannerUrl(editingServiceData)" alt="Current banner" class="current-banner" />
  </div>
  
  <!-- Banner Upload Area -->
  <div class="banner-upload-area" @click="triggerFileInput">
    <input 
      :id="'bannerInput_' + editingServiceId"
      type="file" 
      accept="image/*"
      @change="handleBannerFileSelect"
      style="display: none"
    />
    
    <!-- Preview New Banner -->
    <div v-if="editingServiceData.newBannerPreview" class="new-banner-preview">
      <img :src="editingServiceData.newBannerPreview" alt="New banner preview" />
      <button type="button" class="remove-banner-btn" @click.stop="removeNewBanner">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
    
    <!-- Upload Instructions -->
    <div v-else class="upload-instructions">
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <p>Click to {{ getBannerUrl(editingServiceData) ? 'change' : 'upload' }} banner</p>
      <p class="upload-hint">Click to select image</p>
      <p class="upload-hint">Max size: 5MB</p>
    </div>
  </div>
  
  <!-- Banner Note -->
  <div class="banner-note">
    <small><i class="fa-solid fa-info-circle"></i> {{ getBannerUrl(editingServiceData) ? 'Upload a new image to replace current banner' : 'Upload a banner image for your service' }}</small>
  </div>
</div>
            
            <!-- Save Button -->
            <div class="edit-actions compact">
              <button class="btn save-btn compact" @click="saveService()" :disabled="saving">
                <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Actions - EDIT, TIME SLOTS, DELETE -->
        <div class="card-actions compact">
          <button class="action-btn edit compact" @click.stop="startEdit(service)" :disabled="!getServiceId(service)">
            <i class="fa-solid fa-pen"></i> Edit Service
          </button>
          <!-- FIXED: Time Slots button -->
          <button class="action-btn manage-slots compact" @click.stop="openTimeSlots(service)" :disabled="!getServiceId(service)">
            <i class="fa-solid fa-calendar-edit"></i> Manage Schedules
          </button>
          <button class="action-btn delete compact" @click.stop="confirmDelete(getServiceId(service), service?.title)" :disabled="!getServiceId(service)">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Debug Panel -->
    <div v-if="debugMode" class="debug-panel">
      <h4>Debug Information</h4>
      <p>Total Services: {{ services.length }}</p>
      <p>Active Services: {{ activeServicesCount }}</p>
      <p>Draft Services: {{ draftServicesCount }}</p>
      <p>Services with IDs: {{ services.filter(s => getServiceId(s)).length }}</p>
      <p>Loading: {{ loading }}</p>
      <p>Last Error: {{ lastError }}</p>
      <div v-for="(service, index) in services" :key="index">
        Service {{ index }}: "{{ service?.title || 'NULL SERVICE' }}" - 
        ID: {{ getServiceId(service) || 'MISSING' }} - 
        Status: {{ getServiceStatus(service) }}
      </div>
    </div>

    <!-- Service Form Modal -->
    <transition name="modal-fade">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal service-form-modal" @click.stop>
          <div class="modal-header">
            <h2>{{ editingService ? 'Edit Service' : 'Create New Service' }}</h2>
            <button class="close-btn" @click="closeForm" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <ServiceForm
            :service="editingService"
            :isEditing="!!editingService"
            :initialCategories="categories"
            @save="onServiceSaved"
            @close="closeForm"
          />
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="modal delete-modal" @click.stop>
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete "<strong>{{ serviceToDeleteTitle }}</strong>"? This action cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn cancel-btn" @click="showDeleteConfirm = false">Cancel</button>
            <button class="btn delete-btn" @click="deleteService" :disabled="deleting">
              <i v-if="deleting" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-trash"></i>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Time Slots Modal -->
    <transition name="modal-fade">
      <div v-if="showTimeSlotsModal" class="modal-overlay" @click.self="closeTimeSlotsModal">
        <div class="modal time-slots-modal" @click.stop>
          <div class="modal-header">
            <h2>Manage Time Slots - {{ selectedTimeSlotsService?.title }}</h2>
            <button class="close-btn" @click="closeTimeSlotsModal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-content">
            <!-- TimeSlots Component -->
            <TimeSlots 
              v-if="selectedTimeSlotsService"
              :service="selectedTimeSlotsService"
              :serviceId="getServiceId(selectedTimeSlotsService)"
              @close="closeTimeSlotsModal"
              @saved="handleTimeSlotsSaved"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Reviews Modal -->
    <transition name="modal-fade">
      <div v-if="showReviewsModal" class="modal-overlay" @click.self="closeReviewsModal">
        <div class="modal reviews-modal" @click.stop>
          <div class="modal-header">
            <h2>
              <i class="fa-solid fa-star"></i>
              Reviews for {{ selectedServiceForReviews?.title || 'Service' }}
            </h2>
            <button class="close-btn" @click="closeReviewsModal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-content">
            <!-- Loading State -->
            <div v-if="loadingReviews" class="reviews-loading">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <p>Loading reviews...</p>
            </div>
            
            <!-- Reviews Content -->
            <div v-else-if="showReviewsContent">
              <!-- No Reviews State -->
              <div v-if="selectedServiceReviews.length === 0" class="no-reviews-content">
                <i class="fa-regular fa-comment-dots"></i>
                <h4>No Reviews Yet</h4>
                <p>This service hasn't received any reviews yet.<br>Reviews will appear here once customers leave feedback.</p>
              </div>
              
              <!-- Has Reviews State -->
              <div v-else>
                <!-- Reviews Overview -->
                <div class="reviews-overview">
                  <div class="overview-stats">
                    <div class="overview-stat">
                      <div class="overview-number">{{ selectedServiceRating.toFixed(1) }}</div>
                      <div class="overview-label">Average Rating</div>
                    </div>
                    <div class="overview-stat">
                      <div class="overview-number">{{ selectedServiceReviews.length }}</div>
                      <div class="overview-label">Total Reviews</div>
                    </div>
                  </div>
                </div>
                
                <!-- Reviews List -->
                <div class="reviews-list">
                  <div class="reviews-header">
                    <h4>Customer Reviews ({{ selectedServiceReviews.length }})</h4>
                    <select v-model="reviewsSortBy" class="sort-select">
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>
                  
                  <div class="review-items">
                    <div v-for="review in sortedReviews" :key="review._id" class="review-item">
                      <div class="reviewer-info">
                        <div class="reviewer-avatar">
                          {{ getReviewerInitials(review) }}
                        </div>
                        <div class="reviewer-details">
                          <h5 class="reviewer-name">{{ review.reviewerName }}</h5>
                          <div class="review-meta">
                            <div class="review-rating">
                              <i v-for="n in 5" :key="n" 
                                 class="fa-star"
                                 :class="n <= review.rating ? 'fa-solid' : 'fa-regular'">
                              </i>
                            </div>
                            <span class="review-date">{{ formatReviewDate(review.createdAt) }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="review-content">
                        <p class="review-message">{{ review.message }}</p>
                      </div>
                      
                      <!-- Reply Section -->
                      <div v-if="review.reply" class="review-reply">
                        <strong><i class="fa-solid fa-reply"></i> Your Reply</strong>
                        <p>{{ review.reply }}</p>
                      </div>
                      
                      <!-- Reply Button -->
                      <div v-else class="review-actions">
                        <button class="reply-btn" @click="replyToReview(review)">
                          <i class="fa-solid fa-reply"></i> Reply to Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn close-modal-btn" @click="closeReviewsModal">
              <i class="fa-solid fa-check"></i> Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Banner Preview Modal -->
    <transition name="modal-fade">
      <div v-if="showBannerPreview" class="modal-overlay" @click.self="showBannerPreview = false">
        <div class="modal banner-preview-modal" @click.stop>
          <div class="modal-header">
            <h2>Banner Preview</h2>
            <button class="close-btn" @click="showBannerPreview = false" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-content">
            <img 
              :src="previewBannerUrl" 
              alt="Banner Preview" 
              class="banner-preview-img"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ServiceForm from './ServiceForm.vue';
import TimeSlots from './TimeSlots.vue';
import http from "@/api/index.js";

export default {
  name: 'ServiceSection',
  components: { ServiceForm, TimeSlots },
  data() {
    return {
      services: [],
      categories: [],
      loading: false,
      showForm: false,
      editingService: null,
      editingServiceId: null,
      editingServiceData: null,
      searchQuery: '',
      statusFilter: 'all',
      showDeleteConfirm: false,
      serviceToDelete: null,
      serviceToDeleteTitle: '',
      deleting: false,
      saving: false,
      errorMessage: '',
      successMessage: '',
      debugMode: false,
      lastError: null,
      
      // Time Slots Modal State
      showTimeSlotsModal: false,
      selectedTimeSlotsService: null,
      
      // Reviews State
      showReviewsModal: false,
      showReviewsContent: false,
      selectedServiceForReviews: null,
      selectedServiceReviews: [],
      loadingReviews: false,
      serviceReviews: {},
      reviewsStats: {
        total: 0,
        averageRating: 0,
        distribution: {}
      },
      reviewsSortBy: 'newest',
      
      // Banner Preview State
      showBannerPreview: false,
      previewBannerUrl: '',
    };
  },
  computed: {
    filteredServices() {
      let result = this.services.filter(service => service != null);
      if (this.statusFilter !== 'all') {
        result = result.filter(s => this.getServiceStatus(s) === this.statusFilter);
      }
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(s =>
          (s?.title || '').toLowerCase().includes(q) ||
          (s?.description || '').toLowerCase().includes(q) ||
          this.getCategoryName(s?.categoryId || s?.category).toLowerCase().includes(q)
        );
      }
      return result;
    },
    activeServicesCount() {
      return this.services.filter(s => this.getServiceStatus(s) === 'active').length;
    },
    draftServicesCount() {
      return this.services.filter(s => this.getServiceStatus(s) === 'draft').length;
    },
    selectedServiceRating() {
      if (this.selectedServiceReviews.length === 0) return 0;
      const sum = this.selectedServiceReviews.reduce((acc, review) => acc + (review.rating || 0), 0);
      return Math.round((sum / this.selectedServiceReviews.length) * 10) / 10;
    },
    sortedReviews() {
      const reviews = [...this.selectedServiceReviews];
      switch (this.reviewsSortBy) {
        case 'newest':
          return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
          return reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'highest':
          return reviews.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'lowest':
          return reviews.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        default:
          return reviews;
      }
    }
  },
  async created() {
    await this.fetchCategories();
    await this.fetchServices();
    this.loadAllReviews().catch(error => {
      console.warn('Could not load reviews initially:', error);
    });
  },
  methods: {
    // ===== SERVICE ID MANAGEMENT =====
    getServiceId(service) {
      if (!service) return null;
      return service._id || service.serviceId || service.id || null;
    },
    
    getServiceKey(service) {
      if (!service) return Math.random();
      const id = this.getServiceId(service);
      return id || service.title || Math.random();
    },
    
    getServiceIdentifier(service) {
      return this.getServiceId(service);
    },
    
    validateService(service) {
      if (!service) return false;
      
      const id = this.getServiceIdentifier(service);
      if (!id || typeof id !== 'string' || id.length < 10) {
        console.warn('Invalid service ID:', id);
        return false;
      }
      
      if (!service.title || service.title.trim() === '') {
        console.warn('Service missing title:', service);
        return false;
      }
      
      return true;
    },

    // ===== SERVICE STATUS - FIXED VERSION =====
    getServiceStatus(service) {
      if (!service) return 'draft';
      
      // Debug: Log service structure
      if (this.debugMode) {
        console.log('🔍 Service Status Check:', {
          serviceId: this.getServiceId(service),
          hasSlots: !!service.slots,
          slotsCount: service.slots ? service.slots.length : 0,
          slotsStructure: service.slots ? JSON.stringify(service.slots[0]) : 'no slots'
        });
      }
      
      // Check if service has slots array
      if (!service.slots || !Array.isArray(service.slots) || service.slots.length === 0) {
        return 'draft';
      }
      
      // Check if any slot has a schedule with timeSlots
      const hasRealSlots = service.slots.some(slot => {
        if (!slot || !slot.schedule) return false;
        
        // Check if schedule is an array and has items
        if (Array.isArray(slot.schedule)) {
          return slot.schedule.some(daySchedule => {
            if (!daySchedule) return false;
            
            // Check if this day has working hours
            if (daySchedule.isWorkingDay === true) {
              // Check if timeSlots exist and are not empty
              if (daySchedule.timeSlots && 
                  Array.isArray(daySchedule.timeSlots) && 
                  daySchedule.timeSlots.length > 0) {
                
                // Check if any time slot is available
                return daySchedule.timeSlots.some(timeSlot => 
                  timeSlot && timeSlot.isAvailable !== false
                );
              }
            }
            return false;
          });
        }
        return false;
      });
      
      return hasRealSlots ? 'active' : 'draft';
    },
    
    // ===== DEBUG METHOD FOR SERVICE SLOTS =====
    debugServiceSlots(service) {
      console.log('🔍 Service slots debug:', {
        serviceId: this.getServiceId(service),
        title: service.title,
        hasSlots: !!service.slots,
        slotsCount: service.slots ? service.slots.length : 0,
        slots: service.slots ? JSON.stringify(service.slots, null, 2) : 'no slots',
        status: this.getServiceStatus(service)
      });
      
      if (service.slots && service.slots.length > 0) {
        service.slots.forEach((slot, index) => {
          console.log(`  Slot ${index}:`, {
            hasSchedule: !!slot.schedule,
            scheduleType: Array.isArray(slot.schedule) ? 'array' : typeof slot.schedule,
            scheduleLength: Array.isArray(slot.schedule) ? slot.schedule.length : 'N/A',
            scheduleSample: slot.schedule && Array.isArray(slot.schedule) && slot.schedule.length > 0 
              ? JSON.stringify(slot.schedule[0]) 
              : 'no schedule'
          });
        });
      }
    },
    
    hasAnyRealAvailability(service) {
      return this.getServiceStatus(service) === 'active';
    },
    
    // UPDATED: Get accurate available days count from schedule
    getAccurateAvailableDaysCount(service) {
      if (!service || !service.slots || !Array.isArray(service.slots)) return 0;
      
      const availableDays = new Set();
      
      service.slots.forEach(slot => {
        if (slot && slot.schedule && Array.isArray(slot.schedule)) {
          slot.schedule.forEach(daySchedule => {
            // Check if this day has any available time slots
            if (this.isDayAvailable(daySchedule)) {
              const dateStr = daySchedule.date || daySchedule.day;
              if (dateStr) {
                availableDays.add(dateStr);
              }
            }
          });
        }
      });
      
      // Return count of unique available days
      return availableDays.size;
    },
    
    // NEW: Improved method to check if a day is available
    isDayAvailable(daySchedule) {
      if (!daySchedule) return false;
      if (daySchedule.isWorkingDay !== true) return false;
      if (!daySchedule.timeSlots || !Array.isArray(daySchedule.timeSlots)) return false;
      
      // Check if any time slot is available
      return daySchedule.timeSlots.some(slot => 
        slot && slot.isAvailable === true
      );
    },

    // ===== BANNER METHODS - IMPROVED =====
    getBannerUrl(service) {
      if (!service || !service.banner) return null;
      
      if (typeof service.banner === 'string') {
        return service.banner;
      }
      
      if (typeof service.banner === 'object' && service.banner.url) {
        return service.banner.url;
      }
      
      if (Array.isArray(service.banner) && service.banner.length > 0) {
        const firstItem = service.banner[0];
        if (typeof firstItem === 'string') return firstItem;
        if (typeof firstItem === 'object' && firstItem.url) return firstItem.url;
      }
      
      return null;
    },
    
    handleBannerError(event) {
      console.warn('Banner image failed to load');
      event.target.style.display = 'none';
      // Show placeholder instead
      const parent = event.target.parentElement;
      if (parent) {
        const placeholder = document.createElement('div');
        placeholder.className = 'banner-placeholder';
        placeholder.innerHTML = '<i class="fa-solid fa-scissors"></i>';
        parent.appendChild(placeholder);
      }
    },
    
    // NEW: Banner preview functionality
    previewBanner(service) {
      const bannerUrl = this.getBannerUrl(service);
      if (bannerUrl) {
        this.previewBannerUrl = bannerUrl;
        this.showBannerPreview = true;
      }
    },

    // ===== BANNER UPLOAD METHODS - ADDED =====
    triggerFileInput() {
      if (!this.editingServiceId) return;
      
      const inputId = 'bannerInput_' + this.editingServiceId;
      const fileInput = document.getElementById(inputId);
      
      if (fileInput) {
        fileInput.click();
      } else {
        console.warn('File input not found:', inputId);
      }
    },
    
    handleBannerFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.match('image.*')) {
          this.setError("Please select an image file (JPG, PNG, WebP).");
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.setError("File size should be less than 5MB.");
          return;
        }
        
        // Store the file
        this.editingServiceData.bannerFile = file;
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editingServiceData.newBannerPreview = e.target.result;
        };
        reader.readAsDataURL(file);
        
        console.log('New banner selected:', file.name);
      }
    },
    
    removeNewBanner() {
      this.editingServiceData.bannerFile = null;
      this.editingServiceData.newBannerPreview = null;
      
      // Clear file input
      const inputId = 'bannerInput_' + this.editingServiceId;
      const fileInput = document.getElementById(inputId);
      if (fileInput) {
        fileInput.value = '';
      }
    },

    // ===== SERVICE METHODS =====
    truncateDescription(description, maxLength = 60) {
      if (!description) return '';
      if (description.length <= maxLength) return description;
      return description.substring(0, maxLength) + '...';
    },
    
    setError(message) {
      this.errorMessage = message;
      this.lastError = message;
      setTimeout(() => { this.errorMessage = ''; }, 5000);
    },
    
    setSuccess(message) {
      this.successMessage = message;
      setTimeout(() => { this.successMessage = ''; }, 3000);
    },
    
    closeForm() {
      this.showForm = false;
      this.editingService = null;
    },
    
    async fetchCategories() {
      try {
        const res = await http.get("/categories");
        this.categories = res.data;
      } catch (err) {
        console.warn("Failed to load categories for display");
      }
    },
    
    getCategoryName(idOrName) {
      if (!idOrName) return "Uncategorized";
      if (typeof idOrName === 'string' && /[a-zA-Z]/.test(idOrName)) {
        return idOrName;
      }
      const cat = this.categories.find(c => c._id === idOrName);
      return cat ? cat.name : "Unknown";
    },
    
    async fetchServices() {
      this.loading = true;
      this.errorMessage = '';
      this.lastError = null;
      try {
        const res = await http.get('/services');
        const servicesData = res.data;
        let processedServices = [];
        
        if (Array.isArray(servicesData)) {
          processedServices = servicesData.filter(service => {
            if (!service || typeof service !== 'object') return false;
            
            const serviceId = this.getServiceId(service);
            
            if (serviceId === 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa') {
              console.warn('Removing test service with malformed ID:', serviceId);
              return false;
            }
            
            if (serviceId && serviceId.match(/^a+$/)) {
              console.warn('Removing service with suspicious ID pattern:', serviceId);
              return false;
            }
            
            return true;
          });
          
          console.log(`Loaded ${processedServices.length} valid services`);
          
          // Debug: Log service slots structure
          if (this.debugMode) {
            processedServices.forEach((service, index) => {
              console.log(`Service ${index} (${service.title}):`, {
                id: this.getServiceId(service),
                slotsCount: service.slots ? service.slots.length : 0,
                status: this.getServiceStatus(service)
              });
            });
          }
        } else {
          console.warn('Unexpected services data format:', typeof servicesData);
          processedServices = [];
        }
        
        const validServices = processedServices.filter(s => this.validateService(s));
        console.log(`Filtered from ${processedServices.length} to ${validServices.length} valid services`);
        
        this.services = validServices;
      } catch (err) {
        console.error("Failed to fetch services:", err);
        const errorMsg = err.response?.data?.message || err.message || "Could not load services";
        this.setError(errorMsg);
        this.services = [];
      } finally {
        this.loading = false;
      }
    },
    
    // ===== START EDIT - UPDATED WITH BANNER FIELDS =====
    startEdit(service) {
      if (!service) {
        this.setError("Cannot edit service: Service data is missing");
        return;
      }
      const serviceId = this.getServiceId(service);
      if (!serviceId) {
        this.setError("This service cannot be edited (missing service ID).");
        return;
      }
      
      // Deep copy the service data
      this.editingServiceData = JSON.parse(JSON.stringify(service));
      this.editingServiceId = serviceId;
      
      // Initialize banner upload fields
      this.editingServiceData.bannerFile = null;
      this.editingServiceData.newBannerPreview = null;
    },
    
    // ===== SAVE SERVICE - EXACT ORIGINAL PATTERN WITH BANNER =====
    async saveService() {
      if (!this.editingServiceData || !this.editingServiceId) {
        this.setError("No service data to save.");
        return;
      }
      
      this.saving = true;
      try {
        // Prepare service data - EXACTLY LIKE ORIGINAL
        const serviceData = {
          title: String(this.editingServiceData.title || '').trim(),
          description: String(this.editingServiceData.description || '').trim(),
          totalPrice: Math.max(0, Number(this.editingServiceData.totalPrice) || 0),
          bookingPrice: Math.max(0, Number(this.editingServiceData.bookingPrice) || 0),
          paymentMethod: String(this.editingServiceData.paymentMethod || 'Telebirr'),
          serviceType: String(this.editingServiceData.serviceType || 'fixed'),
          priceUnit: String(this.editingServiceData.priceUnit || 'ETB')
        };

        // Add category if exists
        if (this.editingServiceData.category) {
          serviceData.category = this.editingServiceData.category;
        }
        if (this.editingServiceData.categoryId) {
          serviceData.categoryId = this.editingServiceData.categoryId;
        }

        // ===== SIMPLE LOGIC: If banner, use FormData. If no banner, use JSON =====
        if (this.editingServiceData.bannerFile) {
          // Create FormData for file upload
          const formData = new FormData();
          
          // Add all service data to FormData
          Object.keys(serviceData).forEach(key => {
            formData.append(key, serviceData[key]);
          });
          
          // Add banner file
          formData.append('banner', this.editingServiceData.bannerFile);
          
          // Update the service with FormData (for banner)
          await http.put(`/services/${this.editingServiceId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
        } else {
          // Update the service (no banner) - EXACT ORIGINAL CODE
          await http.put(`/services/${this.editingServiceId}`, serviceData);
        }
        
        this.setSuccess("Service updated successfully!");
        
        // ===== ORIGINAL WORKING PATTERN: Refresh services list =====
        await this.fetchServices();
        
        // Close edit mode - EXACT ORIGINAL CODE
        this.editingServiceId = null;
        this.editingServiceData = null;
        
      } catch (err) {
        console.error('Save failed:', err);
        let errorMessage = "Failed to save service";
        if (err.response?.status === 500) {
          errorMessage = "Backend server error. The service might be temporarily unavailable.";
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = "Request timeout. Please try again.";
        } else if (err.response?.data?.message) {
          errorMessage = `Backend error: ${err.response.data.message}`;
        } else if (err.message) {
          errorMessage = `Error: ${err.message}`;
        }
        this.setError(errorMessage);
      } finally {
        this.saving = false;
      }
    },
    
    cancelEdit() {
      this.editingServiceId = null;
      this.editingServiceData = null;
    },
    
    confirmDelete(serviceId, serviceTitle) {
      if (!serviceId) {
        this.setError("Cannot delete service: No ID found");
        return;
      }
      this.serviceToDelete = serviceId;
      this.serviceToDeleteTitle = serviceTitle || 'this service';
      this.showDeleteConfirm = true;
    },
    
    async deleteService() {
      if (!this.serviceToDelete) return;
      this.deleting = true;
      try {
        await http.delete(`/services/${this.serviceToDelete}`);
        await this.fetchServices();
        this.showDeleteConfirm = false;
        this.setSuccess("Service deleted successfully!");
      } catch (err) {
        console.error("Failed to delete service:", err);
        const msg = err.response?.data?.message || err.message || "Failed to delete service";
        this.setError(msg);
      } finally {
        this.deleting = false;
        this.serviceToDelete = null;
        this.serviceToDeleteTitle = '';
      }
    },
    
    openForm(service) {
      this.editingService = service ? { ...service } : null;
      this.showForm = true;
      // Close inline edit if open
      if (this.editingServiceId) {
        this.editingServiceId = null;
        this.editingServiceData = null;
      }
    },
    
    // ===== SERVICE FORM HANDLER - FIXED =====
    async onServiceSaved(savedService) {
      console.log('🎯 ServiceSection: Received saved service:', savedService);
      
      try {
        const serviceId = this.getServiceIdentifier(savedService);
        if (!serviceId) {
          console.error('No service ID in saved service:', savedService);
          throw new Error('Service saved but no ID returned');
        }
        
        // Update or add service in local array
        const index = this.services.findIndex(s => 
          this.getServiceIdentifier(s) === serviceId
        );
        
        if (index >= 0) {
          // Update existing service
          this.services.splice(index, 1, {
            ...this.services[index],
            ...savedService,
            banner: savedService.banner || this.services[index].banner
          });
          console.log('✅ Updated existing service at index:', index);
        } else {
          // Add new service at the beginning
          this.services.unshift({
            ...savedService,
            _id: serviceId,
            serviceId: serviceId,
            id: serviceId
          });
          console.log('✅ Added new service to beginning of list');
        }
        
        // Update reviews for this service
        await this.loadServiceReviews(serviceId);
        
        this.setSuccess("Service saved successfully!");
        this.closeForm();
        
      } catch (error) {
        console.error('Error handling saved service:', error);
        // Fallback to full refresh
        await this.fetchServices();
        this.setSuccess("Service saved! Refreshing list...");
        this.closeForm();
      }
    },
    
    // ===== TIME SLOTS - FIXED =====
    openTimeSlots(service) {
      const serviceId = this.getServiceId(service);
      if (!serviceId) {
        this.setError("Please save the service first before adding time slots");
        // Try to open edit mode instead
        this.startEdit(service);
        return;
      }
      
      // Check if service exists in our list
      const existingService = this.services.find(s => 
        this.getServiceId(s) === serviceId
      );
      
      if (!existingService) {
        this.setError("Service not found in local list. Please refresh.");
        return;
      }
      
      this.selectedTimeSlotsService = existingService;
      this.showTimeSlotsModal = true;
      
      // Debug the service before opening
      this.debugServiceSlots(existingService);
      
      console.log('Opening time slots for:', {
        serviceId,
        serviceTitle: existingService.title,
        status: this.getServiceStatus(existingService)
      });
    },
    
    closeTimeSlotsModal() {
      this.showTimeSlotsModal = false;
      this.selectedTimeSlotsService = null;
    },
    
    // ===== UPDATED: Time Slots Saved Handler =====
    async handleTimeSlotsSaved(result) {
      try {
        console.log('🎯 Time slots saved result:', result);
        
        // Refresh the services list to get updated data
        await this.fetchServices();
        
        // Update the specific service in the local array
        const serviceId = this.selectedTimeSlotsService ? 
          this.getServiceId(this.selectedTimeSlotsService) : null;
        
        if (serviceId && result.success) {
          this.setSuccess("Schedule saved successfully! Service is now active.");
          
          // Find and update the specific service
          const index = this.services.findIndex(s => this.getServiceId(s) === serviceId);
          if (index !== -1) {
            // Debug the updated service
            console.log('✅ Updated service after time slots save:', {
              index,
              serviceId,
              title: this.services[index].title,
              slotsCount: this.services[index].slots ? this.services[index].slots.length : 0,
              status: this.getServiceStatus(this.services[index])
            });
            
            // Force a re-render by updating the array
            this.services = [...this.services];
          }
        } else {
          this.setSuccess("Time slots saved successfully!");
        }
        
      } catch (error) {
        console.error('Error handling time slots save:', error);
        this.setError("Failed to update service status. Please refresh the page.");
      } finally {
        this.closeTimeSlotsModal();
      }
    },

    // ===== REVIEWS METHODS =====
    async loadAllReviews() {
      try {
        if (!this.services || this.services.length === 0) {
          return;
        }
        
        const reviewPromises = this.services.map(async (service) => {
          const serviceId = this.getServiceId(service);
          if (!serviceId) return null;
          
          await this.loadServiceReviews(serviceId);
        });
        
        await Promise.all(reviewPromises);
        this.updateReviewsStats();
        
      } catch (error) {
        console.error('Error loading all reviews:', error);
      }
    },
    
    async loadServiceReviews(serviceId) {
      try {
        const endpoint = `/reviews/service/${serviceId}`;
        const response = await http.get(endpoint);
        const data = response.data;
        
        let reviews = [];
        if (Array.isArray(data)) {
          reviews = data;
        } else if (data && data.reviews && Array.isArray(data.reviews)) {
          reviews = data.reviews;
        } else if (data && data.data && Array.isArray(data.data)) {
          reviews = data.data;
        }
        
        const processedReviews = reviews.map(review => ({
          _id: review._id || review.id || Math.random().toString(36).substr(2, 9),
          reviewerName: review.customerName || review.reviewerName || review.user?.name || review.customer?.name || 'Anonymous',
          reviewerEmail: review.customerEmail || review.reviewerEmail || review.user?.email || review.customer?.email,
          rating: review.rating || 0,
          message: review.review || review.message || review.comment || review.content || '',
          createdAt: review.createdAt || review.date || review.timestamp || new Date().toISOString(),
          reply: review.reply || review.response || ''
        }));
        
        let averageRating = 0;
        if (processedReviews.length > 0) {
          averageRating = processedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / processedReviews.length;
        }
        
        this.serviceReviews[serviceId] = {
          reviews: processedReviews,
          count: processedReviews.length,
          averageRating: averageRating
        };
        
        this.updateReviewsStats();
        
        return processedReviews;
      } catch (error) {
        console.log(`Could not load reviews for service ${serviceId}:`, error.message);
        this.serviceReviews[serviceId] = {
          reviews: [],
          count: 0,
          averageRating: 0
        };
        return [];
      }
    },
    
    async viewServiceReviews(service) {
      const serviceId = this.getServiceId(service);
      if (!serviceId) {
        this.setError("Cannot view reviews: Service ID is missing");
        return;
      }
      
      this.selectedServiceForReviews = service;
      this.loadingReviews = true;
      this.showReviewsModal = true;
      this.showReviewsContent = false;
      this.selectedServiceReviews = [];
      
      try {
        const reviews = await this.loadServiceReviews(serviceId);
        this.selectedServiceReviews = reviews;
        
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.selectedServiceReviews = [];
      } finally {
        this.loadingReviews = false;
        this.showReviewsContent = true;
      }
    },
    
    updateReviewsStats() {
      let totalReviews = 0;
      let totalRating = 0;
      
      Object.values(this.serviceReviews).forEach(serviceReview => {
        if (serviceReview.count > 0) {
          totalReviews += serviceReview.count;
          totalRating += serviceReview.averageRating * serviceReview.count;
        }
      });
      
      this.reviewsStats = {
        total: totalReviews,
        averageRating: totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0
      };
    },
    
    closeReviewsModal() {
      this.showReviewsModal = false;
      this.showReviewsContent = false;
      this.selectedServiceForReviews = null;
      this.selectedServiceReviews = [];
      this.reviewsSortBy = 'newest';
    },
    
    getReviewerInitials(review) {
      const name = review.reviewerName || 'Anonymous';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },
    
    formatReviewDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return '';
      }
    },
    
    async replyToReview(review) {
      const reply = prompt('Enter your reply to this review:');
      if (!reply) return;
      
      try {
        await http.post(`/reviews/${review._id}/reply`, { reply });
        review.reply = reply;
        this.setSuccess('Reply sent successfully!');
      } catch (error) {
        console.error('Error replying to review:', error);
        this.setError('Failed to send reply. Please try again.');
      }
    },
    
    // ===== CACHE MANAGEMENT =====
    clearServiceCache() {
      this.services = [];
      this.serviceReviews = {};
      this.successMessage = '';
      this.errorMessage = '';
    }
  }
};
</script>

<style scoped>
/* ===== IMPROVED: Banner Styles ===== */
.card-banner.full-width {
  position: relative;
  height: 140px;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-banner.full-width:hover {
  opacity: 0.95;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.5s ease;
}

.card-banner.full-width:hover .banner-img {
  transform: scale(1.05);
}

.banner-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  opacity: 0.8;
}

/* ===== IMPROVED: Time Slots Modal Styles ===== */
.time-slots-modal {
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.time-slots-modal .modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Make sure TimeSlots component fits */
.time-slots-modal :deep(.time-slots-container) {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}

/* ===== UPDATED: Banner Info Section Styles ===== */
.banner-info-section {
  margin: 1rem 0;
}

.banner-info-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.current-banner-info {
  max-height: 150px;
  overflow: hidden;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.current-banner {
  width: 100%;
  height: auto;
  max-height: 120px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
}

.banner-note {
  margin-top: 0.5rem;
  text-align: center;
  color: #4a5568;
  font-size: 0.8rem;
  padding: 0.5rem;
  background: #edf2f7;
  border-radius: 6px;
  width: 100%;
}

.banner-note i {
  margin-right: 0.25rem;
  color: #3182ce;
}

.no-banner-info {
  padding: 2rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  color: #4a5568;
}

.no-banner-info i {
  font-size: 2.5rem;
  color: #a0aec0;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.7;
}

.no-banner-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.edit-full-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-top: 1rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-full-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* ===== NEW: Banner Preview Modal ===== */
.banner-preview-modal {
  max-width: 800px;
  max-height: 90vh;
}

.banner-preview-modal .modal-content {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a202c;
}

.banner-preview-img {
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  display: block;
}

/* ===== IMPROVED: Availability Badge ===== */
.availability-badge.available {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #276749;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(56, 161, 105, 0.2);
}

.days-count {
  font-size: 0.75rem;
  font-weight: 500;
  color: #276749;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  margin-left: 0.25rem;
}

/* ===== REST OF YOUR EXISTING STYLES ===== */
/* ... All your existing styles remain here ... */

/* ===== BASE STYLES ===== */
.services-section {
  padding: 2rem;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  max-width: 100%;
  overflow-x: hidden;
}

/* ===== SECTION HEADER ===== */
.section-header {
  text-align: left;
  margin-bottom: 2.5rem;
  padding: 0;
}

.section-title {
  font-size: 2.5rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.section-subtitle {
  color: #718096;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 600px;
  margin: 0;
  line-height: 1.5;
}

/* ===== STATUS SUMMARY CARD ===== */
.status-summary-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.status-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.2s ease;
}

.status-stat:hover {
  border-color: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-icon.total {
  background: #edf2f7;
  color: #4a5568;
}

.stat-icon.active {
  background: #c6f6d5;
  color: #38a169;
}

.stat-icon.draft {
  background: #fed7d7;
  color: #e53e3e;
}

.stat-icon.reviews {
  background: #fef3c7;
  color: #d97706;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== CONTROLS BAR ===== */
.controls-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .controls-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.controls-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

@media (min-width: 768px) {
  .controls-left {
    flex-direction: row;
    align-items: center;
    width: auto;
    flex: 1;
    max-width: 600px;
  }
}

.controls-right {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 768px) {
  .controls-right {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
}

.search-input {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-input i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  z-index: 2;
}

.search-input input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.status-filter {
  min-width: 160px;
}

.status-filter select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a0aec0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  padding-right: 2.5rem;
}

.status-filter select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.add-service-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
}

@media (min-width: 768px) {
  .add-service-btn {
    width: auto;
  }
}

.add-service-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

.debug-btn {
  background: #718096;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
}

@media (min-width: 768px) {
  .debug-btn {
    width: auto;
  }
}

.debug-btn:hover {
  background: #4a5568;
  transform: translateY(-1px);
}

/* ===== COMPACT SERVICES GRID ===== */
.services-grid.compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1rem;
  padding: 0.5rem 0;
  width: 100%;
}

/* ===== COMPACT SERVICE CARD ===== */
.service-card.compact {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  border: 1px solid #e2e8f0;
}

.service-card.compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #3182ce;
}

/* ===== SERVICE STATUS BADGE ===== */
.service-status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.service-status-badge.draft {
  color: #e53e3e;
}

.service-status-badge.active {
  color: #38a169;
}

/* ===== COMPACT CARD CONTENT ===== */
.card-content.compact {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ===== COMPACT VIEW MODE ===== */
.view-mode.compact {
  flex: 1;
}

/* ===== COMPACT CARD HEADER ===== */
.card-header.compact {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.service-title.compact {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.3;
}

/* ===== COMPACT CATEGORIES ===== */
.categories-section.compact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-tag.compact {
  background: #3182ce;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* ===== COMPACT DESCRIPTION ===== */
.service-description.compact {
  color: #718096;
  line-height: 1.4;
  font-size: 0.85rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0.25rem 0;
}

/* ===== COMPACT SERVICE META ===== */
.service-meta.compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin: 0.25rem 0;
}

.price.compact {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.price-amount.compact {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.total-price.compact {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.booking-price {
  font-size: 0.8rem;
  color: #718096;
}

.payment.compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background: #f7fafc;
  border-radius: 6px;
}

/* ===== COMPACT REVIEWS ===== */
.reviews-summary.compact {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reviews-summary.compact:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.reviews-header.compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.reviews-title {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.85rem;
}

.reviews-count {
  background: #3182ce;
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.rating-value {
  font-weight: 700;
  color: #2d3748;
  font-size: 0.9rem;
}

.no-reviews.compact {
  font-size: 0.8rem;
  color: #a0aec0;
}

/* ===== COMPACT AVAILABILITY ===== */
.availability-summary.compact {
  margin: 0.25rem 0;
}

.availability-header.compact {
  margin-bottom: 0.5rem;
}

.availability-badge {
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.availability-badge.available {
  background: #c6f6d5;
  color: #38a169;
}

.draft-notice.compact {
  font-size: 0.8rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: #e53e3e;
  font-weight: 600;
}

/* ===== COMPACT CARD ACTIONS ===== */
.card-actions.compact {
  display: flex;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

.action-btn.compact {
  flex: 1;
  padding: 0.4rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border: none;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.action-btn.compact:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.edit.compact {
  background: #bee3f8;
  color: #2b6cb0;
}

.action-btn.edit.compact:hover:not(:disabled) {
  background: #90cdf4;
}

.action-btn.manage-slots.compact {
  background: #e0f2fe;
  color: #0369a1;
}

.action-btn.manage-slots.compact:hover:not(:disabled) {
  background: #bae6fd;
}

.action-btn.delete.compact {
  background: #fed7d7;
  color: #c53030;
}

.action-btn.delete.compact:hover:not(:disabled) {
  background: #feb2b2;
}

/* ===== COMPACT EDIT MODE ===== */
.edit-mode.compact {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.edit-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.cancel-btn {
  background: #718096;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

/* ===== FORM GROUPS ===== */
.form-group.compact {
  margin-bottom: 0.75rem;
}

.form-group.compact label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #4a5568;
}

.form-control.compact {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.85rem;
  background: white;
  box-sizing: border-box;
}

.form-control.compact:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

/* ===== COMPACT SAVE BUTTON ===== */
.save-btn.compact {
  width: 100%;
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.save-btn.compact:hover:not(:disabled) {
  background: #2c5282;
}

.save-btn.compact:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== ERROR & SUCCESS MESSAGES ===== */
.error-message {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.success-message {
  background: #c6f6d5;
  border: 1px solid #9ae6b4;
  color: #38a169;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.close-error,
.close-success {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
}

/* ===== BANNER UPLOAD SECTION STYLES ===== */
.banner-upload-section {
  margin: 1rem 0;
}

.banner-upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  background: #f8fafc;
  transition: all 0.3s ease;
  position: relative;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-upload-area:hover {
  border-color: #3182ce;
  background: #edf2f7;
}

.upload-instructions {
  color: #718096;
}

.upload-instructions i {
  font-size: 2.5rem;
  color: #a0aec0;
  margin-bottom: 1rem;
  display: block;
}

.upload-instructions p {
  margin: 0.25rem 0;
}

.upload-hint {
  font-size: 0.85rem;
  color: #a0aec0;
}

.new-banner-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.new-banner-preview img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
}

.remove-banner-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #e53e3e;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
}

.remove-banner-btn:hover {
  background: #c53030;
}

.current-banner-display {
  margin-bottom: 1rem;
}

.current-banner-label {
  display: block;
  font-size: 0.85rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.current-banner {
  width: 100%;
  height: auto;
  max-height: 120px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.banner-note {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #718096;
  text-align: center;
}

/* ===== LOADING STATE ===== */
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.loading-state i {
  font-size: 2rem;
  color: #3182ce;
  margin-bottom: 1rem;
}

.loading-state p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.loading-state .debug-info {
  font-size: 0.875rem;
  color: #a0aec0;
  font-style: italic;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.empty-state i {
  font-size: 3rem;
  color: #a0aec0;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 600;
}

.empty-state p {
  color: #718096;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.primary-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.primary-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

/* ===== DEBUG PANEL ===== */
.debug-panel {
  background: #1a202c;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 2rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
}

.debug-panel h4 {
  color: #a0aec0;
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.debug-panel p {
  margin: 0.5rem 0;
}

/* ===== MODALS ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalAppear 0.2s ease-out;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.25rem;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #2d3748;
}

.delete-modal {
  max-width: 400px;
}

.delete-modal h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.delete-modal p {
  color: #718096;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.delete-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
  background: #c53030;
}

/* ===== REVIEWS MODAL STYLES ===== */
.reviews-modal {
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.reviews-modal .modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.reviews-loading {
  text-align: center;
  padding: 3rem 1rem;
}

.reviews-loading i {
  font-size: 2rem;
  color: #3182ce;
  margin-bottom: 1rem;
}

.reviews-loading p {
  color: #718096;
}

.no-reviews-content {
  text-align: center;
  padding: 2rem 1rem;
}

.no-reviews-content i {
  font-size: 3rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.no-reviews-content h4 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.no-reviews-content p {
  color: #718096;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
}

.reviews-overview {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.overview-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.overview-stat {
  text-align: center;
}

.overview-number {
  font-size: 2rem;
  font-weight: 700;
  color: #3182ce;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.overview-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.reviews-list {
  margin-top: 1.5rem;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.reviews-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.sort-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.review-item {
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3182ce;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.reviewer-details {
  flex: 1;
}

.reviewer-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.review-rating {
  display: flex;
  gap: 0.125rem;
}

.review-rating .fa-star {
  color: #fbbf24;
  font-size: 0.75rem;
}

.review-rating .fa-regular.fa-star {
  color: #d1d5db;
}

.review-date {
  font-size: 0.75rem;
  color: #718096;
}

.review-content {
  margin-bottom: 1rem;
}

.review-message {
  color: #4a5568;
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.review-service-info {
  font-size: 0.75rem;
  color: #718096;
}

.review-actions {
  margin-top: 1rem;
}

.reply-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.reply-btn:hover {
  background: #2c5282;
}

.review-reply {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #38a169;
}

.review-reply strong {
  color: #38a169;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  display: block;
}

.review-reply p {
  color: #4a5568;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
}

.close-modal-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  background: #2c5282;
}

/* ===== ANIMATIONS ===== */
@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active {
  animation: modalAppear 0.2s ease;
}

.modal-fade-leave-active {
  animation: modalAppear 0.2s ease reverse;
}

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* Desktop */
@media (min-width: 1024px) {
  .services-grid.compact {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 768px) {
  .services-section {
    padding: 1.5rem;
  }
  
  .services-grid.compact {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .services-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .services-grid.compact {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .service-card.compact {
    min-height: 300px;
  }
  
  .card-banner.full-width {
    height: 120px;
  }
  
  .status-stats {
    grid-template-columns: 1fr;
  }
  
  .controls-left,
  .controls-right {
    flex-direction: column;
  }
  
  .search-input,
  .status-filter {
    width: 100%;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .services-section {
    padding: 0.75rem;
  }
  
  .service-card.compact {
    min-height: 280px;
  }
  
  .card-banner.full-width {
    height: 100px;
  }
  
  .service-title.compact {
    font-size: 1rem;
  }
  
  .total-price.compact {
    font-size: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .services-section {
    padding: 0.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .service-card.compact {
    min-height: 260px;
  }
  
  .card-banner.full-width {
    height: 90px;
  }
  
  .card-content.compact {
    padding: 0.75rem;
  }
  
  .status-stat {
    padding: 0.75rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles */
.action-btn.compact:focus-visible,
.add-service-btn:focus-visible,
.close-btn:focus-visible,
.search-input input:focus-visible,
.status-filter select:focus-visible,
.edit-full-btn:focus-visible {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .service-card.compact {
    border: 2px solid #000;
  }
  
  .service-status-badge {
    border: 1px solid;
  }
  
  .stat-icon {
    border: 1px solid;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .services-section {
    background: #1a202c;
  }
  
  .status-summary-card,
  .service-card.compact,
  .empty-state,
  .loading-state,
  .modal {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .section-title,
  .service-title.compact {
    color: #f7fafc;
  }
  
  .section-subtitle,
  .service-description.compact {
    color: #cbd5e0;
  }
  
  .total-price.compact {
    color: #f7fafc;
  }
  
  .stat-number {
    color: #f7fafc;
  }
  
  .search-input input,
  .status-filter select,
  .form-control.compact {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .card-banner.full-width {
    background: #2d3748;
  }
  
  .banner-placeholder {
    background: #4a5568;
  }
}

/* Print styles */
@media print {
  .debug-btn,
  .card-actions.compact,
  .service-status-badge,
  .controls-bar,
  .add-service-btn {
    display: none !important;
  }
  
  .service-card.compact {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
  
  .services-grid.compact {
    display: block;
  }
  
  .card-banner.full-width {
    display: none !important;
  }
}
</style>