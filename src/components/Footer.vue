<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <div class="container">
      <!-- Top Section: Brand & Contact -->
      <div class="footer-top">
        <div class="brand-section">
          <div class="brand-header">
            <span class="logo-icon">∞</span>
            <h2 class="brand-name">Infinity-Booking</h2>
          </div>
          <p class="brand-tagline">
            Empowering service professionals with smart booking solutions.
          </p>
          <div class="contact-info">
            <a href="tel:+251900000000" class="contact-item">
              <span class="contact-icon">📞</span>
              <span class="contact-text">+251 900 000 000</span>
            </a>
            <a href="mailto:hello@infinitybooking.com" class="contact-item">
              <span class="contact-icon">✉️</span>
              <span class="contact-text">hello@infinitybooking.com</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Middle Section: Links -->
      <div class="footer-middle">
        <!-- Product Column -->
        <div class="footer-column">
          <h3 class="column-title">
            Product
            <div class="title-underline"></div>
          </h3>
          <div class="column-links">
            <router-link to="/features" class="footer-link">Features</router-link>
            <router-link to="/pricing" class="footer-link">Pricing</router-link>
            <router-link to="/industries" class="footer-link">Industries</router-link>
            <router-link to="/updates" class="footer-link">Updates</router-link>
          </div>
        </div>

        <!-- Company Column -->
        <div class="footer-column">
          <h3 class="column-title">
            Company
            <div class="title-underline"></div>
          </h3>
          <div class="column-links">
            <router-link to="/about" class="footer-link">About</router-link>
            <router-link to="/blog" class="footer-link">Blog</router-link>
            <router-link to="/careers" class="footer-link">Careers</router-link>
            <router-link to="/contact" class="footer-link">Contact</router-link>
          </div>
        </div>

        <!-- Support Column -->
        <div class="footer-column">
          <h3 class="column-title">
            Support
            <div class="title-underline"></div>
          </h3>
          <div class="column-links">
            <router-link to="/help-center" class="footer-link">Help Center</router-link>
            <router-link to="/documentation" class="footer-link">Documentation</router-link>
            <router-link to="/api" class="footer-link">API</router-link>
            <router-link to="/status" class="footer-link">Status</router-link>
          </div>
        </div>

        <!-- Quick Links Column -->
        <div class="footer-column quick-links">
          <h3 class="column-title">
            Quick Links
            <div class="title-underline"></div>
          </h3>
          <div class="column-links grid-links">
            <router-link to="/privacy" class="footer-link">Privacy Policy</router-link>
            <router-link to="/terms" class="footer-link">Terms of Service</router-link>
            <router-link to="/cookies" class="footer-link">Cookie Policy</router-link>
            <router-link to="/sitemap" class="footer-link">Sitemap</router-link>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Bottom Section: Copyright & Social -->
      <div class="footer-bottom">
        <div class="copyright-section">
          <p class="copyright">&copy; {{ currentYear }} Infinity-Booking. All rights reserved.</p>
          <div class="location">
            <span class="location-icon">📍</span>
            <span class="location-text">Addis Ababa, Ethiopia</span>
          </div>
        </div>

        <div class="social-section">
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = new Date().getFullYear();
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.footer {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  color: #ffffff;
  padding: 60px 0 30px;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

/* ===== TOP SECTION ===== */
.footer-top {
  margin-bottom: 40px;
}

.brand-section {
  max-width: 600px;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.logo-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.brand-name {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
}

.brand-tagline {
  font-size: 1.1rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 25px;
  max-width: 500px;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-item:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.contact-icon {
  font-size: 1.2rem;
}

/* ===== DIVIDER ===== */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 40px 0;
}

/* ===== MIDDLE SECTION ===== */
.footer-middle {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
  position: relative;
}

.title-underline {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  margin-top: 8px;
}

.column-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grid-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 20px;
}

.footer-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 6px 0;
  position: relative;
  display: inline-flex;
  align-items: center;
}

.footer-link::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: #ffffff;
  transform: translateX(5px);
}

.footer-link:hover::before {
  width: 20px;
}

/* ===== BOTTOM SECTION ===== */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.copyright-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copyright {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.location-icon {
  font-size: 1rem;
}

/* ===== SOCIAL LINKS ===== */
.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  border-color: transparent;
}

.social-link:hover::before {
  opacity: 1;
}

.social-link:hover .social-icon {
  color: white;
}

.social-icon {
  width: 20px;
  height: 20px;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Large Tablet */
@media (max-width: 1024px) {
  .footer {
    padding: 50px 0 25px;
  }
  
  .footer-middle {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .brand-name {
    font-size: 1.8rem;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .footer {
    padding: 40px 0 20px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .brand-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .logo-icon {
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
  }
  
  .brand-name {
    font-size: 1.6rem;
  }
  
  .brand-tagline {
    font-size: 1rem;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .contact-item {
    padding: 8px 12px;
    font-size: 0.95rem;
  }
  
  .divider {
    margin: 30px 0;
  }
  
  .footer-middle {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .footer-column {
    align-items: center;
    text-align: center;
  }
  
  .title-underline {
    margin-left: auto;
    margin-right: auto;
  }
  
  .grid-links {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .copyright-section {
    align-items: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .footer {
    padding: 35px 0 15px;
  }
  
  .brand-header {
    align-items: center;
    text-align: center;
  }
  
  .brand-tagline {
    text-align: center;
    font-size: 0.95rem;
  }
  
  .contact-item {
    justify-content: center;
    font-size: 0.9rem;
  }
  
  .column-title {
    font-size: 1rem;
    margin-bottom: 15px;
  }
  
  .footer-link {
    font-size: 0.9rem;
    padding: 4px 0;
  }
  
  .social-link {
    width: 40px;
    height: 40px;
  }
  
  .social-icon {
    width: 18px;
    height: 18px;
  }
  
  .copyright {
    font-size: 0.85rem;
  }
  
  .location {
    font-size: 0.85rem;
  }
}

/* Small Mobile */
@media (max-width: 360px) {
  .footer {
    padding: 30px 0 12px;
  }
  
  .brand-name {
    font-size: 1.4rem;
  }
  
  .brand-tagline {
    font-size: 0.9rem;
  }
  
  .contact-item {
    font-size: 0.85rem;
    padding: 6px 10px;
  }
  
  .divider {
    margin: 25px 0;
  }
  
  .footer-middle {
    gap: 20px;
  }
  
  .social-links {
    gap: 10px;
  }
  
  .social-link {
    width: 36px;
    height: 36px;
  }
}
</style>