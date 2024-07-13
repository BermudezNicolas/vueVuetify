<template>
  <div class="pt-10" >
    
    <v-card
      class="mx-auto  pa-12 pb-8 mb-9"
      elevation="8"
      max-width="500"
      rounded="lg"
    >
      <v-img
          class="mx-auto my-8"
          max-width="228"
          src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
      ></v-img>
     <v-form @submit.prevent="submit" ref="loginForm">
      
      <v-text-field
        v-model="userOrEmail"
        :rules="nameRules"
        label="E-mail"
        variant="outlined"
        density="compact"
        class="my-3"

      >
      </v-text-field>
      <v-text-field
        v-model="password"
        :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPass = !showPass"
        :type="showPass ? 'text' : 'password'"
        hint="password will be at least 6 characters"
        :rules="pwRules"
        label="Password"
        variant="outlined"
        density="compact"
      >
      </v-text-field>


      <v-checkbox
         v-model="rememberMe"
         label="Remember me"
         color="primary"
         class="ml-3"
      ></v-checkbox>

      <div class="text-center">

        <v-btn
        density="compact"
        size="large"
        variant="tonal"
        color="blue"
        :loading="loading"
        type="submit"
        class="mb-3 text-center text-none"
        
       > 
          Login
      </v-btn>
      </div>
    
        <p class="text-subtitle-1 text-medium-emphasis text-center">or</p>
        <v-card class="text-center mt-2" elevation="0">
          <router-link
            to="/register"
            class="text-decoration-none text-blue text-center"
            >SignUp</router-link
          >
        </v-card>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import '../gradientAnimationStyles.css'
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const loading = ref(false);
const loginForm = ref(true)

const userOrEmail = ref(localStorage.getItem('rememberMeEmail' || ''))
const password = ref('');
const showPass = ref(false)

const rememberMe = ref(document.cookie.includes('rememberMe=true'));

const nameRules = [(value) => !!value || 'Required.',
                   (value) => (/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(value)) || 'e-mail must be valid'
  ];
const pwRules =   [(value) => !!value || 'Required.',
                   (value) => (value.length >= 6)|| 'password must be al least 6'];

const visible = ref(false)
let timeout = -1;


    
const submit = async () => {
    loading.value = true
    const {valid, errors} = await loginForm.value.validate()
    if(valid) {
        const userStore = await useUserStore();
        const error = await userStore.loginUser(userOrEmail.value, password.value,rememberMe.value); // se usa para manejar los errores de autenticacion del user
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
                  case "auth/weak-password":
                    password.value =  "";
                    console.log("Invalid password");
                    break
                  case "auth/missing-password":
                    console.log("auth/missing-password");
                    break;
                  case "auth/missing-email":
                    console.log("missing-email");
                    break;   
                  default:
                    console.log(
                      "Something unexpected happened, please try again later..."
                    );
                  // reseteo el form si hay un error
                    password.value =  "";
                    break;
                }
              
    }
    loading.value = false
  }
</script>


<style>

</style>
