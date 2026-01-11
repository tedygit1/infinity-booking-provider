<!-- src/pages/Providers/NotificationsSection.vue - COMPLETE FIX -->
<template>
  <div class="notifications-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <i class="fa-solid fa-bell"></i>
          Notifications
        </h1>
        <div class="header-stats">
          <div class="stat-item unread-stat" :class="{ 'has-unread': unreadCount > 0 }">
            <span class="stat-number">{{ unreadCount }}</span>
            <span class="stat-label">Unread</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalCount }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
      </div>
      
      <div class="header-actions">
        <button 
          v-if="unreadCount > 0" 
          @click="markAllAsRead"
          class="btn btn-mark-all"
          :disabled="loading"
        >
          <i class="fa-solid fa-check-double"></i>
          Mark All as Read
        </button>
        <button 
          @click="refreshNotifications"
          class="btn btn-refresh"
          :disabled="loading"
        >
          <i class="fa-solid fa-rotate" :class="{ 'fa-spin': loading }"></i>
          Refresh
        </button>
        
        <!-- Filter Dropdown -->
        <div class="filter-container">
          <button @click="toggleFilter" class="btn btn-filter">
            <i class="fa-solid fa-filter"></i>
            {{ activeFilter === 'all' ? 'All' : filterLabels[activeFilter] }}
            <i class="fa-solid fa-chevron-down filter-arrow"></i>
          </button>
          <div v-if="showFilter" class="filter-dropdown" @click.self="closeFilter">
            <div class="filter-section">
              <div class="filter-title">Status</div>
              <div 
                class="filter-option" 
                :class="{ active: activeFilter === 'all' }"
                @click="setFilter('all')"
              >
                <i class="fa-solid fa-list"></i>
                All Notifications
              </div>
              <div 
                class="filter-option" 
                :class="{ active: activeFilter === 'unread' }"
                @click="setFilter('unread')"
              >
                <i class="fa-solid fa-circle"></i>
                Unread Only
              </div>
            </div>
            
            <div class="filter-divider"></div>
            
            <div class="filter-section">
              <div class="filter-title">Type</div>
              <div 
                v-for="type in notificationTypes"
                :key="type.value"
                class="filter-option" 
                :class="{ active: activeFilter === type.value }"
                @click="setFilter(type.value)"
              >
                <i :class="type.icon"></i>
                {{ type.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="notifications-container">
      <!-- Loading State -->
      <div v-if="loading && notifications.length === 0" class="loading-state">
        <div class="loading-spinner">
          <i class="fa-solid fa-spinner fa-spin"></i>
        </div>
        <p>Loading your notifications...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredNotifications.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fa-solid fa-bell-slash"></i>
        </div>
        <h3>No notifications found</h3>
        <p v-if="activeFilter !== 'all'">
          No {{ filterLabels[activeFilter] || activeFilter }} notifications found.
        </p>
        <p v-else>
          You're all caught up! No notifications at the moment.
        </p>
        <button 
          @click="clearFilter" 
          class="btn btn-clear-filter"
          v-if="activeFilter !== 'all'"
        >
          Clear Filter
        </button>
      </div>

      <!-- Notifications List -->
      <div v-else class="notifications-list">
        <div 
          v-for="notification in filteredNotifications"
          :key="notification._id || notification.id"
          class="notification-item"
          :class="getNotificationClasses(notification)"
          @click="toggleNotificationDetail(notification)"
        >
          <div class="notification-icon-container">
            <div class="notification-icon" :class="getIconClass(notification.type)">
              <i :class="getIcon(notification.type)"></i>
            </div>
            <div v-if="!notification.read" class="unread-badge"></div>
          </div>
          
          <div class="notification-content">
            <div class="notification-header">
              <h4 class="notification-title">
                {{ notification.title || getDefaultTitle(notification.type) }}
              </h4>
              <span class="notification-time">
                {{ formatTime(notification.createdAt) }}
              </span>
            </div>
            
            <p class="notification-message">
              {{ truncateMessage(notification.message || notification.content) }}
            </p>
            
            <div class="notification-footer">
              <span class="notification-type">
                <i class="fa-solid fa-tag"></i>
                {{ formatNotificationType(notification.type) }}
              </span>
              <div class="notification-actions">
                <button 
                  v-if="!notification.read"
                  @click.stop="markAsRead(notification)"
                  class="action-btn mark-read"
                  title="Mark as read"
                >
                  <i class="fa-solid fa-check"></i>
                  Mark as Read
                </button>
                <button 
                  v-if="notification.read"
                  @click.stop="markAsUnread(notification)"
                  class="action-btn mark-unread"
                  title="Mark as unread"
                >
                  <i class="fa-solid fa-circle"></i>
                  Mark as Unread
                </button>
                <button 
                  @click.stop="deleteNotification(notification)"
                  class="action-btn delete"
                  title="Delete"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Slide-down Detail -->
            <div v-if="expandedNotificationId === (notification._id || notification.id)" 
                 class="notification-detail-slide">
              <div class="detail-content">
                <div class="detail-section">
                  <h5><i class="fa-solid fa-info-circle"></i> Details</h5>
                  <p class="detail-full-message">
                    {{ notification.message || notification.content }}
                  </p>
                </div>

                <!-- Booking Details Section - FIXED TO SHOW BOOKER NOT PROVIDER -->
                <div v-if="notification.data && Object.keys(notification.data).length > 0" 
                     class="detail-section">
                  <h5><i class="fa-solid fa-calendar-check"></i> Booking Details</h5>
                  
                  <!-- Try to fetch real booking details if available -->
                  <div v-if="bookingDetails[notification._id]" class="real-booking-details">
                    <!-- Booker/Customer Details -->
                    <div v-if="bookingDetails[notification._id].booker" class="detail-group">
                      <h6><i class="fa-solid fa-user"></i> Customer Details</h6>
                      <div class="detail-item">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">
                          {{ bookingDetails[notification._id].booker.fullname || 'N/A' }}
                        </span>
                      </div>
                      <div class="detail-item" v-if="bookingDetails[notification._id].booker.email">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">
                          {{ bookingDetails[notification._id].booker.email }}
                        </span>
                      </div>
                      <div class="detail-item" v-if="bookingDetails[notification._id].booker.phonenumber">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">
                          {{ bookingDetails[notification._id].booker.phonenumber }}
                        </span>
                      </div>
                    </div>

                    <!-- Service Details -->
                    <div v-if="bookingDetails[notification._id].service" class="detail-group">
                      <h6><i class="fa-solid fa-gear"></i> Service Details</h6>
                      <div class="detail-item">
                        <span class="detail-label">Service:</span>
                        <span class="detail-value">
                          {{ bookingDetails[notification._id].service.title || 'N/A' }}
                        </span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">
                          {{ bookingDetails[notification._id].service.categoryName || 'N/A' }}
                        </span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Price:</span>
                        <span class="detail-value detail-value-amount">
                          {{ formatAmount(bookingDetails[notification._id].service.bookingPrice || 
                                         bookingDetails[notification._id].service.totalPrice) }}
                        </span>
                      </div>
                    </div>

                    <!-- Booking Information -->
                    <div class="detail-group">
                      <h6><i class="fa-solid fa-receipt"></i> Booking Information</h6>
                      <div class="detail-item" v-if="bookingDetails[notification._id].bookingId">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value detail-value-id">
                          {{ bookingDetails[notification._id].bookingId }}
                        </span>
                      </div>
                      <div class="detail-item" v-if="bookingDetails[notification._id].bookingDate">
                        <span class="detail-label">Booking Date:</span>
                        <span class="detail-value">
                          {{ formatBookingDate(bookingDetails[notification._id].bookingDate) }}
                        </span>
                      </div>
                      <div class="detail-item" v-if="bookingDetails[notification._id].status">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value" :class="`status-${bookingDetails[notification._id].status}`">
                          {{ bookingDetails[notification._id].status }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Fallback: Show notification data if no booking details -->
                  <div v-else class="notification-data-fallback">
                    <div class="detail-grid">
                      <!-- Filter out provider fields -->
                      <template v-for="(value, key) in notification.data">
                        <div 
                          v-if="!['userId', 'userEmail', 'userName', 'providerId', 'providerName', 'providerEmail'].includes(key)"
                          :key="key" 
                          class="detail-item"
                        >
                          <span class="detail-label">{{ formatKey(key) }}:</span>
                          <span class="detail-value">{{ value }}</span>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="detail-actions">
                  <button 
                    v-if="!notification.read"
                    @click.stop="markAsRead(notification)"
                    class="btn btn-action-primary"
                  >
                    <i class="fa-solid fa-check-circle"></i>
                    Mark as Read
                  </button>
                  <button 
                    v-if="notification.read"
                    @click.stop="markAsUnread(notification)"
                    class="btn btn-action-secondary"
                  >
                    <i class="fa-solid fa-circle"></i>
                    Mark as Unread
                  </button>
                  <button 
                    v-if="hasAction(notification)"
                    @click.stop="goToAction(notification)"
                    class="btn btn-action-secondary"
                  >
                    <i class="fa-solid fa-external-link-alt"></i>
                    View Booking
                  </button>
                  <button 
                    @click.stop="deleteNotification(notification)"
                    class="btn btn-action-danger"
                  >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore && filteredNotifications.length > 0" class="load-more">
        <button 
          @click="loadMore" 
          class="btn btn-load-more"
          :disabled="loading"
        >
          <i class="fa-solid fa-arrow-down"></i>
          Load More Notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/index.js'

const router = useRouter()

// State
const notifications = ref([])
const bookingDetails = ref({})
const loading = ref(false)
const expandedNotificationId = ref(null)
const activeFilter = ref('all')
const showFilter = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)

// Filter types
const notificationTypes = ref([
  { value: 'booking', label: 'Bookings', icon: 'fa-solid fa-calendar-check' },
  { value: 'review', label: 'Reviews', icon: 'fa-solid fa-star' },
  { value: 'payment', label: 'Payments', icon: 'fa-solid fa-credit-card' },
  { value: 'message', label: 'Messages', icon: 'fa-solid fa-comment' },
  { value: 'system', label: 'System', icon: 'fa-solid fa-info-circle' },
  { value: 'reminder', label: 'Reminders', icon: 'fa-solid fa-clock' },
  { value: 'cancellation', label: 'Cancellations', icon: 'fa-solid fa-times-circle' }
])

const filterLabels = {
  all: 'All',
  unread: 'Unread',
  booking: 'Bookings',
  review: 'Reviews',
  payment: 'Payments',
  message: 'Messages',
  system: 'System',
  reminder: 'Reminders',
  cancellation: 'Cancellations'
}

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const totalCount = computed(() => {
  return notifications.value.length
})

const filteredNotifications = computed(() => {
  let filtered = [...notifications.value]
  
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (activeFilter.value !== 'all') {
    filtered = filtered.filter(n => n.type === activeFilter.value)
  }
  
  return filtered.sort((a, b) => {
    if (!a.read && b.read) return -1
    if (a.read && !b.read) return 1
    return new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
  })
})

// ============ CRITICAL FIX: SHARED STATE MANAGEMENT ============

// Store ALL notification IDs we've ever seen
const allSeenNotificationIds = ref(new Set())

// Store IDs that we've marked as read (LOCALLY - doesn't depend on backend)
const locallyReadNotificationIds = ref(new Set())

// Store IDs that should NEVER appear again (deleted or permanently dismissed)
const hiddenNotificationIds = ref(new Set())

// Save all tracking to localStorage
const saveNotificationTracking = () => {
  try {
    const trackingData = {
      allSeen: Array.from(allSeenNotificationIds.value),
      locallyRead: Array.from(locallyReadNotificationIds.value),
      hidden: Array.from(hiddenNotificationIds.value),
      lastSaved: new Date().toISOString()
    }
    localStorage.setItem('notification_tracking', JSON.stringify(trackingData))
    console.log('💾 Saved notification tracking data')
  } catch (error) {
    console.error('Error saving notification tracking:', error)
  }
}

// Load notification tracking from localStorage
const loadNotificationTracking = () => {
  try {
    const saved = localStorage.getItem('notification_tracking')
    if (saved) {
      const trackingData = JSON.parse(saved)
      allSeenNotificationIds.value = new Set(trackingData.allSeen || [])
      locallyReadNotificationIds.value = new Set(trackingData.locallyRead || [])
      hiddenNotificationIds.value = new Set(trackingData.hidden || [])
      console.log(`📂 Loaded tracking: ${allSeenNotificationIds.value.size} seen, ${locallyReadNotificationIds.value.size} locally read, ${hiddenNotificationIds.value.size} hidden`)
    }
  } catch (error) {
    console.error('Error loading notification tracking:', error)
  }
}

// ============ CRITICAL FIX: Save SHARED state for Dashboard ============
const saveSharedStateForDashboard = () => {
  try {
    const sharedState = {
      unreadCount: unreadCount.value,
      totalCount: totalCount.value,
      lastUpdated: new Date().toISOString(),
      source: 'notification-center',
      // Also save which notifications are read
      readNotificationIds: notifications.value
        .filter(n => n.read)
        .map(n => n._id || n.id),
      // Save current notifications for consistency
      currentNotifications: notifications.value.map(n => ({
        id: n._id || n.id,
        read: n.read,
        title: n.title,
        type: n.type,
        createdAt: n.createdAt
      }))
    }
    
    // CRITICAL: Save to SHARED storage key that Dashboard looks for
    localStorage.setItem('notification_shared_state', JSON.stringify(sharedState))
    
    // Also save to other keys for compatibility
    localStorage.setItem('current_notification_state', JSON.stringify(sharedState))
    localStorage.setItem('notification_summary', JSON.stringify({
      unread: unreadCount.value,
      total: totalCount.value,
      lastUpdated: new Date().toISOString()
    }))
    localStorage.setItem('unread_notification_count', unreadCount.value.toString())
    
    console.log(`💾 Saved shared state: ${unreadCount.value} unread`)
    
    // Dispatch storage event so Dashboard knows immediately
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'notification_shared_state',
      newValue: JSON.stringify(sharedState)
    }))
    
  } catch (error) {
    console.error('Error saving shared state:', error)
  }
}

