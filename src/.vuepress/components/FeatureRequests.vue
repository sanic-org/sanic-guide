<script setup>
import { ref } from "vue";
import Feature from "./Feature.vue";
const issues = ref([]);
const query = encodeURI(
  `is:issue is:open repo:sanic-org/sanic label:"feature+request",RFC sort:reactions-desc`
);
fetch(`https://api.github.com/search/issues?q=${query}`)
  .then((r) => r.json())
  .then((data) => (issues.value = data.items));
</script>
<template>
  <div v-if="issues.length > 0">
    <div v-for="issue in issues" :key="issue.number">
      <Feature :issue="issue" />
    </div>
  </div>
</template>
