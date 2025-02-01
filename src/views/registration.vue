<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Create an Account
      </h1>
      
      <Form
        v-slot="$form"
        :initialValues
        :resolver
        @submit="register"
        class="flex flex-col gap-6 w-full"
      >
        <div class="flex flex-col gap-2">
          <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Email</label>
          <InputText
            placeholder="Enter your email"
            name="email"
            type="email"
            v-model="email"
            class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="filled">
            {{ $form.email.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Password</label>
          <InputText
            placeholder="Enter your password"
            name="password"
            type="password"
            v-model="password"
            class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="filled">
            {{ $form.password.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-gray-700 dark:text-gray-300 text-sm font-medium">Re-enter Password</label>
          <InputText
            placeholder="Confirm your password"
            name="repassword"
            type="password"
            class="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <Message v-if="$form.repassword?.invalid" severity="error" size="small" variant="filled">
            {{ $form.repassword.error?.message }}
          </Message>
        </div>
        
        <Button 
          type="submit"
          label="Register"
          severity="primary"
          class="w-full py-3 text-lg"
        />

        <Message v-if="error" severity="error" size="small" variant="filled">
          {{ error }}
        </Message>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Button from "primevue/button";

const error = ref(null);
const email = ref("");
const password = ref("");

const auth = getAuth();
const router = useRouter();

const initialValues = reactive({
  email: "",
  password: "",
  repassword: "",
});

const resolver = async ({ values }) => {
  const errors = {};
  if (!values.email) {
    errors.email = [{ message: "Email is required" }];
  }

  if (!values.password) {
    errors.password = [{ message: "Password is required" }];
  } else if (values.password.length < 6) {
    errors.password = [{ message: "Password must be at least 6 characters" }];
  }

  if (!values.repassword) {
    errors.repassword = [{ message: "Re-enter password is required" }];
  }

  if (values.password !== values.repassword) {
    errors.repassword = [{ message: "Passwords do not match" }];
  }

  return {
    errors,
  };
};

const register = async ({ valid }) => {
  if (!valid) {
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push("/onboarding");
  } catch (e) {
    error.value = e.message;
  }
};
</script>

