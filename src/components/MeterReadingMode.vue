<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Schema } from 'amplify/data/resource';
import { generateClient } from 'aws-amplify/data'
import { DataTable, Column, InputIcon, InputText, IconField, Button} from 'primevue'
import { PrimeIcons } from '@primevue/core/api'
import Readings from './Readings.vue';
import 'primeicons/primeicons.css'
import { FilterMatchMode } from '@primevue/core/api'


const client = generateClient<Schema>()
// const mainMeterId = '821355f3-e27e-4c19-8181-36804b1f7765'
// const readings = ref<Array<Schema['Reading']['type']>>([])
const customers = ref<Array<Schema['Customer']['type']>>([])
const tableData = ref<Array<Object>>([])
const loading =ref(true)
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// const formatDate = (value: Date) => {
//     return value.toLocaleDateString('en-US', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//     });
// };

async function fetchCustomers(){ 
    client.models.Customer.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
        customers.value = items        
        let latestValue = ref()
        console.log(customers.value)
        items.forEach((customer) => {
            console.log(customer.readings.length)
            testingStuff(customer.id).then((value) => latestValue.value = value)
            console.log(latestValue.value)
            tableData.value.push({
                id: customer.id,
                name: customer.name,
                serviceAddress: customer.serviceAddress,
                latestReading: latestValue
            })
        })
     },
  });
  console.log(tableData)
  loading.value = false
}

async function testingStuff(customerId: string) {
    let result = await getLatestMeterReading(customerId)
    console.log('In temp func. Value is', result)
    return result
}

// async function generateTableData() {
//     let tempList = await fetchCustomers()
//     console.log(tempList)
//     let latestValue
//     tempList.forEach((customer) => {
//         latestValue = getLatestMeterReading(customer.id)
//         tableData.value.push({
//             id: customer.id,
//             name: customer.name,
//             serviceAddress: customer.serviceAddress,
//             latestReading: latestValue
//         })
//     })

//     loading.value = false

//     console.log("Customers", customers.value)
//     console.log("table Data", tableData.value)
// }

// function updateTableData(customerId: string) {
//     tableData.value.findIndex((entry) => {
//         entry.id == customerId
//     })
// } 

function getLatestMeterReading(customerId: string) {
    let result
    return new Promise((resolve, reject) => {
        client.models.Reading.list({        
        filter: {
            meterId: {
                eq: customerId
            }
        },
        
        }).then ((readingList) => {
            console.log(readingList.data.length, customerId, readingList)
            if (readingList.data.length == 0) {
                resolve('No Value')
            } else {
                result = readingList.data.sort(compareReadings)[0].value
                console.log('Sending Value', result)
                resolve(result)
            }
        })
    })
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
    fetchCustomers()
})

// onUnmounted(() =>{

// })
</script>

<template>
    <h1 class="pageTitle">Meter Reading Mode</h1>
    <DataTable
        width="90%"
        id="meterReadingModeTable"
        data-key="id"
        :value="tableData"
        show-gridlines
        striped-rows
        paginator :rows="5" :rows-per-page-options="[5, 10, 15, 20]"
        removable-sort
        v-model:filters="filters"
        filter-display="row"
        :loading="loading"
        :global-filter-fields="['name', 'serviceAddress']"
        scrollable
        scroll-height="400px"
        size="small">
        <Column expander style="width: 5rem" />
        <template #header>
            <div class="globalSearch">
                <IconField>
                    <InputIcon :class="PrimeIcons.SEARCH" />
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
            </div>               
        </template>
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>
        <Column field="name" header="Name" sortable>
            <template #body="{ data }">
                {{ data.name }}
            </template>
        </Column>
        <Column field="serviceAddress" header="Service Address" sortable>
            <template #body="{ data }">
                {{ data.serviceAddress }}
            </template>
        </Column>
        <Column field="latestReading" header="Latest Reading">
            <template #body="{ data }">
                {{ data.latestReading }}
            </template>
        </Column>
        <!-- <Column class="w-24 !text-end">
            <template #body="{ data }">
                <Readings :customerId="data.id" @new-customer-reading="(customerId) => fetchReadingsByMeterId(customerId)"/>
            </template>
        </Column> -->
    </DataTable>
</template>