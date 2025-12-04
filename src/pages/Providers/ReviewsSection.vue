<template>
  <div class="reviews-section">
    <!-- Header with service name -->
    <div class="section-header">
      <h2>📝 Reviews for "{{ serviceName || 'Loading...' }}"</h2>
      <div class="header-actions">
        <button @click="fetchReviews" class="refresh-btn" :disabled="loading">
          🔄 {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
        <span class="last-updated" v-if="reviews.length">
          Last updated: {{ lastUpdated }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading reviews from API...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Error Loading Reviews</h3>
      <p class="error-text">{{ error }}</p>
      <button @click="fetchReviews" class="retry-btn">
        Try Again
      </button>
      <div class="dev-info" v-if="showDevInfo">
        <p><strong>Debug Info:</strong></p>
        <p>Service ID: {{ serviceId }}</p>
        <p>API Endpoint: {{ apiUrl }}</p>
      </div>
    </div>

    <!-- No Reviews State -->
    <div v-else-if="reviews.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>No Reviews Yet</h3>
      <p>This service hasn't received any reviews yet.</p>
      <p class="hint">When customers book and review this service, their feedback will appear here.</p>
    </div>

    <!-- Reviews Content -->
    <div v-else class="reviews-content">
      <!-- Summary Stats -->
      <div class="stats-summary">
        <div class="stat-card">
          <div class="stat-value">{{ averageRating.toFixed(1) }}</div>
          <div class="stat-label">Average Rating</div>
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ 
              filled: i <= Math.floor(averageRating),
              half: i === Math.ceil(averageRating) && averageRating % 1 !== 0
            }">★</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ reviews.length }}</div>
          <div class="stat-label">Total Reviews</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ fiveStarReviews }}</div>
          <div class="stat-label">5-Star Reviews</div>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="reviews-list">
        <div v-for="review in reviews" :key="review.id || review._id" class="review-card">
          <div class="review-header">
            <div class="user-info">
              <img 
                :src="getUserAvatar(review)" 
                :alt="getUserName(review)"
                class="user-avatar"
                @error="handleImageError"
              />
              <div class="user-details">
                <h4 class="user-name">{{ getUserName(review) }}</h4>
                <div class="rating-date">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
                  </div>
                  <span class="date">{{ formatDate(review.createdAt || review.date) }}</span>
                </div>
              </div>
            </div>
            <div v-if="review.verifiedPurchase" class="verified-badge">
              ✅ Verified
            </div>
          </div>

          <div class="review-body">
            <h4 v-if="review.title" class="review-title">{{ review.title }}</h4>
            <p class="review-text">"{{ review.content || review.comment || review.text }}"</p>
          </div>

          <div class="review-footer">
            <div class="service-info" v-if="review.serviceName">
              <span class="label">Service:</span>
              <span class="value">{{ review.serviceName }}</span>
            </div>
            <div class="booking-info" v-if="review.bookingId">
              <span class="label">Booking ID:</span>
              <span class="value">{{ review.bookingId }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API Debug Info (for development) -->
    <div v-if="showDevInfo && reviews.length > 0" class="debug-info">
      <details>
        <summary>📊 API Response Data</summary>
        <pre>{{ JSON.stringify(reviews, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// Props
const props = defineProps({
  serviceId: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    default: "Service"
  },
  apiBaseUrl: {
    type: String,
    default: "/api" // Using proxy
  },
  showDevInfo: {
    type: Boolean,
    default: false
  }
});

// Reactive State
const reviews = ref([]);
const loading = ref(true);
const error = ref(null);
const lastFetched = ref(null);

// Computed Properties
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce((sum, review) => sum + (review.rating || 0), 0);
  return total / reviews.value.length;
});

const fiveStarReviews = computed(() => {
  return reviews.value.filter(review => review.rating === 5).length;
});

const lastUpdated = computed(() => {
  if (!lastFetched.value) return "Never";
  const now = new Date();
  const diffMs = now - new Date(lastFetched.value);
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  return `${Math.floor(diffMins / 60)} hours ago`;
});

const apiUrl = computed(() => {
  return `${props.apiBaseUrl}/infinity-booking/reviews/service/${props.serviceId}`;
});

// Methods
const fetchReviews = async () => {
  console.log(`📡 Fetching reviews for service: ${props.serviceId}`);
  console.log(`🌐 API URL: ${apiUrl.value}`);
  
  try {
    loading.value = true;
    error.value = null;
    
    const response = await fetch(apiUrl.value, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log(`✅ Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 API Response data:', data);
    
    // Handle different API response structures
    let reviewsData = [];
    
    if (Array.isArray(data)) {
      reviewsData = data;
    } else if (data && Array.isArray(data.reviews)) {
      reviewsData = data.reviews;
    } else if (data && Array.isArray(data.data)) {
      reviewsData = data.data;
    } else if (data && data.reviews && Array.isArray(data.reviews)) {
      reviewsData = data.reviews;
    } else if (data && data.success && Array.isArray(data.data)) {
      reviewsData = data.data;
    } else {
      console.warn('⚠️ Unexpected API structure. Raw data:', data);
      // Try to extract reviews from any array property
      for (const key in data) {
        if (Array.isArray(data[key])) {
          reviewsData = data[key];
          console.log(`📋 Found reviews in property: ${key}`);
          break;
        }
      }
    }

    // Transform and validate reviews
    reviews.value = reviewsData
      .map(review => ({
        id: review.id || review._id || review.reviewId || `review_${Date.now()}_${Math.random()}`,
        userId: review.userId || review.user?._id,
        userName: review.userName || review.user?.name || review.user?.fullName || review.author || 'Anonymous',
        rating: parseFloat(review.rating) || 0,
        title: review.title || review.reviewTitle || '',
        content: review.content || review.comment || review.text || review.review || '',
        createdAt: review.createdAt || review.date || review.reviewDate || new Date().toISOString(),
        verifiedPurchase: review.verifiedPurchase || review.isVerified || false,
        serviceName: review.serviceName || props.serviceName,
        bookingId: review.bookingId,
        avatar: review.avatar || review.user?.avatar || review.profilePicture
      }))
      .filter(review => review.rating > 0); // Only keep reviews with ratings

    console.log(`✅ Loaded ${reviews.value.length} valid reviews`);
    
    // Sort by date (newest first)
    reviews.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    lastFetched.value = new Date();
    
  } catch (err) {
    console.error('❌ Error fetching reviews:', err);
    error.value = err.message || 'Failed to load reviews';
    
    // Fallback to mock data for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🛠️ Using mock data for development');
      reviews.value = getMockReviews();
      error.value = null;
    }
  } finally {
    loading.value = false;
  }
};

const getMockReviews = () => {
  return [
    {
      id: "mock_1",
      userName: "John Smith",
      rating: 5,
      title: "Excellent Service!",
      content: "The massage was absolutely amazing. Very professional and the atmosphere was perfect.",
      createdAt: "2024-01-15T10:30:00Z",
      verifiedPurchase: true,
      serviceName: props.serviceName,
      bookingId: "BOOK-12345"
    },
    {
      id: "mock_2",
      userName: "Sarah Johnson",
      rating: 4,
      title: "Great Experience",
      content: "Very satisfied with the service quality. Will definitely book again!",
      createdAt: "2024-01-10T14:20:00Z",
      verifiedPurchase: true,
      serviceName: props.serviceName,
      bookingId: "BOOK-67890"
    }
  ];
};

const getUserName = (review) => {
  if (review.userName) return review.userName;
  return 'Anonymous Customer';
};

const getUserAvatar = (review) => {
  if (review.avatar) return review.avatar;
  const name = getUserName(review);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0077ff&color=fff&bold=true`;
};

const handleImageError = (event) => {
  event.target.src = 'https://ui-avatars.com/api/?name=Customer&background=0077ff&color=fff';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Date not available';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (err) {
    return dateString;
  }
};

// Lifecycle
onMounted(() => {
  if (props.serviceId) {
    fetchReviews();
  }
});

// Watch for serviceId changes
watch(() => props.serviceId, (newId) => {
  if (newId) {
    fetchReviews();
  }
});
</script>

<style scoped>
.reviews-section {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 1000px;
  margin: 2rem auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.refresh-btn {
  padding: 0.6rem 1.2rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.last-updated {
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #7f8c8d;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 2rem;
  background: #fff5f5;
  border-radius: 12px;
  border: 2px dashed #e74c3c;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #e74c3c;
  margin-bottom: 0.5rem;
}

.error-text {
  color: #666;
  margin-bottom: 1.5rem;
}

.retry-btn {
  padding: 0.8rem 2rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.dev-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
  font-family: monospace;
  font-size: 0.9rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.hint {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #95a5a6;
}

/* Stats Summary */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e9ecef;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  color: #7f8c8d;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 0.1rem;
  margin-top: 0.5rem;
}

.star {
  font-size: 1.2rem;
  color: #e0e0e0;
}

.star.filled {
  color: #f1c40f;
}

.star.half {
  background: linear-gradient(90deg, #f1c40f 50%, #e0e0e0 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.review-card:hover {
  border-color: #3498db;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.15);
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3498db;
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 0.3rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.rating-date {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.verified-badge {
  background: #27ae60;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.review-body {
  margin-bottom: 1rem;
}

.review-title {
  color: #34495e;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.review-text {
  color: #555;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
}

.review-footer {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.service-info, .booking-info {
  display: flex;
  gap: 0.5rem;
}

.label {
  color: #7f8c8d;
  font-weight: 500;
}

.value {
  color: #34495e;
  font-weight: 600;
}

/* Debug Info */
.debug-info {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px dashed #ddd;
}

.debug-info summary {
  cursor: pointer;
  color: #666;
  font-weight: 500;
  padding: 0.5rem;
}

.debug-info pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .stats-summary {
    grid-template-columns: 1fr;
  }
  
  .review-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>