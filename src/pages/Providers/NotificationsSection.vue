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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/index.js'

const router = useRouter()

// State
const notifications = ref([])
const bookingDetails = ref({}) // Store fetched booking details
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

// Main methods
const fetchNotifications = async (page = 1, showLoading = true) => {
  try {
    if (showLoading) loading.value = true
    
    const providerId = getProviderId()
    if (!providerId) {
      console.error('No provider ID found')
      return
    }
    
    console.log(`📡 Fetching notifications for provider: ${providerId}`)
    
    let response
    try {
      // Fetch notifications from API
      response = await http.get('/notifications', {
        params: {
          recipientId: providerId,
          recipientType: 'provider',
          page: page,
          limit: 20,
          sort: '-createdAt',
          read: activeFilter.value === 'unread' ? false : undefined
        }
      })
      
    } catch (fetchError) {
      console.error('❌ Fetch error:', fetchError)
      loadFromLocalStorage()
      if (notifications.value.length === 0) {
        showSampleData()
      }
      throw fetchError
    }
    
    if (response && response.data) {
      let notificationsData = []
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        notificationsData = response.data
      } else if (response.data.notifications) {
        notificationsData = response.data.notifications
      } else if (response.data.data) {
        notificationsData = response.data.data
      } else if (response.data.results) {
        notificationsData = response.data.results
      }
      
      console.log(`📊 Found ${notificationsData.length} notifications`)
      
      // Normalize notifications
      const normalized = normalizeNotifications(notificationsData)
      
      if (page === 1) {
        notifications.value = normalized
      } else {
        notifications.value = [...notifications.value, ...normalized]
      }
      
      hasMore.value = notificationsData.length === 20
      currentPage.value = page
      
      // Save to localStorage
      saveToLocalStorage()
      updateNotificationCounts()
      
      // Fetch booking details for booking notifications
      await fetchBookingDetailsForNotifications(normalized)
    }
  } catch (error) {
    console.error('❌ Error fetching notifications:', error)
    if (page === 1) {
      loadFromLocalStorage()
    }
  } finally {
    if (showLoading) loading.value = false
  }
}

// NEW: Fetch booking details for booking notifications
const fetchBookingDetailsForNotifications = async (notificationsList) => {
  try {
    for (const notification of notificationsList) {
      if (notification.type === 'booking' && notification.data && notification.data.bookingId) {
        try {
          console.log(`🔍 Fetching booking details for: ${notification.data.bookingId}`)
          
          // Try to fetch booking details
          const bookingResponse = await http.get(`/bookings/${notification.data.bookingId}`)
          
          if (bookingResponse.data) {
            bookingDetails.value[notification._id || notification.id] = {
              ...bookingResponse.data,
              // Ensure we have the right data structure
              booker: bookingResponse.data.customer || bookingResponse.data.booker || notification.data,
              service: bookingResponse.data.service || {},
              bookingId: notification.data.bookingId,
              bookingDate: notification.data.bookingDate || bookingResponse.data.createdAt,
              status: bookingResponse.data.status || 'pending'
            }
          }
        } catch (bookingError) {
          console.log(`⚠️ Could not fetch booking details for ${notification.data.bookingId}:`, bookingError.message)
        }
      }
    }
  } catch (error) {
    console.error('❌ Error fetching booking details:', error)
  }
}

// Fetch booking details when notification is expanded
const fetchBookingDetails = async (notification) => {
  if (notification.type !== 'booking' || !notification.data || !notification.data.bookingId) {
    return
  }

  const notificationId = notification._id || notification.id
  
  // Skip if already fetched
  if (bookingDetails.value[notificationId]) {
    return
  }

  try {
    console.log(`🔍 Fetching booking details for: ${notification.data.bookingId}`)
    
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
    console.error(`❌ Error fetching booking details:`, error)
  }
}

const getProviderId = () => {
  try {
    const loggedProvider = localStorage.getItem('loggedProvider')
    if (!loggedProvider) return null
    
    const provider = JSON.parse(loggedProvider)
    
    // Try different ID fields
    return provider.pid || provider._id || provider.id
  } catch (err) {
    console.error('Error getting provider ID:', err)
    return null
  }
}

// FIXED: Mark as Read - Using PUT method
const markAsRead = async (notification) => {
  try {
    const notificationId = notification._id || notification.id
    if (!notificationId) return
    
    console.log(`📝 Marking notification ${notificationId} as read`)
    
    // Update locally first for instant feedback
    const index = notifications.value.findIndex(n => 
      (n._id === notificationId || n.id === notificationId)
    )
    
    if (index === -1) return
    
    const wasRead = notifications.value[index].read
    
    // Update locally IMMEDIATELY
    notifications.value[index].read = true
    updateNotificationCounts()
    
    // Try API call - USE PUT not PATCH
    try {
      console.log(`🔄 PUT /notifications/${notificationId}/read`)
      await http.put(`/notifications/${notificationId}/read`, {})
      console.log('✅ Notification marked as read')
      
      saveToLocalStorage()
      
    } catch (apiError) {
      console.error('❌ PUT /read failed:', apiError.message)
      
      // Try alternative: Update the entire notification
      try {
        console.log('🔄 Trying alternative: PUT /notifications/{id}')
        await http.put(`/notifications/${notificationId}`, { 
          read: true
        })
        console.log('✅ Alternative method successful')
        saveToLocalStorage()
      } catch (altError) {
        console.error('❌ Alternative method failed:', altError.message)
        // Revert local change if all API calls fail
        notifications.value[index].read = wasRead
        updateNotificationCounts()
      }
    }
    
  } catch (error) {
    console.error('❌ Error in markAsRead:', error)
  }
}

