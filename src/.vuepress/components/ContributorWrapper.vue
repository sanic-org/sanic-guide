<template>
  <li>
    <Contributor
      :avatar="contrib.avatar_url"
      :profile="contrib.html_url"
      :login="contrib.login"
    />
  </li>
</template>
<script>
import Contributor from "./Contributor.vue";
export default {
  components: { Contributor },
  props: ["contrib"],
};
</script>
