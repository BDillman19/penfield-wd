<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid
} from '@schedule-x/calendar'
import type { CalendarEventExternal } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import type { Schema } from 'amplify/data/resource'
import type { Nullable } from '@primevue/core';
import { generateClient } from 'aws-amplify/data'
import '@schedule-x/theme-default/dist/index.css'
import { onMounted, ref } from 'vue'
import NewEventPopup from './NewEventPopup.vue'
import 'primeicons/primeicons.css'

const client = generateClient<Schema>()
const eventsServicePlugin = createEventsServicePlugin()
const calendarEvents = ref<Array<CalendarEventExternal>>([])
const todaysDate = new Date().toISOString().substring(0, 10)


class CalendarEvent implements CalendarEventExternal {
    id: string
    title: string
    start: string
    end: string

    constructor(id: string, title: Nullable<string>, start: Nullable<string>, end: Nullable<string>) {
        this.id = id
        this.title = String(title)
        this.start = String(start)
        this.end = String(end)
    }
}

async function fetchEvents() {
  client.models.Event.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      items.forEach((event) => {
        let newEvent = new CalendarEvent(event.id, event.title, event.start, event.end)
        let eventIndex = calendarEvents.value.findIndex((event) =>
            event.id == newEvent.id
        )
        if (eventIndex == -1) {
            calendarEvents.value.push(newEvent)
        } else {
          calendarEvents.value.splice(eventIndex, 1, newEvent)
        }
      })
     },
  })
  setTimeout(()=> loadData(), 1000)
}

function loadData() {
  calendarApp.eventsService.set(calendarEvents.value)
}

function createEvent(title: string, start: string, end: string) {
  client.models.Event.create({
    title: title,
    start: start,
    end: end
})
  fetchEvents()
}

const calendarApp = createCalendar({
  selectedDate: todaysDate,
  defaultView: viewMonthGrid.name,
  dayBoundaries: {
    start: '06:00',
    end: '20:00'
  },
  views: [
    createViewDay(),
    createViewWeek(),
    createViewMonthGrid(),
    createViewMonthAgenda(),
  ],
  events: calendarEvents.value,
},[eventsServicePlugin])

onMounted(() => {
  fetchEvents()
})
</script>
 
<template>
  <div class="calendar">
    <ScheduleXCalendar :calendar-app="calendarApp">
      <template #headerContentLeftPrepend="{ }" >
        <NewEventPopup @create-event="createEvent"/>
      </template>
    </ScheduleXCalendar>
  </div>
</template>