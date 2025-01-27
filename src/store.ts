import { reactive } from 'vue';
import axios from 'axios';
import { config } from 'dotenv';
import { getAuth, onAuthStateChanged } from "firebase/auth";

if (process.env.NODE_ENV === 'development') {
  const { config } = await import('dotenv');
}

const fallbackurl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://titus-backend.fly.dev/';

export const store = reactive({
  user: null,
  church: null,
  members: [],
});

export const HTTP = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || fallbackurl, // Fallback to production URL
});

