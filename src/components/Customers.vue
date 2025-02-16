<script setup lang="ts">

import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { onMounted, ref } from 'vue'
import { v4 } from 'uuid'

const client = generateClient<Schema>()
const customers = ref<Array<Schema['Customer']['type']>>([])
const servAddr = ref('')
const nameInp = ref('')

function createCustomer(address: string, name: string) {
    client.models.Customer.create({
        serviceAddress: address,
        name: name,
        meterId: v4()
    })
    fetchCustomers();
}

async function fetchCustomers(){ 
    const {data: items, errors} = await client.models.Customer.list();
    customers.value=items;
}

onMounted(() => {
    fetchCustomers();
})
</script>

<template>
    <div>
        <ul>
            <li
              v-for="customer in customers"
              :key="customer.id">
              {{ customer.name }}
              {{ customer.meterId }}
            </li>
        </ul>
    </div>
</template>