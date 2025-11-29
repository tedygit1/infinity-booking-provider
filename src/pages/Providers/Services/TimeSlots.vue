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
                <span class="day-label">{{ day.display }}</span>
              </label>
              <span v-if="!isWorkingAtDay(day.date)" class="off-label">Day Off</span>
              <span v-if="day.isToday" class="today-label">Today</span>
            </div>

            <!-- ONLY SHOW EDITABLE SLOTS IF WORKING DAY -->
            <div v-if="isWorkingAtDay(day.date)" class="time-slots-list">
              <div
                v-for="(timeSlot, slotIndex) in dailySchedules[day.date]"
                :key="slotIndex"
                class="time-slot-item"
                :class="{ 
                  'has-error': timeSlot.hasError,
                  'booked-slot': timeSlot.isBooked
                }"
              >
                <!-- BOOKED SLOT -->
                <div v-if="timeSlot.isBooked" class="booked-slot-content">
                  <div class="booked-slot-info">
                    <div class="booked-time">
                      <i class="fa-solid fa-clock booked-icon"></i>
                      {{ timeSlot.startTime }} - {{ timeSlot.endTime }}
                    </div>
                    <div class="booked-label">
                      <span class="booked-badge">BOOKED</span>
                    </div>
                    <div class="customer-info" v-if="getBookingForSlot(day.date, timeSlot.startTime, timeSlot.endTime)">
                      <i class="fa-solid fa-user"></i>
                      {{ getBookingForSlot(day.date, timeSlot.startTime, timeSlot.endTime).customerName || 'Customer' }}
                    </div>
                  </div>
                </div>

                <!-- AVAILABLE SLOT -->
                <div v-else class="available-slot-content">
                  <div class="time-inputs">
                    <input
                      v-model="timeSlot.startTime"
                      type="time"
                      class="time-input"
                      @change="validateTimeSlot(timeSlot)"
                      :disabled="timeSlot.isBooked"
                    />
                    <span class="time-separator">to</span>
                    <input
                      v-model="timeSlot.endTime"
                      type="time"
                      class="time-input"
                      @change="validateTimeSlot(timeSlot)"
                      :disabled="timeSlot.isBooked"
                    />
                  </div>
                  <div class="slot-actions">
                    <label class="availability-toggle">
                      <input
                        type="checkbox"
                        v-model="timeSlot.isAvailable"
                        :disabled="timeSlot.isBooked"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                    <button
                      class="btn-remove-slot"
                      @click="removeTimeSlot(day.date, slotIndex)"
                      :disabled="dailySchedules[day.date].length === 1 || timeSlot.isBooked"
                      title="Remove time slot"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  <div v-if="timeSlot.hasError" class="slot-error">
                    {{ timeSlot.errorMessage }}
                  </div>
                </div>
              </div>

              <button 
                class="btn-add-slot" 
                @click="addTimeSlot(day.date)"
                :disabled="loadingBookings"
              >
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

          <!-- Refresh Bookings Button -->
          <button
            class="btn btn-info"
            @click="fetchBookedSlots"
            :disabled="loadingBookings"
          >
            <i v-if="loadingBookings" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-rotate"></i>
            {{ loadingBookings ? 'Refreshing...' : 'Refresh Bookings' }}
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
        <p>Booked Slots Count: {{ bookedSlots.length }}</p>
        <p>Loading Bookings: {{ loadingBookings }}</p>
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
      loadingBookings: false,
      
      slotConfig: {
        slotLabel: '7-Day Rolling Schedule',
        isActive: true
      },
      
      generatedDays: [],
      dailySchedules: {},
      existingSlots: [],
      existingSlotId: null,
      bookedSlots: [],
      
      defaultTimeSlots: [
        { startTime: '09:00', endTime: '11:00', isAvailable: true, isBooked: false },
        { startTime: '11:00', endTime: '13:00', isAvailable: true, isBooked: false },
        { startTime: '14:00', endTime: '16:00', isAvailable: true, isBooked: false },
        { startTime: '16:00', endTime: '18:00', isAvailable: true, isBooked: false }
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
            week && week.timeSlots && Array.isArray(week.timeSlots) && week.timeSlots.length > 0
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
    await this.fetchBookedSlots();
  },

  methods: {
    // ✅ CORRECTED: Uses bookingDate from API
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
              startTime: normalizeTime(booking.startTime),
              endTime: normalizeTime(booking.endTime)
            };
          });

        this.markBookedSlotsInDailySchedules();
      } catch (error) {
        console.error('❌ Failed to fetch booked slots:', error);
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

    // For each booking, ensure a slot exists
    bookingsForDay.forEach(booking => {
      const existingSlot = this.dailySchedules[dateKey].find(slot => 
        slot.startTime === booking.startTime && slot.endTime === booking.endTime
      );

      if (!existingSlot) {
        // Create new slot for this booking
        const newSlot = {
          startTime: booking.startTime,
          endTime: booking.endTime,
          isAvailable: false, // can't be available if booked
          isBooked: true,
          hasError: false,
          errorMessage: ''
        };
        this.dailySchedules[dateKey].push(newSlot);
      } else {
        // Mark existing slot as booked
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
        if (!this.dailySchedules[dateString]) {
          this.dailySchedules[dateString] = [];
        }
      }
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

    isWorkingAtDay(date) {
      return this.dailySchedules[date]?.length > 0;
    },

    addTimeSlot(date) {
      const slots = this.dailySchedules[date] || [];
      // Prevent duplicate slots
      const existingKeys = new Set(slots.map(s => `${s.startTime}-${s.endTime}`));
      
      const lastSlot = slots.length > 0 ? slots[slots.length - 1] : null;
      let newStartTime = '09:00';
      let newEndTime = '11:00';
      
      if (lastSlot) {
        const [h, m] = lastSlot.endTime.split(':').map(Number);
        const newH = h + 1;
        newStartTime = `${newH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        newEndTime = `${(newH + 2).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      }

      // Avoid duplicates
      const newKey = `${newStartTime}-${newEndTime}`;
      if (existingKeys.has(newKey)) {
        this.setError('This time slot already exists');
        return;
      }

      const newSlot = {
        startTime: newStartTime,
        endTime: newEndTime,
        isAvailable: true,
        isBooked: false
      };

      this.dailySchedules[date] = [...slots, newSlot];
    },

    removeTimeSlot(date, slotIndex) {
      if (!this.dailySchedules[date] || slotIndex >= this.dailySchedules[date].length) return;
      this.dailySchedules[date].splice(slotIndex, 1);
    },

    toggleWorkingDay(date, isWorking) {
      if (isWorking) {
        if (!this.dailySchedules[date] || this.dailySchedules[date].length === 0) {
          this.dailySchedules[date] = JSON.parse(JSON.stringify(this.defaultTimeSlots));
        }
      } else {
        this.dailySchedules[date] = [];
      }
    },

    async initializeTimeSlots() {
      this.loading = true;
      try {
        const response = await http.get(`/services/${this.serviceId}/slots`);
        this.existingSlots = response.data || [];
        if (this.existingSlots.length > 0) {
          this.loadExistingSlotsIntoDays(this.existingSlots);
        } else {
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
      this.dailySchedules = {};
    },

    loadExistingSlotsIntoDays(slots) {
      this.dailySchedules = {};
      slots.forEach(slot => {
        this.existingSlotId = slot.slotId;
        if (slot.weeklySchedule && Array.isArray(slot.weeklySchedule)) {
          slot.weeklySchedule.forEach(daySchedule => {
            if (daySchedule && daySchedule.date && Array.isArray(daySchedule.timeSlots)) {
              const dateString = this.parseBackendDate(daySchedule.date);
              if (this.isDateInNext7Days(dateString)) {
                this.dailySchedules[dateString] = daySchedule.timeSlots.map(timeSlot => ({
                  startTime: timeSlot.startTime,
                  endTime: timeSlot.endTime,
                  isAvailable: timeSlot.isAvailable !== false,
                  isBooked: false
                }));
              }
            }
          });
        }
      });
    },

    isDateInNext7Days(dateString) {
      const today = new Date();
      const targetDate = new Date(dateString);
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays < 7;
    },

    async saveTimeSlots() {
      if (!this.validateAllTimeSlots()) {
        this.setError('Please fix time slot errors before saving');
        return;
      }

      this.saving = true;
      this.errorMessage = '';

      try {
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

        if (this.existingSlotId) {
          await http.put(`/services/${this.serviceId}/slots/${this.existingSlotId}`, slotData);
          this.setSuccess('Time slots updated successfully!');
        } else {
          const response = await http.post(`/services/${this.serviceId}/slots`, { slots: [slotData] });
          if (response.data?.length > 0) {
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

    formatDateForInput(date) {
      if (typeof date === 'string') return date;
      return date.toISOString().split('T')[0];
    },

    formatDateForDisplay(date) {
      if (typeof date === 'string') date = new Date(date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
            if (!this.validateTimeSlot(slot)) isValid = false;
          });
        }
      });
      return isValid;
    },

    resetToDefault() {
      if (confirm('Are you sure you want to reset to default schedule? This will clear all your changes and set 4 default time slots for each working day.')) {
        this.initializeEmptyDays();
        this.generate7DaySchedule();
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
/* Keep your existing CSS exactly as it was — no changes needed */
.time-slots-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Poppins", sans-serif;
}

/* NEW STYLES FOR BOOKED SLOTS */
.booked-slot-content {
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
}

.booked-slot-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.booked-time {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #dc2626;
}

.booked-icon {
  color: #dc2626;
}

.booked-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.booked-badge {
  background: #dc2626;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #7f1d1d;
}

.customer-info i {
  font-size: 0.8rem;
}

.time-slot-item.booked-slot {
  opacity: 0.9;
}

.btn-info {
  background: #3b82f6;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #2563eb;
}

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