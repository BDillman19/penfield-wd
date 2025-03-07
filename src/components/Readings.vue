<script setup lang="ts">

import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { onMounted, ref } from 'vue';
import NewReadingPopup from './NewReadingPopup.vue';

const client = generateClient<Schema>()
const readings = ref<Array<Schema['Reading']['type']>>([])
const props = defineProps(['customerId'])
const emits = defineEmits(['newMainReading', 'newCustomerReading'])
const mainMeterId = '821355f3-e27e-4c19-8181-36804b1f7765'
const latestReadingValue = ref('')


function createReading(mValue: number, customerId: string) {
    client.models.Reading.create({
        value: mValue,
        meterId: customerId,
        usage: Number(mValue) - Number(latestReadingValue)
    })
    fetchReadings();
}
function createReadingWithCustomerId(mValue: number) {
    client.models.Reading.create({
        value: mValue,
        meterId: props.customerId
    })
    if (props.customerId == mainMeterId) {
        emits('newMainReading')
    } else {
        emits('newCustomerReading', props.customerId, mValue)
    }

    fetchReadings();
}

async function fetchReadings() { 
    const {data: items, errors} = await client.models.Reading.list();
    readings.value=items;
}

function getLatestMeterReading() {
    let testing = client.models.Reading.list({        
        filter: {
            meterId: {
                eq: mainMeterId
            }
        },
        
    }).then ((readingList) => {
        if (readingList.data.sort(compareReadings)[0].value == null) {
            return 0
        } else {
            return readingList.data.sort(compareReadings)[0].value
        }
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

onMounted(() => {
    fetchReadings();
})
</script>

<template>
    <NewReadingPopup v-on:create-reading="createReadingWithCustomerId" />
</template>