<template>
  <v-sheet class="ma-4">
    <v-form validate-on="submit lazy" @submit.prevent="submit">
      <v-text-field
        prepend-inner-icon="$treeviewExpand"
        clearable
        variant="solo-inverted"
        label="Enter an URL:"
        v-model="url"
        :rules="urlRules"
      ></v-text-field>
      <div class="text-center">
        <v-btn
          :loading="loading"
          class="mt-2"
          text="Add"
          type="submit"
          width="50%"
        ></v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script>
import { useDatabaseStore } from '@/stores/database';
export default {
  data: () => ({
    loading: false,
    url: "",
    urlRules: [
      (v) => !!v || "URL is required",
      (v) => /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v) || "Invalid URL format",
    ],
  }),

  methods: {
    async submit(event) {
      this.loading = true;

      const isValidUrl = await this.checkApi(this.url);

      if (isValidUrl === true) {
        const database = await useDatabaseStore();
        database.addUrl(this.url);
        this.url = ""; // Limpiar el campo de URL después de agregarla
      }

      this.loading = false;
    },

    async checkApi(url) {
      return new Promise((resolve) => {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          if (!url) return resolve(false);
          if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(url)) return resolve(false);

          return resolve(true);
        }, 1000);
      });
    },
  },
};
</script>