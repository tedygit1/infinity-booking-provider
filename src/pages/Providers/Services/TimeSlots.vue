<template>
  <div class="time-slots-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>Loading time slots...</p>
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
      <!-- Slot Configuration Header -->
      <div class="slot-config-header">
        <h3>7-Day Rolling Schedule</h3>
        <p class="schedule-description">
          Set availability for the next 7 days. Customers can book appointments within this window.
        </p>
        <div class="slot-config-controls">
          <label class="config-toggle">
            <input
              type="checkbox"
              v-model="slotConfig.isActive"
            />
            <span class="toggle-label">Active Configuration</span>
          </label>
          <input
            v-model="slotConfig.slotLabel"
            type="text"
            class="slot-label-input"
            placeholder="Schedule Name"
          />
        </div>
      </div>

      <!-- 7-Day Schedule -->
      <div class="weekly-schedule-section">
        <div class="schedule-header">
          <h4>Next 7 Days Availability</h4>
          <div class="date-range">
            {{ currentDateRange }}
          </div>
        </div>

        <p class="section-description">
          Configure time slots for each day. Changes will be saved when you click "Update Time Slots".
        </p>

        <div class="days-grid">
          <div
            v-for="day in generatedDays"
            :key="day.date"
            class="day-card"
            :class="{ 
              'working-day': isWorkingDay(day.date), 
              'day-off': !isWorkingDay(day.date),
              'today': day.isToday 
            }"
          >
            <div class="day-header">
              <label class="day-toggle">
                <input
                  type="checkbox"
                  :checked="isWorkingDay(day.date)"
                  @change="toggleWorkingDay(day.date, $event.target.checked)"
                />
                <span class="day-label">{{ day.display }}</span>
              </label>
              <span v-if="!isWorkingDay(day.date)" class="off-label">Day Off</span>
              <span v-if="day.isToday" class="today-label">Today</span>
            </div>

            <div v-if="isWorkingDay(day.date)" class="time-slots-list">
              <div
                v-for="(timeSlot, slotIndex) in getTimeSlotsForDay(day.date)"
                :key="slotIndex"
                class="time-slot-item"
                :class="{ 'has-error': timeSlot.hasError }"
              >
                <div class="time-inputs">
                  <input
                    v-model="timeSlot.startTime"
                    type="time"
                    class="time-input"
                    @change="validateTimeSlot(timeSlot)"
                  />
                  <span class="time-separator">to</span>
                  <input
                    v-model="timeSlot.endTime"
                    type="time"
                    class="time-input"
                    @change="validateTimeSlot(timeSlot)"
                  />
                </div>
                <div class="slot-actions">
                  <label class="availability-toggle">
                    <input
                      type="checkbox"
                      v-model="timeSlot.isAvailable"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                  <button
                    class="btn-remove-slot"
                    @click="removeTimeSlot(day.date, slotIndex)"
                    :disabled="getTimeSlotsForDay(day.date).length === 1"
                    title="Remove time slot"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
                <div v-if="timeSlot.hasError" class="slot-error">
                  {{ timeSlot.errorMessage }}
                </div>
              </div>

              <button class="btn-add-slot" @click="addTimeSlot(day.date)">
                <i class="fa-solid fa-plus"></i> Add Time Slot
              </button>
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
            {{ saving ? 'Saving...' : 'Update Time Slots' }}
          </button>
          
          <button
            class="btn btn-warning"
            @click="resetToDefault"
            :disabled="saving"
          >
            <i class="fa-solid fa-undo"></i>
            Reset Defaults
          </button>
        </div>
      </div>

      <!-- Debug Info -->
      <div v-if="debugMode" class="debug-info">
        <h5>Debug Info:</h5>
        <p>Has Existing Slot: {{ hasExistingSlot }}</p>
        <p>Slot ID: {{ existingSlotId }}</p>
        <p>Total Days: {{ generatedDays.length }}</p>
        <p>First Day: {{ generatedDays[0]?.display }}</p>
        <p>Last Day: {{ generatedDays[6]?.display }}</p>
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
      debugMode: true,
      
      // Current slot configuration
      slotConfig: {
        slotLabel: '7-Day Rolling Schedule',
        isActive: true
      },
      
      // 7-day rolling schedule
      generatedDays: [],
      
      // Store daily schedules by date
      dailySchedules: {},
      
      // Store existing slots data
      existingSlots: [],
      existingSlotId: null,
      
      // Default time slots configuration - 4 slots instead of 1
      defaultTimeSlots: [
        { startTime: '09:00', endTime: '11:00', isAvailable: true },
        { startTime: '11:00', endTime: '13:00', isAvailable: true },
        { startTime: '14:00', endTime: '16:00', isAvailable: true },
        { startTime: '16:00', endTime: '18:00', isAvailable: true }
      ]
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
            week && 
            week.timeSlots && 
            Array.isArray(week.timeSlots) && 
            week.timeSlots.length > 0
          );
        }
        
        return false;
      });
      
      return hasRealSlots ? 'active' : 'draft';
    }
  },

  async created() {
    await this.initializeTimeSlots();
    this.generate7DaySchedule();
  },

  methods: {
    // 🚀 GENERATE 7-DAY ROLLING SCHEDULE (Today + next 6 days)
    generate7DaySchedule() {
      this.generatedDays = [];
      const today = new Date();
      
      console.log('📅 Today is:', today.toDateString());
      
      // Generate 7 consecutive days starting from TODAY
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
        
        // Initialize empty schedule for this date if not exists
        if (!this.dailySchedules[dateString]) {
          this.dailySchedules[dateString] = [];
        }
      }
      
      console.log('📅 Generated 7-day schedule (Today + 6 days):', this.generatedDays);
    },

    getDayOfWeek(date) {
      const days = [
        { key: 'sunday', name: 'sunday', label: 'Sunday' },
        { key: 'monday', name: 'monday', label: 'Monday' },
        { key: 'tuesday', name: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', name: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', name: 'thursday', label: 'Thursday' },
        { key: 'friday', name: 'friday', label: 'Friday' },
        { key: 'saturday', name: 'saturday', label: 'Saturday' }
      ];
      return days[date.getDay()];
    },

    // 🚀 SLOT OPERATIONS (No auto-save)
    addTimeSlot(date) {
      const lastSlot = this.dailySchedules[date] && this.dailySchedules[date].length > 0 
        ? this.dailySchedules[date][this.dailySchedules[date].length - 1] 
        : null;
      
      let newStartTime = '09:00';
      let newEndTime = '11:00';
      
      if (lastSlot) {
        // Calculate new time based on last slot
        const lastEnd = lastSlot.endTime;
        const [hours, minutes] = lastEnd.split(':').map(Number);
        
        // Add 1 hour to the last end time
        const newHours = hours + 1;
        newStartTime = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        newEndTime = `${(newHours + 2).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      
      const newSlot = {
        startTime: newStartTime,
        endTime: newEndTime,
        isAvailable: true
      };

      if (!this.dailySchedules[date]) {
        this.dailySchedules[date] = [];
      }
      
      this.dailySchedules[date].push(newSlot);
      console.log(`➕ Added time slot to ${date}`);
    },

    removeTimeSlot(date, slotIndex) {
      if (!this.dailySchedules[date] || this.dailySchedules[date].length <= slotIndex) {
        return;
      }

      this.dailySchedules[date].splice(slotIndex, 1);
      console.log(`🗑️ Deleted time slot from ${date}`);
    },

    toggleWorkingDay(date, isWorking) {
      console.log(`🔄 Toggling ${date} to ${isWorking ? 'working' : 'off'}`);
      
      if (isWorking) {
        if (!this.dailySchedules[date] || this.dailySchedules[date].length === 0) {
          // Create 4 default time slots instead of just 1
          this.dailySchedules[date] = JSON.parse(JSON.stringify(this.defaultTimeSlots));
        }
      } else {
        // Day off - clear all slots
        this.dailySchedules[date] = [];
      }
      
      console.log(`✅ ${date} schedule with ${this.dailySchedules[date].length} default slots:`, this.dailySchedules[date]);
    },

    // 🚀 INITIALIZATION AND DATA LOADING
    async initializeTimeSlots() {
      this.loading = true;
      try {
        // ✅ GET: Get all slots for a service
        const response = await http.get(`/services/${this.serviceId}/slots`);
        this.existingSlots = response.data || [];
        
        console.log('🔍 Found existing slots:', this.existingSlots);
        
        if (this.existingSlots.length > 0) {
          this.loadExistingSlotsIntoDays(this.existingSlots);
        } else {
          // No existing slots, initialize empty
          this.initializeEmptyDays();
        }
        
      } catch (error) {
        console.warn('Could not load existing slots:', error);
        this.initializeEmptyDays();
      } finally {
        this.loading = false;
      }
    },

    initializeEmptyDays() {
      // Will be populated when generating the 7-day schedule
      this.dailySchedules = {};
    },

    loadExistingSlotsIntoDays(slots) {
      console.log('🔄 Loading existing slots into daily schedule...');
      
      // Clear existing daily schedules
      this.dailySchedules = {};
      
      slots.forEach(slot => {
        console.log('📥 Processing slot:', slot);
        
        // Store the slot ID for updates
        this.existingSlotId = slot.slotId;
        
        if (slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          slot.weeklySchedule.forEach(daySchedule => {
            if (daySchedule && daySchedule.date && Array.isArray(daySchedule.timeSlots)) {
              const dateString = this.parseBackendDate(daySchedule.date);
              
              console.log(`📅 Mapping schedule for ${dateString}:`, daySchedule.timeSlots);
              
              // Only load if date is within next 7 days
              if (this.isDateInNext7Days(dateString)) {
                this.dailySchedules[dateString] = daySchedule.timeSlots.map(timeSlot => ({
                  startTime: timeSlot.startTime,
                  endTime: timeSlot.endTime,
                  isAvailable: timeSlot.isAvailable !== false
                }));
              }
            }
          });
        }
      });
      
      console.log('✅ Final daily schedules:', this.dailySchedules);
    },

    isDateInNext7Days(dateString) {
      const today = new Date();
      const targetDate = new Date(dateString);
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays < 7;
    },

    // 🚀 SAVE ALL CHANGES (Manual save only)
    async saveTimeSlots() {
      if (!this.validateAllTimeSlots()) {
        this.setError('Please fix time slot errors before saving');
        return;
      }

      this.saving = true;
      this.errorMessage = '';

      try {
        // Build the complete slots array for the 7-day schedule
        const weeklySchedule = [];
        
        this.generatedDays.forEach(day => {
          const timeSlots = this.dailySchedules[day.date] || [];
          const isWorkingDay = timeSlots.length > 0;
          
          weeklySchedule.push({
            date: this.formatDateForBackend(day.date),
            day: day.dayKey,
            isWorkingDay: isWorkingDay,
            timeSlots: isWorkingDay ? timeSlots.map(slot => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
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

        console.log('💾 Saving 7-day schedule:', slotData);

        if (this.existingSlotId) {
          // ✅ PUT: Update existing slot
          const response = await http.put(`/services/${this.serviceId}/slots/${this.existingSlotId}`, slotData);
          console.log('✅ Schedule updated successfully:', response.data);
          this.setSuccess('Time slots updated successfully!');
        } else {
          // ✅ POST: Create new slot
          const response = await http.post(`/services/${this.serviceId}/slots`, { slots: [slotData] });
          console.log('✅ Schedule created successfully:', response.data);
          
          // Store the new slot ID
          if (response.data && response.data.length > 0) {
            this.existingSlotId = response.data[0].slotId;
          }
          
          this.setSuccess('Time slots created successfully!');
        }

        this.$emit('saved');
        
      } catch (error) {
        console.error('❌ Error saving schedule:', error);
        this.handleApiError(error, 'save time slots');
      } finally {
        this.saving = false;
      }
    },

    // 🔧 UTILITY METHODS
    formatDateForInput(date) {
      if (typeof date === 'string') return date;
      return date.toISOString().split('T')[0];
    },

    formatDateForDisplay(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
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

    isWorkingDay(date) {
      return this.dailySchedules[date] && this.dailySchedules[date].length > 0;
    },

    getTimeSlotsForDay(date) {
      return this.dailySchedules[date] || [];
    },

    validateTimeSlot(timeSlot) {
      timeSlot.hasError = false;
      timeSlot.errorMessage = '';

      if (timeSlot.startTime && timeSlot.endTime) {
        if (timeSlot.startTime >= timeSlot.endTime) {
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
            if (!this.validateTimeSlot(slot)) {
              isValid = false;
            }
          });
        }
      });
      
      return isValid;
    },

    resetToDefault() {
      if (confirm('Are you sure you want to reset to default schedule? This will clear all your changes and set 4 default time slots for each working day.')) {
        this.initializeEmptyDays();
        this.generate7DaySchedule();
        
        // Set default working days (Monday to Thursday - 4 days)
        const workingDays = ['monday', 'tuesday', 'wednesday', 'thursday'];
        
        this.generatedDays.forEach(day => {
          if (workingDays.includes(day.dayKey)) {
            this.dailySchedules[day.date] = JSON.parse(JSON.stringify(this.defaultTimeSlots));
          }
        });
        
        this.setSuccess('Reset to default schedule with 4 working days and 4 time slots each');
      }
    },

    handleApiError(error, operation) {
      console.error(`❌ Error during ${operation}:`, error);
      
      let errorMsg = `Failed to ${operation}`;
      
      if (error.response?.status === 400) {
        errorMsg = 'Invalid data format. Please check your time slots.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again.';
      } else if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMsg = error.response.data.message.join(', ');
        } else {
          errorMsg = error.response.data.message;
        }
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
/* Updated styles for 7-day schedule */
.schedule-description {
  color: #64748b;
  margin-bottom: 16px;
  line-height: 1.5;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.date-range {
  background: #e0f2fe;
  color: #0369a1;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.day-card.today {
  border-color: #3b82f6;
  background: #eff6ff;
}

.today-label {
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Keep all your existing styles below, they work perfectly */
.time-slots-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Poppins", sans-serif;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.loading-state i {
  font-size: 2rem;
  margin-bottom: 16px;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-error, .close-success {
  background: none;
  border: none;
  color: inherit;
  margin-left: auto;
  cursor: pointer;
}

.draft-alert {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  color: #d97706;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.draft-alert i {
  font-size: 1.2rem;
  margin-top: 2px;
}

.alert-content strong {
  display: block;
  margin-bottom: 4px;
  font-size: 1rem;
}

.alert-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.slot-config-header {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.slot-config-header h3 {
  color: #0f172a;
  margin-bottom: 8px;
}

.slot-config-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.config-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #334155;
}

.toggle-label {
  font-size: 0.9rem;
}

.slot-label-input {
  flex: 1;
  min-width: 250px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
}

.slot-label-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.weekly-schedule-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.day-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.day-card.working-day {
  border-color: #22c55e;
  background: #f0fdf4;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.day-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}

.day-toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.day-label {
  font-size: 1rem;
}

.off-label {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
}

.time-slots-list {
  space-y: 12px;
}

.time-slot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
}

.time-slot-item.updating {
  opacity: 0.7;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.time-input {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
}

.time-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.time-input:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

.time-separator {
  color: #64748b;
  font-size: 0.9rem;
}

.slot-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.availability-toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.availability-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #22c55e;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

input:disabled + .toggle-slider {
  opacity: 0.6;
  cursor: not-allowed;
}

.updating-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #3b82f6;
  font-size: 0.8rem;
}

.btn-remove-slot {
  background: #fee2e2;
  border: none;
  color: #dc2626;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-remove-slot:hover:not(:disabled) {
  background: #fecaca;
}

.btn-remove-slot:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-add-slot {
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  color: #475569;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: center;
  transition: background 0.2s;
}

.btn-add-slot:hover {
  background: #e2e8f0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 24px 0;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #22c55e;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.time-slot-item.has-error {
  border: 1px solid #dc2626;
  border-radius: 6px;
  padding: 8px;
}

.slot-error {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 4px;
}

.day-card.day-off {
  background: #f8fafc;
  opacity: 0.7;
}

.primary-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .time-slots-container {
    padding: 15px;
  }
  
  .slot-config-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .slot-label-input {
    min-width: auto;
  }
  
  .schedule-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .days-grid {
    grid-template-columns: 1fr;
  }
  
  .primary-actions {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .time-slot-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-remove-slot {
    align-self: flex-end;
    width: auto;
    padding: 8px 12px;
  }
}
</style>