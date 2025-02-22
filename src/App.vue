<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Customers from "./components/Customers.vue";
import '@coreui/coreui/dist/css/coreui.min.css';


</script>

<template>
  <main>
      <img id="logoHeader" src="./assets/PWDLogoFullUpdated.png"/>
    <authenticator :sign-up-attributes="['name']" :hide-sign-up="true">
      <template v-slot="{ user, signOut }">
        <button id="signOut" @click="signOut">Sign Out</button>
        <Customers />
      </template>  
    </authenticator>
  </main>
</template>

