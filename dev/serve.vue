<script lang="ts">
import Vue from 'vue';
import VueExpertDatatable from '@/vue-expert-datatable.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueExpertDatatable
  }
});
</script>

<template>
  <div id="app">
    <vue-expert-datatable />
  </div>
</template>
