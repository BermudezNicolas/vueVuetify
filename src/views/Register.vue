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
    <v-form @submit.prevent="submit" ref="loginForm">
      <v-text-field
        v-model="userOrEmail"
        :rules="nameRules"
        label="User name or email"
        hint="Username will be 3 to 10 characters"
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
      >
      </v-text-field>

      <v-text-field
        v-model="rPassword"
        :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPass = !showPass"
        :type="showPass ? 'text' : 'password'"
        hint="password will be at least 6 characters"
        :rules="rpwRules"
        label="Repeat Password"
      >
      </v-text-field>
      <v-btn
        color="blue"
        type="submit"
        block
        class="mt-2"
        :loading="loading"
      >
        Sign up
      </v-btn>
        <p class="text-subtitle-1 text-medium-emphasis text-center">or</p>
        <v-card class="text-center mt-2" elevation="0">
          <router-link
            to="/login"
            class="text-decoration-none text-blue text-center"
            >Log in</router-link
          >
        </v-card>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/user';
  const loginDialog = ref(true)

  const userOrEmail = ref('')
  const password = ref('')
  const rPassword = ref('')
  const showPass = ref(false)
  const loginForm = ref(null)
  const lastErrors = ref({})
  const loading = ref(false)

  const nameRules = [(value) => !!value || 'Required.',
                     (value) => (/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(value)) || 'e-mail must be valid'
  ]
  const pwRules = [(value) => !!value || 'Required.',
                   (value) => (value.length >= 6)|| 'password must be al least 6']

  const rpwRules =  [(value) => !!value || 'Required.',
                     (value) => (value === password.value)|| 'passwords do not match']

  const submit = async () => {
    loading.value = true
    const {valid, errors} = await loginForm.value.validate()
    if(valid) {
        const userStore = await useUserStore();
        const error = await userStore.registerUser(userOrEmail.value, password.value); // se usa para manejar los errores de autenticacion del user
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
                    repeatPassword.value =  "";
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


