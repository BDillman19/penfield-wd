<script setup lang="ts">
import { ref } from 'vue';
import { Button, Dialog, InputText } from 'primevue';
import { PrimeIcons } from '@primevue/core/api'
import 'primeicons/primeicons.css'

const visibleNewCustPopup = ref(false)
const serviceAddress = ref('')
const name = ref('')
const altName = ref('')
const homePhone = ref('')
const cellPhone1 = ref('')
const cellPhone2 = ref('')
const emits = defineEmits(['createCustomer'])

</script>

<template>
    <Button :icon="PrimeIcons.USER_EDIT"
                        raised
                        severity="info"
                        id="addCustomerButton"
                        @click="() => { visibleNewCustPopup = true }"></Button>

    
    <Dialog 
        v-model:visible="visibleNewCustPopup"
        modal
        header="Add Customer"
        :style="{ width: '30rem' }"
        >
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Enter Customer information.</span>
        <div class="flex items-center gap-4 mb-4">
            <InputText 
                id="name" 
                class="flex-auto" 
                autocomplete="off" 
                placeholder="Name"
                v-model="name" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <InputText 
                id="altName" 
                class="flex-auto" 
                autocomplete="off" 
                placeholder="Alternative Name"
                v-model="altName" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <InputText 
                id="serviceAddress" 
                class="flex-auto" 
                autocomplete="off" 
                placeholder="Service Address"
                v-model="serviceAddress" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <InputText 
                id="homePhone" 
                class="flex-auto" 
                autocomplete="off" 
                placeholder="Home Phone"
                v-model="homePhone" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <InputText 
                id="cellPhone1" 
                class="flex-auto" 
                autocomplete="off" 
                placeholder="Primary Cell Phone"
                v-model="cellPhone1" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <InputText 
                id="cellPhone2" 
                class="flex-auto" 
                autocomplete="off" 
                placeholder="Secondary Cell Phone"
                v-model="cellPhone2" />
        </div>
        <div class="flex justify-end">
            <Button 
                class="modalButton" 
                type="button" 
                label="Cancel" 
                severity="secondary" 
                @click="visibleNewCustPopup = false">
            </Button>
            <Button 
                class="modalButton" 
                type="button" 
                label="Save" 
                severity="info" 
                @click="() => {
                    $emit('createCustomer', serviceAddress, name, altName, homePhone, cellPhone1, cellPhone2)
                    visibleNewCustPopup = false
                }">
            </Button>
        </div>
    </Dialog>
</template>