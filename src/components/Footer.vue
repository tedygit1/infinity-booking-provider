<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <div class="container">
      <!-- Brand + Contact (stacked on mobile) -->
      <div class="brand-section">
        <div class="brand-header">
          <span class="logo-icon">∞</span>
          <div class="brand-text">
            <h2 class="brand-name">Infinity-Booking</h2>
            <p class="brand-tagline">Smart booking for every service professional</p>
          </div>
        </div>

        <div class="contact-info">
          <a href="tel:+251900000000" class="contact-item">
            <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            <span>+251 90 000 000</span>
          </a>
          <a href="mailto:hello@infinitybooking.com" class="contact-item">
            <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>hello@infinitybooking.com</span>
          </a>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Links: 4 columns on desktop, 2 on tablet, 1 on mobile -->
      <div class="links-section">
        <div class="link-column">
          <h3 class="column-title">Product</h3>
          <RouterLink to="/features" class="footer-link">Features</RouterLink>
          <RouterLink to="/pricing" class="footer-link">Pricing</RouterLink>
        </div>

        <div class="link-column">
          <h3 class="column-title">Support</h3>
          <RouterLink to="/help-center" class="footer-link">Help Center</RouterLink>
          <RouterLink to="/feedback" class="footer-link">Feedback</RouterLink>
        </div>

        <div class="link-column">
          <h3 class="column-title">Company</h3>
          <RouterLink to="/team" class="footer-link">Team</RouterLink>
        </div>

        <div class="link-column">
          <h3 class="column-title">Legal</h3>
          <RouterLink to="/privacy-policy" class="footer-link">Privacy Policy</RouterLink>
          <RouterLink to="/terms-of-service" class="footer-link">Terms of Service</RouterLink>
          <RouterLink to="/security" class="footer-link">Security</RouterLink>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Bottom: Copyright + Social -->
      <div class="bottom-section">
        <p class="copyright">
          &copy; {{ currentYear }} Infinity-Booking. All rights reserved.<br />
          <span class="location">Addis Ababa, Ethiopia</span>
        </p>
        <div class="social-links">
          <a href="#" class="social-icon" aria-label="Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
            </svg>
          </a>
          <a href="#" class="social-icon" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.14 0-2.063-.926-2.063-2.065 0-1.14.92-2.063 2.063-2.063 1.14 0 2.064.92 2.064 2.063 0 1.14-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  padding: 2rem 0 1.25rem;
  font-family: 'Poppins', system-ui, sans-serif;
  line-height: 1.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* === Brand Section === */
.brand-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.brand-header {
  display: inline-flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
}

.logo-icon {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.brand-name {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #a5b4fc, #c7d2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.375rem;
  border-radius: 6px;
  transition: background 0.2s;
  width: fit-content;
  margin: 0 auto;
}

.contact-item:hover {
  background: rgba(79, 70, 229, 0.15);
  color: #f1f5f9;
}

.contact-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* === Divider === */
.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 1.25rem 0;
}

/* === Links Section === */
.links-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.link-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.column-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.25rem 0;
  transition: color 0.2s;
  line-height: 1.4;
}

.footer-link:hover {
  color: #c7d2fe;
}

/* === Bottom Section === */
.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.copyright {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

.location {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 6px;
  color: #cbd5e1;
  transition: all 0.2s;
}

.social-icon:hover {
  background: rgba(79, 70, 229, 0.25);
  color: #f1f5f9;
}

.social-icon svg {
  width: 16px;
  height: 16px;
}

/* === Responsive === */
@media (max-width: 900px) {
  .links-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 550px) {
  .links-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .link-column {
    width: 100%;
    align-items: center;
  }

  .footer-link {
    text-align: center;
    width: 100%;
  }

  .brand-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .brand-name {
    font-size: 1.5rem;
  }

  .footer {
    padding: 1.5rem 0 1rem;
  }

  .divider {
    margin: 1rem 0;
  }
}
</style>