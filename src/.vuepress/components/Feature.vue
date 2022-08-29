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
        #{{ issue.number
        }}<span
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            width="15"
            height="15"
            class="icon outbound"
          >
            <path
              fill="currentColor"
              d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
            ></path>
            <polygon
              fill="currentColor"
              points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
            ></polygon>
          </svg>
          <span class="sr-only">(opens new window)</span></span
        >
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
