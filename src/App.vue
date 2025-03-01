<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { RouterView } from "vue-router";
import { Button, IconField, InputIcon} from "primevue";
import { PrimeIcons } from '@primevue/core/api'

function routeToDashboard() {

}

</script>

<template>
  <main>
      <img id="logoHeader" src="./assets/PWDLogoFullUpdated.png"/>
    <authenticator :sign-up-attributes="['name']" :hide-sign-up="true">
      <template v-slot="{ user, signOut }">
        <div id="routeButtons">
          <RouterLink to="/dashboard">
            <Button 
              id="dashboardButton" 
              severity="secondary" 
              raised>
              <InputIcon id="dashboardButtonIcon" :class="PrimeIcons.HOME" />
              <span id="dashboardButtonText">Dashboard</span>
            </Button>
          </RouterLink>
          <Button 
            id="signOut" 
            severity="contrast" 
            raised 
            @click="signOut">
            <InputIcon id="signOutButtonIcon" :class="PrimeIcons.SIGN_OUT" />
            <span id="signOutButtonText">Sign Out</span>
          </Button>
        </div>
          
          <RouterView />
      </template>  
    </authenticator>
  </main>
</template>

