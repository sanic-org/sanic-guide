<template>
  <div>
    <img :src="avatar" />
    <a :href="profile" target="_blank" rel="noopener noreferrer">
      @{{ login }}
    </a>
    <em v-if="releaseManager">v23 Release Manager</em>
  </div>
</template>
<script>
export default {
  props: ["avatar", "profile", "login", "releaseManager"],
};
</script>
<style scoped>
img {
  width: 54px;
  border-radius: 100%;
}
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  width: 150px;
}
em {
  font-size: 70%;
}
</style>
