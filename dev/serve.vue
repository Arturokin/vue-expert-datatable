<script lang="ts">
import Vue from 'vue';
import VueExpertDatatable from '@/vue-expert-datatable.vue';

export default Vue.extend({
    name: 'ServeDev',
    components: {
        VueExpertDatatable
    },
    data() {
        return {
            fields: [
                {
                    title: 'id',
                    align: 'left',
                    value: 'id',
                },
                {
                    title: 'Nombre',
                    align: 'left',
                    value: 'nombre',
                },
                {
                    title: 'Descripción',
                    align: 'left',
                    value: 'descripcion',
                },
                {
                    title: 'Estado',
                    align: 'left',
                    value: 'estado',
                }
            ]
        }
    },
});
</script>

<template>
  <div id="app">
    <vue-expert-datatable :fields="fields"/>
  </div>
</template>
