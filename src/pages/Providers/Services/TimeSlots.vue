<!-- src/pages/Providers/TimeSlots.vue -->
<template>
  <div class="time-slots-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading time slots...</p>
    </div>
    <!-- Loading Bookings State -->
    <div v-if="loadingBookings" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Checking booked appointments...</p>
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
    <!-- Service Status Alert -->
    <div v-if="serviceStatus === 'draft'" class="draft-alert">
      <i class="fa-solid fa-clock"></i>
      <div class="alert-content">
        <strong>Draft Service</strong>
        <p>Add time slots to activate and publish this service</p>
      </div>
    </div>

    <!-- Time Slots Management -->
    <div class="time-slots-content" v-if="!loading">
      <!-- 7-Day Schedule -->
      <div class="weekly-schedule-section">
        <div class="schedule-header">
          <h4>Weekly Schedule Template</h4>
          <div class="date-range">
            {{ currentDateRange }}
          </div>
        </div>
        <p class="section-description">
          Configure time slots for each day. Changes are saved when you click "Update Time Slots".
          This schedule repeats every week.
        </p>
        <div class="days-grid">
          <div
            v-for="day in generatedDays"
            :key="day.date"
            class="day-card"
            :class="{ 
              'working-day': isWorkingAtDay(day.date), 
              'day-off': !isWorkingAtDay(day.date),
              'today': day.isToday 
            }"
          >
            <div class="day-header">
              <label class="day-toggle">
                <input
                  type="checkbox"
                  :checked="isWorkingAtDay(day.date)"
                  @change="toggleWorkingDay(day.date, $event.target.checked)"
                />
                <span class="day-label">{{ day.dayName }}</span>
              </label>
              <div class="day-labels">
                <span v-if="!isWorkingAtDay(day.date)" class="off-label">Day Off</span>
                <span v-if="day.isToday" class="today-label">Today</span>
              </div>
            </div>
            <!-- ONLY SHOW EDITABLE SLOTS IF WORKING DAY -->
            <div v-if="isWorkingAtDay(day.date)" class="time-slots-list">
              <div
                v-for="(timeSlot, slotIndex) in dailySchedules[day.date]"
                :key="slotIndex"
                class="time-slot-item"
                :class="{ 
                  'has-error': timeSlot.hasError,
                  'booked-slot': timeSlot.isBooked,
                  'available-slot': !timeSlot.isBooked && timeSlot.isAvailable,
                  'unavailable-slot': !timeSlot.isBooked && !timeSlot.isAvailable
                }"
              >
                <!-- COMPACT SINGLE LINE LAYOUT -->
                <div class="slot-compact-line">
                  <!-- TIME RANGE - MORE SPACE -->
                  <div class="time-range-compact">
                    <i class="fa-solid fa-clock slot-icon"></i>
                    <span v-if="timeSlot.isBooked" class="booked-time-text">
                      {{ formatTime12(timeSlot.startTime) }}–{{ formatTime12(timeSlot.endTime) }}
                    </span>
                    <span v-else class="edit-time-range">
                      <div class="time-input-wrapper">
                        <input
                          :value="formatTime(timeSlot.startTime)"
                          @input="updateTimeSlot(timeSlot, 'startTime', $event.target.value)"
                          type="time"
                          class="time-input"
                          @change="validateTimeSlot(timeSlot)"
                        />
                      </div>
                      <span class="time-separator">–</span>
                      <div class="time-input-wrapper">
                        <input
                          :value="formatTime(timeSlot.endTime)"
                          @input="updateTimeSlot(timeSlot, 'endTime', $event.target.value)"
                          type="time"
                          class="time-input"
                          @change="validateTimeSlot(timeSlot)"
                        />
                      </div>
                    </span>
                  </div>

                  <!-- STATUS INDICATOR - LESS SPACE -->
                  <div class="status-indicator-compact">
                    <!-- BOOKED -->
                    <div v-if="timeSlot.isBooked" class="booked-indicator">
                      <span class="status-dot booked-dot" title="BOOKED"></span>
                      <span v-if="getBookingForSlot(day.date, timeSlot.startTime, timeSlot.endTime)" 
                            class="customer-compact">
                        <i class="fa-solid fa-user"></i>
                      </span>
                    </div>
                    
                    <!-- AVAILABLE/UNAVAILABLE TOGGLE SWITCH - SMALLER -->
                    <div v-else class="toggle-container">
                      <label class="toggle-switch-small" :title="timeSlot.isAvailable ? 'Available - Click to make unavailable' : 'Unavailable - Click to make available'">
                        <input
                          type="checkbox"
                          v-model="timeSlot.isAvailable"
                          @change="saveSingleDayTemplate(day.dayKey, day.date)"
                        />
                        <span class="toggle-slider-small"></span>
                      </label>
                    </div>
                  </div>

                  <!-- ERROR & REMOVE - SMALLER -->
                  <div class="actions-compact">
                    <div v-if="timeSlot.hasError" class="error-indicator" :title="timeSlot.errorMessage">
                      <i class="fa-solid fa-exclamation-triangle"></i>
                    </div>
                    <button
                      class="remove-btn-compact"
                      @click="removeTimeSlot(day.date, slotIndex)"
                      :disabled="dailySchedules[day.date].length === 1 || timeSlot.isBooked"
                      :title="timeSlot.isBooked ? 'Cannot remove booked slot' : 'Remove time slot'"
                    >
                      <i class="fa-solid fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- ADD SLOT BUTTON -->
              <button 
                class="btn-add-slot-compact" 
                @click="addTimeSlot(day.date)"
                :disabled="loadingBookings"
              >
                <i class="fa-solid fa-plus"></i> Add Time Slot
              </button>
            </div>
            <!-- DAY OFF MESSAGE -->
            <div v-else class="day-off-message">
              <i class="fa-solid fa-moon"></i>
              <span>No time slots - Day off</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="handleCancel">
          <i class="fa-solid fa-arrow-left"></i> Cancel
        </button>
        <div class="primary-actions">
          <button
            class="btn btn-primary"
            @click="saveTimeSlots"
            :disabled="saving"
          >
            <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-save"></i>
            <span class="btn-text">{{ saving ? 'Saving...' : 'Update Time Slots' }}</span>
          </button>
          <button
            class="btn btn-info"
            @click="fetchBookedSlots"
            :disabled="loadingBookings"
          >
            <i v-if="loadingBookings" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-rotate"></i>
            <span class="btn-text">{{ loadingBookings ? 'Refreshing...' : 'Refresh Bookings' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/api/index.js';

export default {
  name: 'TimeSlots',
  props: {
    service: {
      type: Object,
      required: true
    },
    serviceId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      errorMessage: '',
      successMessage: '',
      loadingBookings: false,
      slotConfig: {
        slotLabel: 'Weekly Schedule',
        isActive: true
      },
      generatedDays: [],
      dailySchedules: {},
      existingSlots: [],
      existingSlotId: null,
      bookedSlots: [],
      // PERMANENT DAY TEMPLATES - Each day of week has its own saved slots
      dayTemplates: {
        // Monday, Tuesday, etc. with their own saved slots
      },
      defaultTimeSlots: [
        { startTime: '09:00', endTime: '11:00', isAvailable: true, isBooked: false },
        { startTime: '11:00', endTime: '13:00', isAvailable: true, isBooked: false },
        { startTime: '14:00', endTime: '16:00', isAvailable: true, isBooked: false },
        { startTime: '16:00', endTime: '18:00', isAvailable: true, isBooked: false }
      ],
      providerId: null
    };
  },
  computed: {
    currentDateRange() {
      if (this.generatedDays.length === 0) return '';
      const firstDay = this.generatedDays[0];
      const lastDay = this.generatedDays[this.generatedDays.length - 1];
      return `${firstDay.display} - ${lastDay.display}`;
    },
    hasExistingSlot() {
      return this.existingSlotId !== null;
    },
    serviceStatus() {
      if (!this.service) return 'draft';
      if (!this.service.slots || !Array.isArray(this.service.slots) || this.service.slots.length === 0) {
        return 'draft';
      }
      const hasRealSlots = this.service.slots.some(slot => {
        if (!slot) return false;
        if (slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          return slot.weeklySchedule.some(week => 
            week && week.timeSlots && Array.isArray(week.timeSlots) && week.timeSlots.length > 0
          );
        }
        return false;
      });
      return hasRealSlots ? 'active' : 'draft';
    },
    // Storage key for this service's day templates
    templateStorageKey() {
      if (!this.serviceId) return null;
      return `service_${this.serviceId}_day_templates`;
    }
  },
  async created() {
    await this.getProviderId();
    this.loadDayTemplates(); // Load saved templates for each day
    this.generate7DaySchedule(); // Generate next 7 days
    this.initializeDaysFromTemplates(); // Apply saved templates to days
    await this.initializeTimeSlots(); // Load existing slots from backend
    await this.fetchBookedSlots(); // Mark booked slots
  },
  methods: {
    async getProviderId() {
      try {
        const fromLocalStorage = localStorage.getItem('providerId') || 
                                localStorage.getItem('loggedProvider');
        
        if (fromLocalStorage) {
          try {
            const parsed = JSON.parse(fromLocalStorage);
            this.providerId = parsed.pid || parsed.providerId || parsed._id || parsed.id || fromLocalStorage;
          } catch {
            this.providerId = fromLocalStorage;
          }
        }
        
        if (!this.providerId) {
          const response = await http.get('/users/profile');
          const userData = response.data;
          this.providerId = userData.providerId || userData.pid || userData._id || userData.id;
          
          if (this.providerId) {
            localStorage.setItem('providerId', this.providerId);
          }
        }
      } catch (error) {
        console.warn('Could not get provider ID:', error);
        this.providerId = null;
      }
    },
    
    // Load saved templates for each day of week
    loadDayTemplates() {
      try {
        const storageKey = this.templateStorageKey;
        if (!storageKey) {
          this.dayTemplates = {};
          return;
        }
        
        const savedTemplates = localStorage.getItem(storageKey);
        
        if (savedTemplates) {
          this.dayTemplates = JSON.parse(savedTemplates);
        } else {
          // Initialize empty templates for all days
          this.dayTemplates = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          };
        }
      } catch (error) {
        console.warn('Could not load templates:', error);
        this.dayTemplates = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        };
      }
    },
    
    // Save all day templates to localStorage
    saveDayTemplates() {
      try {
        const storageKey = this.templateStorageKey;
        if (!storageKey) return;
        
        localStorage.setItem(storageKey, JSON.stringify(this.dayTemplates));
      } catch (error) {
        console.warn('Could not save templates:', error);
      }
    },
    
    // Initialize each day with its saved template
    initializeDaysFromTemplates() {
      this.generatedDays.forEach(day => {
        this.applyDayTemplate(day);
      });
    },
    
    // Apply saved template to a specific day
    applyDayTemplate(day) {
      const dateKey = day.date;
      const dayKey = day.dayKey;
      
      // Start with empty schedule
      this.dailySchedules[dateKey] = [];
      
      // Apply saved template for this day of week
      if (this.dayTemplates[dayKey] && this.dayTemplates[dayKey].length > 0) {
        // Day has saved slots - copy them
        const templateSlots = JSON.parse(JSON.stringify(this.dayTemplates[dayKey]));
        this.dailySchedules[dateKey] = templateSlots.map(slot => ({
          startTime: this.formatTime(slot.startTime),
          endTime: this.formatTime(slot.endTime),
          isAvailable: slot.isAvailable !== false,
          isBooked: false, // Will be marked later
          hasError: false,
          errorMessage: ''
        }));
      }
      // If no saved template, day remains empty (day off)
    },
    
    // Save template for a specific day of week
    saveDayTemplate(dayKey, date = null) {
      if (date && this.dailySchedules[date]) {
        const slots = this.dailySchedules[date];
        
        if (slots.length > 0) {
          // Save working day slots
          this.dayTemplates[dayKey] = slots.map(slot => ({
            startTime: this.formatTime(slot.startTime),
            endTime: this.formatTime(slot.endTime),
            isAvailable: slot.isAvailable
          }));
        } else {
          // Save day off (empty array)
          this.dayTemplates[dayKey] = [];
        }
        
        // Auto-save to localStorage
        this.saveDayTemplates();
      }
    },
    
    // Save template for single day (alias)
    saveSingleDayTemplate(dayKey, date = null) {
      this.saveDayTemplate(dayKey, date);
    },
    
    // Save ALL templates from current view
    saveAllTemplates() {
      this.generatedDays.forEach(day => {
        const slots = this.dailySchedules[day.date];
        
        if (slots && slots.length > 0) {
          // Working day with slots
          this.dayTemplates[day.dayKey] = slots.map(slot => ({
            startTime: this.formatTime(slot.startTime),
            endTime: this.formatTime(slot.endTime),
            isAvailable: slot.isAvailable
          }));
        } else {
          // Day off (empty array)
          this.dayTemplates[day.dayKey] = [];
        }
      });
      
      // Save to localStorage
      this.saveDayTemplates();
    },
    
    async initializeTimeSlots() {
      this.loading = true;
      try {
        const response = await http.get(`/services/${this.serviceId}/slots`);
        this.existingSlots = response.data || [];
        if (this.existingSlots.length > 0) {
          this.loadExistingSlotsIntoDays(this.existingSlots);
        }
      } catch (error) {
        console.warn('Could not load existing slots:', error);
      } finally {
        this.loading = false;
      }
    },
    
    loadExistingSlotsIntoDays(slots) {
      slots.forEach(slot => {
        this.existingSlotId = slot.slotId;
        if (slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          slot.weeklySchedule.forEach(daySchedule => {
            if (daySchedule && daySchedule.date && Array.isArray(daySchedule.timeSlots)) {
              const dateString = this.parseBackendDate(daySchedule.date);
              
              if (this.generatedDays.some(day => day.date === dateString)) {
                const day = this.generatedDays.find(d => d.date === dateString);
                const dayKey = day.dayKey;
                
                // Only load if no template exists for this day
                // Templates take priority over backend data
                const hasTemplate = this.dayTemplates[dayKey] && this.dayTemplates[dayKey].length > 0;
                
                if (!hasTemplate && daySchedule.timeSlots.length > 0) {
                  // No template exists, use existing slots from backend
                  this.dailySchedules[dateString] = daySchedule.timeSlots.map(timeSlot => ({
                    startTime: this.formatTime(timeSlot.startTime),
                    endTime: this.formatTime(timeSlot.endTime),
                    isAvailable: timeSlot.isAvailable !== false,
                    isBooked: false
                  }));
                  
                  // Also save these as template for this day of week
                  this.saveDayTemplate(dayKey, dateString);
                }
              }
            }
          });
        }
      });
    },
    
    generate7DaySchedule() {
      this.generatedDays = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = this.getDayOfWeek(date);
        const displayDate = this.formatDateForDisplay(date);
        const dateString = this.formatDateForInput(date);
        this.generatedDays.push({
          date: dateString,
          dayKey: dayOfWeek.key,
          dayName: dayOfWeek.name,
          display: `${dayOfWeek.label}, ${displayDate}`,
          isToday: i === 0
        });
      }
    },
    
    toggleWorkingDay(date, isWorking) {
      const day = this.generatedDays.find(d => d.date === date);
      const dayKey = day ? day.dayKey : null;
      
      if (isWorking) {
        // Check if we have saved template for this day
        if (dayKey && this.dayTemplates[dayKey] && this.dayTemplates[dayKey].length > 0) {
          // Use saved template
          this.applyDayTemplate(day);
        } else {
          // Use defaults for new working day
          this.dailySchedules[date] = JSON.parse(JSON.stringify(this.defaultTimeSlots));
          
          // Save as template
          if (dayKey) {
            this.saveDayTemplate(dayKey, date);
          }
        }
      } else {
        // When turning day OFF, save empty array as template
        this.dailySchedules[date] = [];
        if (dayKey) {
          this.dayTemplates[dayKey] = [];
          this.saveDayTemplates();
        }
      }
    },
    
    formatTime(timeStr) {
      if (!timeStr) return '09:00';
      
      if (timeStr === '24:00' || timeStr.startsWith('24:')) {
        return `00:${timeStr.split(':')[1] || '00'}`;
      }
      
      const [h, m] = timeStr.split(':').map(Number);
      
      let hour = h;
      if (hour >= 24) {
        hour = hour % 24;
      } else if (hour < 0) {
        hour = 0;
      }
      
      let minute = m;
      if (minute >= 60) {
        minute = 59;
      } else if (minute < 0) {
        minute = 0;
      } else if (isNaN(minute)) {
        minute = 0;
      }
      
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    },
    
    formatTime12(time24) {
      if (!time24) return '';
      
      const normalizedTime = this.formatTime(time24);
      const [h, m] = normalizedTime.split(':').map(Number);
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 || 12;
      return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
    },
    
    updateTimeSlot(slot, field, newValue) {
      if (newValue && newValue.length === 5) {
        slot[field] = this.formatTime(newValue);
        
        // Find the day for this slot to update template
        for (const day of this.generatedDays) {
          if (this.dailySchedules[day.date] && this.dailySchedules[day.date].includes(slot)) {
            this.saveDayTemplate(day.dayKey, day.date);
            break;
          }
        }
      }
    },
    
    formatDateForDisplay(date) {
      if (typeof date === 'string') date = new Date(date);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    },
    
    async fetchBookedSlots() {
      this.loadingBookings = true;
      try {
        const response = await http.get(`/bookings/service/${this.serviceId}`);
        const rawBookings = response.data || [];
        this.bookedSlots = rawBookings
          .filter(booking => 
            booking && 
            booking.bookingDate && 
            booking.startTime && 
            booking.endTime &&
            booking.status !== 'cancelled'
          )
          .map(booking => {
            const dateObj = new Date(booking.bookingDate);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            const normalizeTime = (t) => t?.length > 5 ? t.substring(0, 5) : t;
            return {
              ...booking,
              date: formattedDate,
              startTime: this.formatTime(normalizeTime(booking.startTime)),
              endTime: this.formatTime(normalizeTime(booking.endTime))
            };
          });
        this.markBookedSlotsInDailySchedules();
      } catch (error) {
        console.error('Failed to fetch booked slots:', error);
        this.setError('Failed to load booked appointments');
      } finally {
        this.loadingBookings = false;
      }
    },
    
    markBookedSlotsInDailySchedules() {
      this.generatedDays.forEach(day => {
        const dateKey = day.date;
        const backendDate = this.formatDateForBackend(dateKey);
        const bookingsForDay = this.bookedSlots.filter(b => b.date === backendDate);
        
        if (!this.dailySchedules[dateKey]) {
          this.dailySchedules[dateKey] = [];
        }
        
        bookingsForDay.forEach(booking => {
          const existingSlot = this.dailySchedules[dateKey].find(slot => 
            slot.startTime === booking.startTime && slot.endTime === booking.endTime
          );
          
          if (!existingSlot) {
            const newSlot = {
              startTime: booking.startTime,
              endTime: booking.endTime,
              isAvailable: false,
              isBooked: true,
              hasError: false,
              errorMessage: ''
            };
            this.dailySchedules[dateKey].push(newSlot);
          } else {
            existingSlot.isBooked = true;
            existingSlot.isAvailable = false;
          }
        });
      });
    },
    
    getBookingForSlot(date, startTime, endTime) {
      const backendDate = this.formatDateForBackend(date);
      return this.bookedSlots.find(booking => {
        return booking.date === backendDate &&
               booking.startTime === startTime &&
               booking.endTime === endTime;
      });
    },
    
    getDayOfWeek(date) {
      const days = [
        { key: 'sunday', name: 'Sunday', label: 'Sun' },
        { key: 'monday', name: 'Monday', label: 'Mon' },
        { key: 'tuesday', name: 'Tuesday', label: 'Tue' },
        { key: 'wednesday', name: 'Wednesday', label: 'Wed' },
        { key: 'thursday', name: 'Thursday', label: 'Thu' },
        { key: 'friday', name: 'Friday', label: 'Fri' },
        { key: 'saturday', name: 'Saturday', label: 'Sat' }
      ];
      return days[date.getDay()];
    },
    
    isWorkingAtDay(date) {
      return this.dailySchedules[date]?.length > 0;
    },
    
    addTimeSlot(date) {
      const slots = this.dailySchedules[date] || [];
      const lastSlot = slots.length > 0 ? slots[slots.length - 1] : null;
      let newStartTime = '09:00';
      let newEndTime = '11:00';
      
      if (lastSlot) {
        const [h, m] = lastSlot.endTime.split(':').map(Number);
        
        let newStartH = h + 1;
        let newStartM = m;
        
        if (newStartH >= 24) {
          newStartH = newStartH % 24;
        }
        
        newStartTime = `${newStartH.toString().padStart(2, '0')}:${newStartM.toString().padStart(2, '0')}`;
        
        let newEndH = newStartH + 2;
        let newEndM = newStartM;
        
        if (newEndH >= 24) {
          newEndH = newEndH % 24;
        }
        
        newEndTime = `${newEndH.toString().padStart(2, '0')}:${newEndM.toString().padStart(2, '0')}`;
      }
      
      newStartTime = this.formatTime(newStartTime);
      newEndTime = this.formatTime(newEndTime);
      
      const newSlot = { 
        startTime: newStartTime, 
        endTime: newEndTime, 
        isAvailable: true, 
        isBooked: false 
      };
      
      this.dailySchedules[date] = [...slots, newSlot];
      
      // Update template
      const day = this.generatedDays.find(d => d.date === date);
      if (day) {
        this.saveDayTemplate(day.dayKey, date);
      }
    },
    
    removeTimeSlot(date, slotIndex) {
      if (!this.dailySchedules[date] || slotIndex >= this.dailySchedules[date].length) return;
      
      this.dailySchedules[date].splice(slotIndex, 1);
      
      // Update template
      const day = this.generatedDays.find(d => d.date === date);
      if (day) {
        this.saveDayTemplate(day.dayKey, date);
      }
    },
    
    // Save time slots to backend
    async saveTimeSlots() {
      if (!this.validateAllTimeSlots()) {
        this.setError('Please fix time slot errors before saving');
        return;
      }
      
      this.saving = true;
      this.errorMessage = '';
      
      try {
        // Save all current settings as permanent templates
        this.saveAllTemplates();
        
        // Prepare data for backend
        const weeklySchedule = [];
        this.generatedDays.forEach(day => {
          const timeSlots = this.dailySchedules[day.date] || [];
          const isWorkingDay = timeSlots.length > 0;
          
          weeklySchedule.push({
            date: this.formatDateForBackend(day.date),
            day: day.dayKey,
            isWorkingDay: isWorkingDay,
            timeSlots: isWorkingDay ? timeSlots.map(slot => ({
              startTime: this.formatTime(slot.startTime),
              endTime: this.formatTime(slot.endTime),
              isAvailable: slot.isAvailable
            })) : []
          });
        });
        
        const slotData = {
          slotId: this.existingSlotId || `slot_${Date.now()}`,
          slotLabel: this.slotConfig.slotLabel,
          isActive: this.slotConfig.isActive,
          weeklySchedule: weeklySchedule
        };
        
        if (this.existingSlotId) {
          await http.put(`/services/${this.serviceId}/slots/${this.existingSlotId}`, slotData);
        } else {
          const response = await http.post(`/services/${this.serviceId}/slots`, { slots: [slotData] });
          if (response.data?.length > 0) {
            this.existingSlotId = response.data[0].slotId;
          }
        }
        
        this.setSuccess('Time slots updated successfully');
        this.$emit('saved');
        
      } catch (error) {
        console.error('Error saving schedule:', error);
        this.handleApiError(error, 'save time slots');
      } finally {
        this.saving = false;
      }
    },
    
    formatDateForInput(date) {
      if (typeof date === 'string') return date;
      return date.toISOString().split('T')[0];
    },
    
    formatDateForBackend(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    
    parseBackendDate(dateString) {
      if (!dateString) return '';
      const parts = dateString.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return '';
    },
    
    validateTimeSlot(timeSlot) {
      timeSlot.hasError = false;
      timeSlot.errorMessage = '';
      
      if (timeSlot.startTime && timeSlot.endTime) {
        const normalizedStartTime = this.formatTime(timeSlot.startTime);
        const normalizedEndTime = this.formatTime(timeSlot.endTime);
        
        const startHour = parseInt(normalizedStartTime.split(':')[0]);
        const endHour = parseInt(normalizedEndTime.split(':')[0]);
        
        if (startHour < 0 || startHour > 23) {
          timeSlot.hasError = true;
          timeSlot.errorMessage = 'Start time must be between 00:00 and 23:59';
          return false;
        }
        
        if (endHour < 0 || endHour > 23) {
          timeSlot.hasError = true;
          timeSlot.errorMessage = 'End time must be between 00:00 and 23:59';
          return false;
        }
        
        if (normalizedStartTime >= normalizedEndTime) {
          timeSlot.hasError = true;
          timeSlot.errorMessage = 'End time must be after start time';
          return false;
        }
      }
      return true;
    },
    
    validateAllTimeSlots() {
      let isValid = true;
      this.generatedDays.forEach(day => {
        const timeSlots = this.dailySchedules[day.date];
        if (timeSlots) {
          timeSlots.forEach(slot => {
            if (!this.validateTimeSlot(slot)) isValid = false;
          });
        }
      });
      return isValid;
    },
    
    handleApiError(error, operation) {
      console.error(`Error during ${operation}:`, error);
      let errorMsg = `Failed to ${operation}`;
      if (error.response?.status === 400) {
        errorMsg = 'Invalid data format. Please check your time slots.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again.';
      } else if (error.response?.data?.message) {
        errorMsg = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      this.setError(errorMsg);
    },
    
    handleCancel() {
      this.$emit('close');
    },
    
    setError(message) {
      this.errorMessage = message;
      setTimeout(() => { this.errorMessage = ''; }, 5000);
    },
    
    setSuccess(message) {
      this.successMessage = message;
      setTimeout(() => { this.successMessage = ''; }, 3000);
    }
  }
};
</script>



