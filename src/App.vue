<template>
    <div class="card">
      <MenuBar :model="filteredLinks">
        <template #start>
          <div class="logo-container">
              <router-link to="/" class="p-menuitem-link">
                <img src="/logo.svg" alt="primevue" class="menu-logo" />
              </router-link>
          </div>
        </template>
        <template #item="{ item, props }">
          <router-link v-if="item.route" :to="item.route" class="p-menuitem-link" @click="item.command">
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </template>
        <template #end>
          <!-- user name and church name -->
          <div class="flex flex-col items-end"
              v-if="store.user && store.church"
            >
            <span class="text-sm font-semibold">{{ store.user.name.first }} {{store.user.name.last}}</span>
            <span class="text-xs text-gray-500">{{ store.church.name }}</span>
          </div>
        </template>
      </MenuBar>
    </div>
    <router-view />
</template>

<script setup>
import { ref, computed} from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import MenuBar from "primevue/menubar";
import { store } from "./store";

const auth = getAuth();
const router = useRouter();

const logOut = async () => {
  try {
    await signOut(auth);
    store.user = null;
    store.church = null;
    router.push("/");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const isLoggedIn = ref(false);

// Watch authentication state
onAuthStateChanged(auth, (user) => {
  isLoggedIn.value = !!user;
});

// Links configuration
const links = [
  { 
    label: "Home", 
    route: "/",
    auth: null,
    icon: "pi pi-fw pi-home",
  },
  { 
    label: "Dashboard",
    route: "/dashboard", 
    auth: true,
    icon: "pi pi-fw pi-th-large",
  },
  {
    label: "Sign Out",
    route: "/",
    auth: true,
    command: logOut,
    icon: "pi pi-fw pi-sign-out",
  },
  {
    label: "Register",
    route: "/register",
    auth: false,
    icon: "pi pi-fw pi-user-plus",
  },
  {
    label: "Login",
    route: "/sign-in",
    auth: false,
    icon: "pi pi-fw pi-sign-in",
  },
];
const filteredLinks = computed(() => links.filter((link) => link.auth === isLoggedIn.value || link.auth === null));

</script>

<style>
  .logo-container {
  display: flex;
  align-items: center; /* Centers the logo in the menu bar */
  height: 100%; /* Matches the height of the MenuBar */
  padding: 0 1rem; /* Adds some space around the logo */
  }

  .menu-logo {
  max-height: clamp(40px, 8vh, 80px); /* Responsive height */
  width: auto; /* Maintains aspect ratio */
  object-fit: contain; /* Ensures it doesn't get stretched */
  }
</style>
