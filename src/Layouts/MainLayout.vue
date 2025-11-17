<!-- src/Layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <Navbar />
    <main class="main-content">
      <!-- ✅ THIS WAS MISSING! -->
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8fafc;
}
.main-content {
  flex: 1;
  width: 100%;
}
</style>