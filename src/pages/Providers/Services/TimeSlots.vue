<template>
  <div class="ultimate-scheduler">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Loading schedule...
    </div>

    <!-- Messages -->
    <div v-if="error" class="message error">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
      <button class="close-error" @click="error = ''">
        <i class="fas fa-times"></i>
      </button>
    </div>
   
    <div v-if="success" class="message success">
      <i class="fas fa-check-circle"></i> {{ success }}
      <button class="close-success" @click="success = ''">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Service Status Alert -->
    <div v-if="!hasExistingSlot" class="draft-alert">
      <i class="fas fa-clock"></i>
      <div class="alert-content">
        <strong>Schedule Your Availability</strong>
        <p>Click on calendar days to set your working hours. Customers can book these time slots.</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading" class="scheduler-container">
      <!-- Calendar Section -->
      <div class="calendar-wrapper">
        <!-- Month Navigation -->
        <div class="month-nav">
          <button @click="prevMonth" class="nav-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="month-year">{{ currentMonthYear }}</div>
          <button @click="nextMonth" class="nav-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <!-- Week Days -->
          <div class="weekdays">
            <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
              {{ day }}
            </div>
          </div>

          <!-- Days Grid -->
          <div class="days-grid">
            <!-- Empty Days -->
            <div v-for="n in firstDayOffset" :key="'empty-' + n" class="day empty"></div>
            
            <!-- Actual Days -->
            <div
              v-for="day in daysInMonth"
              :key="day"
              class="day"
              :class="getDayClasses(day)"
              @click="!isPastDay(day) && selectSingleDay(day)"
            >
              <div class="day-number">{{ day }}</div>
              
              <!-- BIG COLOR INDICATORS (only the colors bigger) -->
              <div class="day-indicators-big">
                <!-- Booked Indicator - BIG RED DOT -->
                <div v-if="hasBookings(day)" class="booked-indicator-big" title="Has bookings">
                  ●
                </div>
                
                <!-- Available Indicator - BIG GREEN DOT -->
                <div v-else-if="isAvailableDay(day)" class="available-indicator-big" title="Available">
                  ●
                </div>
                
                <!-- Off Day Indicator - BIG GRAY MINUS -->
                <div v-else-if="isOffDay(day)" class="off-indicator-big" title="Day off">
                  –
                </div>
              </div>
              
              <!-- Active Day Highlight -->
              <div v-if="isActiveDay(day)" class="active-highlight"></div>
              
              <!-- Past Overlay -->
              <div v-if="isPastDay(day)" class="past-overlay">
                <i class="fas fa-lock"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- BIG Color Legend -->
        <div class="big-color-legend">
          <div class="legend-item-big">
            <div class="legend-dot-big active-dot-big"></div>
            <span>Selected</span>
          </div>
          <div class="legend-item-big">
            <div class="legend-dot-big booked-dot-big"></div>
            <span>Booked</span>
          </div>
          <div class="legend-item-big">
            <div class="legend-dot-big available-dot-big"></div>
            <span>Available</span>
          </div>
          <div class="legend-item-big">
            <div class="legend-dot-big off-dot-big"></div>
            <span>Day Off</span>
          </div>
        </div>
      </div>

      <!-- Timeslot Panel for Active Day -->
      <div v-if="activeDate" class="timeslot-panel">
        <!-- Active Day Header -->
        <div class="active-day-header">
          <div class="day-info">
            <h3>{{ formatDateLong(activeDate) }}</h3>
            <div class="day-status-badges">
              <div class="day-toggle-rectangle" @click="toggleActiveDayOff()">
                <div class="toggle-rectangle" :class="{ 'working': activeDayData.working, 'off': !activeDayData.working }">
                  <i v-if="activeDayData.working" class="fas fa-check"></i>
                  <i v-else class="fas fa-minus"></i>
                </div>
                <span class="toggle-label">{{ activeDayData.working ? 'Working Day' : 'Day Off' }}</span>
              </div>
              
              <div v-if="hasBookingsForActiveDay()" class="booked-badge">
                <i class="fas fa-calendar-check"></i>
                {{ getBookedCount() }} booked
              </div>
            </div>
          </div>
        </div>

        <!-- Time Slots List -->
        <div v-if="activeDayData.working" class="time-slots-list">
          <div 
            v-for="(slot, index) in activeDayData.slots" 
            :key="index"
            class="time-slot-line"
          >
            <!-- COMPACT SINGLE LINE LAYOUT (CLOCK ICON REMOVED) -->
            <div class="slot-compact-line">
              <!-- TIME RANGE - NO CLOCK ICON -->
              <div class="time-range-compact">
                <!-- For booked slots -->
                <span v-if="slot.isBooked" class="booked-time-text">
                  {{ formatTo12Hour(slot.startTime) }} – {{ formatTo12Hour(slot.endTime) }}
                </span>
                
                <!-- For editable slots -->
                <span v-else class="edit-time-range">
                  <div class="time-input-wrapper">
                    <input
                      type="time"
                      :value="formatTimeForInput(slot.startTime)"
                      @input="updateSlotTime(index, 'startTime', $event.target.value)"
                      class="time-input"
                      @change="validateActiveSlot(index)"
                    />
                  </div>
                  <span class="time-separator">–</span>
                  <div class="time-input-wrapper">
                    <input
                      type="time"
                      :value="formatTimeForInput(slot.endTime)"
                      @input="updateSlotTime(index, 'endTime', $event.target.value)"
                      class="time-input"
                      @change="validateActiveSlot(index)"
                    />
                  </div>
                </span>
              </div>

              <!-- STATUS INDICATOR -->
              <div class="status-indicator-compact">
                <!-- BOOKED - Just icon -->
                <div v-if="slot.isBooked" class="booked-indicator-icon">
                  <i class="fas fa-calendar-check"></i>
                </div>
                
                <!-- AVAILABLE/UNAVAILABLE TOGGLE -->
                <div v-else class="toggle-container">
                  <label class="toggle-switch-small">
                    <input
                      type="checkbox"
                      :checked="slot.isActive"
                      @change="toggleSlotActiveInActiveDay(index)"
                    />
                    <span class="toggle-slider-small"></span>
                  </label>
                </div>
              </div>

              <!-- ERROR & REMOVE -->
              <div class="actions-compact">
                <div v-if="slot.hasError" class="error-indicator" :title="slot.errorMessage">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <button
                  class="remove-btn-compact"
                  @click="removeSlotFromActiveDay(index)"
                  :disabled="activeDayData.slots.length === 1 || slot.isBooked"
                  :title="slot.isBooked ? 'Cannot remove booked slot' : 'Remove time slot'"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Add Slot Button -->
          <button @click="addSlotToActiveDay()" class="add-slot-btn">
            <i class="fas fa-plus"></i> Add Time Slot
          </button>
        </div>

        <!-- Day Off Message -->
        <div v-else class="day-off-card">
          <i class="fas fa-moon"></i>
          <span>Day Off</span>
          <button @click="toggleActiveDayOff()" class="make-working-btn">
            Set Working
          </button>
        </div>

        <!-- Save Button -->
        <div class="save-section">
          <button 
            @click="saveActiveDayChanges()" 
            class="save-btn"
            :disabled="!hasChanges || saving"
          >
            <i v-if="saving" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ saving ? 'Saving...' : 'Save Schedule' }}
          </button>
        </div>
      </div>

      <!-- No Selection Message -->
      <div v-else class="no-selection">
        <div class="empty-message">
          <i class="fas fa-calendar-alt"></i>
          <h3>Select a Day to Schedule</h3>
          <p>Click on future dates in the calendar to schedule</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/api/index.js';

