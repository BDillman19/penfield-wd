<script setup lang="ts">

import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { onMounted, ref } from 'vue';
import NewReadingPopup from './NewReadingPopup.vue';

const client = generateClient<Schema>()
const readings = ref<Array<Schema['Reading']['type']>>([])
const props = defineProps(['customerId'])

function createReading(mValue: number, customerId: string) {
    client.models.Reading.create({
        value: mValue,
        meterId: customerId
    })
    fetchReadings();
}
function createReadingWithCustomerId(mValue: number) {
    client.models.Reading.create({
        value: mValue,
        meterId: props.customerId
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
    <NewReadingPopup v-on:create-reading="createReadingWithCustomerId" />
</template>