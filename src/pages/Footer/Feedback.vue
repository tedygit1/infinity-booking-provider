<template>
  <div class="page-container font-poppins">
    <div class="card">
      <!-- Header -->
      <div class="header">
        <h1 class="page-title">Provider Feedback</h1>
        <p class="subtitle">
          Help us improve Infinity-Booking for all service providers — from plumbers in Hawassa to tutors in Mekelle and beyond.
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitFeedback" class="feedback-form" novalidate>
        <!-- Name -->
        <div class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input
            id="name"
            type="text"
            v-model.trim="feedback.name"
            class="form-input"
            :class="{ 'input-error': errors.name }"
            @blur="validateField('name')"
            required
            aria-describedby="name-error"
          />
          <div v-if="errors.name" id="name-error" class="error-text">
            {{ errors.name }}
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            type="email"
            v-model.trim="feedback.email"
            class="form-input"
            :class="{ 'input-error': errors.email }"
            @blur="validateField('email')"
            required
            aria-describedby="email-error"
          />
          <div v-if="errors.email" id="email-error" class="error-text">
            {{ errors.email }}
          </div>
        </div>

        <!-- Category -->
        <div class="form-group">
          <label for="category" class="form-label">Feedback Category</label>
          <div class="select-wrapper">
            <select
              id="category"
              v-model="feedback.category"
              class="form-select"
              :class="{ 'input-error': errors.category }"
              @blur="validateField('category')"
              required
              aria-describedby="category-error"
            >
              <option value="" disabled>Select a category</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Payment Problem">Payment or Payout Problem</option>
              <option value="Booking Management">Booking or Scheduling</option>
              <option value="Profile/Verification">Profile or Verification</option>
              <option value="Dashboard UX">Dashboard Experience</option>
              <option value="Mobile App">Mobile App (if applicable)</option>
              <option value="Feature Request">New Feature Suggestion</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div v-if="errors.category" id="category-error" class="error-text">
            {{ errors.category }}
          </div>
        </div>

        <!-- Message -->
        <div class="form-group">
          <label for="message" class="form-label">Your Message</label>
          <textarea
            id="message"
            v-model.trim="feedback.message"
            class="form-textarea"
            :class="{ 'input-error': errors.message }"
            @blur="validateField('message')"
            rows="5"
            placeholder="Describe your idea, issue, or suggestion in detail..."
            required
            aria-describedby="message-error"
          ></textarea>
          <div v-if="errors.message" id="message-error" class="error-text">
            {{ errors.message }}
          </div>
          <div class="char-count">{{ feedback.message.length }}/800</div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="submit-btn"
          :disabled="isSubmitting"
          aria-live="polite"
        >
          <span v-if="!isSubmitting">Submit Feedback</span>
          <span v-else>
            <svg class="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"></circle>
            </svg>
            Sending...
          </span>
        </button>
      </form>

      <!-- Success -->
      <Transition name="fade">
        <div v-if="submitted" class="success-message">
          <div class="success-icon">✓</div>
          <h2>Thank You!</h2>
          <p>Your feedback has been sent to our product team in Addis Ababa.</p>
          <button class="reset-btn" @click="resetForm">Submit Another</button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'

// Simulate provider context
const mockProvider = {
  name: '',
  email: 'new@gmail.com'
}

const feedback = reactive({
  name: mockProvider.name,
  email: mockProvider.email,
  category: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  category: '',
  message: ''
})

const submitted = ref(false)
const isSubmitting = ref(false)

// Validation helpers
function validateField(field) {
  errors[field] = ''
  if (!feedback[field]) {
    errors[field] = field === 'category' 
      ? 'Please select a category' 
      : `Please enter your ${field === 'name' ? 'name' : field}`
    return
  }

  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(feedback.email)) {
      errors.email = 'Please enter a valid email address'
    }
  }

  if (field === 'message' && feedback.message.length > 800) {
    errors.message = 'Message must be 800 characters or less'
  }
}

function validateAll() {
  validateField('name')
  validateField('email')
  validateField('category')
  validateField('message')
  return !errors.name && !errors.email && !errors.category && !errors.message
}

async function submitFeedback() {
  validateAll()
  if (!validateAll()) return

  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  isSubmitting.value = false
  submitted.value = true
}

function resetForm() {
  Object.assign(feedback, {
    name: mockProvider.name,
    email: mockProvider.email,
    category: '',
    message: ''
  })
  Object.keys(errors).forEach(key => errors[key] = '')
  submitted.value = false
}

onMounted(() => {
  document.getElementById('name')?.focus()
})
</script>

<style scoped>
/* ===== Same styles as before — no changes needed ===== */
.page-container {
  padding: 2rem 1.25rem;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
}

.card {
  width: 100%;
  max-width: 650px;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 85, 104, 0.3);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  background: linear-gradient(to right, #818cf8, #c7d2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  font-size: 1.0625rem;
  color: #cbd5e1;
  line-height: 1.6;
  max-width: 550px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #cbd5e1;
  font-size: 0.9375rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.875rem;
  border-radius: 8px;
  border: 1px solid #475569;
  background: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.input-error {
  border-color: #ef4444 !important;
  background: rgba(55, 0, 0, 0.2);
}

.error-text {
  color: #f87171;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1rem;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: #94a3b8;
  font-size: 0.75rem;
}

.form-select {
  appearance: none;
  padding-right: 2.25rem;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  text-align: right;
  font-size: 0.8125rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.6);
}

.submit-btn:disabled {
  opacity: 0.85;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 1s linear infinite;
  vertical-align: middle;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  margin-top: 2rem;
  text-align: center;
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.15);
  border-radius: 12px;
  border: 1px solid #10b981;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #059669;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.success-message h2 {
  font-size: 1.75rem;
  color: #ecfdf5;
  margin-bottom: 0.5rem;
}

.success-message p {
  color: #d1fae5;
  font-size: 1.125rem;
  line-height: 1.6;
}

.reset-btn {
  margin-top: 1rem;
  background: transparent;
  color: #a7f3d0;
  border: 1px solid #10b981;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(16, 185, 129, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .card {
    padding: 1.5rem;
  }
  .page-title {
    font-size: 1.875rem;
  }
  .subtitle {
    font-size: 1rem;
  }
}
</style>