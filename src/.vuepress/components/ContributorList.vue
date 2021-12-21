<template>
  <div>
    <h4>{{ title }}</h4>
    <ul>
      <Contributor
        v-for="contrib in contributors"
        :key="contrib.id"
        :contrib="contrib"
      />
    </ul>
    <div class="additional" v-if="additional">
      <a :href="more" target="_blank">+{{ additional }} more</a>
    </div>
  </div>
</template>

<script>
import Contributor from "./Contributor.vue";
export default {
  components: { Contributor },
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
