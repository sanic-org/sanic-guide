<template>
  <div>
    <Home v-bind="$attrs" />
    <Footer />
  </div>
</template>

<script>
import Home from "@parent-theme/components/Home.vue";
import Footer from "@theme/components/Footer.vue";
export default {
  components: { Home, Footer },
};
</script>