// FIXED: Mark All as Read
const markAllAsRead = async () => {
  if (unreadCount.value === 0) return
  
  try {
    const providerId = getProviderId()
    if (!providerId) return
    
    console.log(`📝 Marking all notifications as read`)
    
    // Update locally first
    const oldStates = notifications.value.map(n => n.read)
    notifications.value.forEach(n => n.read = true)
    updateNotificationCounts()
    
    // Try API call - USE PUT not PATCH
    try {
      console.log('🔄 PUT /notifications/all/read')
      await http.put('/notifications/all/read', {
        recipientId: providerId,
        recipientType: 'provider'
      })
      console.log('✅ All notifications marked as read')
      saveToLocalStorage()
      
    } catch (apiError) {
      console.error('❌ PUT /all/read failed:', apiError.message)
      
      // Try alternative: Mark each individually
      try {
        console.log('🔄 Marking each individually')
        
        const unreadNotifications = notifications.value.filter(n => !oldStates[notifications.value.indexOf(n)])
        
        for (const notification of unreadNotifications) {
          try {
            await http.put(`/notifications/${notification._id || notification.id}/read`, {})
          } catch (err) {
            console.log(`Failed to mark ${notification._id}:`, err.message)
          }
        }
        
        saveToLocalStorage()
        
      } catch (batchError) {
        console.error('❌ Batch marking failed:', batchError.message)
        
        // Revert all changes
        notifications.value.forEach((n, index) => {
          n.read = oldStates[index]
        })
        updateNotificationCounts()
      }
    }
    
  } catch (error) {
    console.error('❌ Error in markAllAsRead:', error)
  }
}

// Mark as Unread
const markAsUnread = async (notification) => {
  try {
    const notificationId = notification._id || notification.id
    if (!notificationId) return
    
    console.log(`📝 Marking notification ${notificationId} as unread`)
    
    // Update locally first
    const index = notifications.value.findIndex(n => 
      (n._id === notificationId || n.id === notificationId)
    )
    
    if (index === -1) return
    
    const wasRead = notifications.value[index].read
    notifications.value[index].read = false
    updateNotificationCounts()
    
    // Try API call - USE PUT not PATCH
    try {
      await http.put(`/notifications/${notificationId}/unread`, {})
      saveToLocalStorage()
    } catch (apiError) {
      console.error('PUT /unread failed:', apiError.message)
      
      // Try alternative
      try {
        await http.put(`/notifications/${notificationId}`, { read: false })
        saveToLocalStorage()
      } catch (altError) {
        console.error('Alternative failed:', altError.message)
        // Revert local change
        notifications.value[index].read = wasRead
        updateNotificationCounts()
      }
    }
    
  } catch (error) {
    console.error('Error marking as unread:', error)
  }
}

// Delete notification
const deleteNotification = async (notification) => {
  if (!confirm('Are you sure you want to delete this notification?')) {
    return
  }
  
  try {
    const notificationId = notification._id || notification.id
    
    // Close if expanded
    if (expandedNotificationId.value === notificationId) {
      expandedNotificationId.value = null
    }
    
    // Remove from array first
    notifications.value = notifications.value.filter(n => 
      n._id !== notificationId && n.id !== notificationId
    )
    
    // Try API call
    try {
      if (notificationId) {
        await http.delete(`/notifications/${notificationId}`)
      }
    } catch (apiError) {
      console.error('API delete failed:', apiError.message)
    }
    
    updateNotificationCounts()
    saveToLocalStorage()
    
    // Remove booking details if exists
    if (bookingDetails.value[notificationId]) {
      delete bookingDetails.value[notificationId]
    }
    
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

const updateNotificationCounts = () => {
  const unread = notifications.value.filter(n => !n.read).length
  const total = notifications.value.length
  
  // Update localStorage for Dashboard
  localStorage.setItem('notification_count', JSON.stringify({
    unread: unread,
    total: total,
    lastUpdated: new Date().toISOString()
  }))
  
  localStorage.setItem('unread_notification_count', unread.toString())
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent('notification-count-changed', {
    detail: { unread, total }
  }))
  
  console.log(`📢 Emitted notification count: ${unread} unread`)
}

const loadFromLocalStorage = () => {
  try {
    const savedNotifications = localStorage.getItem('provider_notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      if (parsed.length > 0) {
        notifications.value = normalizeNotifications(parsed)
        console.log(`📂 Loaded ${parsed.length} notifications from cache`)
        return true
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
  return false
}

const saveToLocalStorage = () => {
  try {
    localStorage.setItem('provider_notifications', JSON.stringify(notifications.value.slice(0, 100)))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const showSampleData = () => {
  const sampleNotifications = [
    {
      _id: 'sample1',
      title: 'New Booking Request',
      message: 'niga bro wants to book your service',
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString(),
      data: {
        bookingId: 'sample_booking_123',
        bookingDate: new Date().toISOString()
      }
    }
  ]
  
  notifications.value = normalizeNotifications(sampleNotifications)
  updateNotificationCounts()
  saveToLocalStorage()
}

// UI methods
const refreshNotifications = () => {
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
    
    // Fetch booking details if it's a booking notification
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
  if (typeof amount === 'number') {
    return `$${amount.toFixed(2)}`
  }
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
  console.log('🔔 Notifications page mounted')
  
  // Load from localStorage first (fast)
  loadFromLocalStorage()
  
  // Then fetch from API
  fetchNotifications(1)
})

// Watch for notification expansion
watch(expandedNotificationId, async (newId, oldId) => {
  if (newId) {
    const notification = notifications.value.find(n => 
      (n._id === newId || n.id === newId)
    )
    
    if (notification && notification.type === 'booking') {
      await fetchBookingDetails(notification)
    }
  }
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