<script setup>
import { ref, onMounted } from "vue";
import Feature from "./Feature.vue";
const issues = ref([]);
const query = encodeURI(
  `is:issue is:open repo:sanic-org/sanic label:"feature+request",RFC sort:reactions-desc`
);
onMounted(() => {
  fetch(`https://api.github.com/search/issues?q=${query}`)
    .then((r) => r.json())
    .then((data) => (issues.value = data.items));
});
</script>
<template>
  <div>
    <template v-if="issues.length > 0">
      <div v-for="issue in issues" :key="issue.number">
        <Feature :issue="issue" />
      </div>
    </template>
  </div>
</template>
