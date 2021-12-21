<template>
  <li>
    <img :src="contrib.avatar_url" />
    <a :href="contrib.html_url" target="_blank" rel="noopener noreferrer"
      >@{{ contrib.login }}</a
    >
  </li>
</template>
<script>
export default {
  props: ["contrib"],
};
</script>
<style scoped>
img {
  width: 54px;
  border-radius: 100%;
}
li {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  width: 150px;
}
</style>
