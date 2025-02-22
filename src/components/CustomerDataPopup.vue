<script setup lang="ts">
import { ref } from 'vue';
import { CModal, CModalTitle, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/vue';
import { Schema } from 'amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { Filter } from 'aws-cdk-lib/aws-sns';
import { equal } from 'assert';

const visibleCustDataPopup = ref(false)
// const emits = defineEmits(['createCustomer'])
const client = generateClient<Schema>()
const customersReadings = ref<Array<Schema['Reading']['type']>>([])

function fetchReadingsByMeterId(meterId: string) {
    client.models.Reading.list({
        filter: {
            meterId: {
                eq: meterId
            }
        }
    }).then (readingList => {
        customersReadings.value = readingList.data
    })
}


</script>


<template>
    <CButton color="primary" @click="() => { visibleCustDataPopup = true }">More</CButton>
    <CModal 
        alignment="center"
        :visible="visibleCustDataPopup"
        @close="() => { visibleCustDataPopup = false }"
        aria-labelledby="CustomerDataModel"
    >
        <CModalHeader>
            <CModalTitle id="CustomerDataModal">Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <p>did it work?</p>
            
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="() => { visibleCustDataPopup = false }">
                Cancel
            </CButton>
            <CButton color="primary" @click="() => {
                // $emit('createCustomer', serviceAddress, name)
                visibleCustDataPopup = false
            }">
                Yes
            </CButton>
        </CModalFooter>
    </CModal>
</template>