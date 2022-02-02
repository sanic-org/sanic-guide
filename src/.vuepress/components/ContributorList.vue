<template>
  <div>
    <h4 v-if="title">{{ title }}</h4>
    <ul>
      <ContributorWrapper
        v-for="contrib in contributors"
        :key="contrib.id"
        :contrib="contrib"
      />
      <slot />
    </ul>
    <div class="additional" v-if="additional">
      <a :href="more" target="_blank">+{{ additional }} more</a>
    </div>
  </div>
</template>

<script>
import ContributorWrapper from "./ContributorWrapper.vue";
export default {
  components: { ContributorWrapper },
  props: ["title", "contributors", "additional", "more"],
  //   data: {},
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.additional {
  margin-left: 3rem;
}
</style>
