import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Notifications
import VueSonner from 'vue-sonner'  // ✅ fixed import

// Font Awesome for Footer icons
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
app.use(router)
app.use(VueSonner)
app.mount('#app')
