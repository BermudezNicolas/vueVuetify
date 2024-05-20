<template>
  <div>
    <v-img
      class="mx-auto my-8"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>
    <v-card
      class="mx-auto pa-12 pb-8 mb-9"
      elevation="8"
      max-width="500"
      rounded="lg"
    >
      <v-form validate-on="submit lazy" @submit.prevent="submit" max-width="500">
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>
        <v-text-field
          v-model="mail"
          placeholder="Email Adress"
          :rules="mailRules"
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex aling-center justify-space-between"
        >
          Password
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
            >Forgot your password?</a
          >
        </div>
        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          :rules="passwordRules"
        ></v-text-field>
        
        <v-checkbox  
        class="pl-1"  
        label="Remember me" 
        v-model="rememberMe" 
        base-color="blue"
       > 
       </v-checkbox>

       

        <div class="text-center">
          <v-btn
            density="compact"
            size="large"
            variant="tonal"
            color="blue"
            :loading="loading"
            type="submit"
            class="mb-3"
            >Log In</v-btn
          >
        </div>
        <p class="text-subtitle-1 text-medium-emphasis text-center">or</p>
        <v-card class="text-center mt-2" elevation="0">
          <router-link
            to="/register"
            class="text-decoration-none text-blue text-center"
            >Sing Up</router-link
          >
        </v-card>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const loading = ref(false);
const mailRules = [value => checkMail(value)];
const passwordRules = [value => checkPassword(value)];
const mail = ref(localStorage.getItem('rememberMeEmail' || ''));
const password = ref(localStorage.getItem('rememberMePassword' || ''));
const rememberMe = ref(document.cookie.includes('rememberMe=true'));
const visible = ref(false)
let timeout = -1;


    
async function submit (event) {
      loading.value = true;
      const userStore = await useUserStore();
      console.log(rememberMe.value)
      const error = await userStore.loginUser(mail.value, password.value,rememberMe.value); // se usa para manejar los errores de autenticacion del user
      if (!error) {
        return; // no hace nada, en este caso no hubo problema con el metodo login, por lo que termina la funcion aca
      }

      switch (
        error // contempla los distintos errores que tira firebase por parte de la auth, dependendiendo el error voy a notificar a la UI del mismo
      ) {
        case "auth/invalid-credential":
          console.log("Invalid Credentials");
          // reseteo el form si hay un error
          password.value =  "";
          break;
        case "auth/invalid-email":
          console.log("Invalid Email");
          break;  
        case "auth/missing-password":
          console.log("auth/missing-password");
          break;
        default:
          console.log(
            "Something unexpected happened, please try again later..."
          );
          mail.value =  "";      // reseteo el form si hay un error
          password.value =  "";
          break;
      }
      loading.value = false;
    }

async function checkMail(value) {
      return new Promise((resolve) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          if (!value) return resolve("Please enter an email.");
          if (!/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(value))
            return resolve("This is not a valid email. Please try again");

          return resolve(true);
        }, 1000);
      });
}

async function checkPassword(value) {
      return new Promise((resolve) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          if (!value) 
            return resolve("Please enter a password.");
          if (value.length < 6)
            return resolve("Password must be at least 6 characters");

          return resolve(true);
        },1);
      });
}
</script>