// Load current notification state (for instant display on refresh)
const loadCurrentNotificationState = () => {
  try {
    // First try shared state
    const saved = localStorage.getItem('notification_shared_state')
    if (saved) {
      const state = JSON.parse(saved)
      return state
    }
    
    // Fallback to old state
    const oldSaved = localStorage.getItem('current_notification_state')
    if (oldSaved) {
      const state = JSON.parse(oldSaved)
      return state
    }
  } catch (error) {
    console.error('Error loading current state:', error)
  }
  return null
}

// ============ CRITICAL FIX: Update global notification counts ============
const updateNotificationCounts = () => {
  const unread = unreadCount.value
  const total = totalCount.value
  
  // CRITICAL: Save SHARED state for Dashboard
  saveSharedStateForDashboard()
  
  // Save tracking
  saveNotificationTracking()
  
  // Emit event for real-time sync
  window.dispatchEvent(new CustomEvent('notification-count-updated', {
    detail: { 
      unread: unread,
      total: total,
      timestamp: new Date().toISOString()
    }
  }))
  
  console.log(`📢 Notification count updated: ${unread} unread`)
}

// Setup event listeners
const setupEventListeners = () => {
  // Listen for manual refresh from dashboard
  window.addEventListener('refresh-notifications', () => {
    console.log('📡 Received refresh request')
    fetchNotifications(1)
  })
}

