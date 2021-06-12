<script lang="ts">
import Vue from 'vue';
import VueExpertDatatable from '@/index';
Vue.use(VueExpertDatatable)
import '../src/application/theme/ant-design'

export default Vue.extend({
    name: 'ServeDev',
    data() {
        return {
            fields: [
                {
                    title: 'id',
                    align: 'left',
                    value: 'id',
                    pronoun: 'el'
                },
                {
                    title: 'Nombre',
                    align: 'left',
                    value: 'nombre',
                    fieldType: 'text',
                    pronoun: 'un'
                },
                {
                    title: 'Descripción',
                    align: 'left',
                    value: 'descripcion',
                    fieldType: 'text',
                    pronoun: 'una'
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
            ],
            api_url: 'https://crudcrud.com/api/d5e1605ccb3e4c509de1c4601906f3c4/users'
        }
    },
});
</script>

<template>
    <div id="app">
        <div class="main">
            <vue-expert-datatable 
                :fields="fields"
                :rest-api-url="api_url"
                size="small"
                lang="ES"
                table-name="usuario"
            >
                <template v-slot:[`header.actions`]="{ header }">
                    Acciones
                </template>
                <template v-slot:[`item.id`]="{ value }">
                    {{ value }}
                </template>
            </vue-expert-datatable>
        </div>
    </div>
</template>

<style lang="scss">
.main {
    margin: 20px;
    padding: 20px;
}
</style>
