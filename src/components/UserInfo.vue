<template>
  <ScrollPanel style="height: 100%; width: 100%;">
    <Card class="p-card" :style="{ width: '100%', height: '100%' }">
      <template #header>
        <div class="flex align-items-center justify-content-between">
          <h2 class="text-xl font-semibold">
            {{ store.user ? `${store.user.name.first} ${store.user.name.last}` : "User Information" }}
          </h2>
        </div>
      </template>
      <template #content>
        <div v-if="store.user">
          <div class="p-field">
            <label class="font-medium">Full Name:</label>
            <p>{{ store.user.name.first }} {{ store.user.name.last }}</p>
          </div>
          <div class="p-field">
            <label class="font-medium">Email:</label>
            <p>{{ store.user.email }}</p>
          </div>
          <div class="p-field">
            <label class="font-medium">Role:</label>
            <p>{{ store.user.role }}</p>
          </div>
        </div>

        <div v-else>
          <p>Loading user information...</p>
        </div>
      </template>
    </Card>
  </ScrollPanel>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import { store, HTTP } from "../store";
import axios from "axios";
import Card from "primevue/card";
import ScrollPanel from "primevue/scrollpanel";

const getUser = async (token) => {
  try {
    const res = await HTTP.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    return null;
  }
};

onMounted(async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    return;
  }

  const token = await user.getIdToken();
  store.user = await getUser(token);
});
</script>

<style scoped>
.p-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: var(--surface-a);
}

.font-medium {
  font-weight: 500;
}
</style>

