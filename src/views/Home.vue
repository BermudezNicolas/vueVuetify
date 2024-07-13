<template>
  <div>
    <AddForm></AddForm>
    <div class="mx-auto mb-3" style="width: 70%;">
        <v-expansion-panels
        variant="popout"
        v-for="doc of databaseStore.documents"
        :key="doc.id"
        class="w-7"
      >
        <v-expansion-panel
          class="border-t-sm border-white border-opacity-100"
          elevation="8"
          style="background-color:#3451ea;"
        >
          <v-expansion-panel-title expand-icon="mdi-menu-down">
            <v-col cols="auto">
              <p class="url-text text-white">{{ doc.name }}</p>
            </v-col>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row justify="space-between" align="center">
              <v-col cols="auto">
                <p class="text-white text-h5 text-start">Id</p>
              </v-col>
              <v-col cols="1" class="text-white">
                <v-divider class="border-opacity-100"></v-divider>
              </v-col>
              <v-col class="text-white">
                {{ doc.id }}
              </v-col>
            </v-row>
            <v-row justify="space-between" align="center">
              <v-col cols="auto">
                <p class="text-white text-h5 text-start">Short</p>
              </v-col>
              <v-col cols="1" class="text-white">
                <v-divider class="border-opacity-100"></v-divider>
              </v-col>
              <v-col class="text-white">
                {{ doc.short }}
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn
                  color="error"
                  variant="flat"
                  border="opacity-border-100"
                  density="compact"
                  class="mr-2"
                  @click="databaseStore.deleteUrl(doc.id)"
                  >Delete</v-btn
                >
                <v-btn
                  color="white"
                  variant="flat"
                  density="compact"
                  @click="router.push(`/edit/${doc.id}`)"
                  >Edit</v-btn
                >
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup>
import AddForm from "../components/AddForm.vue";
import { useUserStore } from "@/stores/user";
import { useDatabaseStore } from "@/stores/database";
import { useRouter } from "vue-router";

const router = useRouter();

const handleUpdate = async (docId, newUrl) => {
  try {
    console.log(docId, newUrl);
    await databaseStore.updateUrl(docid, newUrl);
    overlay.value = false; // Oculta la tarjeta de edición después de hacer clic en "Edit"
  } catch (error) {
    console.log(error.message);
  }
};

const userStore = useUserStore();
const databaseStore = useDatabaseStore();

databaseStore.getUrls();
</script>

<style>
.url-text {
  white-space: pre-wrap; /* Permite saltos de línea */
  word-break: break-all; /* Romper palabras para evitar truncamiento */
}
</style>
