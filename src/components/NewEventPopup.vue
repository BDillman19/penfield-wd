<script setup lang="ts">
import { ref } from 'vue';
import { Button, Dialog, InputText, DatePicker } from 'primevue';
import { PrimeIcons } from '@primevue/core/api'
import 'primeicons/primeicons.css'

const visibleNewEventPopup = ref(false)
const title = ref('')
const start= ref<Date>(new Date())
const end = ref<Date>(new Date())
const emits = defineEmits(['createEvent'])

function getStartDateTime() {
    let difference = start.value.getTimezoneOffset()
    let isoDate = new Date((start.value.getTime())-(difference*60000)).toISOString()

    return isoDate.substring(0,10).concat(' ', isoDate.substring(11, 16))
}

function getEndDateTime() {
    let difference = end.value.getTimezoneOffset()
    let isoDate = new Date((end.value.getTime())-(difference*60000)).toISOString()

    return isoDate.substring(0,10).concat(' ', isoDate.substring(11, 16))
}
</script>

<template>
    <Button :icon="PrimeIcons.FILE_EDIT"
                        style="background-color: #0EA5E9;"
                        raised
                        severity="info"
                        id="addReadingButton"
                        @click="() => { visibleNewEventPopup = true }">
    </Button>
    <Dialog 
        v-model:visible="visibleNewEventPopup"
        modal
        header="Add Event"
        :style="{ width: '30rem' }"
        >
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Enter Event Information.</span>
        <div class="flex items-center gap-4 mb-4">
            <span class="inputNewEvent">
                <InputText 
                    id="title" 
                    class="eventInputBox" 
                    autocomplete="off" 
                    placeholder="Title"
                    v-model="title" />
            </span>
            <span class="inputNewEvent">
                <DatePicker
                    class="eventInputBox"
                    v-model="start"
                    show-time
                    hour-format="12"
                    id="start"
                    placeholder="Start"/>
            </span>
            <span class="inputNewEvent">
                <DatePicker
                    required="true"
                    class="eventInputBox"
                    v-model="end"
                    show-time
                    hour-format="12"
                    id="end"
                    placeholder="End"/>
            </span>
        </div>
        <div class="flex justify-end">
            <Button 
                class="modalButton"
                type="button" 
                label="Cancel" 
                severity="secondary" 
                @click="visibleNewEventPopup = false">
            </Button>
            <Button 
                class="modalButton" 
                type="button" 
                label="Save" 
                severity="info" 
                @click="() => {
                    getStartDateTime()
                    getEndDateTime()
                    $emit('createEvent',
                        title,
                        getStartDateTime(),
                        getEndDateTime())
                    visibleNewEventPopup = false
                }">
            </Button>
        </div>
    </Dialog>
</template>