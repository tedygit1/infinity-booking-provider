<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />

    <Toaster position="top-right" rich-colors />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Footer
  }
};
</script>
