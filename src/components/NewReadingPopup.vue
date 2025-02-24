<script setup lang="ts">
import { ref } from 'vue';
import { Button, Dialog, InputText } from 'primevue';
import { PrimeIcons } from '@primevue/core/api'
import 'primeicons/primeicons.css'

const visibleNewReadingPopup = ref(false)
const value = ref('')
const emits = defineEmits(['createReading'])

</script>

<template>
    <Button :icon="PrimeIcons.FILE_EDIT"
                        raised
                        severity="info"
                        id="addReadingButton"
                        @click="() => { visibleNewReadingPopup = true }">
    </Button>
    <Dialog 
        v-model:visible="visibleNewReadingPopup"
        modal
        header="Add Meter Reading"
        :style="{ width: '30rem' }"
        >
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Enter Meter Reading.</span>
        <div class="flex items-center gap-4 mb-4">
            <InputText 
                id="value" 
                class="flex-auto" 
                autocomplete="off" 
                placeholder="Value"
                v-model="value" />
        </div>
        <div class="flex justify-end">
            <Button 
                class="modalButton" 
                type="button" 
                label="Cancel" 
                severity="secondary" 
                @click="visibleNewReadingPopup = false">
            </Button>
            <Button 
                class="modalButton" 
                type="button" 
                label="Save" 
                severity="info" 
                @click="() => {
                    $emit('createReading', value)
                    visibleNewReadingPopup = false
                }">
            </Button>
        </div>
    </Dialog>
</template>