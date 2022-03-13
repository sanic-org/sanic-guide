<template>
  <div>
    <ContributorList
      title="2022 Steering Council"
      v-bind:contributors="steering"
    />
    <ContributorList
      title="Core Developers"
      :contributors="core"
      :additional="10"
      :more="`https://github.com/orgs/sanic-org/people`"
    />
    <ContributorList
      title="Contributors"
      :contributors="contributors"
      :additional="229"
      :more="`https://github.com/sanic-org/sanic/graphs/contributors`"
    />
  </div>
</template>
<script>
import steering from "../data/steering.json";
import contributors from "../data/contributors.json";
import core from "../data/core.json";
import ContributorList from "./ContributorList.vue";

console.log({ steering });
export default {
  components: { ContributorList },
  data: function () {
    return { steering, core, contributors };
  },
};
</script>
