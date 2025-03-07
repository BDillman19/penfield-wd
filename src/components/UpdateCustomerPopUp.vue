<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Button, Dialog, InputText, FloatLabel } from 'primevue';
import { PrimeIcons } from '@primevue/core/api'
import type {Schema} from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import 'primeicons/primeicons.css'

const props = defineProps(['customerId'])
const emits = defineEmits(['updateCustomer'])
const client = generateClient<Schema>()
const visibleUpdateCustPopup = ref(false)
const serviceAddress = ref()
const name = ref()
const altName = ref()
const homePhone = ref()
const cellPhone1 = ref()
const cellPhone2 = ref()
const latestReadingValue = ref()
const customer = ref<Schema['Customer']['type']>()

async function getCustomerById() {
    client.models.Customer.list({
        filter: {
            id: {
                eq: props.customerId
            }
        }
    }).then((data) => {
        if (data.data.length == 0) {
            console.log('no customer found')
        } else if (data.data.length == 1) {
            name.value = data.data[0].name
            serviceAddress.value = data.data[0].serviceAddress
            altName.value = data.data[0].altName
            homePhone.value = data.data[0].homePhone
            cellPhone1.value = data.data[0].cellPhone1
            cellPhone2.value = data.data[0].cellPhone2
            latestReadingValue.value = data.data[0].lastReadingValue
        } else if (data.data.length > 1) {
            console.log('more than one customer found')
        }

    })
}

onMounted(() => {
    getCustomerById()
})
</script>

<template>
    <Button :icon="PrimeIcons.USER_EDIT"
                        raised
                        severity="info"
                        id="updateCustomerButton"
                        @click="() => { visibleUpdateCustPopup = true }"></Button>

    
    <Dialog 
        v-model:visible="visibleUpdateCustPopup"
        modal
        header="Update Customer"
        :style="{ width: '30rem' }"
        >
        <span style="margin: 2%;">Enter Customer information.</span>
        <span class="inputTextUpdateCustomer">
            <FloatLabel variant="on">
                <InputText 
                    id="name" 
                    class="" 
                    autocomplete="off" 
                    :default-value=name
                    v-model="name" />
                <label for="name">Name</label>
            </FloatLabel>

        </span>
        <span class="inputTextUpdateCustomer">
            <FloatLabel variant="on">
                <InputText 
                    id="altName" 
                    class="" 
                    autocomplete="off" 
                    :default-value=altName
                    v-model="altName" />
                <label for="altName">Alternative Name</label>
            </FloatLabel>
        </span>
        <span class="inputTextUpdateCustomer">
            <FloatLabel variant="on">
                <InputText 
                    id="serviceAddress" 
                    class="" 
                    autocomplete="off" 
                    :default-value=serviceAddress
                    v-model="serviceAddress" />
                <label for="serviceAddress">Service Address</label>
            </FloatLabel>

        </span>
        <span class="inputTextUpdateCustomer">
            <FloatLabel variant="on">
                <InputText 
                    id="homePhone" 
                    class="" 
                    autocomplete="off" 
                    :default-value=homePhone
                    v-model="homePhone" />
                <label for="homePhone">Home Phone</label>
            </FloatLabel>

        </span>
        <span class="inputTextUpdateCustomer">
            <FloatLabel variant="on">
                <InputText 
                    id="cellPhone1" 
                    class="" 
                    autocomplete="off" 
                    :default-value=cellPhone1
                    v-model="cellPhone1" />
                <label for="cellPhone1">Primary Cell Phone</label>
            </FloatLabel>
        </span>
        <span class="inputTextUpdateCustomer">
            <FloatLabel variant="on">
                <InputText 
                    id="cellPhone2" 
                    class="" 
                    autocomplete="off" 
                    :default-value=cellPhone2
                    v-model="cellPhone2" />
                <label for="cellPhone2">Secondary Cell Phone</label>
            </FloatLabel>
        </span>
        <div class="flex justify-end">
            <Button 
                class="modalButton" 
                type="button" 
                label="Cancel" 
                severity="secondary" 
                @click="visibleUpdateCustPopup = false">
            </Button>
            <Button 
                class="modalButton" 
                type="button" 
                label="Save" 
                severity="info" 
                @click="() => {
                    $emit('updateCustomer', customerId, name, serviceAddress, altName, homePhone, cellPhone1, cellPhone2, latestReadingValue)
                    visibleUpdateCustPopup = false
                }">
            </Button>
        </div>
    </Dialog>
</template>