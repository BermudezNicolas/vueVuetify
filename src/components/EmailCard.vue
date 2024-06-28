<template>
  <div>
      <v-card
        class="mx-auto rounded py-6 border-xl border-red border-opacity-100"
        color="black"
        style="width: auto"
        border="lg opacity-100"
        elevation="5"
      >
        <v-form class="px-2" @submit.prevent="submit" ref="emailUpdateForm">
          <v-text-field
            label="email"
            variant="outlined"
            density="compact"
            placeholder="example@gmail.com"
            :rules="emailRules"
            v-model="email"
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

const alertActivated = ref(false)
const userStore = useUserStore()
const updateEmail = async () => {
  try {
    alertActivated.value = true;
    await userStore.changeEmail(email.value);
    // Oculta la alerta después de 3 segundos
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      alertActivated.value = false;
    }, 10000);
  }
};

const loading = ref(false);
const emailUpdateForm = ref(true);
const email = ref("");
const emailRules = [
  (value) => !!value || "Required.",
  (value) =>
    /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(value) ||
    "e-mail must be valid",
];

const submit = async () => {
  loading.value = true;
  const { valid, errors } = await emailUpdateForm.value.validate();
  if (valid) {
    const error = await updateEmail();
    if (!error) {
      return; // no hace nada, en este caso no hubo problema con el metodo login, por lo que termina la funcion aca
    }
    console.log(error.code);
  }
  loading.value = false;
};
</script>
<style lang=""></style>
