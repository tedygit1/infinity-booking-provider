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

    <!-- Service Status Alert - FIXED: Changed existingSlotId to hasExistingSlot -->
    <div v-if="!hasExistingSlot" class="draft-alert">
      <i class="fas fa-clock"></i>
      <div class="alert-content">
        <strong>here are your schedules </strong>
        <p>you can edit your schedules any time you want a change,add,delete of schedules</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading" class="scheduler-container">
      <!-- Always visible Calendar -->
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

        <!-- Scrollable Calendar Grid -->
        <div class="calendar-scroll">
          <div class="calendar-grid">
            <!-- Week Days -->
            <div class="weekdays">
              <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">
                {{ day }}
              </div>
            </div>

            <!-- Days - Scrollable -->
            <div class="days-grid">
              <!-- Empty Days -->
              <div v-for="n in firstDayOffset" :key="'empty-' + n" class="day empty"></div>
              
              <!-- Actual Days - Only future/current days -->
              <div
                v-for="day in daysInMonth"
                :key="day"
                class="day"
                :class="{
                  'today': isToday(day),
                  'selected': isSelected(day),
                  'working': isWorkingDay(day),
                  'past': isPastDay(day)
                }"
                @click="!isPastDay(day) && selectDay(day)"
              >
                <div class="day-number">{{ day }}</div>
                <div v-if="isPastDay(day)" class="past-overlay">
                  <i class="fas fa-lock"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Days Schedule (Horizontal Scroll) -->
      <div v-if="selectedDaysData.length > 0" class="selected-days-wrapper">
        <div class="selected-header">
          <h3>Selected Days Schedule</h3>
          <div class="selected-count">{{ selectedDaysData.length }} day{{ selectedDaysData.length > 1 ? 's' : '' }} selected</div>
        </div>

        <!-- Horizontal Scroll for Days -->
        <div class="days-horizontal-scroll">
          <div v-for="dayData in selectedDaysData" :key="dayData.dateKey" class="day-card">
            <!-- Day Header with Toggle on Left -->
            <div class="day-card-header">
              <!-- Small Rectangle Toggle on Left -->
              <div 
                class="day-toggle-left"
                @click="toggleDayOff(dayData.dateKey)"
                :title="dayData.working ? 'Working Day - Click to set as Day Off' : 'Day Off - Click to set as Working Day'"
              >
                <div class="toggle-rectangle" :class="{ 'working': dayData.working, 'off': !dayData.working }">
                  <i v-if="dayData.working" class="fas fa-check"></i>
                  <i v-else class="fas fa-minus"></i>
                </div>
              </div>
              
              <div class="day-date-info">
                <div class="day-date">{{ dayData.formattedDateShort }}</div>
                <div class="day-week">{{ dayData.dayOfWeek }}</div>
              </div>
            </div>

            <!-- Time Slots -->
            <div v-if="dayData.working" class="time-slots-list">
              <div v-for="(slot, index) in dayData.slots" :key="index" class="time-slot-line">
                <!-- COMPACT SINGLE LINE LAYOUT - FROM WORKING CODE -->
                <div class="slot-compact-line">
                  <!-- TIME RANGE - MORE SPACE -->
                  <div class="time-range-compact">
                    <i class="fas fa-clock slot-icon" :class="{
                      'booked-slot-icon': slot.isBooked,
                      'available-slot-icon': !slot.isBooked && slot.isActive,
                      'unavailable-slot-icon': !slot.isBooked && !slot.isActive
                    }"></i>
                    
                    <!-- For booked slots -->
                    <span v-if="slot.isBooked" class="booked-time-text">
                      {{ formatTo12Hour(slot.startTime) }} – {{ formatTo12Hour(slot.endTime) }}
                    </span>
                    
                    <!-- For editable slots -->
                    <span v-else class="edit-time-range">
                      <div class="time-input-wrapper">
                        <input
                          type="time"
                          :value="formatTime(slot.startTime)"
                          @input="updateTimeSlot(dayData.dateKey, index, 'startTime', $event.target.value)"
                          class="time-input"
                          @change="validateTimeSlot(dayData.dateKey, index)"
                        />
                      </div>
                      <span class="time-separator">–</span>
                      <div class="time-input-wrapper">
                        <input
                          type="time"
                          :value="formatTime(slot.endTime)"
                          @input="updateTimeSlot(dayData.dateKey, index, 'endTime', $event.target.value)"
                          class="time-input"
                          @change="validateTimeSlot(dayData.dateKey, index)"
                        />
                      </div>
                    </span>
                  </div>

                  <!-- STATUS INDICATOR - FROM WORKING CODE -->
                  <div class="status-indicator-compact">
                    <!-- BOOKED -->
                    <div v-if="slot.isBooked" class="booked-indicator">
                      <span class="status-dot booked-dot" title="BOOKED"></span>
                    </div>
                    
                    <!-- AVAILABLE/UNAVAILABLE TOGGLE SWITCH - FROM WORKING CODE -->
                    <div v-else class="toggle-container">
                      <label class="toggle-switch-small" 
                             :title="slot.isActive ? 'Available - Click to make unavailable' : 'Unavailable - Click to make available'">
                        <input
                          type="checkbox"
                          :checked="slot.isActive"
                          @change="toggleSlotActive(dayData.dateKey, index)"
                        />
                        <span class="toggle-slider-small"></span>
                      </label>
                    </div>
                  </div>

                  <!-- ERROR & REMOVE - FROM WORKING CODE -->
                  <div class="actions-compact">
                    <div v-if="slot.hasError" class="error-indicator" :title="slot.errorMessage">
                      <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <button
                      class="remove-btn-compact"
                      @click="removeSlot(dayData.dateKey, index)"
                      :disabled="dayData.slots.length === 1 || slot.isBooked"
                      :title="slot.isBooked ? 'Cannot remove booked slot' : 'Remove time slot'"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Add Slot Button -->
              <button @click="addSlotToDay(dayData.dateKey)" class="add-slot-btn">
                <i class="fas fa-plus"></i> Add Time Slot
              </button>
            </div>

            <!-- Day Off Message -->
            <div v-else class="day-off-card">
              <i class="fas fa-moon"></i>
              <span>Day Off</span>
              <button @click="toggleDayOff(dayData.dateKey)" class="make-working-btn">
                Set Working
              </button>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="save-section">
          <button 
            @click="saveAllChanges" 
            class="save-btn"
            :disabled="!hasChanges || saving"
          >
            <i v-if="saving" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ saving ? 'Saving...' : 'Save Schedule' }}
          </button>
          <button 
    @click="testBackendDirect" 
    class="test-btn"
    style="margin-left: 10px; background: #f59e0b;"
  >
    <i class="fas fa-vial"></i>
    Test Backend
  </button>
        </div>
      </div>

      <!-- No Selection Message -->
      <div v-else class="no-selection">
        <div class="empty-message">
          <i class="fas fa-calendar-alt"></i>
          <h3>No Days Selected</h3>
          <p>Click on future dates in the calendar to schedule</p>
          <p class="past-note"><i class="fas fa-info-circle"></i> Past dates are locked</p>
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
      selectedDaysData: [],
      hasChanges: false,
      
      mainSlotId: null,
      allSlots: [],
      bookedSlots: [],
      loadingBookings: false,
      
      // Template system from old code
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
      return new Date(year, month, 1).getDay();
    },
    
    selectedDays() {
      return Object.keys(this.scheduleData).filter(dateKey => 
        this.scheduleData[dateKey] && this.isDateInCurrentMonth(dateKey)
      );
    },
    
    hasExistingSlot() {
      return !!this.mainSlotId;
    }
  },
  async created() {
    console.log('🔍 Service ID:', this.serviceId);
    // Load day templates first
    this.loadDayTemplates();
    await this.loadData();
    await this.fetchBookedSlots();
  },
  watch: {
    scheduleData: {
      deep: true,
      handler() {
        this.updateSelectedDaysData();
        this.hasChanges = true;
      }
    }
  },
  methods: {
    // ========== LOAD DATA ==========
    async loadData() {
      this.loading = true;
      try {
        console.log('📥 Loading from:', `/services/${this.serviceId}/slots`);
        
        const response = await http.get(`/services/${this.serviceId}/slots`);
        this.allSlots = response.data || [];
        
        console.log('📦 Response:', this.allSlots);
        
        if (this.allSlots.length > 0) {
          this.mainSlotId = this.allSlots[0]._id || this.allSlots[0].slotId;
          this.loadScheduleFromSlot(this.allSlots[0]);
        } else {
          this.scheduleData = {};
        }
        
        this.updateSelectedDaysData();
        
      } catch (error) {
        console.error('❌ Load error:', error);
        if (error.response?.status !== 404) {
          this.error = error.response?.data?.message || 'Failed to load schedule';
        }
      } finally {
        this.loading = false;
      }
    },
    
    loadScheduleFromSlot(slot) {
      this.scheduleData = {};
      
      console.log('🔍 Slot structure:', slot);
      
      // Check for weeklySchedule (from old working code)
      const scheduleData = slot.weeklySchedule || slot.slots || [];
      
      console.log('📅 Schedule data found:', scheduleData);
      
      scheduleData.forEach(daySchedule => {
        if (daySchedule && daySchedule.date) {
          const dateKey = this.formatDate(daySchedule.date);
          
          if (!this.isDatePast(dateKey)) {
            this.scheduleData[dateKey] = {
              working: daySchedule.isWorkingDay !== false,
              slots: []
            };
            
            if (daySchedule.isWorkingDay && Array.isArray(daySchedule.timeSlots)) {
              console.log(`📋 Loading timeSlots for ${dateKey}:`, daySchedule.timeSlots);
              
              this.scheduleData[dateKey].slots = daySchedule.timeSlots.map(ts => {
                const slotData = {
                  startTime: this.formatTime(ts.startTime),
                  endTime: this.formatTime(ts.endTime),
                  isActive: ts.isAvailable !== false,  // Map isAvailable to isActive
                  isBooked: ts.isBooked || false,
                  hasError: false,
                  errorMessage: ''
                };
                console.log(`   Slot ${ts.startTime}-${ts.endTime}: isAvailable=${ts.isAvailable}, isActive=${slotData.isActive}`);
                return slotData;
              });
            }
          }
        }
      });
      
      console.log('📊 Processed schedule data:', this.scheduleData);
    },
    
    // ========== TEMPLATE SYSTEM FROM OLD CODE ==========
    loadDayTemplates() {
      const savedTemplates = localStorage.getItem(`dayTemplates_${this.serviceId}`);
      if (savedTemplates) {
        try {
          this.dayTemplates = JSON.parse(savedTemplates);
          console.log('Loaded templates from localStorage:', this.dayTemplates);
        } catch (error) {
          console.warn('Could not load day templates:', error);
          this.dayTemplates = {};
        }
      } else {
        console.log('No saved templates found in localStorage');
        this.dayTemplates = {};
      }
    },
    
    saveDayTemplates() {
      try {
        localStorage.setItem(`dayTemplates_${this.serviceId}`, JSON.stringify(this.dayTemplates));
        console.log('Saved templates to localStorage:', this.dayTemplates);
      } catch (error) {
        console.warn('Could not save day templates:', error);
      }
    },
    
    autoSaveTemplates() {
      console.log('Auto-saving templates from current schedule...');
      
      // Get all selected dates and save their templates
      const dateKeys = Object.keys(this.scheduleData)
        .filter(dateKey => !this.isDatePast(dateKey))
        .sort();
      
      dateKeys.forEach(dateKey => {
        const date = new Date(dateKey);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = days[date.getDay()];
        const dayData = this.scheduleData[dateKey];
        
        if (dayData.working && dayData.slots.length > 0) {
          // Working day with slots
          this.dayTemplates[dayKey] = dayData.slots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            isActive: slot.isActive
          }));
          console.log(`Saved template for ${dayKey}:`, this.dayTemplates[dayKey]);
        } else {
          // Day off (empty array)
          this.dayTemplates[dayKey] = [];
          console.log(`Saved ${dayKey} as Day Off (empty array)`);
        }
      });
      
      this.saveDayTemplates();
    },
    
    // ========== SAVE CHANGES - WITH REDIRECT/CLOSE ==========
    async saveAllChanges() {
      if (this.saving) return;
      
      console.log('🔍 ========== SAVE STARTED ==========');
      this.saving = true;
      this.error = '';
      this.success = '';
      
      try {
        // First save templates (from old working code)
        this.autoSaveTemplates();
        
        // Build weekly schedule
        const weeklySchedule = this.buildWeeklySchedule();
        console.log('📅 Built weeklySchedule (raw):', weeklySchedule);
        console.log('📅 Built weeklySchedule (JSON):', JSON.stringify(weeklySchedule, null, 2));
        
        if (weeklySchedule.length === 0) {
          throw new Error('No schedule data to save');
        }
        
        // Use old working code structure
        const slotData = {
          slotId: this.mainSlotId || `slot_${Date.now()}`,
          slotLabel: `${this.serviceId} Schedule`,
          isActive: true,
          weeklySchedule: weeklySchedule
        };
        
        console.log('🔧 Slot data prepared:', slotData);
        
        let response;
        
        if (!this.mainSlotId) {
          console.log('🚀 Creating NEW slot...');
          
          // CREATE payload: Wrap in "slots" array (from old working code)
          const createPayload = {
            slots: [slotData]
          };
          
          console.log('📤 CREATE Payload:', JSON.stringify(createPayload, null, 2));
          
          response = await http.post(
            `/services/${this.serviceId}/slots`,
            createPayload
          );
          
          console.log('✅ CREATE successful:', response.data);
          this.mainSlotId = response.data[0]?.slotId || response.data[0]?._id || slotData.slotId;
          
        } else {
          console.log('✏️ Updating EXISTING slot...');
          
          // UPDATE payload: Direct object with weeklySchedule (from old working code)
          const updatePayload = {
            slotLabel: slotData.slotLabel,
            isActive: slotData.isActive,
            weeklySchedule: slotData.weeklySchedule
          };
          
          console.log('📤 UPDATE Payload:', JSON.stringify(updatePayload, null, 2));
          
          response = await http.put(
            `/services/${this.serviceId}/slots/${this.mainSlotId}`,
            updatePayload
          );
          
          console.log('✅ UPDATE successful:', response.data);
        }
        
        console.log('✅ Response:', response.data);
        this.success = 'Schedule saved successfully! Your schedule will repeat weekly.';
        this.hasChanges = false;
        
        // 🚀 EMIT EVENTS FOR PARENT COMPONENT
        this.$emit('saved');      // Notify parent that save was successful
        this.$emit('close');      // Tell parent to close the modal/dialog
        
        // Reload data
        await this.loadData();
        await this.fetchBookedSlots();
        
        // 🚀 AUTO-CLOSE/REDIRECT AFTER 2 SECONDS
        setTimeout(() => {
          this.$emit('close'); // Emit close event again to ensure parent closes
          
          // If using Vue Router and you want to redirect to services page
          // this.$router.push('/provider/services');
        }, 2000);
        
      } catch (error) {
        console.error('❌ ========== SAVE FAILED ==========');
        console.error('📋 ERROR:', error);
        
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
          console.error('URL:', error.config?.url);
          
          if (error.response.data?.message) {
            this.error = Array.isArray(error.response.data.message) 
              ? error.response.data.message.join(', ')
              : error.response.data.message;
          } else if (error.response.data?.error) {
            this.error = error.response.data.error;
          } else {
            this.error = `Server error: ${error.response.status}`;
          }
          
          // Show request data for debugging
          if (error.config?.data) {
            try {
              console.error('Request that failed:', JSON.parse(error.config.data));
            } catch (e) {
              console.error('Request that failed (raw):', error.config.data);
            }
          }
          
        } else {
          this.error = error.message;
        }
        
      } finally {
        this.saving = false;
        console.log('🔍 ========== SAVE FINISHED ==========');
      }
    },
    
    // ========== BUILD WEEKLY SCHEDULE ==========
    buildWeeklySchedule() {
      const weeklySchedule = [];
      
      const dateKeys = Object.keys(this.scheduleData)
        .filter(dateKey => !this.isDatePast(dateKey))
        .sort();
      
      console.log('📅 Date keys to process:', dateKeys);
      
      if (dateKeys.length === 0) {
        console.log('⚠️ No future dates selected');
        return [];
      }
      
      dateKeys.forEach(dateKey => {
        const dayData = this.scheduleData[dateKey];
        const backendDate = this.formatDateForBackend(dateKey);
        
        // Get day name in lowercase
        const [day, month, year] = backendDate.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[dateObj.getDay()];
        
        const scheduleItem = {
          day: dayName,
          date: backendDate, // DD/MM/YYYY format
          isWorkingDay: dayData.working,
          timeSlots: []
        };
        
        // Only add timeSlots if it's a working day
        if (dayData.working && dayData.slots.length > 0) {
          console.log(`📋 Building timeSlots for ${dateKey}:`, dayData.slots);
          
          // Validate and format each time slot
          scheduleItem.timeSlots = dayData.slots.map(slot => {
            const timeSlotData = {
              startTime: this.ensureTimeFormat(slot.startTime),
              endTime: this.ensureTimeFormat(slot.endTime),
              isAvailable: slot.isActive,  // Map isActive back to isAvailable
              isBooked: slot.isBooked || false
            };
            console.log(`   Slot ${slot.startTime}-${slot.endTime}: isActive=${slot.isActive}, isAvailable=${timeSlotData.isAvailable}`);
            return timeSlotData;
          });
        }
        
        weeklySchedule.push(scheduleItem);
      });
      
      console.log('🔧 Final weeklySchedule built:', JSON.stringify(weeklySchedule, null, 2));
      return weeklySchedule;
    },
    
    // ========== CALENDAR METHODS ==========
    prevMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    },
    
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    },
    
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
    
    isSelected(day) {
      const dateKey = this.getDateKey(day);
      return this.scheduleData[dateKey] !== undefined;
    },
    
    isWorkingDay(day) {
      const dateKey = this.getDateKey(day);
      const dayData = this.scheduleData[dateKey];
      return dayData && dayData.working === true;
    },
    
    isDateInCurrentMonth(dateKey) {
      const [year, month] = dateKey.split('-').map(Number);
      const currentYear = this.currentDate.getFullYear();
      const currentMonth = this.currentDate.getMonth() + 1;
      return year === currentYear && month === currentMonth;
    },
    
    isDatePast(dateKey) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = new Date(dateKey);
      date.setHours(0, 0, 0, 0);
      return date < today;
    },
    
    selectDay(day) {
      const dateKey = this.getDateKey(day);
      
      if (this.isDatePast(dateKey)) {
        this.error = 'Cannot schedule past dates';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      if (!this.scheduleData[dateKey]) {
        // Check if we have a template for this day of week
        const date = new Date(dateKey);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayKey = days[date.getDay()];
        
        if (this.dayTemplates[dayKey] && this.dayTemplates[dayKey].length > 0) {
          // Use template if it exists
          this.scheduleData[dateKey] = {
            working: true,
            slots: JSON.parse(JSON.stringify(this.dayTemplates[dayKey]))
          };
          console.log(`Selected ${dateKey} using template for ${dayKey}`);
        } else {
          // Use defaults
          this.scheduleData[dateKey] = {
            working: true,
            slots: JSON.parse(JSON.stringify(this.defaultTimeSlots))
          };
        }
      }
      
      this.updateSelectedDaysData();
    },
    
    updateSelectedDaysData() {
      this.selectedDaysData = this.selectedDays
        .map(dateKey => {
          const date = new Date(dateKey);
          const dayData = this.scheduleData[dateKey];
          
          return {
            dateKey,
            working: dayData.working,
            slots: [...dayData.slots],
            formattedDateShort: this.formatDateShort(dateKey),
            dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' })
          };
        })
        .sort((a, b) => new Date(a.dateKey) - new Date(b.dateKey));
    },
    
    toggleDayOff(dateKey) {
      if (this.isDatePast(dateKey)) {
        this.error = 'Cannot modify past dates';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      const dayData = this.scheduleData[dateKey];
      if (dayData) {
        dayData.working = !dayData.working;
        
        if (dayData.working && dayData.slots.length === 0) {
          // Check for template
          const date = new Date(dateKey);
          const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const dayKey = days[date.getDay()];
          
          if (this.dayTemplates[dayKey] && this.dayTemplates[dayKey].length > 0) {
            dayData.slots = JSON.parse(JSON.stringify(this.dayTemplates[dayKey]));
          } else {
            dayData.slots = JSON.parse(JSON.stringify(this.defaultTimeSlots));
          }
        } else if (!dayData.working) {
          dayData.slots = [];
        }
        
        this.updateSelectedDaysData();
      }
    },
    
    addSlotToDay(dateKey) {
      if (this.isDatePast(dateKey)) {
        this.error = 'Cannot modify past dates';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      const dayData = this.scheduleData[dateKey];
      if (dayData && dayData.working) {
        const slots = dayData.slots;
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
        
        dayData.slots.push({ 
          startTime: this.formatTime(newStartTime), 
          endTime: this.formatTime(newEndTime), 
          isActive: true, 
          isBooked: false,
          hasError: false
        });
      }
    },
    
    removeSlot(dateKey, index) {
      if (this.isDatePast(dateKey)) {
        this.error = 'Cannot modify past dates';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      const dayData = this.scheduleData[dateKey];
      if (dayData && dayData.working && dayData.slots.length > 1) {
        const slot = dayData.slots[index];
        if (!slot.isBooked) {
          dayData.slots.splice(index, 1);
        }
      }
    },
    
    toggleSlotActive(dateKey, index) {
      if (this.isDatePast(dateKey)) {
        this.error = 'Cannot modify past dates';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      const dayData = this.scheduleData[dateKey];
      if (dayData && dayData.working) {
        const slot = dayData.slots[index];
        if (slot && !slot.isBooked) {
          slot.isActive = !slot.isActive;
        }
      }
    },
    
    updateTimeSlot(dateKey, index, field, newValue) {
      if (this.isDatePast(dateKey)) {
        this.error = 'Cannot modify past dates';
        setTimeout(() => this.error = '', 3000);
        return;
      }
      
      const dayData = this.scheduleData[dateKey];
      if (dayData && dayData.working) {
        const slot = dayData.slots[index];
        if (slot && !slot.isBooked && newValue && newValue.length === 5) {
          const oldValue = slot[field];
          slot[field] = this.formatTime(newValue);
          
          if (!this.validateTimeSlot(dateKey, index)) {
            slot[field] = oldValue;
          }
        }
      }
    },
    
    validateTimeSlot(dateKey, index) {
      const dayData = this.scheduleData[dateKey];
      if (dayData && dayData.working) {
        const slot = dayData.slots[index];
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
      }
      return false;
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
        
        this.markBookedSlotsInSchedule();
        
      } catch (error) {
        console.error('Failed to fetch booked slots:', error);
      } finally {
        this.loadingBookings = false;
      }
    },
    
    markBookedSlotsInSchedule() {
      Object.keys(this.scheduleData).forEach(dateKey => {
        const dayData = this.scheduleData[dateKey];
        if (dayData && dayData.working) {
          const backendDate = this.formatDateForBackend(dateKey);
          const bookingsForDay = this.bookedSlots.filter(b => b.date === backendDate);
          
          bookingsForDay.forEach(booking => {
            const existingSlot = dayData.slots.find(slot => 
              slot.startTime === booking.startTime && slot.endTime === booking.endTime
            );
            
            if (existingSlot) {
              existingSlot.isBooked = true;
              existingSlot.isActive = false;
            }
          });
        }
      });
      
      this.updateSelectedDaysData();
    },
    
    // ========== UTILITY METHODS ==========
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
    
    formatDateShort(dateKey) {
      const date = new Date(dateKey);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    },
    
    // ========== CANCEL/CLOSE METHOD ==========
    handleCancel() {
      this.$emit('close');
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

/* Scrollable Calendar */
.calendar-scroll {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;
}

.calendar-grid {
  background: #f8fafc;
  border-radius: 8px;
  padding: 15px;
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
  position: sticky;
  top: 0;
  background: #f8fafc;
  z-index: 1;
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

.day.selected {
  border-color: #10b981;
  background: #d1fae5;
}

.day.working {
  border-color: #10b981;
}

.day.past {
  background: #f3f4f6;
  border-color: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
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

.past-overlay {
  position: absolute;
  top: 2px;
  right: 2px;
  color: #9ca3af;
  font-size: 0.7rem;
}

/* ===== SELECTED DAYS ===== */
.selected-days-wrapper {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

.selected-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.selected-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #1e293b;
  font-weight: 600;
}

.selected-count {
  background: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Horizontal Scroll */
.days-horizontal-scroll {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 5px 20px;
  margin: 0 -5px;
}

/* Day Card */
.day-card {
  min-width: 320px;
  background: white;
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  flex-shrink: 0;
}

/* Day Header */
.day-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

/* Toggle Rectangle */
.day-toggle-left {
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-rectangle {
  width: 36px;
  height: 36px;
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
  font-size: 1rem;
}

/* Day Date */
.day-date-info {
  flex: 1;
}

.day-date {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.day-week {
  font-size: 0.85rem;
  color: #64748b;
}

/* ===== TIME SLOTS LIST ===== */
.time-slots-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* TIME SLOT LINE - COMPACT SINGLE LINE */
.time-slot-line {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.2s ease;
}

.time-slot-line.booked-slot {
  background: #fef2f2;
  border-color: #fecaca;
}

.time-slot-line.available-slot {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.time-slot-line.unavailable-slot {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.time-slot-line.has-error {
  border-color: #f87171;
  background: #fff1f1;
}

/* COMPACT SINGLE LINE LAYOUT */
.slot-compact-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  flex-wrap: nowrap;
}

/* TIME RANGE COMPACT - FROM WORKING CODE */
.time-range-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.slot-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
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
  border-radius: 6px;
  font-size: 0.85rem;
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
  flex-shrink: 0;
  padding: 0 2px;
  white-space: nowrap;
  margin: 0 2px;
}

/* STATUS INDICATOR COMPACT - FROM WORKING CODE */
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

/* SMALLER TOGGLE SWITCH - FROM WORKING CODE */
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
  transform: translateX(10px);
}

/* ACTIONS COMPACT - FROM WORKING CODE */
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
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.day-off-card i {
  font-size: 1.5rem;
  color: #94a3b8;
}

.make-working-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.make-working-btn:hover {
  background: #2563eb;
}

/* ===== NO SELECTION ===== */
.no-selection {
  background: white;
  border-radius: 10px;
  padding: 30px 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.empty-message i {
  font-size: 2.5rem;
  color: #cbd5e1;
  margin-bottom: 10px;
}

.empty-message h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #475569;
}

.empty-message p {
  margin: 0 0 6px 0;
  font-size: 0.9rem;
  color: #64748b;
}

.past-note {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.past-note i {
  font-size: 0.9rem;
  margin: 0;
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

/* Desktop (≥768px) */
@media (min-width: 768px) {
  .slot-compact-line {
    gap: 12px;
  }
  
  .time-range-compact {
    flex: 0 0 220px;
  }
  
  .time-input {
    width: 85px;
  }
  
  .booked-time-text {
    min-width: 180px;
  }
}

/* Tablet (480px-768px) */
@media (max-width: 768px) and (min-width: 480px) {
  .days-horizontal-scroll {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .day-card {
    min-width: auto;
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
    padding: 5px 6px;
  }
  
  .booked-time-text {
    min-width: 160px;
  }
}

/* Mobile (<480px) */
@media (max-width: 480px) {
  .ultimate-scheduler {
    padding: 10px;
  }
  
  .calendar-wrapper,
  .selected-days-wrapper {
    padding: 15px;
  }
  
  .days-horizontal-scroll {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .day-card {
    min-width: auto;
    padding: 12px;
  }
  
  .slot-compact-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: nowrap;
  }
  
  .time-range-compact {
    min-width: 160px;
  }
  
  .booked-time-text {
    min-width: 140px;
    font-size: 0.85rem;
  }
  
  .edit-time-range {
    gap: 4px;
  }
  
  .time-input {
    width: 75px;
    padding: 5px 4px;
  }
  
  .toggle-switch-small {
    width: 30px;
    height: 18px;
  }
  
  .toggle-slider-small:before {
    height: 14px;
    width: 14px;
  }
  
  .toggle-switch-small input:checked + .toggle-slider-small:before {
    transform: translateX(12px);
  }
}

/* Extra Small Mobile (<360px) */
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
    padding: 4px 3px;
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
}

/* Hover effects */
.time-slot-line:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transform: translateY(-1px);
}
</style>