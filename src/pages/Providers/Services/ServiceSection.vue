<!-- src/pages/Providers/Services/ServiceSection.vue -->
<template>
  <div class="services-section">
    <!-- Messages -->
    <div v-if="errorMessage" class="alert alert-error">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ errorMessage }}</span>
      <button class="close-btn" @click="errorMessage = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div v-if="successMessage" class="alert alert-success">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ successMessage }}</span>
      <button class="close-btn" @click="successMessage = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
        <div class="modal delete-confirm-modal" @click.stop>
          <div class="modal-header">
            <h3>
              <i class="fa-solid fa-trash-can"></i>
              Confirm Delete
            </h3>
            <button class="close-btn" @click="cancelDelete">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="delete-warning">
              <i class="fa-solid fa-exclamation-triangle"></i>
              <h4>Delete Service</h4>
              <p>Are you sure you want to delete <strong>"{{ serviceToDelete?.title }}"</strong>?</p>
              <p class="warning-text">This action cannot be undone. All service data, including bookings and reviews, will be permanently deleted.</p>
            </div>
            
            <div class="delete-details">
              <div class="detail-item">
                <i class="fa-solid fa-calendar"></i>
                <span>All time slots will be removed</span>
              </div>
              <div class="detail-item">
                <i class="fa-solid fa-money-bill-wave"></i>
                <span>Future bookings will be cancelled</span>
              </div>
              <div class="detail-item">
                <i class="fa-solid fa-star"></i>
                <span>Reviews will be permanently deleted</span>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cancelDelete" :disabled="isDeleting">
              <i class="fa-solid fa-xmark"></i>
              Cancel
            </button>
            <button 
              class="btn btn-danger" 
              @click="proceedDelete" 
              :disabled="isDeleting"
            >
              <span v-if="isDeleting">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Deleting...
              </span>
              <span v-else>
                <i class="fa-solid fa-trash"></i>
                Yes, Delete Service
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Compact Header -->
    <div class="compact-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="section-title">
            <i class="fa-solid fa-concierge-bell"></i>
            My Services
          </h1>
          <p class="section-subtitle">Manage your professional service offerings</p>
        </div>
        <button class="btn add-service-btn" @click="openForm(null)">
          <i class="fa-solid fa-plus"></i>
          Add Service
        </button>
      </div>
    </div>

    <!-- Compact Stats Box -->
    <div class="compact-stats-box">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon total">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ services.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon active">
            <i class="fa-solid fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ activeServicesCount }}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon draft">
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ draftServicesCount }}</span>
            <span class="stat-label">Draft</span>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-icon reviews">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ reviewsStats.total || 0 }}</span>
            <span class="stat-label">Reviews</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Controls -->
    <div class="compact-controls">
      <div class="controls-content">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search services..."
            class="search-input"
          />
        </div>
        
        <div class="filter-box">
          <select v-model="statusFilter" class="filter-select">
            <option value="all">All Services</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
          </select>
        </div>
        
        <button v-if="debugMode" class="btn debug-btn" @click="debugMode = false">
          <i class="fa-solid fa-eye-slash"></i>
          Hide Debug
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner">
        <i class="fa-solid fa-spinner fa-spin"></i>
      </div>
      <p>Loading services...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="services.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fa-solid fa-box-open"></i>
      </div>
      <h3>No services yet</h3>
      <p>Start by creating your first service to showcase your offerings</p>
      <button class="btn primary-btn" @click="openForm(null)">
        <i class="fa-solid fa-plus"></i>
        Create Service
      </button>
    </div>

    <!-- Services Grid -->
    <div v-else class="services-grid">
      <div
        v-for="service in filteredServices"
        :key="getServiceKey(service)"
        class="service-card"
        :class="{ 'draft': getServiceStatus(service) === 'draft' }"
      >
        <!-- Status Badge -->
        <div class="status-badge" :class="getServiceStatus(service)">
          <i :class="getServiceStatus(service) === 'active' ? 'fa-solid fa-check' : 'fa-solid fa-clock'"></i>
          {{ getServiceStatus(service) === 'active' ? 'Active' : 'Draft' }}
        </div>

        <!-- Service Image -->
        <div class="service-image" @click="viewServiceImages(service)">
          <img
            v-if="getBannerUrl(service)"
            :src="getBannerUrl(service)"
            :alt="service?.title || 'Service'"
            @error="handleBannerError"
          />
          <div v-else class="image-placeholder">
            <i class="fa-solid fa-image"></i>
          </div>
          <div v-if="getServiceImages(service).length > 0" class="image-count">
            <i class="fa-solid fa-camera"></i>
            {{ getServiceImages(service).length }}
          </div>
        </div>

        <!-- Service Info -->
        <div class="service-info">
          <div class="service-header">
            <h3 class="service-title">{{ service?.title || 'Untitled Service' }}</h3>
            <div class="service-category">
              <span class="category-tag">
                <i class="fa-solid fa-tag"></i>
                {{ getCategoryName(service?.categoryId || service?.category) }}
              </span>
            </div>
          </div>

          <p class="service-description">
            {{ truncateDescription(service?.description) }}
          </p>

          <!-- Subcategories -->
          <div v-if="hasSubcategories(service)" class="subcategories">
            <div class="subcategory-tags">
              <span 
                v-for="subcategory in getSubcategories(service)" 
                :key="subcategory._id || subcategory"
                class="subcategory-tag"
              >
                {{ typeof subcategory === 'string' ? subcategory : subcategory.name }}
              </span>
            </div>
          </div>

          <!-- Pricing -->
          <div class="pricing">
            <div class="price-main">
              <span class="price-label">Price:</span>
              <span class="price-amount">{{ service?.totalPrice || 0 }} ETB</span>
            </div>
            <div v-if="service?.bookingPrice" class="price-deposit">
              <span class="deposit-label">Deposit:</span>
              <span class="deposit-amount">{{ service.bookingPrice }} ETB</span>
            </div>
          </div>

          <!-- Reviews -->
          <div class="reviews-summary" @click="viewServiceReviews(service)">
            <div class="reviews-header">
              <i class="fa-solid fa-star"></i>
              <span class="reviews-label">Reviews</span>
              <span v-if="serviceReviews[getServiceId(service)]?.count > 0" class="reviews-count">
                {{ serviceReviews[getServiceId(service)]?.count }}
              </span>
            </div>
            <div v-if="serviceReviews[getServiceId(service)]?.count > 0" class="reviews-content">
              <div class="reviews-rating">
                <div class="stars">
                  <i v-for="n in 5" :key="n" 
                     class="fa-star"
                     :class="n <= (serviceReviews[getServiceId(service)]?.averageRating || 0) ? 'fa-solid' : 'fa-regular'">
                  </i>
                </div>
                <span class="rating-value">
                  {{ (serviceReviews[getServiceId(service)]?.averageRating || 0).toFixed(1) }}
                </span>
              </div>
              <p class="view-reviews-text">Click to view reviews</p>
            </div>
            <div v-else class="no-reviews">
              <i class="fa-regular fa-comment"></i>
              <span>No reviews yet</span>
            </div>
          </div>

          <!-- Availability -->
          <div class="availability">
            <div class="availability-status">
              <i :class="hasAnyRealAvailability(service) ? 'fa-solid fa-calendar-check' : 'fa-solid fa-calendar-xmark'"></i>
              <span>{{ hasAnyRealAvailability(service) ? 'Available' : 'Not Available' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn action-btn manage-btn" @click="toggleTimeSlots(service)">
            <i class="fa-solid fa-calendar"></i>
            Schedule
          </button>
          <button class="btn action-btn edit-btn" @click="editService(service)">
            <i class="fa-solid fa-pen"></i>
            Edit
          </button>
          <button class="btn action-btn delete-btn" @click="confirmDelete(service)">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Service Form Modal -->
    <transition name="modal-fade">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal service-form-modal" @click.stop>
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

    <!-- Time Slots Modal -->
    <transition name="modal-fade">
      <div v-if="expandedServiceId" class="modal-overlay" @click.self="closeTimeSlotsPanel">
        <div class="modal timeslots-modal" @click.stop>
          <div class="modal-header">
            <h3>
              <i class="fa-solid fa-calendar-alt"></i>
              Manage Schedule
              <span class="service-name">- {{ selectedService?.title }}</span>
            </h3>
            <button class="close-btn" @click="closeTimeSlotsPanel">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body scrollable">
            <TimeSlots 
              :service="selectedService"
              :serviceId="selectedServiceId"
              @close="closeTimeSlotsPanel"
              @saved="handleTimeSlotsSaved"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Service Images Modal -->
    <transition name="modal-fade">
      <div v-if="showImagesModal" class="modal-overlay" @click.self="closeImagesModal">
        <div class="modal images-modal" @click.stop>
          <div class="modal-header">
            <h3>
              <i class="fa-solid fa-images"></i>
              Service Images
              <span class="service-name">- {{ imagesModalService?.title }}</span>
            </h3>
            <button class="close-btn" @click="closeImagesModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body scrollable">
            <div class="current-images" v-if="serviceImages.length > 0">
              <h4>Current Images ({{ serviceImages.length }})</h4>
              <div class="images-grid">
                <div 
                  v-for="(image, index) in serviceImages" 
                  :key="index" 
                  class="image-item"
                >
                  <img :src="getValidImageUrl(image)" :alt="`Service image ${index + 1}`" class="service-image-preview" />
                </div>
              </div>
            </div>
            <div v-else class="no-images">
              <i class="fa-regular fa-image"></i>
              <p>No images available</p>
              <p class="info-text">Add images when editing the service</p>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-primary" @click="closeImagesModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Reviews Modal -->
    <transition name="modal-fade">
      <div v-if="showReviewsModal" class="modal-overlay" @click.self="closeReviewsModal">
        <div class="modal reviews-modal" @click.stop>
          <div class="modal-header">
            <h3>
              <i class="fa-solid fa-star"></i>
              Reviews for {{ selectedServiceForReviews?.title }}
            </h3>
            <button class="close-btn" @click="closeReviewsModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body scrollable">
            <div v-if="loadingReviews" class="loading-reviews">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <p>Loading reviews...</p>
            </div>
            
            <div v-else-if="selectedServiceReviews.length === 0" class="no-reviews-content">
              <i class="fa-regular fa-comment-dots"></i>
              <h4>No Reviews Yet</h4>
              <p>This service hasn't received any reviews yet.</p>
            </div>
            
            <div v-else class="reviews-content">
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
              
              <div class="reviews-list">
                <div class="reviews-header">
                  <h4>Customer Reviews ({{ selectedServiceReviews.length }})</h4>
                </div>
                
                <div class="review-items">
                  <div v-for="review in selectedServiceReviews" :key="review._id" class="review-item">
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
                    
                    <div v-if="review.reply" class="review-reply">
                      <strong><i class="fa-solid fa-reply"></i> Your Reply</strong>
                      <p>{{ review.reply }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-primary" @click="closeReviewsModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Debug Panel -->
    <div v-if="debugMode" class="debug-panel">
      <div class="debug-header">
        <h5><i class="fa-solid fa-bug"></i> Debug Information</h5>
        <button class="close-btn" @click="debugMode = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="debug-content">
        <p>Total Services: {{ services.length }}</p>
        <p>Active: {{ activeServicesCount }}</p>
        <p>Draft: {{ draftServicesCount }}</p>
        <p>Loading: {{ loading }}</p>
        <p>Is Deleting: {{ isDeleting }}</p>
        <p>Show Delete Confirm: {{ showDeleteConfirm }}</p>
        <p>Editing Service ID: {{ editingService?._id || editingService?.serviceId || 'None' }}</p>
        <p>Show Form: {{ showForm }}</p>
        <p>Categories Loaded: {{ categories.length }}</p>
      </div>
    </div>
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
      searchQuery: '',
      statusFilter: 'all',
      errorMessage: '',
      successMessage: '',
      debugMode: false,
      lastError: null,
      isDeleting: false,
      
      // Delete Confirmation
      showDeleteConfirm: false,
      serviceToDelete: null,
      
      // Time Slots
      expandedServiceId: null,
      selectedService: null,
      selectedServiceId: null,
      
      // Images Modal
      showImagesModal: false,
      imagesModalService: null,
      serviceImages: [],
      
      // Reviews
      showReviewsModal: false,
      selectedServiceForReviews: null,
      selectedServiceReviews: [],
      loadingReviews: false,
      serviceReviews: {},
      reviewsStats: { total: 0, averageRating: 0 }
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
      return sum / this.selectedServiceReviews.length;
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
    // ===== UTILITY METHODS =====
    getServiceStatus(service) {
      if (!service) return 'draft';
      if (!service.slots || !Array.isArray(service.slots) || service.slots.length === 0) {
        return 'draft';
      }
      const hasRealSlots = service.slots.some(slot => {
        if (!slot) return false;
        if (slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          return slot.weeklySchedule.some(week => 
            week && 
            week.timeSlots && 
            Array.isArray(week.timeSlots) && 
            week.timeSlots.length > 0
          );
        }
        return false;
      });
      return hasRealSlots ? 'active' : 'draft';
    },
    
    hasAnyRealAvailability(service) {
      return this.getServiceStatus(service) === 'active';
    },
    
    getServiceId(service) {
      if (!service) return null;
      return service._id || service.serviceId || service.id || null;
    },
    
    getServiceKey(service) {
      return this.getServiceId(service) || Math.random();
    },
    
    getCategoryName(idOrName) {
      if (!idOrName) return "Uncategorized";
      if (typeof idOrName === 'string' && /[a-zA-Z]/.test(idOrName)) {
        return idOrName;
      }
      const cat = this.categories.find(c => c._id === idOrName);
      return cat ? cat.name : "Unknown";
    },
    
    hasSubcategories(service) {
      if (!service) return false;
      return Array.isArray(service.subcategories) && 
             service.subcategories.length > 0;
    },
    
    getSubcategories(service) {
      if (!service || !Array.isArray(service.subcategories)) {
        return [];
      }
      return service.subcategories;
    },
    
    truncateDescription(description, maxLength = 100) {
      if (!description) return 'No description available';
      if (description.length <= maxLength) return description;
      return description.substring(0, maxLength) + '...';
    },
    
    // ===== UI METHODS =====
    setError(message) {
      this.errorMessage = message;
      this.lastError = message;
      setTimeout(() => { this.errorMessage = ''; }, 5000);
    },
    
    setSuccess(message) {
      this.successMessage = message;
      setTimeout(() => { this.successMessage = ''; }, 3000);
    },
    
    // ===== IMAGE METHODS =====
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
      event.target.style.display = 'none';
    },
    
    getServiceImages(service) {
      if (!service) return [];
      
      if (!service.images) {
        return [];
      }
      
      if (Array.isArray(service.images)) {
        return service.images.filter(img => img && img.trim() !== '');
      }
      
      if (typeof service.images === 'string' && service.images.trim() !== '') {
        return [service.images];
      }
      
      return [];
    },
    
    getValidImageUrl(image) {
      if (!image) return '';
      
      if (typeof image === 'string') {
        if (image.startsWith('http') || image.startsWith('data:') || image.startsWith('/')) {
          return image;
        }
        return `/uploads/${image}`;
      }
      
      if (typeof image === 'object') {
        const possibleKeys = ['url', 'imageUrl', 'src', 'path'];
        for (const key of possibleKeys) {
          if (image[key] && typeof image[key] === 'string') {
            const url = image[key];
            if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) {
              return url;
            }
            return `/uploads/${url}`;
          }
        }
      }
      
      return '';
    },
    
    // ===== DATA FETCHING =====
    async fetchCategories() {
      try {
        const res = await http.get("/categories");
        this.categories = res.data;
        console.log('✅ Categories loaded:', this.categories.length);
      } catch (err) {
        console.warn("Failed to load categories");
        this.categories = [];
      }
    },
    
    async fetchServices() {
      this.loading = true;
      try {
        const res = await http.get('/services');
        const servicesData = res.data;
        
        if (Array.isArray(servicesData)) {
          this.services = servicesData.filter(service => {
            if (!service || typeof service !== 'object') return false;
            const serviceId = this.getServiceId(service);
            return serviceId !== 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
          });
          console.log('✅ Services loaded:', this.services.length);
        } else {
          this.services = [];
        }
      } catch (err) {
        this.setError("Could not load services");
        this.services = [];
      } finally {
        this.loading = false;
      }
    },
    
    async loadAllReviews() {
      try {
        let totalReviews = 0;
        let totalRating = 0;
        
        for (const service of this.services) {
          const serviceId = this.getServiceId(service);
          if (!serviceId) continue;
          
          try {
            const response = await http.get(`/reviews/service/${serviceId}`);
            let reviews = [];
            
            if (Array.isArray(response.data)) {
              reviews = response.data;
            } else if (response.data?.reviews) {
              reviews = response.data.reviews;
            } else if (response.data?.data) {
              reviews = response.data.data;
            }
            
            const processedReviews = reviews.map(review => ({
              _id: review._id || review.id || Math.random().toString(36).substr(2, 9),
              reviewerName: review.customerName || review.reviewerName || review.user?.name || 'Anonymous',
              rating: review.rating || 0,
              message: review.review || review.message || review.comment || '',
              createdAt: review.createdAt || review.date || new Date().toISOString(),
              reply: review.reply || review.response || ''
            }));
            
            const averageRating = processedReviews.length > 0 
              ? processedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / processedReviews.length
              : 0;
            
            this.serviceReviews[serviceId] = {
              reviews: processedReviews,
              count: processedReviews.length,
              averageRating: averageRating
            };
            
            totalReviews += processedReviews.length;
            totalRating += averageRating * processedReviews.length;
            
          } catch (error) {
            console.log(`No reviews for service ${serviceId}:`, error.message);
            this.serviceReviews[serviceId] = {
              reviews: [],
              count: 0,
              averageRating: 0
            };
          }
        }
        
        this.reviewsStats = {
          total: totalReviews,
          averageRating: totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0
        };
        
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    },
    
    // ===== SERVICE FORM METHODS =====
    openForm(service) {
      console.log('🔧 Opening form with service:', service);
      
      if (service) {
        const categoryId = service.categoryId || 
                          service.category?._id || 
                          service.category || 
                          '';
        
        let subcategoryIds = service.subcategoryIds;
        if (!subcategoryIds || subcategoryIds.length === 0) {
          if (service.subcategories && Array.isArray(service.subcategories)) {
            subcategoryIds = service.subcategories.map(sub => {
              if (typeof sub === 'object') {
                return sub._id || sub.id || sub;
              }
              return sub;
            });
          } else {
            subcategoryIds = [];
          }
        }
        
        // Prepare service data for editing
        const editingService = {
          ...service,
          _id: service._id || service.serviceId || service.id,
          categoryId: categoryId,
          subcategoryIds: Array.isArray(subcategoryIds) ? [...subcategoryIds] : [],
          banner: service.banner || null,
          status: service.status || 'draft'
        };
        
        console.log('🔧 Processed service for editing:', {
          id: editingService._id,
          title: editingService.title,
          categoryId: editingService.categoryId,
          subcategoryIds: editingService.subcategoryIds,
          banner: editingService.banner
        });
        
        this.editingService = editingService;
      } else {
        console.log('🔧 Creating new service (no service passed)');
        this.editingService = null;
      }
      
      this.showForm = true;
    },
    
    closeForm() {
      this.showForm = false;
      this.editingService = null;
    },
    
    async onServiceSaved(savedService) {
      console.log('💾 Service saved:', savedService);
      
      try {
        // Check if we have valid service data
        if (!savedService) {
          console.log('⚠️ No service data received');
          this.setError("No service data received");
          this.closeForm();
          return;
        }
        
        // Get service ID from any possible field
        const serviceId = savedService._id || savedService.serviceId || savedService.id;
        
        if (!serviceId) {
          console.log('⚠️ No service ID found, fetching all services...');
          await this.fetchServices();
          this.closeForm();
          this.setSuccess("Service saved successfully!");
          return;
        }
        
        console.log('🔍 Processing service with ID:', serviceId);
        
        // Check if this is an update (existing service) or new service
        const existingIndex = this.services.findIndex(s => {
          const sId = s._id || s.serviceId || s.id;
          return sId === serviceId;
        });
        
        if (existingIndex !== -1) {
          console.log('🔄 Updating existing service at index:', existingIndex);
          
          // For update: Merge and replace the existing service
          const updatedService = {
            ...this.services[existingIndex], // Keep existing data
            ...savedService, // Override with new data
            _id: serviceId, // Ensure ID is preserved
            serviceId: serviceId,
            id: serviceId
          };
          
          // Replace in array
          this.services[existingIndex] = updatedService;
          this.services = [...this.services]; // Force reactivity
          
          console.log('✅ Service UPDATED at index:', existingIndex);
          this.setSuccess(`Service "${updatedService.title}" updated successfully!`);
          
        } else {
          console.log('🆕 Adding NEW service to list');
          
          // For new service: Add to beginning of list
          const newService = {
            ...savedService,
            _id: serviceId,
            serviceId: serviceId,
            id: serviceId
          };
          
          this.services = [newService, ...this.services];
          console.log('✅ NEW service added to list');
          this.setSuccess(`Service "${newService.title}" created successfully!`);
        }
        
        this.closeForm();
        
      } catch (error) {
        console.error('❌ Error saving service:', error);
        this.setError("Failed to save service. Please try again.");
        this.closeForm();
      }
    },
    
    editService(service) {
      if (!service) {
        this.setError("Cannot edit service: Service data is missing");
        return;
      }
      
      console.log('📝 Editing service:', service.title);
      this.openForm(service);
    },
    
    // ===== DELETE METHODS =====
    confirmDelete(service) {
      const serviceId = this.getServiceId(service);
      if (!serviceId) {
        this.setError("Cannot delete service: No ID found");
        return;
      }
      
      // Store the service to delete and show confirmation modal
      this.serviceToDelete = service;
      this.showDeleteConfirm = true;
    },
    
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.serviceToDelete = null;
    },
    
    async proceedDelete() {
      if (!this.serviceToDelete) {
        this.cancelDelete();
        return;
      }
      
      const serviceId = this.getServiceId(this.serviceToDelete);
      const serviceTitle = this.serviceToDelete.title;
      
      this.isDeleting = true;
      
      try {
        await http.delete(`/services/${serviceId}`);
        
        // Remove from local array immediately for better UX
        const index = this.services.findIndex(s => {
          const sId = s._id || s.serviceId || s.id;
          return sId === serviceId;
        });
        
        if (index !== -1) {
          this.services.splice(index, 1);
          this.services = [...this.services]; // Force reactivity
        }
        
        this.setSuccess(`Service "${serviceTitle}" deleted successfully!`);
        
      } catch (err) {
        console.error('❌ Failed to delete service:', err);
        this.setError("Failed to delete service. Please try again.");
      } finally {
        this.isDeleting = false;
        this.cancelDelete();
      }
    },
    
    // ===== IMAGES MODAL =====
    viewServiceImages(service) {
      if (!service) {
        this.setError("Cannot view images: Service data is missing");
        return;
      }
      
      this.imagesModalService = service;
      this.serviceImages = this.getServiceImages(service);
      this.showImagesModal = true;
    },
    
    closeImagesModal() {
      this.showImagesModal = false;
      this.imagesModalService = null;
      this.serviceImages = [];
    },
    
    // ===== TIME SLOTS =====
    toggleTimeSlots(service) {
      const serviceId = this.getServiceId(service);
      if (this.expandedServiceId === serviceId) {
        this.closeTimeSlotsPanel();
      } else {
        this.expandedServiceId = serviceId;
        this.selectedService = service;
        this.selectedServiceId = serviceId;
      }
    },
    
    closeTimeSlotsPanel() {
      this.expandedServiceId = null;
      this.selectedService = null;
      this.selectedServiceId = null;
    },
    
    async handleTimeSlotsSaved() {
      await this.fetchServices();
      this.setSuccess("Schedule updated!");
      this.closeTimeSlotsPanel();
    },
    
    // ===== REVIEWS =====
    async viewServiceReviews(service) {
      const serviceId = this.getServiceId(service);
      if (!serviceId) return;
      
      this.selectedServiceForReviews = service;
      this.showReviewsModal = true;
      this.loadingReviews = true;
      this.selectedServiceReviews = [];
      
      try {
        if (this.serviceReviews[serviceId]?.reviews) {
          this.selectedServiceReviews = this.serviceReviews[serviceId].reviews;
        } else {
          const response = await http.get(`/reviews/service/${serviceId}`);
          let reviews = [];
          
          if (Array.isArray(response.data)) {
            reviews = response.data;
          } else if (response.data?.reviews) {
            reviews = response.data.reviews;
          } else if (response.data?.data) {
            reviews = response.data.data;
          }
          
          this.selectedServiceReviews = reviews.map(review => ({
            _id: review._id || review.id || Math.random().toString(36).substr(2, 9),
            reviewerName: review.customerName || review.reviewerName || review.user?.name || 'Anonymous',
            rating: review.rating || 0,
            message: review.review || review.message || review.comment || '',
            createdAt: review.createdAt || review.date || new Date().toISOString(),
            reply: review.reply || review.response || ''
          }));
          
          this.serviceReviews[serviceId] = {
            reviews: this.selectedServiceReviews,
            count: this.selectedServiceReviews.length,
            averageRating: this.selectedServiceReviews.length > 0 
              ? this.selectedServiceReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / this.selectedServiceReviews.length
              : 0
          };
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
        this.selectedServiceReviews = [];
      } finally {
        this.loadingReviews = false;
      }
    },
    
    closeReviewsModal() {
      this.showReviewsModal = false;
      this.selectedServiceForReviews = null;
      this.selectedServiceReviews = [];
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
    }
  }
};
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.services-section {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* ===== ALERTS ===== */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.alert .close-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.7;
}

