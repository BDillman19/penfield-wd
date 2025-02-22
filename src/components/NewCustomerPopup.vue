<script setup lang="ts">
import { ref } from 'vue';
import { CModal, CModalTitle, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/vue';

const visibleNewCustPopup = ref(false)
const serviceAddress = ref('')
const name = ref('')
const emits = defineEmits(['createCustomer'])

function saveCustomer(address: string, name: string) {
    
}

</script>


<template>
    <CButton color="primary" @click="() => { visibleNewCustPopup = true }">Add Customer</CButton>
    <CModal 
        backdrop="static"
        alignment="center"
        :visible="visibleNewCustPopup"
        @close="() => { visibleNewCustPopup = false }"
        aria-labelledby="AddCustomerModal"
    >
        <CModalHeader>
            <CModalTitle id="AddCustomerModal">Add Customer</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <input class="modalInput" v-model="name" placeholder="Name"/>
            <input class="modalInput" v-model="serviceAddress" placeholder="Service Address"/>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="() => { visibleNewCustPopup = false }">
                Cancel
            </CButton>
            <CButton color="primary" @click="() => {
                $emit('createCustomer', serviceAddress, name)
                visibleNewCustPopup = false
            }">
                Save Customer
            </CButton>
        </CModalFooter>
    </CModal>
</template>