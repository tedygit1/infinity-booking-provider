<!-- src/pages/Providers/SettingsSection.vue -->
<template>
  <div class="settings-section">
    <div class="settings-header">
      <h2 class="title">⚙️ Account Settings</h2>
      <p class="subtitle">Manage your privacy, security, and preferences</p>
    </div>

    <div class="settings-grid">
      <!-- Privacy -->
      <div class="setting-card">
        <h3><i class="fa-solid fa-lock"></i> Privacy</h3>
        <div class="toggle-item">
          <span>Public Profile</span>
          <label class="switch">
            <input type="checkbox" v-model="privacy.publicProfile" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle-item">
          <span>Hide Phone Number</span>
          <label class="switch">
            <input type="checkbox" v-model="privacy.hidePhone" />
            <span class="slider"></span>
          </label>
        </div>
        <button class="btn primary" @click="savePrivacy">Save Privacy Settings</button>
      </div>

      <!-- Notifications -->
      <div class="setting-card">
        <h3><i class="fa-solid fa-bell"></i> Notifications</h3>
        <div class="toggle-item">
          <span>Email Notifications</span>
          <label class="switch">
            <input type="checkbox" v-model="notifications.email" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle-item">
          <span>SMS Alerts</span>
          <label class="switch">
            <input type="checkbox" v-model="notifications.sms" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="toggle-item">
          <span>In-App Notifications</span>
          <label class="switch">
            <input type="checkbox" v-model="notifications.inApp" />
            <span class="slider"></span>
          </label>
        </div>
        <button class="btn primary" @click="saveNotifications">Save Notification Preferences</button>
      </div>

      <!-- Security -->
      <div class="setting-card">
        <h3><i class="fa-solid fa-shield-alt"></i> Security</h3>
        <div class="form-group">
          <label>New Password</label>
          <input
            type="password"
            v-model="security.newPassword"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </div>
        <div class="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            v-model="security.confirmPassword"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </div>
        <div class="toggle-item">
          <span>Two-Factor Authentication (2FA)</span>
          <label class="switch">
            <input type="checkbox" v-model="security.twoFactor" disabled />
            <span class="slider"></span>
          </label>
        </div>
        <p class="helper">2FA is coming soon for enhanced security.</p>
        <button
          class="btn primary"
          @click="changePassword"
          :disabled="!security.newPassword"
        >
          Update Password
        </button>
      </div>

      <!-- Localization -->
      <div class="setting-card">
        <h3><i class="fa-solid fa-language"></i> Localization</h3>
        <div class="form-group">
          <label>Language</label>
          <select v-model="localization.language">
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
          </select>
        </div>
        <div class="form-group">
          <label>Timezone</label>
          <select v-model="localization.timezone">
            <option value="Africa/Addis_Ababa">Africa/Addis Ababa (EAT)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <button class="btn primary" @click="saveLocalization">Save Preferences</button>
      </div>

      <!-- Danger Zone -->
      <div class="setting-card danger">
        <h3><i class="fa-solid fa-exclamation-triangle"></i> Danger Zone</h3>
        <p class="danger-text">
          Critical actions that affect your account access and data.
        </p>
        
        <!-- Logout Section -->
        <div class="danger-action">
          <div class="action-info">
            <i class="fa-solid fa-right-from-bracket"></i>
            <div>
              <div class="action-label">Logout</div>
              <div class="action-description">Sign out from your current session</div>
            </div>
          </div>
          <button 
            class="btn logout" 
            @click="confirmLogout"
            :disabled="loggingOut"
          >
            <i class="fa-solid fa-right-from-bracket"></i>
            {{ loggingOut ? 'Logging out...' : 'Logout' }}
          </button>
        </div>

        <!-- Deactivate Account -->
        <div class="danger-action">
          <div class="action-info">
            <i class="fa-solid fa-user-slash"></i>
            <div>
              <div class="action-label">Deactivate Account</div>
              <div class="action-description">Temporarily disable your account</div>
            </div>
          </div>
          <button class="btn outline-danger" @click="deactivateAccount">
            <i class="fa-solid fa-user-slash"></i>
            Deactivate
          </button>
        </div>

        <!-- Delete Account -->
        <div class="danger-action">
          <div class="action-info">
            <i class="fa-solid fa-trash"></i>
            <div>
              <div class="action-label">Delete Account</div>
              <div class="action-description">Permanently delete all your data</div>
            </div>
          </div>
          <button class="btn danger" @click="deleteAccount">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-icon">
          <i class="fa-solid fa-right-from-bracket"></i>
        </div>
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to logout from your account?</p>
        <div class="modal-actions">
          <button class="btn secondary" @click="showLogoutModal = false">Cancel</button>
          <button class="btn logout" @click="performLogout">Yes, Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Logout state
