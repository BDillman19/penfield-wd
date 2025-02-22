<script setup lang="ts">

import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { onMounted, ref } from 'vue'
import { v4 } from 'uuid'
import NewCustomerPopup from './NewCustomerPopup.vue'
import { CTable,CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/vue'


const client = generateClient<Schema>()
const customers = ref<Array<Schema['Customer']['type']>>([])
let customerTableData: object[] = []

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
     },
  });
  
}

// function getLatestReadingByMeterId(meterId: string) {
//     let reading: Schema['Reading'] = client.models.Reading.list({
//         filter: {
//             meterId: {
//                 eq: meterId
//             }
//         }
//     }).then(readingList => {
//         if readingList.data.length > 0 {
//             return 
//         } 
//     })
    
// }

function deleteCustomer(id: string) {
    client.models.Customer.delete({ id })
    fetchCustomers()
}

onMounted(() => {
    fetchCustomers();
})


</script>

<template>
   <NewCustomerPopup 
        v-on:createCustomer="createCustomer"
    />
    <div class="dataTable">
    <CTable striped bordered hover>
        <CTableHead>
            <CTableRow>
                <CTableHeaderCell scope="col" key="name">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col" key="serviceAddress">Service Address</CTableHeaderCell>
                <CTableHeaderCell scope="col" key="meterId">Meter</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="customer in customers">
                <CTableDataCell> {{ customer.name }}</CTableDataCell>
                <CTableDataCell> {{ customer.serviceAddress }}</CTableDataCell>
                <CTableDataCell> {{ customer.meterId }}</CTableDataCell>
            </CTableRow>
        </CTableBody>
    </CTable>
    </div>
    <div class="temp">

    </div>
    
    <div>
        <ul>
            <li
              v-for="customer in customers"
              :key="customer.id"
              @click="deleteCustomer(customer.id)">
              {{ customer.name }} |
              {{ customer.serviceAddress }} |
              {{ customer.meterId }}
            </li>
        </ul>
    </div>
</template>