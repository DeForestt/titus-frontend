import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const firebaseConfig = {
  apiKey: "AIzaSyCaLszIXdoneJ60CalgGuZraB7JrvHpoXA",
  authDomain: "titus-managment.firebaseapp.com",
  projectId: "titus-managment",
  storageBucket: "titus-managment.firebasestorage.app",
  messagingSenderId: "760270556512",
  appId: "1:760270556512:web:890442052e8a5338166205",
  measurementId: "G-VSJQBCDMHG"
};


initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  // Default theme configuration
  theme: {
      preset: Aura,
      options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
      }
  }
});
app.mount('#app');

