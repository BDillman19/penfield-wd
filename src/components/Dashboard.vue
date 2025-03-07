<script setup lang="ts">
import { Card, Button, InputIcon } from 'primevue';
import { PrimeIcons } from '@primevue/core/api'
import 'primeicons/primeicons.css'

</script>

<template>
    <div class="pageTitle">
        <h1>Dashboard</h1>
    </div>
    <div class="routerCards">
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
        <span class="cards">
            <RouterLink to="/meter-reading-mode">
                <Card>
                    <template #header>
                        <img alt="user header" class="cardIcons" src="../assets/water-meter.png"/>
                    </template>
                    <template #title>
                        <p class="cardTitle">Readings</p>
                    </template>
                    <template #content>
                    </template>
                    <template #footer>
                    </template>
                </Card>
            </RouterLink>
        </span>
        <span class="cards">
            <RouterLink to="/schedule">
                <Card>
                    <template #header>
                        <img alt="calendar" class="cardIcons" src="../assets/calendar-logo2.png" />
                    </template>
                    <template #title>
                        <p class="cardTitle">Schedule</p>
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