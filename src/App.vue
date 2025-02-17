<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Customers from "./components/Customers.vue";
import Readings from "./components/Readings.vue";
import NewCustomerPopup from "./components/NewCustomerPopup.vue";
import '@coreui/coreui/dist/css/coreui.min.css';

</script>

<template>
  <main>
      <img id="logoHeader" src="./assets/PWDLogoFullUpdated.png"/>
    <authenticator :sign-up-attributes="['name']" :hide-sign-up="true">
      <template v-slot="{ user, signOut }">
        <button id="signOut" @click="signOut">Sign Out</button>
        <!-- <NewCustomerPopup /> -->
        <Customers />
        <!-- <Readings /> -->
      </template>  
    </authenticator>
  </main>
</template>

