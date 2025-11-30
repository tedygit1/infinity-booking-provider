<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-section brand-section">
          <div class="brand-logo">
            <span class="logo-icon">∞</span>
            <span class="logo-text">Infinity-Booking</span>
          </div>
          <p class="brand-description">
            Empowering service professionals with smart booking solutions and helping customers find trusted services.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <span class="social-icon">📘</span>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <span class="social-icon">📷</span>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <span class="social-icon">🐦</span>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <span class="social-icon">💼</span>
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div class="footer-section">
          <h3 class="section-title">Product</h3>
          <div class="footer-links">
            <router-link to="/features" class="footer-link">Features</router-link>
            <router-link to="/pricing" class="footer-link">Pricing</router-link>
            <router-link to="/industries" class="footer-link">Industries</router-link>
            <router-link to="/updates" class="footer-link">Updates</router-link>
          </div>
        </div>

        <!-- Company Links -->
        <div class="footer-section">
          <h3 class="section-title">Company</h3>
          <div class="footer-links">
            <router-link to="/about" class="footer-link">About</router-link>
            <router-link to="/blog" class="footer-link">Blog</router-link>
            <router-link to="/careers" class="footer-link">Careers</router-link>
            <router-link to="/contact" class="footer-link">Contact</router-link>
          </div>
        </div>

        <!-- Support Links -->
        <div class="footer-section">
          <h3 class="section-title">Support</h3>
          <div class="footer-links">
            <router-link to="/help" class="footer-link">Help Center</router-link>
            <router-link to="/docs" class="footer-link">Documentation</router-link>
            <router-link to="/api" class="footer-link">API</router-link>
            <router-link to="/status" class="footer-link">Status</router-link>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="footer-section contact-section">
          <h3 class="section-title">Contact</h3>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <span class="contact-text">+251 900 000 000</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">✉️</span>
              <span class="contact-text">hello@infinitybooking.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <span class="contact-text">Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>&copy; {{ currentYear }} Infinity-Booking. All rights reserved.</p>
        </div>
        <div class="footer-legal">
          <router-link to="/privacy" class="legal-link">Privacy Policy</router-link>
          <router-link to="/terms" class="legal-link">Terms of Service</router-link>
          <router-link to="/cookies" class="legal-link">Cookie Policy</router-link>
        </div>
        <button 
          class="scroll-top" 
          @click="scrollToTop"
          :class="{ 'visible': showScrollTop }"
          aria-label="Scroll to top"
        >
          <span class="scroll-icon">↑</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentYear = new Date().getFullYear();
const showScrollTop = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* ===== BASE STYLES ===== */
.footer {
  background: #1a1a1a;
  color: #ffffff;
  padding: 60px 0 20px;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ===== FOOTER CONTENT ===== */
.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

/* ===== BRAND SECTION ===== */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.logo-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.brand-description {
  font-size: 0.85rem;
  color: #9ca3af;
  line-height: 1.5;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.social-link:hover {
  background: #667eea;
  transform: translateY(-2px);
}

.social-icon {
  font-size: 1rem;
}

/* ===== SECTION TITLES ===== */
.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
}

/* ===== FOOTER LINKS ===== */
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
  padding: 4px 0;
}

.footer-link:hover {
  color: #667eea;
}

/* ===== CONTACT SECTION ===== */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-icon {
  font-size: 1rem;
  width: 16px;
  text-align: center;
}

.contact-text {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* ===== FOOTER BOTTOM ===== */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #374151;
  position: relative;
}

.footer-copyright p {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

.footer-legal {
  display: flex;
  gap: 24px;
}

.legal-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: #667eea;
}

/* ===== SCROLL TO TOP BUTTON ===== */
.scroll-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.scroll-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-top:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.scroll-icon {
  font-size: 1.2rem;
  font-weight: 600;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 32px;
  }
  
  .brand-section {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 40px 0 20px;
  }
  
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  
  .brand-section {
    grid-column: 1 / -1;
    text-align: center;
  }
  
  .brand-logo {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .footer-legal {
    gap: 16px;
  }
  
  .scroll-top {
    bottom: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .contact-item {
    justify-content: center;
  }
  
  .footer-legal {
    flex-direction: column;
    gap: 8px;
  }
  
  .scroll-top {
    bottom: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
  }
  
  .scroll-icon {
    font-size: 1rem;
  }
}
</style>