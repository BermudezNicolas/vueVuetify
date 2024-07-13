<template>
  <div>
       
      <v-card
        class="mx-auto rounded py-6 "
        color="white"
        theme="dark"
        style="width: auto; border:20px; border-color:red"
        elevation="5"
      >
        <v-form class="px-2" @submit.prevent="submit" ref="phoneUpdateForm">
          <v-text-field
            label="Phone"
            variant="outlined"
            density="compact"
            placeholder="example@gmail.com"
            :rules="phoneRules"
            v-model="phone"
            class="mb-3"
          >
          </v-text-field>

        </v-form>
        <div class="d-flex justify-end">
          <slot  name="cancelCard">
          </slot> 
          <v-btn
            class="mr-2"
            color="primary"
            :disabled="loading"
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
import { useUserStore } from "@/stores/user";
import {useDatabaseStore} from "@/stores/database"
import { ref } from "vue";


const userStore = useUserStore();

const loading = ref(false);
const phoneUpdateForm = ref(true);
const phone = ref(" ");

const phoneRules = [
  (value) => !!value || "Required.",
  (value) => value.length >= 8 || "Phone number must be valid.",
  (value) => /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/.test(value) ||
    "Phone number must be valid.",
];

const submit = async () => {
  try {
    loading.value = true;
    const userStore = await useUserStore();
    const database = await useDatabaseStore()
    const { valid, errors } = await phoneUpdateForm.value.validate();
    if (valid) {
      const error = await database.changePhone(phone.value);
      if (!error) {
        return; // no hace nada, en este caso no hubo problema con el metodo login, por lo que termina la funcion aca
      }
      console.log(error.code);
    }
  } catch (error) {
    console.log(error.code);
  } finally {
    loading.value = false;
  }
};
</script>
