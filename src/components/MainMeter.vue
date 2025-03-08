<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Schema } from 'amplify/data/resource';
import { generateClient } from 'aws-amplify/data'
import { DataTable, Column} from 'primevue'
import { PrimeIcons } from '@primevue/core/api'
import Readings from './Readings.vue';
import 'primeicons/primeicons.css'

const client = generateClient<Schema>()
const mainMeterId = '821355f3-e27e-4c19-8181-36804b1f7765'
const readings = ref<Array<Schema['Reading']['type']>>([])
const loading =ref(true)
const formatDate = (value: Date) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

async function fetchMainMeterReadings(){ 
    client.models.Reading.observeQuery({
        filter: {
            meterId: {
                eq: mainMeterId
            }
        }
    }).subscribe({
    next: ({ items, isSynced }) => {
      readings.value = items
      loading.value = false
     },
  });
  
}

function compareReadings(reading1: {createdAt: string}, reading2: {createdAt: string}) {
    if (new Date(reading1.createdAt) < new Date(reading2.createdAt)) {
        return 1;
    } else if (new Date(reading1.createdAt) > new Date(reading2.createdAt)) {
        return -1;
    } else {
        return 0
    }
}

onMounted( () => {
    fetchMainMeterReadings()
})
</script>

<template>
    <div class="pageTitle">
        <h1>Main Meter</h1>
    </div>
    <DataTable
        width="90%"
        id="mainMeterReadingsTable"
        :expanded-row-icon="PrimeIcons.ANGLE_DOWN"
        :collapsed-row-icon="PrimeIcons.INFO_CIRCLE"
        data-key="id"
        :value="readings"
        show-gridlines
        striped-rows
        paginator :rows="5" :rows-per-page-options="[5, 10, 15, 20]"
        removable-sort
        filter-display="row"
        :loading="loading"
        scrollable
        scroll-height="400px"
        size="small"
        sort-field="createdAt"
        :sortOrder="-1">
        <template #header>
                <Readings :customer-id="mainMeterId" v-on:new-main-reading="fetchMainMeterReadings()"/>              
        </template>
        <template #empty> No Readings found. </template>
        <template #loading> Loading main meter data. Please wait. </template>
        <Column field="value" header="Value" sortable>
            <template #body="{ data }">
                {{ data.value }}
            </template>
        </Column>
        <Column field="createdAt" header="Date" sortable>
            <template #body="{ data }">
                {{ formatDate(new Date(data.createdAt)) }}
            </template>
        </Column>
        <Column field="usage" header="Usage">
            <template #body="{ data }">
                {{ data.usage }}
            </template>
        </Column>
    </DataTable>
</template>