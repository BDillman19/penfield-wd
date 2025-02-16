<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Todos from './components/Todos.vue'
</script>

<template>
  <main>
    <authenticator :sign-up-attributes="['name']" :hide-sign-up="true">
      <template v-slot="{ user, signOut }">
        <button @click="signOut">Sign Out</button>
        <Todos />
      </template>  
    </authenticator>
  </main>
</template>

