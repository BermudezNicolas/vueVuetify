<template>
  <v-overlay v-model="overlay" persistent class="align-center justify-center">
    <v-card
      elevation="8"
      style="width: 600px; height: 300px; border-radius: 23px"
    >
      <v-form validate-on="submit lazy" @submit.prevent>
        <div class="text-h3 text-center my-2">Edit url</div>
        <v-divider :thickness="1" class="border-opacity-25 my-4"></v-divider>
        <div class="mx-2 text-subtitle-1 text-medium-emphasis">Url</div>
        <v-text-field
          v-model="url"
          :rules="rules"
          variant="outlined"
          prepend-inner-icon="mdi-pencil"
          class="mx-2 mb-2"
          clearable
        ></v-text-field>
        <div class="d-flex justify-center">
          <v-btn
            variant="tonal"
            color="error"
            density="compact"
            class="ma-2"
            @click="router.push('/')"
            >Cancel</v-btn
          >
          <v-btn
            type="submit"
            variant="tonal"
            color="info"
            density="compact"
            class="ma-2"
            @click="submit"
            >Edit</v-btn
          >
        </div>
      </v-form>
    </v-card>
  </v-overlay>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useDatabaseStore } from "@/stores/database";
import { useRoute } from "vue-router";
import { updateDoc } from "firebase/firestore/lite";
import router from "@/router/router";

const url = ref("");
let validUrl = false;
const rules = [(value) => checkApi(value)];
const overlay = ref(true);

const databaseStore = useDatabaseStore();
const route = useRoute();

onMounted(async () => {
  const data = await databaseStore.readUrl(route.params.id);
  url.value = data; // Acceder a la propiedad 'url' del objeto
});

async function submit(event) {
  try {
    if (validUrl) await databaseStore.updateUrl(route.params.id, url.value);
  } catch (error) {
    console.log("url invalido");
  }
}

async function checkApi(url) {
  return new Promise((resolve) => {
    if (!url) {
      return resolve("Please enter a url.");
    }
    if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(url)) {
      return resolve("Invalid url.");
    }
    validUrl = true;
    return resolve(true);
  });
}
</script>
