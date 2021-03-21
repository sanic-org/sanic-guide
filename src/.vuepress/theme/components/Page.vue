<template>
  <div>
    <Page v-bind="$attrs" />
    <Footer />
  </div>
</template>

<script>
import Page from "@parent-theme/components/Page.vue";
import Footer from "@theme/components/Footer.vue";
export default {
  components: { Page, Footer },
};
</script>
