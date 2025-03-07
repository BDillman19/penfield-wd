<script setup lang="ts">

import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { onMounted, ref } from 'vue'
import { DataTable, Column, InputIcon, InputText, IconField} from 'primevue'
import { FilterMatchMode } from '@primevue/core/api'
import { PrimeIcons } from '@primevue/core/api'
import NewCustomerPopup from './NewCustomerPopup.vue'
import Readings from './Readings.vue'
import 'primeicons/primeicons.css'
import UpdateCustomerPopUp from './UpdateCustomerPopUp.vue'

const client = generateClient<Schema>()
const customersReadings = ref<Map<String, Array<Schema['Reading']['type']>>>(new Map()) 
const customers = ref<Array<Schema['Customer']['type']>>([])
const loading =ref(true)
const loadingReadings = ref(true)
const expandedRows = ref({})

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

function createCustomer(serviceAddress: string, 
                        name: string, 
                        altName: string, 
                        homePhone: string,
                        cellPhone1: string,
                        cellPhone2: string ) {
    client.models.Customer.create({
        serviceAddress: serviceAddress,
        name: name,
        altName: altName,
        homePhone: homePhone,
        cellPhone1: cellPhone1,
        cellPhone2: cellPhone2,
        lastReadingValue: 0
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
        customersReadings.value?.set(meterId, readingList.data)
        loadingReadings.value = false
    })
}

function deleteCustomer(id: string) {
    client.models.Customer.delete({ id })
    fetchCustomers()
}

function updateCustomer(
        customerId: string,
        name: string,
        serviceAddress: string,
        altName: string,
        homePhone: string,
        cellPhone1: string,
        cellPhone2: string,
        latestReadingValue: number
) {
    client.models.Customer.update({
        id: customerId,
        name: name,
        serviceAddress: serviceAddress,
        altName: altName,
        homePhone: homePhone,
        cellPhone1: cellPhone1,
        cellPhone2: cellPhone2,
        lastReadingValue: latestReadingValue
    })
    fetchCustomers()
}

onMounted(() => {
    fetchCustomers();
})

const onRowExpand = (event: { data: { id: string } }) => {
    fetchReadingsByMeterId(event.data.id)
};
const onRowCollapse = () => {
    loadingReadings.value = true
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
    <h1 class="pageTitle">Customers</h1>
    <DataTable
        width="90%"
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
        </Column>
        <Column field="serviceAddress" header="Service Address" sortable>
            <template #body="{ data }">
                {{ data.serviceAddress }}
            </template>
        </Column>
        <Column field="homePhone" header="Home Phone">
            <template #body="{ data }">
                {{ data.homePhone }}
            </template>
        </Column>
        <Column field="cellPhone1" header="Primary Cell Phone">
            <template #body="{ data }">
                {{ data.cellPhone1 }}
            </template>
        </Column>
        <Column class="w-24 !text-end">
            <template #body="{ data }">
                <UpdateCustomerPopUp :customer-id="data.id" @update-customer="updateCustomer" />
            </template>
        </Column>
        <template #expansion="data">
            <div class="p-4">
                <h5>Meter Readings for {{ data.data.name }}</h5>
                <DataTable 
                    :value="customersReadings.get(data.data.id)"
                    sort-field="createdAt"
                    :loading="loadingReadings"
                    :sortOrder="-1">
                    <template #empty> No readings found. </template>
                    <template #loading> Loading customers readings. Please wait. </template>
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