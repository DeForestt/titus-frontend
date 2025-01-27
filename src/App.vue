<template>
    <div class="card">
      <MenuBar :model="filteredLinks">
        <template #start>
          <img src="./assets/vue.svg" alt="primevue" href="/">
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

const auth = getAuth();
const router = useRouter();

const logOut = async () => {
  try {
    await signOut(auth);
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
  { label: "Home", 
    url: "/",
    auth: null,
    icon: "pi pi-fw pi-home",
  },
  { 
    label: "Dashboard",
    url: "/dashboard", 
    auth: true,
    icon: "pi pi-fw pi-th-large",
  },
  {
    label: "Sign Out",
    url: "/",
    auth: true,
    command: logOut,
    icon: "pi pi-fw pi-sign-out",
  },
  {
    label: "Register",
    url: "/register",
    auth: false,
    icon: "pi pi-fw pi-user-plus",
  },
  {
    label: "Login",
    url: "/sign-in",
    auth: false,
    icon: "pi pi-fw pi-sign-in",
  },
];
const filteredLinks = computed(() => links.filter((link) => link.auth === isLoggedIn.value || link.auth === null));

</script>

