<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Schema } from 'amplify/data/resource';
import { generateClient } from 'aws-amplify/data'
import { DataTable, Column, InputIcon, InputText, IconField, Button} from 'primevue'
import { PrimeIcons } from '@primevue/core/api'
import Readings from './Readings.vue';
import 'primeicons/primeicons.css'
import { FilterMatchMode } from '@primevue/core/api'
import type { Nullable } from '@primevue/core';

const client = generateClient<Schema>()
const customers = ref<Array<Schema['Customer']['type']>>([])
const tableData = ref<Array<CustomerWithLatestReading>>([])
const loading =ref(true)
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

interface ICustomerWithLatestReading {
    id: string
    name: string
    serviceAddress: string
    latestValue: string
}

class CustomerWithLatestReading implements ICustomerWithLatestReading {
    id: string
    name: string
    serviceAddress: string
    latestValue: string

    constructor(id: string, name: Nullable<string>, serviceAddress: Nullable<string>, latestValue: string) {
        this.id = id
        this.name = String(name)
        this.serviceAddress = String(serviceAddress)
        this.latestValue = latestValue
    }
}

async function fetchCustomers(){ 
    client.models.Customer.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
        customers.value = items        
        let latestValue = ref()
        items.forEach(async (customer) => {
            let customerIndex = tableData.value.findIndex((customerWithReading) =>
                customerWithReading.id == customer.id
            )
            latestValue.value = await getLatestMeterReading(customer.id).then((value) => { return value })
            let customerWithReading = new CustomerWithLatestReading(customer.id, customer.name, customer.serviceAddress, latestValue.value)
            if (customerIndex == -1) {
                tableData.value.push(customerWithReading)
            } else {
                tableData.value.splice(customerIndex, 1, customerWithReading)
            }
        })
     },
  });
  loading.value = false
}

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
            if (readingList.data.length == 0) {
                resolve('No Value')
            } else {
                result = readingList.data.sort(compareReadings)[0].value
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

async function updateTableData(customerId: string) {
    let result = ref()
    result.value = await getLatestMeterReading(customerId).then((value) => { return value })
    let customerIndex = tableData.value.findIndex((customerWithReading) =>
        customerWithReading.id == customerId
    )

    tableData.value[customerIndex].latestValue = result.value
    console.log('result found', result.value)
    console.log(tableData.value[customerIndex].latestValue)
}

onMounted( () => {
    fetchCustomers()
})
</script>

<template>
    <div class="pageTitle">
        <h1>Meter Reading Mode</h1>
    </div>
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
        <Column field="latestValue" header="Latest Reading">
            <template #body="{ data }">
                {{ data.latestValue }}
            </template>
        </Column>
        <Column class="w-24 !text-end">
            <template #body="{ data }">
                <Readings :customerId="data.id" @new-customer-reading="() => fetchCustomers()"/>
            </template>
        </Column>
    </DataTable>
</template>