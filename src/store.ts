import { reactive } from 'vue';
import axios from 'axios';
import { config } from 'dotenv';

if (import.meta.env.NODE_ENV === 'development') {
  config();
}

const fallbackurl = import.meta.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://titus-backend.fly.dev/';

export const store = reactive({
  user: null,
  church: null,
  members: [],
});

export const HTTP = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || fallbackurl, // Fallback to production URL
  // baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080', // Fallback to localhost
});

