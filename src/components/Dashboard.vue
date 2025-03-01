<script setup lang="ts">
import { Card, Button, InputIcon } from 'primevue';
import { PrimeIcons } from '@primevue/core/api'
import 'primeicons/primeicons.css'

</script>

<template>
    <h1 class="pageTitle">Dashboard</h1>
    <div>
        <span class="cards">
            <RouterLink to="/customers">
                <Card>
                    <template #header>
                        <img alt="user header" class="cardIcons" src="../assets/customers-icon.png"/>
                    </template>
                    <template #title>
                        <p class="cardTitle">Customers</p>
                    </template>
                    <template #content>
                    </template>
                    <template #footer>
                    </template>
                </Card>
            </RouterLink>
        </span>
        <span class="cards">
            <RouterLink to="/main-meter">
                <Card>
                    <template #header>
                        <!-- <i class="cardIcons pi pi-gauge"></i> -->
                        <!-- <InputIcon :class="PrimeIcons." /> -->
                        <img alt="user header" class="cardIcons" src="../assets/main-meter.png"/>
                    </template>
                    <template #title>
                        <p class="cardTitle">Main Meter</p>
                    </template>
                    <template #content>
                    </template>
                    <template #footer>
                    </template>
                </Card>
            </RouterLink>
        </span>
    </div>
</template>