const loggingOut = ref(false);
const showLogoutModal = ref(false);

// Settings state (in real app, load from API)
const privacy = ref({
  publicProfile: true,
  hidePhone: false,
});

const notifications = ref({
  email: true,
  sms: false,
  inApp: true,
});

const security = ref({
  newPassword: "",
  confirmPassword: "",
  twoFactor: false,
});

const localization = ref({
  language: "en",
  timezone: "Africa/Addis_Ababa",
});

// Logout functionality
const confirmLogout = () => {
  showLogoutModal.value = true;
};

const performLogout = async () => {
  loggingOut.value = true;
  showLogoutModal.value = false;
  
  try {
    // Clear all authentication data
    localStorage.removeItem("provider_token");
    localStorage.removeItem("provider_id");
    localStorage.removeItem("loggedProvider");
    
    // Redirect to login page
    await router.push({ name: "Login" });
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout failed. Please try again.");
  } finally {
    loggingOut.value = false;
  }
};

// Save handlers
function savePrivacy() {
  console.log("Saving privacy:", privacy.value);
  alert("Privacy settings saved!");
}

function saveNotifications() {
  console.log("Saving notifications:", notifications.value);
  alert("Notification preferences updated!");
}

function saveLocalization() {
  console.log("Saving localization:", localization.value);
  alert("Language and timezone updated!");
}

function changePassword() {
  const { newPassword, confirmPassword } = security.value;
  if (!newPassword) {
    alert("Please enter a new password.");
    return;
  }
  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }
  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }
  // In real app: call API
  alert("Password updated successfully!");
  security.value.newPassword = "";
  security.value.confirmPassword = "";
}

function deactivateAccount() {
  if (confirm("Are you sure? You can reactivate your account within 30 days.")) {
    alert("Account deactivation request sent. You'll receive a confirmation email.");
  }
}

function deleteAccount() {
  if (
    confirm(
      "⚠️ This action cannot be undone. All your data will be permanently deleted. Continue?"
    )
  ) {
    // In real app: call delete API
    localStorage.clear();
    router.push({ name: "Login" });
  }
}
</script>

<style scoped>
.settings-section {
  padding: 1.6rem 1.2rem;
  font-family: "Poppins", sans-serif;
  max-width: 100%;
}

.settings-header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(90deg, #0066cc, #00a8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.subtitle {
  color: #64748b;
  font-size: 1.05rem;
  margin-top: 0.4rem;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.setting-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  padding: 1.4rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(200, 220, 255, 0.4);
}

.setting-card h3 {
  font-size: 1.25rem;
  margin: 0 0 1rem;
  color: #005599;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #0077ff;
  box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.2);
}

.helper {
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.3rem;
}

/* Toggle Switch */
.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  font-weight: 500;
  color: #2d3748;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #0077ff;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* Buttons */
.btn {
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn.primary {
  background: linear-gradient(90deg, #0066cc, #0088ff);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 102, 204, 0.3);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 102, 204, 0.4);
}

.btn.secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn.secondary:hover {
  background: #e2e8f0;
}

.btn.logout {
  background: linear-gradient(90deg, #dc2626, #ef4444);
  color: white;
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3);
}

.btn.logout:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(220, 38, 38, 0.4);
}

.btn.danger {
  background: linear-gradient(90deg, #dc2626, #ef4444);
  color: white;
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3);
}

.btn.outline-danger {
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.btn.danger:hover,
.btn.outline-danger:hover {
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Danger Zone */
.setting-card.danger {
  border-color: rgba(220, 38, 38, 0.3);
  background: rgba(254, 242, 242, 0.7);
}

.danger-text {
  color: #dc2626;
  font-size: 0.95rem;
  margin: 0.8rem 0 1.2rem;
  line-height: 1.5;
  font-weight: 500;
}

.danger-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(220, 38, 38, 0.1);
}

.danger-action:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.action-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.action-info i {
  font-size: 1.2rem;
  color: #dc2626;
  width: 24px;
}

.action-label {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.action-description {
  font-size: 0.85rem;
  color: #64748b;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.modal-icon {
  font-size: 3rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.modal-content h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.modal-content p {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Responsive */
@media (min-width: 768px) {
  .settings-section {
    padding: 2rem;
  }
  
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }
  
  .setting-card.danger {
    grid-column: 1 / -1;
  }
  
  .danger-action {
    padding: 1.25rem 0;
  }
}

@media (max-width: 480px) {
  .danger-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .danger-action .btn {
    width: 100%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>