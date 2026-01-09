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
        <p>Click on calendar days to set your working hours.</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading" class="scheduler-container">
      <!-- Calendar Section -->
      <div class="calendar-section">
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
                
                <!-- BIG COLOR INDICATORS -->
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

          <!-- Mobile Color Legend -->
          <div class="mobile-color-legend">
            <div class="legend-row">
              <div class="legend-item-mobile">
                <div class="legend-dot-mobile active-dot-mobile"></div>
                <span>Selected</span>
              </div>
              <div class="legend-item-mobile">
                <div class="legend-dot-mobile booked-dot-mobile"></div>
                <span>Booked</span>
              </div>
            </div>
            <div class="legend-row">
              <div class="legend-item-mobile">
                <div class="legend-dot-mobile available-dot-mobile"></div>
                <span>Available</span>
              </div>
              <div class="legend-item-mobile">
                <div class="legend-dot-mobile off-dot-mobile"></div>
                <span>Day Off</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeslot Panel for Active Day -->
      <div v-if="activeDate" class="timeslot-panel">
        <!-- Mobile Active Day Header -->
        <div class="mobile-day-header">
          <div class="mobile-day-info">
            <h3>{{ formatDateShort(activeDate) }}</h3>
            <div class="mobile-day-status">
              <div class="day-toggle-mobile" @click="toggleActiveDayOff()">
                <div class="toggle-circle" :class="{ 'working': activeDayData.working, 'off': !activeDayData.working }">
                  <i v-if="activeDayData.working" class="fas fa-check"></i>
                  <i v-else class="fas fa-minus"></i>
                </div>
                <span>{{ activeDayData.working ? 'Working Day' : 'Day Off' }}</span>
              </div>
              
              <div v-if="hasBookingsForActiveDay()" class="mobile-booked-badge">
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
            <!-- MOBILE COMPACT LAYOUT -->
            <div class="slot-mobile-line">
              <!-- Icon Column -->
              <div class="slot-icon-column">
                <i class="fas fa-clock slot-icon" :class="{
                  'booked-slot-icon': slot.isBooked,
                  'available-slot-icon': !slot.isBooked && slot.isActive,
                  'unavailable-slot-icon': !slot.isBooked && !slot.isActive
                }"></i>
              </div>
              
              <!-- Time Column -->
              <div class="slot-time-column">
                <!-- For booked slots -->
                <div v-if="slot.isBooked" class="booked-slot-mobile">
                  <div class="booked-time-mobile">
                    {{ formatTo12Hour(slot.startTime) }} – {{ formatTo12Hour(slot.endTime) }}
                  </div>
                  <div class="booked-label-mobile">
                    <i class="fas fa-calendar-check"></i> Booked
                  </div>
                </div>
                
                <!-- For editable slots -->
                <div v-else class="editable-slot-mobile">
                  <div class="time-inputs-mobile">
                    <div class="time-input-group-mobile">
                      <label>Start</label>
                      <input
                        type="time"
                        :value="formatTimeForInput(slot.startTime)"
                        @input="updateSlotTime(index, 'startTime', $event.target.value)"
                        class="time-input-mobile"
                        @change="validateActiveSlot(index)"
                      />
                    </div>
                    
                    <div class="time-separator-mobile">–</div>
                    
                    <div class="time-input-group-mobile">
                      <label>End</label>
                      <input
                        type="time"
                        :value="formatTimeForInput(slot.endTime)"
                        @input="updateSlotTime(index, 'endTime', $event.target.value)"
                        class="time-input-mobile"
                        @change="validateActiveSlot(index)"
                      />
                    </div>
                  </div>
                  
                  <div class="slot-actions-mobile">
                    <!-- Toggle Switch -->
                    <label class="toggle-switch-mobile">
                      <input
                        type="checkbox"
                        :checked="slot.isActive"
                        @change="toggleSlotActiveInActiveDay(index)"
                      />
                      <span class="toggle-slider-mobile"></span>
                    </label>
                    
                    <!-- Remove Button -->
                    <button
                      class="remove-btn-mobile"
                      @click="removeSlotFromActiveDay(index)"
                      :disabled="activeDayData.slots.length === 1 || slot.isBooked"
                      title="Remove"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Error Message -->
            <div v-if="slot.hasError" class="slot-error-mobile">
              <i class="fas fa-exclamation-triangle"></i>
              {{ slot.errorMessage }}
            </div>
          </div>

          <!-- Add Slot Button -->
          <button @click="addSlotToActiveDay()" class="add-slot-btn-mobile">
            <i class="fas fa-plus"></i> Add Time Slot
          </button>
        </div>

        <!-- Day Off Message -->
        <div v-else class="day-off-card-mobile">
          <div class="day-off-content-mobile">
            <i class="fas fa-moon"></i>
            <div class="day-off-text">
              <h4>Day Off</h4>
              <p>No appointments available on this day</p>
            </div>
            <button @click="toggleActiveDayOff()" class="make-working-btn-mobile">
              Set Working
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="save-section-mobile">
          <button 
            @click="saveActiveDayChanges()" 
            class="save-btn-mobile"
            :disabled="!hasChanges || saving"
          >
            <i v-if="saving" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ saving ? 'Saving...' : 'Save Schedule' }}
          </button>
        </div>
      </div>

      <!-- No Selection Message -->
      <div v-else class="no-selection-mobile">
        <div class="empty-message-mobile">
          <i class="fas fa-calendar-alt"></i>
          <h3>Select a Day</h3>
          <p>Tap on any future date to set working hours</p>
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
    
    formatDateShort(dateKey) {
      const date = new Date(dateKey);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
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
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
  -webkit-tap-highlight-color: transparent;
}