export default {
  name: 'UltimateScheduler',
  props: {
    serviceId: {
      type: String,
      required: true
    },
    service: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      error: '',
      success: '',
      
      currentDate: new Date(),
      scheduleData: {},
      
      // ONE DAY AT A TIME - Active day context
      activeDate: null,
      activeDayData: {
        working: true,
        slots: []
      },
      
      hasChanges: false,
      
      mainSlotId: null,
      allSlots: [],
      bookedSlots: [],
      loadingBookings: false,
      
      // Template system
      dayTemplates: {},
      defaultTimeSlots: [
        { startTime: '09:00', endTime: '11:00', isActive: true, isBooked: false, hasError: false },
        { startTime: '11:00', endTime: '13:00', isActive: true, isBooked: false, hasError: false },
        { startTime: '14:00', endTime: '16:00', isActive: true, isBooked: false, hasError: false },
        { startTime: '16:00', endTime: '18:00', isActive: true, isBooked: false, hasError: false }
      ]
    };
  },
  computed: {
    currentMonthYear() {
      const month = this.currentDate.toLocaleDateString('en-US', { month: 'long' });
      const year = this.currentDate.getFullYear();
      return `${month} ${year}`;
    },
    
    daysInMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      return new Date(year, month + 1, 0).getDate();
    },
    
    firstDayOffset() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      // Adjust for Monday-first week (0=Sunday, 1=Monday)
      return firstDay === 0 ? 6 : firstDay - 1;
    },
    
    hasExistingSlot() {
      return !!this.mainSlotId;
    }
  },
  async created() {
    console.log('🔍 Service ID:', this.serviceId);
    this.loadDayTemplates();
    await this.loadData();
    await this.fetchBookedSlots();
  },
  watch: {
    'activeDayData': {
      deep: true,
      handler() {
        this.hasChanges = true;
      }
    }
  },
  methods: {
    // ========== SINGLE DAY SELECTION ==========
    selectSingleDay(day) {
      const dateKey = this.getDateKey(day);
      
      if (this.isDatePast(dateKey)) {
        this.error = 'Cannot schedule past dates';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      // Set as active day
      this.activeDate = dateKey;
      
      // Load or initialize day data
      if (this.scheduleData[dateKey]) {
        // Clone existing data
        this.activeDayData = {
          working: this.scheduleData[dateKey].working,
          slots: JSON.parse(JSON.stringify(this.scheduleData[dateKey].slots))
        };
      } else {
        // Initialize new day with template or defaults
        const date = new Date(dateKey);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = days[date.getDay()];
        
        if (this.dayTemplates[dayKey] && this.dayTemplates[dayKey].length > 0) {
          this.activeDayData = {
            working: true,
            slots: JSON.parse(JSON.stringify(this.dayTemplates[dayKey]))
          };
        } else {
          this.activeDayData = {
            working: true,
            slots: JSON.parse(JSON.stringify(this.defaultTimeSlots))
          };
        }
      }
      
      console.log(`Selected single day: ${dateKey}`, this.activeDayData);
    },
    
    // ========== DAY STATE METHODS ==========
    getDayClasses(day) {
      const dateKey = this.getDateKey(day);
      const classes = [];
      
      if (this.isToday(day)) classes.push('today');
      if (this.isPastDay(day)) classes.push('past');
      if (this.isActiveDay(day)) classes.push('active');
      
      return classes;
    },
    
    isActiveDay(day) {
      const dateKey = this.getDateKey(day);
      return this.activeDate === dateKey;
    },
    
    isAvailableDay(day) {
      const dateKey = this.getDateKey(day);
      return this.scheduleData[dateKey] && this.scheduleData[dateKey].working;
    },
    
    isOffDay(day) {
      const dateKey = this.getDateKey(day);
      return this.scheduleData[dateKey] && !this.scheduleData[dateKey].working;
    },
    
    hasBookings(day) {
      const dateKey = this.getDateKey(day);
      const backendDate = this.formatDateForBackend(dateKey);
      return this.bookedSlots.some(booking => booking.date === backendDate);
    },
    
    // ========== ACTIVE DAY OPERATIONS ==========
    toggleActiveDayOff() {
      if (this.hasBookingsForActiveDay()) {
        this.error = 'Cannot set as Day Off when there are bookings';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      this.activeDayData.working = !this.activeDayData.working;
      
      if (this.activeDayData.working && this.activeDayData.slots.length === 0) {
        // Add default slots when switching to working day
        this.activeDayData.slots = JSON.parse(JSON.stringify(this.defaultTimeSlots));
      } else if (!this.activeDayData.working) {
        // Clear slots when switching to day off
        this.activeDayData.slots = [];
      }
    },
    
    addSlotToActiveDay() {
      if (this.activeDayData.slots.length >= 8) {
        this.error = 'Maximum 8 time slots per day';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      const slots = this.activeDayData.slots;
      const lastSlot = slots.length > 0 ? slots[slots.length - 1] : null;
      let newStartTime = '09:00';
      let newEndTime = '11:00';
      
      if (lastSlot) {
        const [h, m] = lastSlot.endTime.split(':').map(Number);
        let newStartH = h + 2;
        if (newStartH >= 24) newStartH = 9;
        newStartTime = `${newStartH.toString().padStart(2, '0')}:00`;
        newEndTime = `${(newStartH + 2).toString().padStart(2, '0')}:00`;
      }
      
      this.activeDayData.slots.push({ 
        startTime: this.formatTime(newStartTime), 
        endTime: this.formatTime(newEndTime), 
        isActive: true, 
        isBooked: false,
        hasError: false
      });
    },
    
    removeSlotFromActiveDay(index) {
      if (this.activeDayData.slots.length <= 1) {
        this.error = 'Must have at least one time slot';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      const slot = this.activeDayData.slots[index];
      if (!slot.isBooked) {
        this.activeDayData.slots.splice(index, 1);
      }
    },
    
    toggleSlotActiveInActiveDay(index) {
      const slot = this.activeDayData.slots[index];
      if (slot && !slot.isBooked) {
        slot.isActive = !slot.isActive;
      }
    },
    
    updateSlotTime(index, field, newValue) {
      const slot = this.activeDayData.slots[index];
      if (slot && !slot.isBooked && newValue && newValue.length === 5) {
        const oldValue = slot[field];
        slot[field] = this.formatTime(newValue);
        
        if (!this.validateActiveSlot(index)) {
          slot[field] = oldValue;
        }
      }
    },
    
    validateActiveSlot(index) {
      const slot = this.activeDayData.slots[index];
      if (slot) {
        slot.hasError = false;
        slot.errorMessage = '';
        
        if (slot.startTime && slot.endTime) {
          const startTime = this.formatTime(slot.startTime);
          const endTime = this.formatTime(slot.endTime);
          
          if (startTime >= endTime) {
            slot.hasError = true;
            slot.errorMessage = 'End time must be after start time';
            return false;
          }
        }
        return true;
      }
      return false;
    },
    
    // ========== SAVE ACTIVE DAY ==========
    async saveActiveDayChanges() {
      if (this.saving) return;
      
      console.log('💾 Saving active day:', this.activeDate);
      this.saving = true;
      this.error = '';
      
      try {
        // Update scheduleData with active day
        this.scheduleData[this.activeDate] = {
          working: this.activeDayData.working,
          slots: JSON.parse(JSON.stringify(this.activeDayData.slots))
        };
        
        // Save templates
        this.autoSaveTemplates();
        
        // Build and save to backend
        const weeklySchedule = this.buildWeeklySchedule();
        
        const slotData = {
          slotId: this.mainSlotId || `slot_${Date.now()}`,
          slotLabel: `${this.serviceId} Schedule`,
          isActive: true,
          weeklySchedule: weeklySchedule
        };
        
        let response;
        
        if (!this.mainSlotId) {
          const createPayload = { slots: [slotData] };
          response = await http.post(`/services/${this.serviceId}/slots`, createPayload);
          this.mainSlotId = response.data[0]?.slotId || response.data[0]?._id || slotData.slotId;
        } else {
          const updatePayload = {
            slotLabel: slotData.slotLabel,
            isActive: slotData.isActive,
            weeklySchedule: slotData.weeklySchedule
          };
          response = await http.put(`/services/${this.serviceId}/slots/${this.mainSlotId}`, updatePayload);
        }
        
        this.success = 'Schedule saved successfully!';
        this.hasChanges = false;
        
        // Reload booked slots to refresh indicators
        await this.fetchBookedSlots();
        
        setTimeout(() => {
          this.success = '';
        }, 3000);
        
      } catch (error) {
        console.error('Save error:', error);
        this.error = error.response?.data?.message || 'Failed to save schedule';
      } finally {
        this.saving = false;
      }
    },
    
    // ========== ACTIVE DAY INFO ==========
    hasBookingsForActiveDay() {
      if (!this.activeDate) return false;
      const backendDate = this.formatDateForBackend(this.activeDate);
      return this.bookedSlots.some(booking => booking.date === backendDate);
    },
    
    getBookedCount() {
      if (!this.activeDate) return 0;
      const backendDate = this.formatDateForBackend(this.activeDate);
      return this.bookedSlots.filter(booking => booking.date === backendDate).length;
    },
    
    // ========== EXISTING METHODS ==========
    async loadData() {
      this.loading = true;
      try {
        const response = await http.get(`/services/${this.serviceId}/slots`);
        this.allSlots = response.data || [];
        
        if (this.allSlots.length > 0) {
          this.mainSlotId = this.allSlots[0]._id || this.allSlots[0].slotId;
          this.loadScheduleFromSlot(this.allSlots[0]);
        } else {
          this.scheduleData = {};
        }
        
      } catch (error) {
        console.error('Load error:', error);
        if (error.response?.status !== 404) {
          this.error = error.response?.data?.message || 'Failed to load schedule';
        }
      } finally {
        this.loading = false;
      }
    },
    
    loadScheduleFromSlot(slot) {
      this.scheduleData = {};
      const scheduleData = slot.weeklySchedule || slot.slots || [];
      
      scheduleData.forEach(daySchedule => {
        if (daySchedule && daySchedule.date) {
          const dateKey = this.formatDate(daySchedule.date);
          
          if (!this.isDatePast(dateKey)) {
            this.scheduleData[dateKey] = {
              working: daySchedule.isWorkingDay !== false,
              slots: []
            };
            
            if (daySchedule.isWorkingDay && Array.isArray(daySchedule.timeSlots)) {
              this.scheduleData[dateKey].slots = daySchedule.timeSlots.map(ts => ({
                startTime: this.formatTime(ts.startTime),
                endTime: this.formatTime(ts.endTime),
                isActive: ts.isAvailable !== false,
                isBooked: ts.isBooked || false,
                hasError: false,
                errorMessage: ''
              }));
            }
          }
        }
      });
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
        
      } catch (error) {
        console.error('Failed to fetch booked slots:', error);
      } finally {
        this.loadingBookings = false;
      }
    },
    
    buildWeeklySchedule() {
      const weeklySchedule = [];
      const dateKeys = Object.keys(this.scheduleData)
        .filter(dateKey => !this.isDatePast(dateKey))
        .sort();
      
      dateKeys.forEach(dateKey => {
        const dayData = this.scheduleData[dateKey];
        const backendDate = this.formatDateForBackend(dateKey);
        const [day, month, year] = backendDate.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[dateObj.getDay()];
        
        const scheduleItem = {
          day: dayName,
          date: backendDate,
          isWorkingDay: dayData.working,
          timeSlots: []
        };
        
        if (dayData.working && dayData.slots.length > 0) {
          scheduleItem.timeSlots = dayData.slots.map(slot => ({
            startTime: this.ensureTimeFormat(slot.startTime),
            endTime: this.ensureTimeFormat(slot.endTime),
            isAvailable: slot.isActive,
            isBooked: slot.isBooked || false
          }));
        }
        
        weeklySchedule.push(scheduleItem);
      });
      
      return weeklySchedule;
    },
    
    loadDayTemplates() {
      const savedTemplates = localStorage.getItem(`dayTemplates_${this.serviceId}`);
      if (savedTemplates) {
        try {
          this.dayTemplates = JSON.parse(savedTemplates);
        } catch (error) {
          this.dayTemplates = {};
        }
      }
    },
    
    autoSaveTemplates() {
      const dateKeys = Object.keys(this.scheduleData)
        .filter(dateKey => !this.isDatePast(dateKey))
        .sort();
      
      dateKeys.forEach(dateKey => {
        const date = new Date(dateKey);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = days[date.getDay()];
        const dayData = this.scheduleData[dateKey];
        
        if (dayData.working && dayData.slots.length > 0) {
          this.dayTemplates[dayKey] = dayData.slots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            isActive: slot.isActive
          }));
        } else {
          this.dayTemplates[dayKey] = [];
        }
      });
      
      localStorage.setItem(`dayTemplates_${this.serviceId}`, JSON.stringify(this.dayTemplates));
    },
    
    // ========== UTILITY METHODS ==========
    isToday(day) {
      const today = new Date();
      return today.getDate() === day &&
             today.getMonth() === this.currentDate.getMonth() &&
             today.getFullYear() === this.currentDate.getFullYear();
    },
    
    isPastDay(day) {
      const dateKey = this.getDateKey(day);
      return this.isDatePast(dateKey);
    },
    
    isDatePast(dateKey) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = new Date(dateKey);
      date.setHours(0, 0, 0, 0);
      return date < today;
    },
    
    prevMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
      this.activeDate = null; // Clear active day when month changes
    },
    
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
      this.activeDate = null; // Clear active day when month changes
    },
    
    getDateKey(day) {
      const year = this.currentDate.getFullYear();
      const month = (this.currentDate.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      return `${year}-${month}-${dayStr}`;
    },
    
    formatDate(dateStr) {
      if (!dateStr) return '';
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return dateStr;
    },
    
    formatDateForBackend(dateKey) {
      const [year, month, day] = dateKey.split('-');
      return `${day}/${month}/${year}`;
    },
    
    formatDateLong(dateKey) {
      const date = new Date(dateKey);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    
    formatTime(timeStr) {
      if (!timeStr) return '09:00';
      if (timeStr === '24:00' || timeStr.startsWith('24:')) {
        return `00:${timeStr.split(':')[1] || '00'}`;
      }
      const [h, m] = timeStr.split(':').map(Number);
      let hour = isNaN(h) ? 9 : h;
      if (hour >= 24) hour = hour % 24;
      if (hour < 0) hour = 0;
      let minute = isNaN(m) ? 0 : m;
      if (minute >= 60) minute = 59;
      if (minute < 0) minute = 0;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    },
    
    formatTimeForInput(timeStr) {
      return this.formatTime(timeStr);
    },
    
    ensureTimeFormat(timeStr) {
      const formatted = this.formatTime(timeStr);
      if (!formatted.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        return '09:00';
      }
      return formatted;
    },
    
    formatTo12Hour(timeStr) {
      if (!timeStr) return '12:00 AM';
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  }
};
</script>
<style scoped>
/* ===== BASE STYLES ===== */
.ultimate-scheduler {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Inter", sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

/* ===== MESSAGES ===== */
.loading, .message {
  padding: 14px 16px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.loading { background: #f1f5f9; color: #64748b; }
.error { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.draft-alert { 
  background: #fffbeb; 
  color: #d97706; 
  border: 1px solid #fef3c7;
  padding: 14px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.close-error, .close-success {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.7;
}
.close-error:hover, .close-success:hover { opacity: 1; }

/* ===== CALENDAR ===== */
.calendar-wrapper {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.nav-btn {
  background: #3b82f6;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #2563eb;
}

.month-year {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  flex: 1;
}

/* Calendar Grid */
.calendar-grid {
  background: #f8fafc;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.85rem;
}

.weekdays div {
  padding: 8px 2px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day {
  aspect-ratio: 1;
  min-height: 45px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  position: relative;
}

.day.empty {
  border: none;
  background: transparent;
  cursor: default;
}

.day.today {
  border-color: #f59e0b;
  background: #fef3c7;
}

.day.past {
  background: #f3f4f6;
  border-color: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

.day.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.day:not(.past):not(.empty):hover {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.day-number {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.day.past .day-number {
  color: #9ca3af;
}

/* BIG COLOR INDICATORS */
.day-indicators-big {
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16px;
}

.booked-indicator-big {
  color: #dc2626;
  font-size: 0.9rem;
  line-height: 1;
  font-weight: bold;
}

.available-indicator-big {
  color: #10b981;
  font-size: 0.9rem;
  line-height: 1;
  font-weight: bold;
}

.off-indicator-big {
  color: #9ca3af;
  font-size: 1.1rem;
  line-height: 1;
  font-weight: bold;
}

.active-highlight {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #3b82f6;
  border-radius: 10px;
  pointer-events: none;
}

.past-overlay {
  position: absolute;
  top: 2px;
  right: 2px;
  color: #9ca3af;
  font-size: 0.7rem;
}

/* BIG COLOR LEGEND */
.big-color-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 15px;
  font-size: 0.85rem;
  color: #64748b;
}

.legend-item-big {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot-big {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid;
}

.active-dot-big {
  background: #3b82f6;
  border-color: #3b82f6;
}

.booked-dot-big {
  background: #dc2626;
  border-color: #dc2626;
}

.available-dot-big {
  background: #10b981;
  border-color: #10b981;
}

.off-dot-big {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* ===== TIMESLOT PANEL ===== */
.timeslot-panel {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

/* Active Day Header */
.active-day-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.day-info h3 {
  margin: 0 0 15px 0;
  font-size: 1.3rem;
  color: #1e293b;
  font-weight: 600;
}

.day-status-badges {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.day-toggle-rectangle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.toggle-rectangle {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toggle-rectangle.working {
  background: #10b981;
  color: white;
}

.toggle-rectangle.off {
  background: #9ca3af;
  color: white;
}

.toggle-rectangle:hover {
  transform: translateY(-2px);
}

.toggle-rectangle i {
  font-size: 0.9rem;
}

.toggle-label {
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
}

.booked-badge {
  background: #fee2e2;
  color: #dc2626;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}

/* ===== TIME SLOTS LIST - FIXED TOGGLE OVERLAP ===== */
.time-slots-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.time-slot-line {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
}

/* SIMPLE ONE LINE LAYOUT */
.slot-compact-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

/* TIME RANGE - MORE SPACE */
.time-range-compact {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  margin-right: 10px; /* ADDED: Space between time and toggle */
}

.booked-time-text {
  font-weight: 600;
  color: #1e40af;
  font-size: 0.9rem;
  white-space: nowrap;
  padding: 0 4px;
}

.edit-time-range {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

/* TIME INPUT - SMALLER */
.time-input {
  width: 78px; /* SLIGHTLY SMALLER */
  min-width: 78px;
  padding: 6px 6px; /* SMALLER PADDING */
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  font-family: 'Inter', monospace;
  color: #1e293b;
  background: white;
  box-sizing: border-box;
  flex-shrink: 0;
}

.time-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.time-separator {
  color: #64748b;
  font-size: 0.9rem;
  padding: 0 2px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* STATUS INDICATOR - SMALLER TOGGLE */
.status-indicator-compact {
  display: flex;
  align-items: center;
  gap: 12px; /* INCREASED: More space before X */
  flex-shrink: 0;
}

.booked-indicator-icon {
  color: #dc2626;
  font-size: 1rem;
  cursor: help;
  flex-shrink: 0;
}

/* TOGGLE SWITCH - SMALLER */
.toggle-container {
  flex-shrink: 0;
}

.toggle-switch-small {
  display: inline-block;
  position: relative;
  width: 32px; /* SMALLER */
  height: 18px; /* SMALLER */
  cursor: pointer;
  flex-shrink: 0;
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
  height: 14px; /* SMALLER */
  width: 14px; /* SMALLER */
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
  transform: translateX(14px); /* SMALLER MOVEMENT */
}

/* ACTIONS */
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  flex-shrink: 0;
  padding: 0;
  transition: all 0.2s;
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

/* ===== ADD SLOT BUTTON ===== */
.add-slot-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.85rem;
  margin-top: 8px;
  width: 100%;
}

.add-slot-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

/* ===== DAY OFF CARD ===== */
.day-off-card {
  text-align: center;
  padding: 30px 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.day-off-card i {
  font-size: 2rem;
  color: #94a3b8;
}

.day-off-card span {
  font-size: 1.1rem;
  font-weight: 600;
}

.make-working-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.make-working-btn:hover {
  background: #2563eb;
}

/* ===== NO SELECTION ===== */
.no-selection {
  background: white;
  border-radius: 10px;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
  margin-top: 20px;
}

.empty-message i {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 15px;
}

.empty-message h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #475569;
  font-weight: 600;
}

.empty-message p {
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  color: #64748b;
}

/* ===== SAVE BUTTON ===== */
.save-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.save-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  min-width: 160px;
  justify-content: center;
}

.save-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== RESPONSIVE DESIGN ===== */

/* DESKTOP: Vertical stacking */
@media (min-width: 768px) {
  .scheduler-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .slot-compact-line {
    gap: 12px;
  }
  
  .time-input {
    width: 80px;
  }
  
  .toggle-switch-small {
    width: 34px;
    height: 19px;
  }
  
  .toggle-slider-small:before {
    height: 15px;
    width: 15px;
  }
  
  .toggle-switch-small input:checked + .toggle-slider-small:before {
    transform: translateX(15px);
  }
}

/* Tablet */
@media (min-width: 480px) and (max-width: 767px) {
  .ultimate-scheduler {
    padding: 15px;
  }
  
  .slot-compact-line {
    gap: 10px;
  }
  
  .time-input {
    width: 76px;
    padding: 5px 5px;
  }
  
  .time-range-compact {
    margin-right: 8px;
  }
  
  .status-indicator-compact {
    gap: 10px;
  }
  
  .toggle-switch-small {
    width: 30px;
    height: 17px;
  }
  
  .toggle-slider-small:before {
    height: 13px;
    width: 13px;
  }
  
  .toggle-switch-small input:checked + .toggle-slider-small:before {
    transform: translateX(13px);
  }
  
  .remove-btn-compact {
    width: 22px;
    height: 22px;
    font-size: 0.85rem;
  }
}

/* Mobile */
@media (max-width: 479px) {
  .ultimate-scheduler {
    padding: 12px;
  }
  
  .calendar-wrapper,
  .timeslot-panel {
    padding: 16px;
  }
  
  /* Mobile Calendar */
  .day {
    min-height: 40px;
  }
  
  .day-number {
    font-size: 0.9rem;
  }
  
  /* Mobile timeslot */
  .slot-compact-line {
    gap: 6px;
  }
  
  .time-input {
    width: 72px;
    padding: 5px 4px;
    font-size: 0.85rem;
  }
  
  .time-range-compact {
    margin-right: 6px;
  }
  
  .booked-time-text {
    font-size: 0.85rem;
    padding: 0 2px;
  }
  
  .time-separator {
    font-size: 0.85rem;
    padding: 0 1px;
  }
  
  .status-indicator-compact {
    gap: 8px;
  }
  
  .toggle-switch-small {
    width: 28px;
    height: 16px;
  }
  
  .toggle-slider-small:before {
    height: 12px;
    width: 12px;
  }
  
  .toggle-switch-small input:checked + .toggle-slider-small:before {
    transform: translateX(12px);
  }
  
  .remove-btn-compact {
    width: 22px;
    height: 22px;
    font-size: 0.85rem;
  }
  
  /* Mobile legend */
  .big-color-legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 14px;
    justify-items: start;
    font-size: 0.8rem;
  }
  
  .legend-dot-big {
    width: 16px;
    height: 16px;
  }
}

/* Small Phones (iPhone SE) */
@media (max-width: 374px) {
  .day {
    min-height: 36px;
  }
  
  .slot-compact-line {
    gap: 4px;
  }
  
  .time-input {
    width: 68px;
    padding: 4px 3px;
    font-size: 0.8rem;
  }
  
  .time-range-compact {
    margin-right: 4px;
  }
  
  .booked-time-text {
    font-size: 0.8rem;
    padding: 0 1px;
  }
  
  .time-separator {
    font-size: 0.8rem;
  }
  
  .status-indicator-compact {
    gap: 6px;
  }
  
  .toggle-switch-small {
    width: 26px;
    height: 15px;
  }
  
  .toggle-slider-small:before {
    height: 11px;
    width: 11px;
  }
  
  .toggle-switch-small input:checked + .toggle-slider-small:before {
    transform: translateX(11px);
  }
  
  .remove-btn-compact {
    width: 20px;
    height: 20px;
    font-size: 0.8rem;
  }
}
</style>