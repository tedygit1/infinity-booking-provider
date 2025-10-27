<template>
  <div>
    <Navbar />
    <main class="min-h-screen">
      <slot /> <!-- This renders router-view -->
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from "@/Components/Navbar.vue";
import Footer from "@/Components/Footer.vue";

export default {
  name: "MainLayout",
  components: { Navbar, Footer }
};
</script>

<style scoped>
/* Optional: layout-specific styles */
</style>