const cleanupEventListeners = () => {
  window.removeEventListener('refresh-notifications', null)
}

// ============ MAIN FETCH METHOD ============

const fetchNotifications = async (page = 1, showLoading = true) => {
  try {
    if (showLoading) loading.value = true
    
    const providerId = getProviderId()
    if (!providerId) {
      console.error('No provider ID found')
      return
    }
    
    console.log(`📡 Fetching notifications from API...`)
    
    let response
    try {
      // Fetch from API
      const timestamp = new Date().getTime()
      response = await http.get('/notifications', {
        params: {
          recipientId: providerId,
          recipientType: 'provider',
          page: page,
          limit: 50,
          sort: '-createdAt',
          _t: timestamp
        },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
    } catch (fetchError) {
      console.error('❌ API fetch failed:', fetchError.message)
      // If API fails, show cached data
      showCachedNotifications()
      return
    }
    
    if (response && response.data) {
      let rawNotifications = []
      
      // Extract notifications from response
      if (Array.isArray(response.data)) {
        rawNotifications = response.data
      } else if (response.data.notifications) {
        rawNotifications = response.data.notifications
      } else if (response.data.data) {
        rawNotifications = response.data.data
      } else if (response.data.results) {
        rawNotifications = response.data.results
      }
      
      console.log(`📊 API returned ${rawNotifications.length} raw notifications`)
      
      // Normalize them
      const normalized = normalizeNotifications(rawNotifications)
      
      // ============ CRITICAL FILTERING LOGIC ============
      const filteredNotifications = []
      
      for (const notification of normalized) {
        const notificationId = notification._id || notification.id
        
        // Track that we've seen this notification
        allSeenNotificationIds.value.add(notificationId)
        
        // RULE 1: If it's hidden, skip it completely
        if (hiddenNotificationIds.value.has(notificationId)) {
          console.log(`🚫 Skipping hidden notification: ${notificationId}`)
          continue
        }
        
        // RULE 2: If we've marked it as read locally, force it to be read
        if (locallyReadNotificationIds.value.has(notificationId)) {
          console.log(`✅ Forcing local read: ${notificationId}`)
          notification.read = true
        }
        
        // RULE 3: If notification from API says it's read, track it
        if (notification.read) {
          locallyReadNotificationIds.value.add(notificationId)
        }
        
        filteredNotifications.push(notification)
      }
      
      console.log(`📋 After filtering: ${filteredNotifications.length} notifications to display`)
      
      // Update notifications array
      if (page === 1) {
        notifications.value = filteredNotifications
      } else {
        // Merge avoiding duplicates
        const existingIds = new Set(notifications.value.map(n => n._id || n.id))
        const newNotifications = filteredNotifications.filter(n => !existingIds.has(n._id || n.id))
        notifications.value = [...notifications.value, ...newNotifications]
      }
      
      hasMore.value = rawNotifications.length === 50
      currentPage.value = page
      
      // Save everything
      saveNotificationTracking()
      updateNotificationCounts() // CRITICAL: This saves shared state
      
      // Fetch booking details if needed
      await fetchBookingDetailsForNotifications(filteredNotifications)
      
    }
  } catch (error) {
    console.error('❌ Error in fetchNotifications:', error)
    showCachedNotifications()
  } finally {
    if (showLoading) loading.value = false
  }
}

// Show cached notifications when API fails
const showCachedNotifications = () => {
  try {
    const savedState = localStorage.getItem('notification_shared_state') || 
                       localStorage.getItem('current_notification_state')
    if (savedState) {
      const state = JSON.parse(savedState)
      
      // Convert back to notification objects
      const cachedNotifications = state.currentNotifications ? 
        state.currentNotifications.map(n => ({
          _id: n.id,
          id: n.id,
          title: n.title,
          type: n.type,
          read: n.read,
          createdAt: n.createdAt,
          message: '',
          data: {}
        })) : []
      
      notifications.value = cachedNotifications
      updateNotificationCounts()
      console.log(`📂 Showing ${cachedNotifications.length} cached notifications`)
    }
  } catch (error) {
    console.error('Error showing cached notifications:', error)
  }
}

// Fetch booking details
const fetchBookingDetailsForNotifications = async (notificationsList) => {
  try {
    for (const notification of notificationsList) {
      if (notification.type === 'booking' && notification.data && notification.data.bookingId) {
        try {
          const bookingResponse = await http.get(`/bookings/${notification.data.bookingId}`)
          
          if (bookingResponse.data) {
            bookingDetails.value[notification._id || notification.id] = {
              ...bookingResponse.data,
              booker: bookingResponse.data.customer || bookingResponse.data.booker || notification.data,
              service: bookingResponse.data.service || {},
              bookingId: notification.data.bookingId,
              bookingDate: notification.data.bookingDate || bookingResponse.data.createdAt,
              status: bookingResponse.data.status || 'pending'
            }
          }
        } catch (bookingError) {
          // Silent fail - booking details are optional
        }
      }
    }
  } catch (error) {
    console.error('Error fetching booking details:', error)
  }
}

const fetchBookingDetails = async (notification) => {
  if (notification.type !== 'booking' || !notification.data || !notification.data.bookingId) {
    return
  }

  const notificationId = notification._id || notification.id
  
  if (bookingDetails.value[notificationId]) {
    return
  }

  try {
    const response = await http.get(`/bookings/${notification.data.bookingId}`)
    
    if (response.data) {
      bookingDetails.value[notificationId] = {
        ...response.data,
        booker: response.data.customer || response.data.booker || notification.data,
        service: response.data.service || {},
        bookingId: notification.data.bookingId,
        bookingDate: notification.data.bookingDate || response.data.createdAt,
        status: response.data.status || 'pending'
      }
    }
  } catch (error) {
    console.error(`Error fetching booking details:`, error)
  }
}

const getProviderId = () => {
  try {
    const loggedProvider = localStorage.getItem('loggedProvider')
    if (!loggedProvider) return null
    
    const provider = JSON.parse(loggedProvider)
    return provider.pid || provider._id || provider.id
  } catch (err) {
    console.error('Error getting provider ID:', err)
    return null
  }
}

// ============ CRITICAL FIX: markAsRead - with shared state ============
const markAsRead = async (notification) => {
  try {
    const notificationId = notification._id || notification.id
    if (!notificationId) return
    
    console.log(`✅ MARKING AS READ: ${notificationId}`)
    
    const index = notifications.value.findIndex(n => 
      (n._id === notificationId || n.id === notificationId)
    )
    
    if (index === -1) return
    
    // CRITICAL: Mark as read LOCALLY
    locallyReadNotificationIds.value.add(notificationId)
    
    // Update the notification object
    notifications.value[index].read = true
    
    // CRITICAL: Save shared state BEFORE anything else
    updateNotificationCounts()
    
    // Emit individual read event for Dashboard
    window.dispatchEvent(new CustomEvent('notification-marked-read', {
      detail: { notificationId }
    }))
    
    // Try to update server (but don't wait for it)
    try {
      await http.put(`/notifications/${notificationId}/read`, {})
      console.log(`🌐 Server updated for ${notificationId}`)
    } catch (apiError) {
      console.log(`⚠️ Server update failed for ${notificationId}, but local state is updated`)
    }
    
  } catch (error) {
    console.error('Error in markAsRead:', error)
  }
}

// ============ CRITICAL FIX: markAllAsRead - with shared state ============
const markAllAsRead = async () => {
  const currentUnread = unreadCount.value
  if (currentUnread === 0) return
  
  try {
    const providerId = getProviderId()
    if (!providerId) return
    
    console.log(`✅ MARKING ALL ${currentUnread} AS READ`)
    
    // Get all unread notification IDs
    const unreadNotifications = notifications.value.filter(n => !n.read)
    const unreadIds = unreadNotifications.map(n => n._id || n.id)
    
    // Mark ALL as read LOCALLY
    unreadIds.forEach(id => locallyReadNotificationIds.value.add(id))
    
    // Update ALL notifications locally
    notifications.value.forEach(n => {
      if (!n.read) n.read = true
    })
    
    // CRITICAL: Save shared state BEFORE anything else
    updateNotificationCounts()
    
    // CRITICAL: Emit event for Dashboard
    window.dispatchEvent(new CustomEvent('all-notifications-marked-read'))
    
    // Try to update server in background
    try {
      await http.put('/notifications/all/read', {
        recipientId: providerId,
        recipientType: 'provider'
      })
      console.log(`🌐 Server updated for all notifications`)
    } catch (apiError) {
      console.log(`⚠️ Server update failed, but all marked as read locally`)
    }
    
  } catch (error) {
    console.error('Error in markAllAsRead:', error)
  }
}

// Mark as Unread
const markAsUnread = async (notification) => {
  try {
    const notificationId = notification._id || notification.id
    if (!notificationId) return
    
    console.log(`↩️ Marking as unread: ${notificationId}`)
    
    // Remove from locally read set
    locallyReadNotificationIds.value.delete(notificationId)
    
    // Update the notification
    const index = notifications.value.findIndex(n => 
      (n._id === notificationId || n.id === notificationId)
    )
    
    if (index !== -1) {
      notifications.value[index].read = false
    }
    
    updateNotificationCounts()
    
    // Try server update
    try {
      await http.put(`/notifications/${notificationId}/unread`, {})
    } catch (apiError) {
      console.error('Server unread update failed:', apiError.message)
    }
    
  } catch (error) {
    console.error('Error marking as unread:', error)
  }
}

// Delete notification
const deleteNotification = async (notification) => {
  if (!confirm('Permanently delete this notification?')) {
    return
  }
  
  try {
    const notificationId = notification._id || notification.id
    
    // Close if expanded
    if (expandedNotificationId.value === notificationId) {
      expandedNotificationId.value = null
    }
    
    // HIDE IT PERMANENTLY
    hiddenNotificationIds.value.add(notificationId)
    
    // Remove from other tracking
    locallyReadNotificationIds.value.delete(notificationId)
    
    // Remove from display
    notifications.value = notifications.value.filter(n => 
      n._id !== notificationId && n.id !== notificationId
    )
    
    // Save everything
    saveNotificationTracking()
    updateNotificationCounts()
    
    // Remove booking details
    if (bookingDetails.value[notificationId]) {
      delete bookingDetails.value[notificationId]
    }
    
    // Try server delete (optional)
    try {
      await http.delete(`/notifications/${notificationId}`)
    } catch (apiError) {
      console.error('Server delete failed:', apiError.message)
    }
    
    console.log(`🗑️ Notification ${notificationId} permanently hidden`)
    
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}

// Helper functions
const normalizeNotifications = (notificationsData) => {
  return notificationsData.map(notification => ({
    id: notification._id || notification.id,
    _id: notification._id || notification.id,
    title: notification.title || getDefaultTitle(notification.type),
    message: notification.message || notification.content || '',
    type: notification.type || 'system',
    read: notification.read || false,
    createdAt: notification.createdAt || notification.timestamp || new Date().toISOString(),
    data: notification.data || notification.metadata || {},
    priority: notification.priority || 'normal',
    action: notification.action || notification.link
  }))
}

// UI methods
const refreshNotifications = () => {
  console.log('🔄 Manual refresh')
  fetchNotifications(1)
}

const loadMore = () => {
  fetchNotifications(currentPage.value + 1, false)
}

const toggleNotificationDetail = async (notification) => {
  const notificationId = notification._id || notification.id
  
  if (expandedNotificationId.value === notificationId) {
    expandedNotificationId.value = null
  } else {
    expandedNotificationId.value = notificationId
    
    // Auto mark as read when opened
    if (!notification.read) {
      markAsRead(notification)
    }
    
    // Fetch booking details
    if (notification.type === 'booking') {
      await fetchBookingDetails(notification)
    }
  }
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const closeFilter = () => {
  showFilter.value = false
}

const setFilter = (filter) => {
  activeFilter.value = filter
  showFilter.value = false
  fetchNotifications(1)
}

const clearFilter = () => {
  activeFilter.value = 'all'
  fetchNotifications(1)
}

// Debug functions
const debugState = () => {
  console.log('=== DEBUG STATE ===')
  console.log('Displaying:', notifications.value.length, 'notifications')
  console.log('Unread count:', unreadCount.value)
  console.log('Locally read IDs:', Array.from(locallyReadNotificationIds.value))
  console.log('Hidden IDs:', Array.from(hiddenNotificationIds.value))
  
  // Check shared state
  const sharedState = localStorage.getItem('notification_shared_state')
  if (sharedState) {
    console.log('Shared state:', JSON.parse(sharedState))
  }
}

const resetAllTracking = () => {
  if (confirm('Reset ALL notification tracking? This will make all notifications appear as new.')) {
    localStorage.removeItem('notification_tracking')
    localStorage.removeItem('notification_shared_state')
    localStorage.removeItem('current_notification_state')
    localStorage.removeItem('notification_summary')
    localStorage.removeItem('unread_notification_count')
    
    allSeenNotificationIds.value = new Set()
    locallyReadNotificationIds.value = new Set()
    hiddenNotificationIds.value = new Set()
    
    console.log('🧹 ALL tracking reset')
    
    // Refresh
    fetchNotifications(1)
  }
}

// Formatting helpers
const getNotificationClasses = (notification) => {
  const classes = {
    'unread': !notification.read,
    'expanded': expandedNotificationId.value === (notification._id || notification.id)
  }
  const type = notification.type || 'info'
  classes[`type-${type}`] = true
  return classes
}

const truncateMessage = (message) => {
  if (!message) return ''
  return message.length > 100 ? message.substring(0, 100) + '...' : message
}

const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ')
}

const formatAmount = (amount) => {
  if (!amount) return '$0'
  if (typeof amount === 'number') return `$${amount.toFixed(2)}`
  if (typeof amount === 'string') {
    if (amount.includes('$')) return amount
    const num = parseFloat(amount)
    if (!isNaN(num)) return `$${num.toFixed(2)}`
  }
  return `$${amount}`
}

const formatBookingDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const getIcon = (type) => {
  const icons = {
    booking: 'fa-solid fa-calendar-check',
    review: 'fa-solid fa-star',
    payment: 'fa-solid fa-credit-card',
    message: 'fa-solid fa-comment',
    system: 'fa-solid fa-info-circle',
    reminder: 'fa-solid fa-clock',
    cancellation: 'fa-solid fa-times-circle'
  }
  return icons[type] || 'fa-solid fa-bell'
}

const getIconClass = (type) => {
  const classes = {
    booking: 'icon-booking',
    review: 'icon-review',
    payment: 'icon-payment',
    message: 'icon-message',
    system: 'icon-system',
    reminder: 'icon-reminder',
    cancellation: 'icon-cancellation'
  }
  return classes[type] || 'icon-default'
}

const getDefaultTitle = (type) => {
  const titles = {
    booking: 'New Booking',
    review: 'New Review',
    payment: 'Payment Update',
    message: 'New Message',
    system: 'System Notification',
    reminder: 'Reminder',
    cancellation: 'Booking Cancelled'
  }
  return titles[type] || 'Notification'
}

const formatNotificationType = (type) => {
  if (!type) return 'General'
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return 'Invalid date'
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const hasAction = (notification) => {
  return notification.type === 'booking' && notification.data && notification.data.bookingId
}

const goToAction = (notification) => {
  if (notification.type === 'booking' && notification.data && notification.data.bookingId) {
    router.push({ 
      name: 'ProviderBookings',
      query: { bookingId: notification.data.bookingId }
    })
  }
}

// Lifecycle
onMounted(() => {
  console.log('🚀 Notifications page mounted - SHARED STATE FIX')
  
  // Load tracking data
  loadNotificationTracking()
  
  // Load current state for instant display
  const cachedState = loadCurrentNotificationState()
  if (cachedState) {
    // Convert cached state to notifications for instant display
    const cachedNotifications = cachedState.currentNotifications ? 
      cachedState.currentNotifications.map(n => ({
        _id: n.id,
        id: n.id,
        title: n.title,
        type: n.type,
        read: n.read,
        createdAt: n.createdAt,
        message: '',
        data: {}
      })) : []
    
    notifications.value = cachedNotifications
    console.log(`📊 Instantly showing ${cachedNotifications.length} cached notifications`)
  }
  
  // Setup event listeners
  setupEventListeners()
  
  // Fetch fresh data from API
  fetchNotifications(1)
  
  // Make debug functions available
  window.debugNotifications = debugState
  window.resetNotificationTracking = resetAllTracking
})

onUnmounted(() => {
  console.log('🔔 Notifications page unmounted - Saving final state')
  
  // CRITICAL: Save final shared state before leaving
  saveSharedStateForDashboard()
  
  cleanupEventListeners()
})
</script>

<style scoped>
/* All your existing CSS styles from the previous version */
/* Only add these new styles: */

.real-booking-details {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
}

.notification-data-fallback {
  background: #fff8e1;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid #ffecb3;
}

/* Status colors */
.status-pending { color: #f59e0b; font-weight: 600; }
.status-confirmed { color: #10b981; font-weight: 600; }
.status-cancelled { color: #ef4444; font-weight: 600; }
.status-completed { color: #3b82f6; font-weight: 600; }


/* MAIN PAGE STYLES */
.notifications-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 0;
}

/* HEADER */
.page-header {
  background: white;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title i {
  color: #3b82f6;
  font-size: 1.8rem;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  border-radius: 12px;
  min-width: 100px;
}

.stat-item.unread-stat.has-unread {
  background: #fef2f2;
  border: 2px solid #ef4444;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
}

.stat-item.unread-stat.has-unread .stat-number {
  color: #ef4444;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.95rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-mark-all {
  background: #3b82f6;
  color: white;
}

.btn-mark-all:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-refresh {
  background: #f1f5f9;
  color: #475569;
}

.btn-refresh:hover:not(:disabled) {
  background: #e2e8f0;
}

/* FILTER */
.filter-container {
  position: relative;
}

.btn-filter {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.25rem;
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  min-width: 200px;
  z-index: 100;
  margin-top: 0.5rem;
  overflow: hidden;
}

.filter-section {
  padding: 1rem;
}

.filter-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  color: #475569;
}

.filter-option:hover {
  background: #f8fafc;
}

.filter-option.active {
  background: #f0f9ff;
  color: #3b82f6;
  font-weight: 600;
}

.filter-option i {
  width: 20px;
  text-align: center;
}

.filter-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

/* NOTIFICATIONS LIST */
.notifications-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.loading-spinner {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #3b82f6;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  animation: fadeIn 0.5s ease;
}

.empty-icon {
  font-size: 4rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.btn-clear-filter {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* NOTIFICATION ITEMS */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border-color: #3b82f6;
}

.notification-item.unread {
  border-left: 4px solid #3b82f6;
  background: #f0f9ff;
}

/* Type-specific styles */
.notification-item.type-booking {
  border-top: 3px solid #1d4ed8;
}

.notification-item.type-review {
  border-top: 3px solid #d97706;
}

.notification-item.type-payment {
  border-top: 3px solid #16a34a;
}

.notification-item.type-message {
  border-top: 3px solid #0ea5e9;
}

.notification-item.type-system {
  border-top: 3px solid #7c3aed;
}

.notification-item.type-reminder {
  border-top: 3px solid #0284c7;
}

.notification-item.type-cancellation {
  border-top: 3px solid #dc2626;
}

.notification-icon-container {
  position: relative;
  flex-shrink: 0;
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.icon-booking { background: #dbeafe; color: #1d4ed8; }
.icon-review { background: #fef3c7; color: #d97706; }
.icon-payment { background: #dcfce7; color: #16a34a; }
.icon-message { background: #f0f9ff; color: #0ea5e9; }
.icon-system { background: #f3e8ff; color: #7c3aed; }
.icon-reminder { background: #e0f2fe; color: #0284c7; }
.icon-cancellation { background: #fee2e2; color: #dc2626; }
.icon-default { background: #f1f5f9; color: #64748b; }

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from { transform: scale(1); }
  to { transform: scale(1.2); }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.notification-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.notification-time {
  font-size: 0.85rem;
  color: #94a3b8;
  white-space: nowrap;
  margin-left: 1rem;
}

.notification-message {
  color: #475569;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-type {
  font-size: 0.85rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.notification-item:hover .notification-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.action-btn.mark-read {
  color: #3b82f6;
}

.action-btn.mark-read:hover {
  background: #dbeafe;
}

.action-btn.mark-unread {
  color: #64748b;
}

.action-btn.mark-unread:hover {
  background: #f1f5f9;
  color: #475569;
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fee2e2;
}

/* DETAIL SECTION */
.notification-detail-slide {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  animation: slideDown 0.3s ease;
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

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h5 {
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-section h6 {
  font-size: 0.9rem;
  color: #475569;
  margin: 1rem 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-full-message {
  color: #475569;
  line-height: 1.6;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* Booking Details Container */
.booking-details-container {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
}

.detail-group {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.detail-grid {
  display: grid;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.detail-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  min-width: 100px;
}

.detail-value {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 600;
  text-align: right;
  word-break: break-word;
  flex: 1;
}

.detail-value-id {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.detail-value-amount {
  color: #10b981;
  font-weight: 700;
}

/* Status colors */
.status-pending { color: #f59e0b; font-weight: 600; }
.status-confirmed { color: #10b981; font-weight: 600; }
.status-cancelled { color: #ef4444; font-weight: 600; }
.status-completed { color: #3b82f6; font-weight: 600; }
.status-pending { background: #fef3c7; padding: 0.25rem 0.5rem; border-radius: 4px; }
.status-confirmed { background: #d1fae5; padding: 0.25rem 0.5rem; border-radius: 4px; }
.status-cancelled { background: #fee2e2; padding: 0.25rem 0.5rem; border-radius: 4px; }
.status-completed { background: #dbeafe; padding: 0.25rem 0.5rem; border-radius: 4px; }

.detail-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-action-primary {
  background: #3b82f6;
  color: white;
  flex: 1;
}

.btn-action-primary:hover {
  background: #2563eb;
}

.btn-action-danger {
  background: #fef2f2;
  color: #dc2626;
  flex: 1;
}

.btn-action-danger:hover {
  background: #fee2e2;
}

.btn-action-secondary {
  background: #f1f5f9;
  color: #475569;
  flex: 1;
}

.btn-action-secondary:hover {
  background: #e2e8f0;
}

/* LOAD MORE */
.load-more {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn-load-more {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 1rem 2rem;
}

.btn-load-more:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    padding: 1.5rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .notifications-container {
    padding: 1.5rem;
  }
  
  .notification-item {
    padding: 1.25rem;
  }
  
  .notification-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .notification-time {
    margin-left: 0;
  }
  
  .notification-actions {
    opacity: 1;
  }
  
  .detail-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .stat-item {
    min-width: auto;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.75rem 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn {
    justify-content: center;
  }
  
  .notifications-container {
    padding: 1rem;
  }
  
  .notification-item {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .notification-icon-container {
    align-self: flex-start;
  }
  
  .detail-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .detail-label {
    min-width: auto;
  }
  
  .detail-value {
    text-align: left;
  }
}

/* Notification count animation */
.stat-number {
  transition: all 0.3s ease;
}

.stat-number.updated {
  animation: countPop 0.3s ease;
}

@keyframes countPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>