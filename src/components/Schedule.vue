<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'

const todaysDate = new Date().toISOString().substring(0, 10)
console.log(todaysDate.toString())
 
// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  selectedDate: todaysDate,
  views: [
    createViewWeek(),
    createViewMonthGrid(),
    createViewMonthAgenda(),
  ],
  events: [
    {
      id: 1,
      title: 'Event 1',
      start: '2025-03-06',
      end: '2025-03-06',
    },
    {
      id: 2,
      title: 'Event 2',
      start: '2025-03-06 12:00',
      end: '2025-03-06 13:00',
    },
  ],
}) 
</script>
 
<template>
  <div class="calendar">
    <ScheduleXCalendar :calendar-app="calendarApp" />
  </div>
</template>