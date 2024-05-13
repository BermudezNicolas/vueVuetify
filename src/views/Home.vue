<template>
  <v-main>
   <AddForm></AddForm>
   <v-container class=" border-xl mb-8 elevation-3 border-info border-double">
       <p class="text-h2 font-weight-medium text-center mb-3">Urls</p>
       <v-divider :thickness="3" color="info" class="mb-2" ></v-divider>
       <v-row no-gutters justify="center">
           <v-col cols="auto"   v-for="doc of databaseStore.documents" :key="doc.id">
               <v-card class="ma-3 pa-2" elevation="2" border rounded>           
                    <p class="font-weight-bold text-high-emphasis text-h5">Id: {{ doc.id }}</p>
                    <br>
                    <p class="font-weight-bold text-high-emphasis text-h5">Url: {{ doc.name }}</p>
                    <br>
                    <p class="font-weight-bold text-high-emphasis text-h5">Short: {{ doc.short }}</p>
                    <div class="text-center">
                        <v-btn  elevation="4" color="primary" density="compact"  class="rounded-lg mb-2" block @click="overlay = !overlay">
                            Edit
                            <v-overlay v-model="overlay" class="align-center justify-center">
                                   <div>
                                        <v-confirm-edit v-model="model">
                                            <template v-slot:default="{ model: proxyModel, actions }">
                                                <v-card
                                                  class="mx-auto"
                                                  max-width="320"
                                                  title="Update Field"
                                                >
                                                  <template v-slot:text>
                                                    <v-text-field
                                                      v-model="proxyModel.value"
                                                      messages="Modify my value"
                                                    ></v-text-field>
                                                  </template>
                                            
                                                  <template v-slot:actions>
                                                    <v-spacer></v-spacer>
                                            
                                                    <component :is="actions"></component>
                                                  </template>
                                                </v-card>
                                            </template>
                                        </v-confirm-edit>
                                   </div>
                            </v-overlay>                       
                        </v-btn>
                        <v-btn elevation="3" color="error" class="rounded-lg" density="compact">Delete</v-btn>
                    </div>
                </v-card>
           </v-col>
       </v-row>
   </v-container>

  </v-main>

 
</template>

<script setup>
import AddForm from '../components/AddForm.vue';
import { useUserStore } from '@/stores/user';
import { useDatabaseStore } from '@/stores/database';
import router from '@/router/router';

import {ref, watch} from 'vue';
import { shallowRef } from 'vue'

const model = shallowRef('Egg plant')


const userStore = useUserStore();
const databaseStore = useDatabaseStore();


const overlay = ref(false);



databaseStore.getUrls()


</script>