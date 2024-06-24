<template>
    <div class="mx-auto" style="width: 70%; height:auto">
      <v-hover v-slot="{ isHovering, props }"  close-delay="100">
        <v-card class="mx-auto border-thin border-opacity-100" v-bind="props" theme="dark" :class="{enlarge : isHovering, normal: !isHovering}">
          <v-fade-transition >
            <div v-if="isHovering" class="d-flex justify-center bg-primary v-card--reveal text-h4 pb-1" style="opacity: 1; height:100%">
              <slot name="updateBtn">
                 
              </slot>
             
            </div>
          </v-fade-transition>
          <v-card-text>
            <slot></slot>
          </v-card-text>
        </v-card>
      </v-hover>
    </div>
  </template>
  
  <script>
  export default {
  
  }
  </script>
  
  <style>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: space-around;
    position: absolute;
    width: 100%;
    height: 100%
  }


 
  
  .normal {
    transform: scale(1); /* Tamaño normal */
    transition: transform 0.2s ease-out; /* Transición al volver al tamaño normal */
  }
  </style>