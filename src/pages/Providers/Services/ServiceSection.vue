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

    <!-- Services Grid -->
    <div v-else class="services-grid">
      <div
        v-for="service in filteredServices"
        :key="getServiceKey(service)"
        class="service-card"
        :class="{ 'draft-service': getServiceStatus(service) === 'draft' }"
      >
        <!-- Status Badge -->
        <div class="service-status-badge" :class="getServiceStatus(service)">
          <i :class="getServiceStatus(service) === 'draft' ? 'fa-solid fa-clock' : 'fa-solid fa-check-circle'"></i>
          {{ getServiceStatus(service) === 'draft' ? 'Draft' : 'Active' }}
        </div>

        <!-- Banner - SIMPLIFIED -->
        <div class="card-banner">
          <div class="banner-gradient"></div>
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

        <button class="btn upload-btn" @click="uploadImages" :disabled="selectedImages.length === 0 || uploadingImages">
  <i v-if="uploadingImages" class="fa-solid fa-spinner fa-spin"></i>
  <i v-else class="fa-solid fa-upload"></i>
  {{ uploadingImages ? 'Uploading...' : 'Upload Images' }}
</button>

        <!-- Content -->
        <div class="card-content">
          <!-- View Mode - DEFAULT -->
          <div class="view-mode">
            <div class="card-header">
              <h3 class="service-title">{{ service?.title || 'Untitled Service' }}</h3>
              
              <!-- Category & Subcategories Section -->
              <div class="categories-section">
                <!-- Main Category -->
                <div class="category-tag">
                  <i class="fa-solid fa-tag"></i>
                  {{ getCategoryName(service?.categoryId || service?.category) }}
                </div>
                
                <!-- Subcategories -->
                <div v-if="hasSubcategories(service)" class="subcategories-tags">
                  <span 
                    v-for="subcategory in getSubcategories(service)" 
                    :key="subcategory._id"
                    class="subcategory-tag"
                  >
                    {{ subcategory.name }}
                  </span>
                </div>
              </div>

              <!-- Debug: Show Service ID -->
              <div class="service-id-debug" v-if="debugMode">
                <small>ID: {{ getServiceId(service) || 'No ID' }}</small>
                <small>Status: {{ getServiceStatus(service) }}</small>
              </div>
            </div>
            <p class="service-description">
              {{ service?.description || 'No description available' }}
            </p>
            <div class="service-meta">
              <div class="price">
                <div class="price-label">Price</div>
                <div class="price-amount">
                  <span class="total-price">{{ service?.totalPrice || 0 }} ETB</span>
                  <span v-if="service?.bookingPrice" class="booking-price">({{ service.bookingPrice }} ETB deposit)</span>
                </div>
              </div>
              <div class="payment" v-if="service?.paymentMethod">
                <i class="fa-solid fa-wallet"></i> {{ service.paymentMethod }}
              </div>
            </div>
            
            <!-- Reviews Section -->
            <div class="reviews-summary" @click="viewServiceReviews(service)">
              <div class="reviews-header">
                <i class="fa-solid fa-star"></i>
                <span class="reviews-title">Reviews</span>
                <span class="reviews-count" v-if="serviceReviews[getServiceId(service)]?.count > 0">
                  {{ serviceReviews[getServiceId(service)]?.count || 0 }}
                </span>
              </div>
              <div class="reviews-preview" v-if="serviceReviews[getServiceId(service)]?.count > 0">
                <div class="reviews-rating">
                  <div class="stars">
                    <i v-for="n in 5" :key="n" 
                       class="fa-star"
                       :class="n <= serviceReviews[getServiceId(service)]?.averageRating ? 'fa-solid' : 'fa-regular'">
                    </i>
                  </div>
                  <span class="rating-value">{{ serviceReviews[getServiceId(service)]?.averageRating?.toFixed(1) || '0.0' }}</span>
                </div>
                <p class="reviews-hint">Click to view all reviews</p>
              </div>
              <div class="no-reviews" v-else>
                <i class="fa-regular fa-comment"></i>
                <span>No reviews yet</span>
              </div>
            </div>
            
            <!-- Availability Summary -->
            <div class="availability-summary">
              <template v-if="getServiceStatus(service) === 'active'">
                <div class="availability-header">
                  <span class="availability-badge" :class="{ available: hasAnyRealAvailability(service) }">
                    <i :class="hasAnyRealAvailability(service) ? 'fa-solid fa-calendar-check' : 'fa-solid fa-calendar-xmark'"></i>
                    {{ hasAnyRealAvailability(service) ? 'Available' : 'Not Available' }}
                  </span>
                  <span class="days-count" v-if="hasAnyRealAvailability(service)">
                    ({{ getAccurateAvailableDaysCount(service) }} days)
                  </span>
                </div>
                <!-- Manage Time Slots Button -->
                <div class="manage-slots-section">
                  <button class="btn manage-slots-btn" @click="toggleTimeSlots(service)">
                    <i class="fa-solid fa-calendar-edit"></i> Manage Time Slots
                  </button>
                </div>
              </template>
              <template v-else>
                <!-- DRAFT SERVICE: Add Time Slots Button -->
                <div class="draft-actions">
                  <div class="draft-notice">
                    <i class="fa-solid fa-clock"></i>
                    <span>Add time slots to activate service</span>
                  </div>
                  <button class="btn add-slots-btn" @click="toggleTimeSlots(service)">
                    <i class="fa-solid fa-calendar-plus"></i> Add Time Slots
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Edit Mode - Only show when editing this specific service -->
          <div v-if="editingServiceId === getServiceId(service)" class="edit-mode">
            <div class="edit-header">
              <h3>Edit Service</h3>
              <button class="btn cancel-btn" @click="cancelEdit()">
                Cancel
              </button>
            </div>
            <!-- Title -->
            <div class="form-group">
              <label>Title</label>
              <input
                v-model="editingServiceData.title"
                type="text"
                class="form-control"
                placeholder="Service title"
              />
            </div>
            <!-- Description -->
            <div class="form-group">
              <label>Description</label>
              <textarea
                v-model="editingServiceData.description"
                class="form-control"
                rows="4"
                placeholder="Service description"
              ></textarea>
            </div>
            <!-- Pricing -->
            <div class="form-group">
              <label>Total Price (ETB)</label>
              <input
                v-model.number="editingServiceData.totalPrice"
                type="number"
                class="form-control"
                min="0"
                step="1"
              />
            </div>
            <div class="form-group">
              <label>Booking Deposit (ETB)</label>
              <input
                v-model.number="editingServiceData.bookingPrice"
                type="number"
                class="form-control"
                min="0"
                step="1"
              />
            </div>
            <!-- Payment Method -->
            <div class="form-group">
              <label>Payment Method</label>
              <select v-model="editingServiceData.paymentMethod" class="form-control">
                <option value="">Select payment method</option>
                <option value="Telebirr">Telebirr</option>
                <option value="Chapa">Chapa</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            <!-- Service Status Display -->
            <div class="form-group">
              <label>Service Status</label>
              <div class="status-display">
                <span class="status-badge" :class="getServiceStatus(editingServiceData)">
                  {{ getServiceStatus(editingServiceData) === 'draft' ? 'Draft' : 'Active' }}
                </span>
                <p class="status-note" v-if="getServiceStatus(editingServiceData) === 'draft'">
                  <i class="fa-solid fa-info-circle"></i>
                  Service will become active when you add time slots
                </p>
              </div>
            </div>
            <!-- Quick Availability Toggle -->
            <div class="form-group">
              <h4>Quick Availability</h4>
              <div class="quick-availability">
                <label class="availability-toggle">
                  <input
                    type="checkbox"
                    :checked="hasAnyRealAvailability(editingServiceData)"
                    @change="toggleQuickAvailability($event.target.checked)"
                  />
                  <span class="toggle-label">Service is available for booking</span>
                </label>
                <p class="availability-note">
                  Use the "Manage Time Slots" button for detailed calendar scheduling
                </p>
              </div>
            </div>
            <!-- Save Button -->
            <div class="edit-actions">
              <button class="btn save-btn" @click="saveService()" :disabled="saving">
                <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Actions - EDIT, ADD IMAGES, AND DELETE -->
        <div class="card-actions">
          <button class="action-btn edit" @click.stop="startEdit(service)" :disabled="!getServiceId(service)">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="action-btn add-images" @click.stop="openImagesEditor(service)" :disabled="!getServiceId(service)">
            <i class="fa-solid fa-images"></i> Add Images
          </button>
          <button class="action-btn delete" @click.stop="confirmDelete(getServiceId(service), service?.title)" :disabled="!getServiceId(service)">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>

        <!-- Time Slots Panel -->
        <transition name="slide-down">
          <div v-if="expandedServiceId === getServiceId(service)" class="time-slots-panel">
            <div class="time-slots-panel-header">
              <h4>
                {{ getServiceStatus(service) === 'draft' ? 'Add Time Slots' : 'Manage Time Slots' }}
              </h4>
              <button class="btn close-panel-btn" @click="closeTimeSlotsPanel()">
                <i class="fa-solid fa-xmark"></i> Close
              </button>
            </div>
            <div class="time-slots-panel-content">
              <TimeSlots 
                :service="service"
                :serviceId="getServiceId(service)"
                @close="closeTimeSlotsPanel"
                @saved="handleTimeSlotsSaved"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Debug Panel -->
    <div v-if="debugMode && !showTimeSlotsModal" class="debug-panel">
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

    <!-- Service Images Editor Modal -->
    <transition name="modal-fade">
      <div v-if="showImagesEditor" class="modal-overlay" @click.self="closeImagesEditor">
        <div class="modal images-editor-modal" @click.stop>
          <div class="modal-header">
            <h2>Add Service Images</h2>
            <button class="close-btn" @click="closeImagesEditor" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-content">
            <!-- Current Images Section -->
            <div class="current-images-section" v-if="serviceImages.length > 0">
              <h4>Current Images ({{ serviceImages.length }})</h4>
              <div class="images-grid">
                <div v-for="(image, index) in serviceImages" :key="index" class="image-item">
                  <img :src="getValidImageUrl(image)" :alt="`Service image ${index + 1}`" class="service-image" @error="handleImageError(index)" />
                  <div class="image-overlay">
                    <button class="btn delete-image-btn" @click="deleteImage(index)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload New Images -->
            <div class="upload-images-section">
              <h4>Upload New Images</h4>
              
              <!-- File Upload Area -->
              <div 
                class="upload-area" 
                :class="{ 'dragover': imagesDragover }"
                @dragover.prevent="imagesDragover = true"
                @dragleave.prevent="imagesDragover = false"
                @drop.prevent="handleImagesDrop"
                @click="triggerImagesInput"
              >
                <div class="upload-prompt">
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                  <p>Click to select images</p>
                  <p class="upload-subtext">or drag & drop here</p>
                  <button class="btn browse-btn" @click.stop="triggerImagesInput">
                    <i class="fa-solid fa-folder-open"></i> Browse Files
                  </button>
                  <p class="file-requirements">
                    Supported formats: JPG, PNG, GIF, WebP<br>
                    Max size: 5MB per image • Max 10 images
                  </p>
                </div>
                
                <!-- Hidden file input -->
                <input 
                  ref="imagesInput"
                  type="file" 
                  accept="image/*"
                  multiple
                  @change="handleImagesSelect"
                  class="file-input-hidden"
                />
              </div>

              <!-- Selected Files Info -->
              <div v-if="selectedImages.length > 0" class="selected-files-info">
                <h5>Selected Images ({{ selectedImages.length }})</h5>
                <div class="selected-images-grid">
                  <div v-for="(preview, index) in imagesPreview" :key="index" class="selected-image-item">
                    <img :src="preview" :alt="`Preview ${index + 1}`" class="preview-img" />
                    <button class="btn remove-selected-btn" @click="removeSelectedImage(index)">
                      <i class="fa-solid fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload Progress -->
            <div v-if="imagesUploadProgress > 0 && imagesUploadProgress < 100" class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: imagesUploadProgress + '%' }"></div>
              </div>
              <p class="progress-text">Uploading... {{ imagesUploadProgress }}%</p>
            </div>

            <!-- Error Message -->
            <div v-if="imagesUploadError" class="upload-error">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>{{ imagesUploadError }}</span>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button class="btn cancel-btn" @click="closeImagesEditor" :disabled="uploadingImages">
                Cancel
              </button>
              <button class="btn upload-btn" @click="uploadImages" :disabled="selectedImages.length === 0 || uploadingImages">
                <i v-if="uploadingImages" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-upload"></i>
                {{ uploadingImages ? 'Uploading...' : 'Upload Images' }}
              </button>
            </div>
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
            
            <!-- Reviews Content (only show when not loading) -->
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
                  
                  <!-- Rating Breakdown -->
                  <div class="rating-breakdown">
                    <h4>Rating Breakdown</h4>
                    <div class="rating-bars">
                      <div class="rating-bar" v-for="(count, rating) in ratingDistribution" :key="rating">
                        <span class="rating-label">{{ rating }} stars</span>
                        <div class="bar-container">
                          <div class="bar-fill" :style="{ 
                            width: selectedServiceReviews.length > 0 ? 
                              `${(count / selectedServiceReviews.length) * 100}%` : '0%' 
                          }"></div>
                        </div>
                        <span class="rating-count">{{ count }}</span>
                      </div>
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
                        <div v-if="review.serviceDetails" class="review-service-info">
                          <small>Service: {{ review.serviceDetails.title }}</small>
                        </div>
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
      expandedServiceId: null,
      selectedService: null,
      selectedServiceId: null,
      daysOfWeek: [
        { key: 'monday', name: 'monday', label: 'Monday' },
        { key: 'tuesday', name: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', name: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', name: 'thursday', label: 'Thursday' },
        { key: 'friday', name: 'friday', label: 'Friday' },
        { key: 'saturday', name: 'saturday', label: 'Saturday' },
        { key: 'sunday', name: 'sunday', label: 'Sunday' }
      ],
      
      // Service Images Editor State
      showImagesEditor: false,
      imagesEditorService: null,
      serviceImages: [],
      selectedImages: [],
      imagesPreview: [],
      imagesDragover: false,
      uploadingImages: false,
      imagesUploadProgress: 0,
      imagesUploadError: null,
      uploadSuccessMessage: null,
      
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
      reviewsSortBy: 'newest'
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
          this.getCategoryName(s?.categoryId || s?.category).toLowerCase().includes(q) ||
          this.getSubcategoryNames(s).toLowerCase().includes(q)
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
    ratingDistribution() {
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      this.selectedServiceReviews.forEach(review => {
        const rating = Math.round(review.rating) || 0;
        if (rating >= 1 && rating <= 5) {
          distribution[rating]++;
        }
      });
      return distribution;
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
    // ===== SIMPLIFIED BANNER METHODS =====
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

    // ===== SERVICE IMAGES METHODS =====
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
        // Check if it's already a full URL or data URL
        if (image.startsWith('http') || image.startsWith('data:') || image.startsWith('/')) {
          return image;
        }
        // If it's just a filename, add the uploads path
        return `/uploads/${image}`;
      }
      
      if (typeof image === 'object') {
        // Try to extract URL from object
        const possibleKeys = ['url', 'imageUrl', 'src', 'path', 'image', 'link', 'uri'];
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
    
    handleImageError(index) {
      console.error('Image failed to load at index:', index);
      // You can show a placeholder or hide the image
    },

    // ===== OPEN IMAGES EDITOR =====
    openImagesEditor(service) {
      if (!service) {
        this.setError("Cannot edit images: Service data is missing");
        return;
      }
      
      const serviceId = this.getServiceId(service);
      if (!serviceId) {
        this.setError("Cannot edit images: Service ID is missing");
        return;
      }
      
      this.imagesEditorService = service;
      this.serviceImages = this.getServiceImages(service);
      this.selectedImages = [];
      this.imagesPreview = [];
      this.imagesUploadError = null;
      this.uploadSuccessMessage = null;
      this.imagesUploadProgress = 0;
      this.showImagesEditor = true;
      
      console.log('Opening images editor for service:', {
        title: service.title,
        id: serviceId,
        currentImages: this.serviceImages
      });
    },

    closeImagesEditor() {
      if (this.uploadingImages) {
        if (!confirm('Upload is in progress. Are you sure you want to cancel?')) {
          return;
        }
      }
      this.showImagesEditor = false;
      this.imagesEditorService = null;
      this.serviceImages = [];
      this.selectedImages = [];
      this.imagesPreview = [];
      this.imagesUploadError = null;
      this.uploadSuccessMessage = null;
      this.imagesDragover = false;
      this.imagesUploadProgress = 0;
    },

    triggerImagesInput() {
      this.$refs.imagesInput?.click();
    },

    handleImagesSelect(event) {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        console.log('Files selected:', files.length);
        this.validateAndSetImages(files);
      }
    },

    handleImagesDrop(event) {
      this.imagesDragover = false;
      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        console.log('Files dropped:', files.length);
        this.validateAndSetImages(files);
      }
    },

    validateAndSetImages(files) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      const maxFiles = 10;
      const currentSelected = this.selectedImages.length;
      
      if (currentSelected + files.length > maxFiles) {
        this.imagesUploadError = `Maximum ${maxFiles} images allowed. You have ${currentSelected} selected.`;
        return;
      }

      const validFiles = [];
      const invalidFiles = [];

      files.forEach(file => {
        if (!validTypes.includes(file.type.toLowerCase())) {
          invalidFiles.push(`${file.name}: Invalid file type. Use JPG, PNG, GIF, or WebP.`);
          return;
        }

        if (file.size > maxSize) {
          invalidFiles.push(`${file.name}: File size (${this.formatFileSize(file.size)}) exceeds 5MB limit.`);
          return;
        }

        validFiles.push(file);
      });

      if (invalidFiles.length > 0) {
        this.imagesUploadError = invalidFiles.join('<br>');
      }

      if (validFiles.length > 0) {
        this.selectedImages = [...this.selectedImages, ...validFiles];
        this.generateImagesPreview(validFiles);
        this.imagesUploadError = null;
        console.log('Valid files selected:', validFiles.length);
      }
    },

    generateImagesPreview(files) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagesPreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    removeSelectedImage(index) {
      this.selectedImages.splice(index, 1);
      this.imagesPreview.splice(index, 1);
      console.log('Removed selected image at index:', index);
    },

    async deleteImage(index) {
      const serviceId = this.getServiceId(this.imagesEditorService);
      if (!serviceId) {
        this.setError("Cannot delete image: Service ID is missing");
        return;
      }

      if (!confirm('Are you sure you want to delete this image?')) {
        return;
      }

      try {
        // Remove the image from local state first
        const imageToDelete = this.serviceImages[index];
        const updatedImages = [...this.serviceImages];
        updatedImages.splice(index, 1);
        
        // Update the service with the new images array
        const updateData = {
          ...this.imagesEditorService,
          images: updatedImages
        };
        
        const response = await http.put(`/services/${serviceId}`, updateData);
        
        // Update local state
        this.serviceImages = updatedImages;
        this.imagesEditorService.images = updatedImages;
        
        // Update the service in the main services list
        const serviceIndex = this.services.findIndex(s => this.getServiceId(s) === serviceId);
        if (serviceIndex !== -1) {
          this.services[serviceIndex].images = updatedImages;
        }
        
        this.setSuccess("Image deleted successfully!");
        
      } catch (error) {
        console.error("Failed to delete image:", error);
        this.setError("Failed to delete image. Please try again.");
      }
    },

    // ===== FIXED: UPLOAD IMAGES METHOD =====
    async uploadImages() {
      console.log('🚀 Starting image upload process...');
      
      if (this.selectedImages.length === 0) {
        this.imagesUploadError = "Please select images to upload first";
        return;
      }
      
      if (!this.imagesEditorService) {
        this.imagesUploadError = "Service data is missing";
        return;
      }
      
      const serviceId = this.getServiceId(this.imagesEditorService);
      if (!serviceId) {
        this.setError("Cannot upload images: Service ID is missing");
        return;
      }
      
      console.log('Uploading images for service:', {
        serviceId: serviceId,
        serviceTitle: this.imagesEditorService.title,
        filesToUpload: this.selectedImages.length
      });
      
      this.uploadingImages = true;
      this.imagesUploadError = null;
      this.uploadSuccessMessage = null;
      this.imagesUploadProgress = 0;
      
      try {
        const uploadedUrls = [];
        const totalFiles = this.selectedImages.length;
        
        // Upload each image
        for (let i = 0; i < totalFiles; i++) {
          const file = this.selectedImages[i];
          
          console.log(`Uploading file ${i + 1}/${totalFiles}: ${file.name}`);
          
          // Update progress
          this.imagesUploadProgress = Math.round((i / totalFiles) * 100);
          
          // Create FormData for this file
          const formData = new FormData();
          formData.append('image', file);
          formData.append('serviceId', serviceId);
          
          try {
            // Upload to backend
            const response = await http.post('/upload/image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              timeout: 30000
            });
            
            console.log('Upload response:', response.data);
            
            // Extract image URL from response
            let imageUrl = null;
            const data = response.data;
            
            if (data) {
              // Try different response structures
              if (data.url) imageUrl = data.url;
              else if (data.imageUrl) imageUrl = data.imageUrl;
              else if (data.data?.url) imageUrl = data.data.url;
              else if (data.image) imageUrl = data.image;
              else if (data.path) imageUrl = data.path;
              else if (typeof data === 'string') imageUrl = data;
              else if (Array.isArray(data) && data[0]?.url) imageUrl = data[0].url;
            }
            
            if (imageUrl) {
              // Format the URL if needed
              if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
                imageUrl = `/uploads/${imageUrl}`;
              }
              uploadedUrls.push(imageUrl);
              console.log(`✅ Uploaded: ${file.name} -> ${imageUrl}`);
            } else {
              console.warn(`Could not extract URL from response for ${file.name}`);
              this.imagesUploadError = `Could not get image URL for ${file.name}. Please try again.`;
            }
            
          } catch (uploadError) {
            console.error(`Upload failed for ${file.name}:`, uploadError);
            let errorMsg = `Failed to upload ${file.name}: `;
            
            if (uploadError.response) {
              errorMsg += `Server error ${uploadError.response.status}`;
              if (uploadError.response.data?.message) {
                errorMsg += ` - ${uploadError.response.data.message}`;
              }
            } else if (uploadError.code === 'ECONNABORTED') {
              errorMsg += 'Timeout - file might be too large';
            } else if (uploadError.message) {
              errorMsg += uploadError.message;
            }
            
            this.imagesUploadError = errorMsg;
            continue; // Continue with next file
          }
        }
        
        // Update progress to 100%
        this.imagesUploadProgress = 100;
        
        // If we have uploaded images, update the service
        if (uploadedUrls.length > 0) {
          try {
            // Get current service images
            const currentImages = this.serviceImages;
            const newImages = [...currentImages, ...uploadedUrls];
            
            console.log('Updating service with new images:', {
              oldCount: currentImages.length,
              newCount: newImages.length,
              newImages: newImages
            });
            
            // Prepare update data
            const updateData = {
              ...this.imagesEditorService,
              images: newImages
            };
            
            // Update the service in backend
            const updateResponse = await http.put(`/services/${serviceId}`, updateData);
            
            console.log('Service update response:', updateResponse.data);
            
            // Update local state
            this.serviceImages = newImages;
            this.imagesEditorService.images = newImages;
            
            // Update in main services list
            const serviceIndex = this.services.findIndex(s => this.getServiceId(s) === serviceId);
            if (serviceIndex !== -1) {
              this.services[serviceIndex].images = newImages;
            }
            
            this.uploadSuccessMessage = `✅ Successfully uploaded ${uploadedUrls.length} image(s)!`;
            
            // Clear selected images and previews
            this.selectedImages = [];
            this.imagesPreview = [];
            
            // Show success and close after delay
            setTimeout(() => {
              this.closeImagesEditor();
              this.setSuccess(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
              
              // Refresh services to ensure data is up to date
              this.fetchServices();
            }, 2000);
            
          } catch (updateError) {
            console.error('Failed to update service with images:', updateError);
            this.imagesUploadError = `Images uploaded but failed to update service: ${updateError.message}`;
          }
        } else {
          this.imagesUploadError = "No images were successfully uploaded. Please try again.";
        }
        
      } catch (error) {
        console.error('General upload error:', error);
        this.imagesUploadError = `Upload failed: ${error.message || 'Unknown error'}`;
      } finally {
        this.uploadingImages = false;
        this.imagesUploadProgress = 0;
      }
    },

    // ===== SERVICE METHODS =====
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
    
    getAccurateAvailableDaysCount(service) {
      if (!service || !service.slots || !Array.isArray(service.slots)) return 0;
      const availableDays = new Set();
      service.slots.forEach(slot => {
        if (slot && slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          slot.weeklySchedule.forEach(daySchedule => {
            if (this.shouldCountDay(daySchedule)) {
              availableDays.add(daySchedule.day);
            }
          });
        }
      });
      return availableDays.size;
    },
    
    shouldCountDay(daySchedule) {
      if (!daySchedule) return false;
      if (daySchedule.isWorkingDay !== true) return false;
      if (!daySchedule.timeSlots || !Array.isArray(daySchedule.timeSlots)) return false;
      return daySchedule.timeSlots.some(slot => 
        slot && slot.isAvailable === true
      );
    },
    
    getAvailableDaysCount(service) {
      return this.getAccurateAvailableDaysCount(service);
    },
    
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
    
    async handleTimeSlotsSaved(result) {
      try {
        await this.fetchServices();
        this.showNotification('Time slots saved successfully!', 'success');
      } catch (error) {
        console.error('Error handling time slots save:', error);
        this.showNotification('Time slots saved successfully!', 'success');
      } finally {
        this.closeTimeSlotsPanel();
      }
    },
    
    showNotification(message, type = 'info') {
      const notificationEl = document.createElement('div');
      notificationEl.className = `global-notification global-notification-${type}`;
      notificationEl.textContent = message;
      notificationEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#dc2626' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        word-wrap: break-word;
      `;
      document.body.appendChild(notificationEl);
      setTimeout(() => {
        if (document.body.contains(notificationEl)) {
          document.body.removeChild(notificationEl);
        }
      }, 4000);
    },
    
    getServiceId(service) {
      if (!service) return null;
      return service.serviceId || service._id || service.id || null;
    },
    
    getServiceKey(service) {
      if (!service) return Math.random();
      return this.getServiceId(service) || service.title || Math.random();
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
    
    hasSubcategories(service) {
      if (!service) return false;
      return Array.isArray(service.subcategories) && 
             service.subcategories.length > 0 &&
             service.subcategories[0] && typeof service.subcategories[0] === 'string';
    },
    
    getSubcategories(service) {
      if (!service || !Array.isArray(service.subcategories)) {
        return [];
      }
      return service.subcategories.filter(name => name && typeof name === 'string');
    },
    
    getSubcategoryNames(service) {
      return this.getSubcategories(service).join(', ');
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
        } else {
          console.warn('Unexpected services data format:', typeof servicesData);
          processedServices = [];
        }
        
        this.services = processedServices;
      } catch (err) {
        console.error("Failed to fetch services:", err);
        const errorMsg = err.response?.data?.message || err.message || "Could not load services";
        this.setError(errorMsg);
        this.services = [];
      } finally {
        this.loading = false;
      }
    },
    
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
      this.editingServiceData = JSON.parse(JSON.stringify(service));
      this.editingServiceId = serviceId;
      if (!this.editingServiceData.slots) {
        this.editingServiceData.slots = [];
      }
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
    
    async saveService() {
      if (!this.editingServiceData || !this.editingServiceId) {
        this.setError("No service data to save.");
        return;
      }
      this.saving = true;
      try {
        const serviceData = {
          title: String(this.editingServiceData.title || '').trim(),
          description: String(this.editingServiceData.description || '').trim(),
          totalPrice: Math.max(0, Number(this.editingServiceData.totalPrice) || 0),
          bookingPrice: Math.max(0, Number(this.editingServiceData.bookingPrice) || 0),
          paymentMethod: String(this.editingServiceData.paymentMethod || 'Telebirr'),
          serviceType: String(this.editingServiceData.serviceType || 'fixed'),
          priceUnit: String(this.editingServiceData.priceUnit || 'ETB'),
          location: String(this.editingServiceData.location || ''),
          email: String(this.editingServiceData.email || ''),
          phone: String(this.editingServiceData.phone || ''),
          experience: String(this.editingServiceData.experience || '')
        };
        if (this.editingServiceData.categoryId && this.editingServiceData.categoryId.length > 5) {
          serviceData.categoryId = String(this.editingServiceData.categoryId);
        }
        if (this.editingServiceData.slots && Array.isArray(this.editingServiceData.slots)) {
          serviceData.slots = this.editingServiceData.slots;
        } else {
          serviceData.slots = [];
        }
        await http.put(`/services/${this.editingServiceId}`, serviceData);
        this.setSuccess("Service updated successfully!");
        this.editingServiceId = null;
        this.editingServiceData = null;
        await this.fetchServices();
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
    
    openForm(service) {
      this.editingService = service ? { ...service } : null;
      this.showForm = true;
    },
    
    async onServiceSaved(savedService) {
      await this.fetchServices();
      this.closeForm();
      this.setSuccess("Service saved successfully! Now add time slots to activate it.");
    },
    
    cancelEdit() {
      this.editingServiceId = null;
      this.editingServiceData = null;
    },
    
    toggleQuickAvailability(isAvailable) {
      if (!this.editingServiceData) return;
      if (isAvailable) {
        if (!this.editingServiceData.slots || this.editingServiceData.slots.length === 0) {
          this.editingServiceData.slots = [{
            dayOfWeek: 'monday',
            slotLabel: 'Default Schedule',
            isActive: true,
            weeklySchedule: [{
              day: 'monday',
              isWorkingDay: true,
              timeSlots: [
                { startTime: "09:00", endTime: "17:00", isAvailable: true }
              ]
            }]
          }];
        }
      } else {
        this.editingServiceData.slots = [];
      }
    },

    // ===== REVIEWS METHODS =====
    async loadAllReviews() {
      try {
        console.log('Loading reviews for all services...');
        
        if (!this.services || this.services.length === 0) {
          console.log('No services to load reviews for');
          return;
        }
        
        const reviewPromises = this.services.map(async (service) => {
          const serviceId = this.getServiceId(service);
          if (!serviceId) return null;
          
          try {
            const endpoint = `/reviews/service/${serviceId}`;
            console.log(`Fetching reviews from: ${endpoint}`);
            
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
            
            console.log(`Found ${reviews.length} reviews for service ${service.title}`);
            
            const processedReviews = reviews.map(review => ({
              _id: review._id || review.id || Math.random().toString(36).substr(2, 9),
              reviewerName: review.customerName || review.reviewerName || review.user?.name || review.customer?.name || 'Anonymous',
              reviewerEmail: review.customerEmail || review.reviewerEmail || review.user?.email || review.customer?.email,
              rating: review.rating || 0,
              message: review.review || review.message || review.comment || review.content || '',
              createdAt: review.createdAt || review.date || review.timestamp || new Date().toISOString(),
              serviceDetails: review.service || service,
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
            
            return {
              serviceId,
              count: processedReviews.length,
              averageRating
            };
          } catch (error) {
            console.log(`Could not load reviews for service ${serviceId}:`, error.message);
            this.serviceReviews[serviceId] = {
              reviews: [],
              count: 0,
              averageRating: 0
            };
            return null;
          }
        });
        
        const results = await Promise.all(reviewPromises);
        const successfulLoads = results.filter(r => r !== null && r.count > 0);
        
        console.log(`Reviews loaded: ${successfulLoads.length} services have reviews`);
        
        this.updateReviewsStats();
        
      } catch (error) {
        console.error('Error loading all reviews:', error);
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
      
      console.log(`Opening reviews for service: ${service.title} (${serviceId})`);
      
      try {
        if (this.serviceReviews[serviceId]?.reviews && this.serviceReviews[serviceId].reviews.length > 0) {
          console.log(`Using cached reviews: ${this.serviceReviews[serviceId].reviews.length} reviews found`);
          this.selectedServiceReviews = this.serviceReviews[serviceId].reviews;
          this.loadingReviews = false;
          this.showReviewsContent = true;
          return;
        }
        
        const endpoint = `/reviews/service/${serviceId}`;
        console.log(`Fetching reviews from: ${endpoint}`);
        
        const response = await http.get(endpoint);
        const data = response.data;
        
        let reviews = [];
        
        if (Array.isArray(data)) {
          reviews = data;
          console.log(`Got array of ${reviews.length} reviews`);
        } else if (data && data.reviews && Array.isArray(data.reviews)) {
          reviews = data.reviews;
          console.log(`Got reviews array in 'reviews' property: ${reviews.length} reviews`);
        } else if (data && data.data && Array.isArray(data.data)) {
          reviews = data.data;
          console.log(`Got reviews array in 'data' property: ${reviews.length} reviews`);
        } else {
          console.log(`Unexpected response structure:`, data);
        }
        
        if (reviews.length === 0) {
          console.log('No reviews found for this service');
          this.selectedServiceReviews = [];
          this.serviceReviews[serviceId] = {
            reviews: [],
            count: 0,
            averageRating: 0
          };
          this.loadingReviews = false;
          this.showReviewsContent = true;
          return;
        }
        
        this.selectedServiceReviews = reviews.map(review => ({
          _id: review._id || review.id || Math.random().toString(36).substr(2, 9),
          reviewerName: review.customerName || review.reviewerName || review.user?.name || review.customer?.name || 'Anonymous',
          reviewerEmail: review.customerEmail || review.reviewerEmail || review.user?.email || review.customer?.email,
          rating: review.rating || 0,
          message: review.review || review.message || review.comment || review.content || '',
          createdAt: review.createdAt || review.date || review.timestamp || new Date().toISOString(),
          serviceDetails: review.service || service,
          reply: review.reply || review.response || ''
        }));
        
        console.log(`Processed ${this.selectedServiceReviews.length} reviews`);
        
        this.serviceReviews[serviceId] = {
          reviews: this.selectedServiceReviews,
          count: this.selectedServiceReviews.length,
          averageRating: this.selectedServiceReviews.length > 0 
            ? this.selectedServiceReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / this.selectedServiceReviews.length
            : 0
        };
        
        this.updateReviewsStats();
        
      } catch (error) {
        console.error('Error fetching reviews:', error);
        console.error('Error details:', error.response?.data || error.message);
        
        this.selectedServiceReviews = [];
        this.serviceReviews[serviceId] = {
          reviews: [],
          count: 0,
          averageRating: 0
        };
        
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
        averageRating: totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0,
        distribution: this.calculateOverallRatingDistribution()
      };
    },
    
    calculateOverallRatingDistribution() {
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      
      Object.values(this.serviceReviews).forEach(serviceReview => {
        if (serviceReview.reviews && Array.isArray(serviceReview.reviews)) {
          serviceReview.reviews.forEach(review => {
            const rating = Math.round(review.rating) || 0;
            if (rating >= 1 && rating <= 5) {
              distribution[rating]++;
            }
          });
        }
      });
      
      return distribution;
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

    // ===== HELPER METHODS =====
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }
};
</script>

<style scoped>
/* Keep all your existing styles - they're already correct */
/* Just ensure the CSS is included as is from your original code */

/* 🆕 ADDED: Images Editor Modal Styles */
.images-editor-modal {
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.images-editor-modal .modal-content {
  padding: 1.5rem;
}

.current-images-section,
.upload-images-section {
  margin-bottom: 1.5rem;
}

.current-images-section h4,
.upload-images-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.image-item {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.delete-image-btn {
  background: #e53e3e;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-image-btn:hover {
  background: #c53030;
  transform: scale(1.1);
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.upload-area.dragover {
  border-color: #3182ce;
  background: #ebf8ff;
}

.upload-prompt i {
  font-size: 2.5rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.upload-prompt p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.upload-subtext {
  font-size: 0.875rem;
  color: #a0aec0;
}

.browse-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.2s ease;
}

.browse-btn:hover {
  background: #2c5282;
}

.file-input-hidden {
  display: none;
}

.selected-files-info {
  margin-top: 1.5rem;
}

.selected-files-info h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.selected-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.selected-image-item {
  position: relative;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-selected-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-selected-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.upload-progress {
  margin: 1rem 0;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3182ce;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #718096;
  text-align: center;
  margin-top: 0.5rem;
}

.upload-error {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* 🆕 ADDED: Add Images action button */
.action-btn.add-images {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.add-images:hover:not(:disabled) {
  background: #bfdbfe;
}


.images-editor-modal {
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.images-editor-modal .modal-content {
  padding: 1.5rem;
}

.current-images-section,
.upload-images-section {
  margin-bottom: 1.5rem;
}

.current-images-section h4,
.upload-images-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.image-item {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.delete-image-btn {
  background: #e53e3e;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-image-btn:hover {
  background: #c53030;
  transform: scale(1.1);
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.upload-area.dragover {
  border-color: #3182ce;
  background: #ebf8ff;
}

.upload-prompt i {
  font-size: 2.5rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.upload-prompt p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.upload-subtext {
  font-size: 0.875rem;
  color: #a0aec0;
}

.browse-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.2s ease;
}

.browse-btn:hover {
  background: #2c5282;
}

.file-input-hidden {
  display: none;
}

.selected-files-info {
  margin-top: 1.5rem;
}

.selected-files-info h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.selected-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.selected-image-item {
  position: relative;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-selected-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-selected-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.upload-progress {
  margin: 1rem 0;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3182ce;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #718096;
  text-align: center;
  margin-top: 0.5rem;
}

.upload-error {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* 🗑️ REMOVED: Add Images button styles from banner area */

/* 🆕 ADDED: Add Images action button */
.action-btn.add-images {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.add-images:hover:not(:disabled) {
  background: #bfdbfe;
}

/* ===== ALL OTHER STYLES REMAIN THE SAME AS BEFORE ===== */
/* ... (rest of the styles remain exactly the same as in the previous code) ... */

</style>

<style scoped>
/* 🆕 ADDED: Images Editor Modal Styles */
.images-editor-modal {
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.images-editor-modal .modal-content {
  padding: 1.5rem;
}

.current-images-section,
.upload-images-section {
  margin-bottom: 1.5rem;
}

.current-images-section h4,
.upload-images-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.image-item {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.delete-image-btn {
  background: #e53e3e;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-image-btn:hover {
  background: #c53030;
  transform: scale(1.1);
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.upload-area.dragover {
  border-color: #3182ce;
  background: #ebf8ff;
}

.upload-prompt i {
  font-size: 2.5rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.upload-prompt p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.upload-subtext {
  font-size: 0.875rem;
  color: #a0aec0;
}

.browse-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.2s ease;
}

.browse-btn:hover {
  background: #2c5282;
}

.file-input-hidden {
  display: none;
}

.selected-files-info {
  margin-top: 1.5rem;
}

.selected-files-info h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.selected-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.selected-image-item {
  position: relative;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-selected-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-selected-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.upload-progress {
  margin: 1rem 0;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3182ce;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #718096;
  text-align: center;
  margin-top: 0.5rem;
}

.upload-error {
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* 🆕 ADDED: Add Images button styles */
.add-images-btn {
  background: rgba(139, 92, 246, 0.9);
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.add-images-btn:hover {
  background: rgba(124, 58, 237, 0.9);
  transform: translateY(-1px);
}

/* 🆕 ADDED: Add Images action button */
.action-btn.add-images {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.add-images:hover:not(:disabled) {
  background: #bfdbfe;
}

/* ===== ALL OTHER STYLES REMAIN THE SAME AS BEFORE ===== */
/* ... (rest of the styles remain exactly the same as in the previous code) ... */


/* 🆕 ADDED: Images Editor Modal Styles */
.images-editor-modal {
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.images-editor-modal .modal-content {
  padding: 1.5rem;
}

.current-images-section,
.upload-images-section {
  margin-bottom: 1.5rem;
}

.current-images-section h4,
.upload-images-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.image-item {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.delete-image-btn {
  background: #e53e3e;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-image-btn:hover {
  background: #c53030;
  transform: scale(1.1);
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.upload-area.dragover {
  border-color: #3182ce;
  background: #ebf8ff;
}

.upload-prompt i {
  font-size: 2.5rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.upload-prompt p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.upload-subtext {
  font-size: 0.875rem;
  color: #a0aec0;
}

.browse-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.2s ease;
}

.browse-btn:hover {
  background: #2c5282;
}

.file-input-hidden {
  display: none;
}

.selected-files-info {
  margin-top: 1.5rem;
}

.selected-files-info h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.selected-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.selected-image-item {
  position: relative;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-selected-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-selected-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* 🆕 ADDED: Add Images button styles */
.add-images-btn {
  background: rgba(139, 92, 246, 0.9);
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.add-images-btn:hover {
  background: rgba(124, 58, 237, 0.9);
  transform: translateY(-1px);
}

/* 🆕 ADDED: Add Images action button */
.action-btn.add-images {
  background: #8b5cf6;
  color: white;
}

.action-btn.add-images:hover:not(:disabled) {
  background: #7c3aed;
}

/* 🗑️ REMOVED: Edit Banner button styles */

/* ===== REVIEWS STYLES ===== */
.reviews-summary {
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reviews-summary:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

.reviews-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.reviews-title {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.reviews-count {
  background: #3182ce;
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.reviews-preview {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.reviews-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.stars .fa-star {
  color: #fbbf24;
  font-size: 0.75rem;
}

.stars .fa-regular.fa-star {
  color: #d1d5db;
}

.rating-value {
  font-weight: 700;
  color: #2d3748;
  font-size: 0.875rem;
}

.reviews-hint {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
}

.no-reviews {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0aec0;
  font-size: 0.875rem;
}

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

.rating-breakdown h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-label {
  width: 60px;
  font-size: 0.875rem;
  color: #4a5568;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #3182ce;
  border-radius: 4px;
}

.rating-count {
  width: 30px;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
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

.stat-icon.reviews {
  background: #fef3c7;
  color: #d97706;
}

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

/* ===== SERVICES GRID ===== */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
  width: 100%;
}

/* ===== SERVICE CARD ===== */
.service-card {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  border: 1px solid #e2e8f0;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #3182ce;
}

/* ===== CARD BANNER ===== */
.card-banner {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #edf2f7;
}

.banner-actions {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 3;
}

/* 🗑️ REMOVED: .edit-banner-btn styles */

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-card:hover .banner-img {
  transform: scale(1.05);
}

.banner-placeholder {
  width: 100%;
  height: 100%;
  background: #3182ce;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
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

/* ===== CARD CONTENT ===== */
.card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== CARD HEADER ===== */
.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.4;
}

/* ===== CATEGORIES SECTION ===== */
.categories-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-tag {
  background: #3182ce;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.subcategories-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.subcategory-tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
}

/* ===== SERVICE DESCRIPTION ===== */
.service-description {
  color: #718096;
  line-height: 1.5;
  font-size: 0.9rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== SERVICE META ===== */
.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin: 0.5rem 0;
}

.price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.price-amount {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.booking-price {
  font-size: 0.875rem;
  color: #718096;
}

.payment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
}

/* ===== AVAILABILITY SUMMARY ===== */
.availability-summary {
  margin: 0.5rem 0;
}

.availability-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.availability-badge {
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.availability-badge.available {
  background: #c6f6d5;
  color: #38a169;
}

.days-count {
  color: #718096;
  font-size: 0.875rem;
}

/* ===== MANAGE SLOTS BUTTON ===== */
.manage-slots-section {
  margin-top: 1rem;
}

.manage-slots-btn {
  width: 100%;
  padding: 0.75rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.manage-slots-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

/* ===== DRAFT ACTIONS ===== */
.draft-actions {
  text-align: center;
  padding: 0.75rem;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px dashed #fed7d7;
}

.draft-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #e53e3e;
  font-weight: 600;
  font-size: 0.875rem;
}

.add-slots-btn {
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
  width: 100%;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.add-slots-btn:hover {
  background: #c53030;
  transform: translateY(-1px);
}

/* ===== TIME SLOTS PANEL ===== */
.time-slots-panel {
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}

.time-slots-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.time-slots-panel-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.close-panel-btn {
  background: #718096;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.close-panel-btn:hover {
  background: #4a5568;
}

.time-slots-panel-content {
  padding: 1.25rem;
  max-height: 400px;
  overflow-y: auto;
}

/* ===== CARD ACTIONS ===== */
.card-actions {
  display: flex;
  padding: 0.75rem 1.25rem;
  gap: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.edit {
  background: #bee3f8;
  color: #2b6cb0;
}

.action-btn.edit:hover:not(:disabled) {
  background: #90cdf4;
}

.action-btn.add-images {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.add-images:hover:not(:disabled) {
  background: #bfdbfe;
}

.action-btn.delete {
  background: #fed7d7;
  color: #c53030;
}

.action-btn.delete:hover:not(:disabled) {
  background: #feb2b2;
}

/* ===== EDIT MODE ===== */
.edit-mode {
  background: #f7fafc;
  padding: 1.25rem;
  border-radius: 8px;
  margin-top: 1rem;
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

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.save-btn {
  width: 100%;
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.save-btn:hover:not(:disabled) {
  background: #2c5282;
}

.save-btn:disabled {
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

.slide-down-enter-active {
  animation: slideDown 0.3s ease;
}

.slide-down-leave-active {
  animation: slideUp 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    max-height: 500px;
  }
  to {
    opacity: 0;
    max-height: 0;
  }
}

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* Large Desktop */
@media (min-width: 1400px) {
  .services-section {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet */
@media (max-width: 1024px) and (min-width: 768px) {
  .services-section {
    padding: 1.5rem;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile Landscape / Small Tablet */
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
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .service-card {
    min-height: 380px;
  }
  
  .card-banner {
    height: 140px;
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
  
  .images-editor-modal {
    max-width: 90%;
  }
  
  /* Adjust card actions for mobile */
  .card-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .services-section {
    padding: 0.75rem;
  }
  
  .service-card {
    min-height: 350px;
  }
  
  .card-banner {
    height: 120px;
  }
  
  .service-title {
    font-size: 1.125rem;
  }
  
  .total-price {
    font-size: 1.125rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .time-slots-panel-header {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .time-slots-panel-header h4 {
    font-size: 0.95rem;
  }
  
  .images-editor-modal .modal-content {
    padding: 1rem;
  }
  
  .upload-area {
    padding: 1.5rem;
  }
  
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .image-item {
    height: 100px;
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
  
  .service-card {
    min-height: 320px;
  }
  
  .card-banner {
    height: 100px;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .service-title {
    font-size: 1rem;
  }
  
  .total-price {
    font-size: 1rem;
  }
  
  .status-stat {
    padding: 0.75rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .add-images-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
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
.action-btn:focus-visible,
.add-service-btn:focus-visible,
.close-btn:focus-visible,
.manage-slots-btn:focus-visible,
.add-slots-btn:focus-visible,
.search-input input:focus-visible,
.status-filter select:focus-visible,
.add-images-btn:focus-visible {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .service-card {
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
  .service-card,
  .empty-state,
  .loading-state,
  .modal {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .section-title,
  .service-title {
    color: #f7fafc;
  }
  
  .section-subtitle,
  .service-description {
    color: #cbd5e0;
  }
  
  .total-price {
    color: #f7fafc;
  }
  
  .stat-number {
    color: #f7fafc;
  }
  
  .search-input input,
  .status-filter select,
  .form-control {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .add-images-btn {
    background: rgba(139, 92, 246, 0.7);
  }
}

/* Print styles */
@media print {
  .debug-btn,
  .card-actions,
  .service-status-badge,
  .controls-bar,
  .add-service-btn,
  .add-images-btn {
    display: none !important;
  }
  
  .service-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
  
  .services-grid {
    display: block;
  }
}
</style>