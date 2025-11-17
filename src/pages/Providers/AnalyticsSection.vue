<template>
  <div class="analytics-section">
    <div class="header">
      <h2 class="title">📊 Analytics Overview</h2>
      <p class="subtitle">Visual insights into your service performance</p>
    </div>

    <!-- Chart Placeholder -->
    <div class="chart-placeholder">
      <span v-if="!chartLoaded">Chart visualization coming soon…</span>
      <!-- Later: ApexCharts or Chart.js will be injected here -->
    </div>

    <!-- Analytics Summary Cards -->
    <div class="analytics-cards">
      <div class="analytic-card top-service">
        <div class="card-icon">
          <i class="fa-solid fa-medal"></i>
        </div>
        <h3>Top Service</h3>
        <p>{{ analytics.topService }}</p>
      </div>

      <div class="analytic-card satisfaction">
        <div class="card-icon">
          <i class="fa-solid fa-face-smile"></i>
        </div>
        <h3>Customer Satisfaction</h3>
        <p>{{ animatedSatisfaction }}%</p>
      </div>

      <div class="analytic-card response-time">
        <div class="card-icon">
          <i class="fa-solid fa-clock"></i>
        </div>
        <h3>Avg Response Time</h3>
        <p>{{ analytics.responseTime }} hrs</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const analytics = ref({
  topService: "Loading...",
  satisfaction: 0,
  responseTime: 0,
});

const animatedSatisfaction = ref(0);
const chartLoaded = ref(false);

function animateSatisfaction(target) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    animatedSatisfaction.value = current;
  }, 20);
}

async function fetchAnalytics() {
  try {
    // ✅ TEMP Demo Data
    const data = {
      topService: "Electrical Maintenance",
      satisfaction: 94,
      responseTime: 2,
    };

    analytics.value = data;
    animateSatisfaction(data.satisfaction);
  } catch (error) {
    console.error("Failed to load analytics:", error);
    analytics.value = {
      topService: "N/A",
      satisfaction: 0,
      responseTime: 0,
    };
  }
}

onMounted(() => {
  fetchAnalytics();
  setTimeout(() => {
    chartLoaded.value = true;
  }, 800);
});
</script>

<style scoped>
.analytics-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: #1e293b;
  font-family: "Poppins", sans-serif;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* ----- Chart Placeholder ----- */
.chart-placeholder {
  height: 300px;
  background: linear-gradient(135deg, #f0f9ff, #dbeafe);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
  color: #475569;
  font-style: italic;
  font-size: 1.2rem;
  box-shadow: 0 8px 20px rgba(30, 64, 175, 0.08);
  border: 1px solid #e0e7ff;
}

/* ----- Analytics Cards Grid ----- */
.analytics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.analytic-card {
  background: white;
  border-radius: 20px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  position: relative;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.analytic-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: transparent;
}

.analytic-card h3 {
  font-size: 1.15rem;
  color: #334155;
  margin: 16px 0 12px;
  font-weight: 600;
}

.analytic-card p {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #0f172a;
  margin: 0;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 1.4rem;
}

.top-service { 
  border-top-color: #3b82f6; 
}
.top-service .card-icon {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.satisfaction { 
  border-top-color: #10b981; 
}
.satisfaction .card-icon {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.response-time { 
  border-top-color: #f59e0b; 
}
.response-time .card-icon {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.analytic-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .analytics-section {
    padding: 20px;
  }

  .title {
    font-size: 1.9rem;
  }

  .chart-placeholder {
    height: 260px;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .analytics-cards {
    gap: 20px;
  }

  .analytic-card {
    padding: 24px 16px;
  }

  .analytic-card p {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .analytics-section {
    padding: 16px;
  }

  .header {
    margin-bottom: 24px;
  }

  .title {
    font-size: 1.7rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .chart-placeholder {
    height: 220px;
    font-size: 1rem;
    margin-bottom: 1.8rem;
  }

  .analytics-cards {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .analytic-card {
    padding: 26px 18px;
  }

  .analytic-card p {
    font-size: 1.7rem;
    letter-spacing: 0.3px;
  }

  .card-icon {
    width: 56px;
    height: 56px;
    font-size: 1.3rem;
  }
}
</style>