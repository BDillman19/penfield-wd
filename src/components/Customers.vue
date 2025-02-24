<script setup lang="ts">

import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { onMounted, ref } from 'vue'
import { v4 } from 'uuid'
import { DataTable, Column, InputIcon, InputText, IconField, Button} from 'primevue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'
import { PrimeIcons } from '@primevue/core/api'
import NewCustomerPopup from './NewCustomerPopup.vue'
import Readings from './Readings.vue'
import 'primeicons/primeicons.css'

const client = generateClient<Schema>()
const customersReadings = ref<Map<String, Array<Schema['Reading']['type']>>>(new Map()) 
const customers = ref<Array<Schema['Customer']['type']>>([])
const loading =ref(true)
const expandedRows = ref({})
const toast = useToast()

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    serviceAddress: {value: null, matchMode: FilterMatchMode.CONTAINS}
});

function createCustomer(serviceAddress: string, name: string) {
    client.models.Customer.create({
        serviceAddress: serviceAddress,
        name: name,
        meterId: v4()
    })
    fetchCustomers();
}

async function fetchCustomers(){ 
    client.models.Customer.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      customers.value = items
      loading.value = false
     },
  });
  
}

function fetchReadingsByMeterId(meterId: string) {
    client.models.Reading.list({
        filter: {
            meterId: {
                eq: meterId
            }
        }
    }).then (readingList => {
        readingList.data.forEach(reading => {
            customersReadings.value?.set(meterId, readingList.data)
        })
    })
    return customersReadings.value.get(meterId)
}

function deleteCustomer(id: string) {
    client.models.Customer.delete({ id })
    fetchCustomers()
}

onMounted(() => {
    fetchCustomers();
})

const onRowExpand = () => {
    toast.add({ severity: 'info', summary: 'Product Expanded', life: 3000 });
};
const onRowCollapse = () => {
    toast.add({ severity: 'success', summary: 'Product Collapsed', life: 3000 });
};

const formatDate = (value: Date) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

</script>

<template>
    <DataTable 
        id="customersDataTable"
        v-model:expanded-rows="expandedRows"
        :expanded-row-icon="PrimeIcons.ANGLE_DOWN"
        :collapsed-row-icon="PrimeIcons.INFO_CIRCLE"
        @row-expand="onRowExpand"
        @row-collapse="onRowCollapse"
        data-key="id"
        :value="customers"
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

                <NewCustomerPopup v-on:create-customer="createCustomer" />
            </div>               
        </template>
        <template #empty> No customers found. </template>
        <template #loading> Loading customers data. Please wait. </template>
        <Column field="name" header="Name" sortable>
            <template #body="{ data }">
                {{ data.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by name" />
            </template>
        </Column>
        
        <Column field="serviceAddress" header="Service Address" sortable>
            <template #body="{ data }">
                {{ data.serviceAddress }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search by address" />
            </template>
        </Column>
        <Column class="w-24 !text-end">
            <template #body="{ data }">
                <Readings :customerId="data.id"/>
            </template>
        </Column>
        <template #expansion="data">
            <div class="p-4">
                <h5>Meter Readings for {{ data.data.name }}</h5>
                <DataTable 
                    :value="fetchReadingsByMeterId(data.data.id)"
                    sort-field="createdAt"
                    :sortOrder="-1">
                    <template #empty> No readings found. </template>
                    <Column field="value" header="Value" :sortable="true"></Column>
                    <Column field="createdAt" header="Date" data-type="date" sortable>
                        <template #body="{ data }">
                            {{ formatDate(new Date(data.createdAt)) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>
    </DataTable>
</template>