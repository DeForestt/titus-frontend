import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/home.vue"),
    },
    {
      path: "/register",
      component: () => import("../views/registration.vue"),
    },
    {
      path: "/sign-in",
      component: () => import("../views/sign-in.vue"),
    },
    {
      path: "/dashboard",
      component: () => import("../views/dashboard.vue"),
    },
    {
      path: "/:onboarding",
      component: () => import("../views/create_account.vue"),
    },
  ],
});

export default router;
