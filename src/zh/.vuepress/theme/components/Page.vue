<template>
  <div>
    <Page v-bind="$attrs" />
    <footer class="page-footer">
      MIT Licensed | Copyright © 2018-present Sanic Community Organization
    </footer>
  </div>
</template>

<script>
import Page from "@parent-theme/components/Page.vue";
export default {
  components: { Page },
};
</script>

<style lang="stylus">
footer.page-footer
    margin-bottom: 7rem;
    text-align: center;
    font-size: 0.85rem;
    color: #999;
</style>
