<template>
  <div>
        <v-snackbar
        v-model="snackbar"
        color="white"
        transition="fab-transition"      
        location="right"
        width="300"

      >   
          <div class="d-flex align-center justify-space-between">
            <div>
              <v-icon icon="mdi-email" color="primary" class="mr-2"></v-icon>
              <strong class="text-subtitule-1 ">Hey there! </strong>
            </div>
            <div >
            </div>
            <div>
              <v-btn icon="mdi-close"  color="black" variant="flat" size="small" class="bg-transparent pl-9" @click="snackbar = !snackbar"> </v-btn>
              </div>
          </div>
          <div class="ml-7">
              An e-mail has been sent to your account
          </div>

              
        

      </v-snackbar>

      <v-card
        class="mx-auto rounded py-6 "
        color="white"
        theme="dark"
        style="width: auto; border:20px; border-color:red"
        elevation="5"
      >
        <v-form class="px-2" @submit.prevent="submit" ref="emailUpdateForm">
          <v-text-field
            label="E-mail"
            variant="outlined"
            density="compact"
            placeholder="example@gmail.com"
            :rules="emailRules"
            v-model="email"
            class="mb-3"
          >
          </v-text-field>
          <v-text-field
          label="Password"
          variant="outlined"
          density="compact"
          placeholder="******"
          :rules="passwordRules"
          v-model="password"
        >
        </v-text-field>
        </v-form>
        <div class="d-flex justify-end">
          <slot  name="cancelCard">
          </slot> 
          <v-btn
            class="mr-2"
            color="primary"
            density="compact"
            :loading="loading"
            type="submit"
            @click="submit"
            >Submit</v-btn
          >
        </div>
      </v-card>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const snackbar = ref(false)


const alertActivated = ref(false)
const userStore = useUserStore()
const updateEmail = async () => {
  try {
    snackbar.value = true;
    await userStore.changeEmail(email.value, password.value);
    // Oculta la alerta después de 3 segundos
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      snackbar.value = false;
    }, 20000);
  }
};



const loading = ref(false);
const emailUpdateForm = ref(true);
const email = ref("");
const password = ref("");
const emailRules = [
  (value) => !!value || "Required.",
  (value) =>
    /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(value) || "e-mail must be valid",
  (value) => value != userStore.userData?.email || "Enter a different e-mail",
];

const passwordRules = [
  (value) => !!value || "Required.",
  (value) => (value.length >= 6) || "Password must be at least 6 characters"  
]

const submit = async () => {
  try {
    loading.value = true;
    const userStore = await useUserStore();
    userStore.loadingSession = true
    const { valid, errors } = await emailUpdateForm.value.validate();
    if (valid) {
      const error = await updateEmail();
      if (!error) {
        return; // no hace nada, en este caso no hubo problema con el metodo login, por lo que termina la funcion aca
      }
      console.log(error.code);
    }
  } catch (error) {
    console.log(error.code)
  }
  finally {
    loading.value = false;
    userStore.loadingSession = false

  }
};
</script>
<style lang=""></style>