/* ===== MESSAGES ===== */
.loading, .message {
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.loading { background: #f1f5f9; color: #64748b; }
.error { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.draft-alert { 
  background: #fffbeb; 
  color: #d97706; 
  border: 1px solid #fef3c7;
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 14px;
}
.close-error, .close-success {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.7;
}

/* ===== CALENDAR SECTION ===== */
.calendar-section {
  width: 100%;
  margin-bottom: 24px;
}

.calendar-wrapper {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  width: 100%;
}

/* Month Navigation - Mobile Friendly */
.month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.nav-btn {
  background: #3b82f6;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 18px;
}

.nav-btn:hover {
  background: #2563eb;
}

.month-year {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  flex: 1;
  padding: 0 10px;
}

/* Calendar Grid - Mobile Optimized */
.calendar-grid {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  width: 100%;
  overflow: hidden;
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
  font-size: 12px;
  width: 100%;
}

.weekdays div {
  padding: 6px 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  width: 100%;
}

.day {
  aspect-ratio: 1;
  min-height: 0;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  position: relative;
  padding: 2px;
  width: 100%;
}

/* Make calendar smaller for mobile */
@media (max-width: 480px) {
  .days-grid {
    gap: 3px;
  }
  
  .day {
    border-width: 1.5px;
    border-radius: 6px;
  }
  
  .day-number {
    font-size: 13px !important;
  }
  
  .weekdays {
    font-size: 11px;
  }
  
  .month-year {
    font-size: 16px;
  }
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
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  width: 100%;
}

.day.past .day-number {
  color: #9ca3af;
}

/* BIG COLOR INDICATORS - Mobile Optimized */
.day-indicators-big {
  position: absolute;
  bottom: 2px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 14px;
}

.booked-indicator-big {
  color: #dc2626;
  font-size: 16px; /* BIG RED DOT for mobile */
  line-height: 1;
  font-weight: bold;
}

.available-indicator-big {
  color: #10b981;
  font-size: 16px; /* BIG GREEN DOT for mobile */
  line-height: 1;
  font-weight: bold;
}

.off-indicator-big {
  color: #9ca3af;
  font-size: 18px; /* BIG GRAY MINUS for mobile */
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
  top: 1px;
  right: 1px;
  color: #9ca3af;
  font-size: 10px;
}

/* Mobile Color Legend */
.mobile-color-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.legend-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.legend-item-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  flex: 1;
}

.legend-dot-mobile {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid;
  flex-shrink: 0;
}

.active-dot-mobile {
  background: #3b82f6;
  border-color: #3b82f6;
}

.booked-dot-mobile {
  background: #dc2626;
  border-color: #dc2626;
}

.available-dot-mobile {
  background: #10b981;
  border-color: #10b981;
}

.off-dot-mobile {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* ===== MOBILE TIMESLOT PANEL ===== */
.timeslot-panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  width: 100%;
}

/* Mobile Day Header */
.mobile-day-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.mobile-day-info h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #1e293b;
  font-weight: 700;
}

.mobile-day-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.day-toggle-mobile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.toggle-circle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.toggle-circle.working {
  background: #10b981;
  color: white;
}

.toggle-circle.off {
  background: #9ca3af;
  color: white;
}

.day-toggle-mobile span {
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

.mobile-booked-badge {
  background: #fee2e2;
  color: #dc2626;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  align-self: flex-start;
}

/* ===== MOBILE TIME SLOTS LIST ===== */
.time-slots-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.time-slot-line {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

/* Mobile Slot Layout */
.slot-mobile-line {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.slot-icon-column {
  flex-shrink: 0;
  padding-top: 4px;
}

.slot-icon {
  font-size: 16px;
}

.booked-slot-icon {
  color: #dc2626;
}

.available-slot-icon {
  color: #22c55e;
}

.unavailable-slot-icon {
  color: #94a3b8;
}

.slot-time-column {
  flex: 1;
  min-width: 0;
}

/* Booked Slot Mobile */
.booked-slot-mobile {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.booked-time-mobile {
  font-weight: 600;
  color: #1e40af;
  font-size: 14px;
}

.booked-label-mobile {
  color: #dc2626;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

/* Editable Slot Mobile */
.editable-slot-mobile {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-inputs-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.time-input-group-mobile {
  flex: 1;
  min-width: 120px;
}

.time-input-group-mobile label {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 500;
}

.time-input-mobile {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', monospace;
  color: #1e293b;
  background: white;
  -webkit-appearance: none;
  appearance: none;
}

.time-input-mobile:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.time-separator-mobile {
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  padding: 0 4px;
}

.slot-actions-mobile {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

.toggle-switch-mobile {
  position: relative;
  width: 40px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch-mobile input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider-mobile {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ef4444;
  transition: .3s;
  border-radius: 12px;
}

.toggle-slider-mobile:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

.toggle-switch-mobile input:checked + .toggle-slider-mobile {
  background-color: #22c55e;
}

.toggle-switch-mobile input:checked + .toggle-slider-mobile:before {
  transform: translateX(16px);
}

.remove-btn-mobile {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.remove-btn-mobile:hover:not(:disabled) {
  background: #fecaca;
}

.remove-btn-mobile:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Error Message Mobile */
.slot-error-mobile {
  margin-top: 10px;
  background: #fee2e2;
  color: #dc2626;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Add Slot Button Mobile */
.add-slot-btn-mobile {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 14px;
  margin-top: 8px;
  width: 100%;
}

.add-slot-btn-mobile:hover {
  background: #e2e8f0;
  color: #475569;
}

/* ===== DAY OFF CARD MOBILE ===== */
.day-off-card-mobile {
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  padding: 24px 16px;
  margin-bottom: 20px;
}

.day-off-content-mobile {
  text-align: center;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.day-off-content-mobile i {
  font-size: 40px;
  color: #94a3b8;
}

.day-off-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #4b5563;
  font-weight: 700;
}

.day-off-text p {
  margin: 0;
  font-size: 13px;
  color: #9ca3af;
}

.make-working-btn-mobile {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.make-working-btn-mobile:hover {
  background: #2563eb;
}

/* ===== SAVE BUTTON MOBILE ===== */
.save-section-mobile {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.save-btn-mobile {
  background: #10b981;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
  width: 100%;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.save-btn-mobile:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
}

.save-btn-mobile:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ===== NO SELECTION MOBILE ===== */
.no-selection-mobile {
  background: white;
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
  margin-top: 20px;
}

.empty-message-mobile i {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-message-mobile h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #475569;
  font-weight: 700;
}

.empty-message-mobile p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .ultimate-scheduler {
    max-width: 800px;
    padding: 24px;
  }
  
  .calendar-wrapper,
  .timeslot-panel {
    padding: 24px;
  }
  
  .days-grid {
    gap: 6px;
  }
  
  .day {
    min-height: 50px;
  }
  
  .day-number {
    font-size: 15px;
  }
  
  .time-input-group-mobile {
    min-width: 140px;
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  .ultimate-scheduler {
    max-width: 1000px;
  }
  
  .scheduler-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  
  .calendar-section {
    margin-bottom: 0;
  }
  
  .timeslot-panel {
    margin-top: 0;
  }
  
  .mobile-color-legend {
    display: none;
  }
  
  /* Show desktop layout on large screens */
  .days-grid {
    gap: 8px;
  }
  
  .day {
    min-height: 60px;
  }
  
  .day-number {
    font-size: 16px;
  }
}

/* Extra Small Phones (320px - 375px) */
@media (max-width: 375px) {
  .ultimate-scheduler {
    padding: 12px;
  }
  
  .calendar-wrapper,
  .timeslot-panel {
    padding: 16px;
  }
  
  .days-grid {
    gap: 2px;
  }
  
  .day {
    border-radius: 4px;
  }
  
  .day-number {
    font-size: 12px;
  }
  
  .booked-indicator-big,
  .available-indicator-big {
    font-size: 14px;
  }
  
  .off-indicator-big {
    font-size: 16px;
  }
  
  .time-input-group-mobile {
    min-width: 100px;
  }
  
  .time-input-mobile {
    padding: 8px;
    font-size: 13px;
  }
}

/* Landscape Mode */
@media (max-height: 600px) and (orientation: landscape) {
  .calendar-grid {
    padding: 12px;
  }
  
  .days-grid {
    gap: 2px;
  }
  
  .day {
    min-height: 40px;
  }
  
  .day-number {
    font-size: 12px;
  }
  
  .time-slot-line {
    padding: 12px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .ultimate-scheduler {
    background: #0f172a;
  }
  
  .calendar-wrapper,
  .timeslot-panel,
  .no-selection-mobile {
    background: #1e293b;
    border-color: #334155;
  }
  
  .calendar-grid {
    background: #0f172a;
  }
  
  .day {
    background: #1e293b;
    border-color: #334155;
  }
  
  .day-number {
    color: #e2e8f0;
  }
  
  .time-slot-line {
    background: #0f172a;
    border-color: #334155;
  }
  
  .time-input-mobile {
    background: #1e293b;
    border-color: #475569;
    color: #e2e8f0;
  }
  
  .add-slot-btn-mobile {
    background: #1e293b;
    border-color: #475569;
    color: #94a3b8;
  }
}
</style>