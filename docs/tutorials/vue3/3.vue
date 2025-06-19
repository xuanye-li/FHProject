<script setup>
import { ref } from 'vue'

const titleClass = ref('yeet')
</script>

<template>
  <h1 :class='titleClass'>Make me red</h1> <!-- add dynamic class binding here -->
</template>

<style>
.yeet {
  color: red;
}
</style>