<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import Customers from "./components/Customers.vue";
import CustomersTable from "./components/CustomersTable.vue";
import '@coreui/coreui/dist/css/coreui.min.css';
import { onMounted, ref, watchEffect} from "vue";
import type { Schema } from "amplify/data/resource";
import { generateClient } from 'aws-amplify/data'

const customerData = ref<Array<Schema['Customer']['type']>>([])
const client = generateClient<Schema>()

client.models.Customer.observeQuery().subscribe({
  next: ({ items, isSynced }) => {
    customerData.value = items
  }
})

</script>

<template>
  <main>
      <img id="logoHeader" src="./assets/PWDLogoFullUpdated.png"/>
    <authenticator :sign-up-attributes="['name']" :hide-sign-up="true">
      <template v-slot="{ user, signOut }">
        <button id="signOut" @click="signOut">Sign Out</button>

        <!-- <CustomersTable :customerData="customerData" /> -->

        <Customers />
        <!-- <Readings /> -->
      </template>  
    </authenticator>
  </main>
</template>

