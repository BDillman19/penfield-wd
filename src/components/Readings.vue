<script setup lang="ts">

import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { onMounted, ref } from 'vue';

const client = generateClient<Schema>()
const readings = ref<Array<Schema['Reading']['type']>>([])
const mValue = ref()
const customersMeterId = ref('')

function createReading(mValue: number, customersMeterId: string) {
    client.models.Reading.create({
        value: mValue,
        meterId: customersMeterId
    })
    fetchReadings();
}

async function fetchReadings() { 
    const {data: items, errors} = await client.models.Reading.list();
    readings.value=items;
}

onMounted(() => {
    fetchReadings();
})
</script>

<template>
    <div>
        <h1>Add Meter Reading</h1>
        <input v-model.number="mValue" type="number" placeholder="Meter Value"/>
        <input v-model="customersMeterId" placeholder="Customer"/>
        <button @click="createReading(mValue, customersMeterId)">Add new Meter Value</button>
    </div>
    <div>
        <ul>
            <li
              v-for="reading in readings"
              :key="reading.id">
              {{ reading.value }}
            </li>
        </ul>
    </div>
</template>