.alert .close-btn:hover {
  opacity: 1;
}

/* ===== DELETE CONFIRMATION MODAL ===== */
.delete-confirm-modal {
  max-width: 500px;
}

.delete-warning {
  text-align: center;
  padding: 1.5rem;
  background: #fef2f2;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #fecaca;
}

.delete-warning i {
  font-size: 2.5rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.delete-warning h4 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.delete-warning p {
  color: #7f1d1d;
  margin: 0.5rem 0;
}

.warning-text {
  font-size: 0.9rem;
  font-style: italic;
  color: #991b1b;
}

.delete-details {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  color: #475569;
  font-size: 0.9rem;
}

.detail-item i {
  color: #64748b;
  width: 16px;
  text-align: center;
}

.btn-danger {
  background: linear-gradient(to right, #dc2626, #b91c1c);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(to right, #b91c1c, #991b1b);
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== COMPACT HEADER ===== */
.compact-header {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-text {
  flex: 1;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #3b82f6;
}

.section-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.add-service-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-service-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* ===== COMPACT STATS BOX ===== */
.compact-stats-box {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-icon.total {
  background: #e0f2fe;
  color: #0369a1;
}

.stat-icon.active {
  background: #dcfce7;
  color: #166534;
}

.stat-icon.draft {
  background: #fef3c7;
  color: #92400e;
}

.stat-icon.reviews {
  background: #f3e8ff;
  color: #7c3aed;
}

.stat-info {
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 0.125rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* ===== COMPACT CONTROLS ===== */
.compact-controls {
  background: white;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.controls-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-box {
  min-width: 160px;
}

.filter-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.debug-btn {
  background: #e2e8f0;
  color: #475569;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.debug-btn:hover {
  background: #cbd5e1;
}

/* ===== LOADING & EMPTY STATES ===== */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin: 1rem 0;
}

.spinner {
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.loading-state p {
  color: #64748b;
}

.empty-icon {
  font-size: 2.5rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.primary-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* ===== SERVICES GRID ===== */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  gap: 1.5rem;
}

.service-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e1;
}

.service-card.draft {
  opacity: 0.9;
}

/* Status Badge */
.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-badge.draft {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

/* Service Image */
.service-image {
  height: 180px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-image:hover img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 2.5rem;
}

.image-count {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 3;
}

/* Service Info */
.service-info {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.service-category {
  margin-top: -0.25rem;
}

.category-tag {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.service-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.subcategories {
  margin-top: -0.25rem;
}

.subcategory-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.subcategory-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
}

/* Pricing */
.pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price-label {
  font-size: 0.875rem;
  color: #64748b;
}

.price-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.price-deposit {
  text-align: right;
}

.deposit-label {
  font-size: 0.75rem;
  color: #64748b;
  display: block;
  margin-bottom: 0.125rem;
}

.deposit-amount {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
}

/* Reviews */
.reviews-summary {
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.reviews-summary:hover {
  background: #f1f5f9;
}

.reviews-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.reviews-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.reviews-count {
  background: #3b82f6;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

.reviews-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reviews-rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.stars .fa-star {
  color: #fbbf24;
  font-size: 0.875rem;
}

.stars .fa-regular.fa-star {
  color: #e2e8f0;
}

.rating-value {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.875rem;
}

.view-reviews-text {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  font-style: italic;
}

.no-reviews {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Availability */
.availability {
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.availability-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
}

.availability-status i {
  color: #16a34a;
}

/* Action Buttons */
.action-buttons {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.action-btn {
  flex: 1;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
  min-height: 36px;
}

.manage-btn {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.manage-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.edit-btn {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.edit-btn:hover {
  background: rgba(34, 197, 94, 0.2);
  transform: translateY(-1px);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-1px);
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
  z-index: 2000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-name {
  color: #64748b;
  font-weight: 400;
  margin-left: 0.5rem;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-body.scrollable {
  max-height: 60vh;
  overflow-y: auto;
}

.timeslots-modal .modal-body {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.timeslots-modal .modal-body::-webkit-scrollbar {
  width: 6px;
}

.timeslots-modal .modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.timeslots-modal .modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.timeslots-modal .modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary:hover:not(:disabled) {
  background: #cbd5e1;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Time Slots Modal */
.timeslots-modal {
  max-width: 800px;
}

/* Images Modal */
.images-modal {
  max-width: 700px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.image-item {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.service-image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-images {
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;
}

.no-images i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-images p {
  margin: 0.5rem 0;
}

.info-text {
  font-size: 0.875rem;
  color: #64748b;
  font-style: italic;
}

/* Reviews Modal */
.reviews-modal {
  max-width: 600px;
}

.loading-reviews {
  text-align: center;
  padding: 2rem;
}

.loading-reviews i {
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.no-reviews-content {
  text-align: center;
  padding: 3rem 2rem;
}

.no-reviews-content i {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.no-reviews-content h4 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.no-reviews-content p {
  color: #64748b;
}

.reviews-overview {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.overview-stats {
  display: flex;
  gap: 2rem;
}

.overview-stat {
  text-align: center;
}

.overview-number {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.overview-label {
  font-size: 0.875rem;
  color: #64748b;
}

.reviews-list {
  margin-top: 1.5rem;
}

.reviews-header {
  margin-bottom: 1rem;
}

.reviews-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
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
  background: #3b82f6;
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
  color: #1e293b;
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
  color: #64748b;
}

.review-content {
  margin-bottom: 1rem;
}

.review-message {
  color: #475569;
  line-height: 1.5;
  margin: 0;
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
  color: #475569;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

/* ===== DEBUG PANEL ===== */
.debug-panel {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: #1e293b;
  color: white;
  border-radius: 8px;
  width: 300px;
  max-height: 400px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.debug-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-header h5 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.debug-content {
  padding: 1rem;
  font-size: 0.75rem;
  font-family: monospace;
  max-height: 350px;
  overflow-y: auto;
}

.debug-content p {
  margin: 0.25rem 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .services-section {
    padding: 1rem;
  }
  
  .compact-header,
  .compact-stats-box,
  .compact-controls {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .controls-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box,
  .filter-box {
    width: 100%;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .action-btn {
    min-width: calc(33.333% - 0.5rem);
    font-size: 0.7rem;
    padding: 0.5rem 0.25rem;
  }
  
  .debug-panel {
    width: calc(100% - 2rem);
    right: 1rem;
    bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .overview-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
    min-width: 100%;
  }
}
</style>