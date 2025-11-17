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
          Deactivating or deleting your account is permanent. All your data will be removed.
        </p>
        <button class="btn danger" @click="deactivateAccount">Deactivate Account</button>
        <button class="btn outline-danger" @click="deleteAccount">Permanently Delete Data</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
    alert("Account deactivated. You’ll receive a confirmation email.");
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

.btn.danger {
  background: linear-gradient(90deg, #e53e3e, #f56565);
  color: white;
  box-shadow: 0 4px 10px rgba(229, 62, 62, 0.3);
}

.btn.outline-danger {
  background: transparent;
  color: #e53e3e;
  border: 1px solid #e53e3e;
}

.btn.danger:hover,
.btn.outline-danger:hover {
  transform: translateY(-2px);
}

/* Danger Zone */
.setting-card.danger {
  border-color: rgba(229, 62, 62, 0.3);
  background: rgba(255, 245, 245, 0.7);
}

.danger-text {
  color: #e53e3e;
  font-size: 0.95rem;
  margin: 0.8rem 0 1.2rem;
  line-height: 1.5;
}

/* Responsive */
@media (min-width: 768px) {
  .settings-section {
    padding: 2rem;
  }
}
</style>