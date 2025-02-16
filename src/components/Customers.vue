<script setup lang="ts">

import { register } from 'module';
import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { onMounted, ref } from 'vue';

const client = generateClient<Schema>()
const customers = ref<Array<Schema['Customer']['type']>>([])
const servAddr = ref('')
const nameInp = ref('')

function createCustomer(address: string, name: string) {
    client.models.Customer.create({
        serviceAddress: address,
        name: name
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
        <h1>Add Customer</h1>
        <!-- <form @submit.prevent="registerAnswer">
            <div>Service Address: {{ serviceAddressInp }}</div>
            <div>Name: {{  nameInp }}</div>
            <label>
                <textarea v-model="serviceAddressInp" placeholder="Serivce Address" rows="1" cols="35"></textarea>
                <textarea v-model="nameInp" placeholder="Name" rows="1" cols="35"></textarea>
            </label>
            <button type="submit" >Add</button>
        </form> -->
        <input v-model="servAddr" placeholder="Service Address"/>
        <input v-model="nameInp" placeholder="Name"/>


        <button @click="createCustomer(servAddr, nameInp)">Add new Customer</button>
    </div>
    <div>
        <ul>
            <li
              v-for="customer in customers"
              :key="customer.id">
              {{ customer.name }}
            </li>
        </ul>
    </div>
</template>