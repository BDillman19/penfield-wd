<script setup lang="ts">
import { watch, ref, defineProps } from 'vue';

const props = defineProps({
    customerData: Array
})

//  watch(
//     () => props.customerData,
//     (newValue, oldValue) => {
//         console.log(newValue)
//         console.log(oldValue)
//     }
//  )

</script>

<template>
    <!-- <table>
        <tr v-for="customer in customerData" :key="customer.id">
            <td> {{ customer.meterId }}</td>
        </tr>
    </table> -->
</template>