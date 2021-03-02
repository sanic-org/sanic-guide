<template>
  <div>
    <Page v-bind="$attrs" />
    <footer class="page-footer">
      <a href="https://github.com/sanic-org/sanic/blob/master/LICENSE"
        >MIT Licensed</a
      >
      <br />
      Copyright © 2018-present Sanic Community Organization<br />
      <p>Made with ❤️ and ☕️</p>
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
footer p
    font-size: 1rem;
</style>
