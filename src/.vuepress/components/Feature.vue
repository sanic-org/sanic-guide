<script setup>
const props = defineProps({
  issue: Object,
});
const emojis = {
  "+1": "👍",
  "-1": "👎",
  confused: "😕",
  eyes: "👀",
  heart: "❤️",
  hooray: "🎉",
  laugh: "😆",
  rocket: "🚀",
};
</script>
<template>
  <div>
    <h3>
      <a
        :href="`https://github.com/sanic-org/sanic/issues/${issue.number}`"
        target="_blank"
      >
        #{{ issue.number }}
      </a>
      {{ issue.title }}
    </h3>
    <div class="reactions">
      <span v-for="(item, key, index) in issue.reactions" :key="index">
        <template v-if="emojis[key] && item > 0">
          {{ emojis[key] }} {{ item }}
        </template>
      </span>
    </div>
  </div>
</template>
<style scoped>
h3 {
  margin-bottom: 0.5rem;
}
</style>
