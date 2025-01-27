import { reactive } from 'vue';
import axios from 'axios';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  const { config } = await import('dotenv');
}

export const store = reactive({
  user: null,
  church: null,
});

export const HTTP = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://titus-backend.fly.dev/', // Fallback to production URL
});