<style scoped>
/* ===== BASE STYLES ===== */
.time-slots-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  font-family: "Inter", sans-serif;
  color: #29282e;
}

/* ===== MESSAGES ===== */
.loading-state, .error-message, .success-message, .draft-alert {
  padding: 14px 16px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.loading-state { background: #f1f5f9; color: #64748b; }
.error-message { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.success-message { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.draft-alert { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
.close-error, .close-success {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.7;
}
.close-error:hover, .close-success:hover { opacity: 1; }

/* ===== WEEKLY SCHEDULE ===== */
.weekly-schedule-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}
.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}
.schedule-header h4 {
  font-size: 2.05rem;
  margin: 0;
  color: #0f172a;
}
.date-range {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 10px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
.section-description {
  color: #64748b;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

/* ===== DAYS GRID ===== */
.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 10px;
}
.day-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  background: #454365;
}
.day-card.working-day { border-color: #22c55e; background: #f2f4f6; }
.day-card.today { border-color: #3b82f6; background: #e0e3b3; }
.day-card.day-off { opacity: 0.85; background: #fcfdff; }
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 8px;
}
.day-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.day-label {
  font-weight: 300;
  font-size: 1.05rem;
}
.day-labels { display: flex; gap: 6px; }
.off-label {
  background: #da182b;
  color: #111214;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}
.today-label {
  background: #3b82f6;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}
.day-off-message {
  text-align: center;
  color: #94a3b8;
  padding: 20px 0;
  font-style: italic;
}

/* ===== COMPACT TIME SLOT LAYOUT ===== */
.time-slots-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.time-slot-item {
  background: rgb(35, 27, 37);
  border: 1px solid #e2e8f0;
  border-radius: 80px;
  padding: 10px 10px;
  transition: all 0.2s ease;
}
.time-slot-item.booked-slot {
  background: #fef2f2;
  border-color: #fecaca;
}
.time-slot-item.available-slot {
  background: #f0fdf4;
  border-color: #c1cac4;
}
.time-slot-item.unavailable-slot {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.time-slot-item.has-error {
  border-color: #f87171;
  background: #fff1f1;
}

/* COMPACT SINGLE LINE CONTAINER */
.slot-compact-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  flex-wrap: nowrap;
}

/* TIME RANGE COMPACT - MORE SPACE FOR TIMES */
.time-range-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}
.slot-icon {
  color: #64748b;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.booked-slot .slot-icon {
  color: #dc2626;
}
.available-slot .slot-icon {
  color: #22c55e;
}
.unavailable-slot .slot-icon {
  color: #94a3b8;
}
.booked-time-text {
  font-weight: 600;
  color: #1e40af;
  font-size: 0.9rem;
  white-space: nowrap;
  min-width: 140px;
}
.edit-time-range {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
  min-width: 0;
  flex: 1;
}
.time-input-wrapper {
  display: flex;
  align-items: center;
  min-width: 0;
}
.time-input {
  width: 80px;
  min-width: 75px;
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
  font-family: 'Inter', monospace;
  color: hsl(212, 81%, 34%);
  background: rgb(247, 250, 253);
  box-sizing: border-box;
  flex-shrink: 0;
}
.time-input:focus {
  outline: none;
  border-color: #966881;
  box-shadow: 0 0 0 2px rgba(181, 33, 62, 0.2);
}
.time-separator {
  color: #64748b;
  font-size: 0.9rem;
  flex-shrink: 0;
  padding: 0 2px;
  white-space: nowrap;
  margin: 0 2px;
}

/* STATUS INDICATOR COMPACT */
.status-indicator-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.booked-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.booked-dot {
  background: #dc2626;
}
.customer-compact {
  background: #fee2e2;
  color: #dc2626;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

/* SMALLER TOGGLE SWITCH */
.toggle-container {
  flex-shrink: 0;
  margin-left: 4px;
}
.toggle-switch-small {
  display: inline-block;
  position: relative;
  width: 30px;
  height: 20px;
  cursor: pointer;
}
.toggle-switch-small input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider-small {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ef4444;
  transition: .3s;
  border-radius: 10px;
}
.toggle-slider-small:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}
.toggle-switch-small input:checked + .toggle-slider-small {
  background-color: #22c55e;
}
.toggle-switch-small input:checked + .toggle-slider-small:before {
  transform: translateX(16px);
}

/* ACTIONS COMPACT */
.actions-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.error-indicator {
  color: #dc2626;
  font-size: 0.9rem;
  cursor: help;
  flex-shrink: 0;
}
.remove-btn-compact {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
  padding: 0;
}
.remove-btn-compact:hover:not(:disabled) {
  background: #fecaca;
  transform: scale(1.05);
}
.remove-btn-compact:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

/* ===== ADD SLOT BUTTON COMPACT ===== */
.btn-add-slot-compact {
  width: 100%;
  padding: 8px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  color: #475569;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
  transition: all 0.2s ease;
}
.btn-add-slot-compact:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #94a3b8;
}

/* ===== ACTION BUTTONS ===== */
.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}
.primary-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 0.95rem;
  min-height: 42px;
  transition: all 0.2s ease;
}
.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}
.btn-secondary:hover:not(:disabled) { background: #e2e8f0; }
.btn-primary {
  background: #22c55e;
  color: white;
}
.btn-primary:hover:not(:disabled) { background: #16a34a; }
.btn-info {
  background: #3b82f6;
  color: white;
}
.btn-info:hover:not(:disabled) { background: #2563eb; }
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== DEBUG INFO SECTION ===== */
.debug-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #475569;
}
.debug-info h5 {
  margin: 0 0 10px 0;
  color: #0f172a;
  font-size: 0.9rem;
}
.debug-info p {
  margin: 5px 0;
}
.debug-info div {
  margin: 3px 0;
  padding-left: 10px;
  border-left: 2px solid #e2e8f0;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Desktop (≥768px) - OPTIMIZED FOR DESKTOP */
@media (min-width: 768px) {
  .slot-compact-line {
    gap: 12px;
    flex-wrap: nowrap;
  }
  
  .time-range-compact {
    flex: 0 0 220px;
    min-width: 220px;
  }
  
  .time-input {
    width: 85px;
    min-width: 85px;
  }
  
  .booked-time-text {
    min-width: 180px;
  }
  
  .status-indicator-compact {
    margin-left: 0;
  }
  
  .actions-compact {
    margin-left: auto;
  }
  
  .remove-btn-compact {
    margin-left: 8px;
  }
}

/* Tablet (480px-768px) - VERTICAL STACK */
@media (max-width: 768px) and (min-width: 480px) {
  .days-grid {
    grid-template-columns: 1fr;
  }
  
  .slot-compact-line {
    flex-wrap: nowrap;
    gap: 10px;
  }
  
  .time-range-compact {
    flex: 0 0 200px;
  }
  
  .time-input {
    width: 80px;
    min-width: 80px;
    padding: 5px 6px;
    font-size: 0.85rem;
  }
  
  .booked-time-text {
    min-width: 160px;
  }
  
  .status-indicator-compact {
    margin-left: 0;
  }
  
  .actions-compact {
    margin-left: auto;
  }
}

/* Mobile (<480px) - CLEAN VERTICAL STACK */
@media (max-width: 480px) {
  .time-slots-container {
    padding: 10px;
  }
  
  .weekly-schedule-section {
    padding: 12px;
  }
  
  .days-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .day-card {
    padding: 12px;
  }
  
  /* MOBILE: VERTICAL STACKING */
  .slot-compact-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: nowrap;
    width: 100%;
  }
  
  .time-range-compact {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
    min-width: 160px;
  }
  
  .booked-time-text {
    min-width: 140px;
    font-size: 0.85rem;
  }
  
  .edit-time-range {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .time-input {
    width: 75px;
    min-width: 75px;
    padding: 5px 4px;
    font-size: 0.85rem;
  }
  
  .status-indicator-compact {
    flex-shrink: 0;
    margin-left: 0;
  }
  
  .actions-compact {
    flex-shrink: 0;
    margin-left: 0;
  }
  
  .toggle-switch-small {
    width: 30px;
    height: 18px;
  }
  
  .toggle-slider-small:before {
    height: 14px;
    width: 14px;
    left: 2px;
    bottom: 2px;
  }
  
  .toggle-switch-small input:checked + .toggle-slider-small:before {
    transform: translateX(12px);
  }
  
  .customer-compact {
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
  }
  
  .remove-btn-compact {
    width: 20px;
    height: 20px;
    font-size: 0.8rem;
  }
}

/* Extra Small Mobile (<360px) - COMPACT VERTICAL */
@media (max-width: 360px) {
  .slot-compact-line {
    gap: 6px;
  }
  
  .time-range-compact {
    min-width: 140px;
  }
  
  .booked-time-text {
    min-width: 120px;
    font-size: 0.8rem;
  }
  
  .time-input {
    width: 65px;
    min-width: 65px;
    padding: 4px 3px;
    font-size: 0.8rem;
  }
  
  .toggle-switch-small {
    width: 28px;
    height: 16px;
  }
  
  .toggle-slider-small:before {
    height: 12px;
    width: 12px;
    left: 2px;
    bottom: 2px;
  }
  
  .toggle-switch-small input:checked + .toggle-slider-small:before {
    transform: translateX(12px);
  }
}

/* ENSURE NO BREAKING */
.slot-compact-line {
  display: flex !important;
  overflow: visible !important;
}

.time-range-compact,
.edit-time-range {
  flex-shrink: 0 !important;
  overflow: visible !important;
}

.time-input {
  overflow: visible !important;
  text-overflow: clip !important;
}

.time-input[type="time"] {
  -moz-appearance: textfield;
}

/* Hover effects */
.time-slot-item:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transform: translateY(-1px);
}

/* Tooltip for toggle */
.toggle-switch-small[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2f5082;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 100;
  margin-bottom: 5px;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .slot-compact-line,
  .time-slot-item,
  .remove-btn-compact,
  .toggle-slider-small,
  .toggle-slider-small:before {
    transition: none;
  }
}
</style>