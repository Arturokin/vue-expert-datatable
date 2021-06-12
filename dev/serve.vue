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
                    fieldType: 'text',
                },
                {
                    title: 'Descripción',
                    align: 'left',
                    value: 'descripcion',
                    fieldType: 'longtext',
                },
                {
                    title: 'Estado',
                    align: 'left',
                    value: 'estado',
                },
                {
                    title: 'Visible',
                    align: 'left',
                    value: 'visible',
                    fieldType: 'checkbox',
                    alwaysEditable: true
                }
            ]
        }
    },
});
</script>

<template>
  <div id="app">
    <vue-expert-datatable :fields="fields">
        <template v-slot:[`header.actions`]="{ header }">
            Acciones
        </template>
        <template v-slot:[`item.id`]="{ value }">
            {{ value }}
        </template>
    </vue-expert-datatable>
  </div>
</template>
