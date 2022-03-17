<template>
    <div id="app">
        <div class="main">
			<a rel="stylesheet" href="#" @click.prevent="test_type = 'API'" style="margin-right: 5px">API</a> | 
			<a rel="stylesheet" href="#" @click.prevent="test_type = 'array'">Custom Array</a>
            <vue-expert-datatable
				v-if="test_type === 'API'"
                :fields="fields"
                :rest-api-url="api_url"
                lang="ES"
                table-name="usuario"
                key="1"
            >
                <template v-slot:[`header.actions`]="{ header }">
                    Acciones
                </template>
                <template v-slot:[`item.id`]="{ value }">
                    ID: {{ value }}
                </template>
            </vue-expert-datatable>
			<vue-expert-datatable
				v-if="test_type === 'array'"
                :fields="fields"
                size="small"
                table-name="usuario"
				:data="test_data"
                :key="2"
            >
                <template v-slot:[`header.actions`]="{ header }">
                    Acciones
                </template>
                <template v-slot:[`item.id`]="{ value }">
                    ID: {{ value }}
                </template>
                <template v-slot:[`item.descripcion`]="{ value, input, focus, blur }">
                    <!-- <input type="text" :value="value" @input="input" @focus="focus" @blur="blur"> -->
                    {{ value }}
                    <input type="text" name="descripcion" :value="value" placeholder="Descripción...">
                </template>
            </vue-expert-datatable>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueExpertDatatable from '@/index';
Vue.use(VueExpertDatatable)
interface Data {
	fields: Array<any>;
	api_url: string;
	test_type: 'API' | 'array',
	test_data: Array<any>
}
export default Vue.extend({
    name: 'ServeDev',
    data() : Data {
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
                    pronoun: 'un',
					editable: true,
					rules: 'required'
                },
                {
                    title: 'Descripción',
                    align: 'left',
                    value: 'descripcion',
                    fieldType: 'text',
                    pronoun: 'una',
					editable: true,
					rules: 'required'
                },
                {
                    title: 'Estado',
                    align: 'left',
                    value: 'estado',
					editable: true
                },
                {
                    title: 'Visible',
                    align: 'left',
                    value: 'visible',
                    fieldType: 'checkbox',
                    editable: true
                }
            ],
            api_url: 'https://crudcrud.com/api/d5e1605ccb3e4c509de1c4601906f3c4/users',
			test_type: 'API',
			test_data: [
				{
					id: 1,
					nombre: 'Prueba 1',
					descripcion: 'Descripción de prueba...',
					estado: 'Activo',
					visible: true
				},
				{
					id: 2,
					nombre: 'Prueba 2',
					descripcion: 'Descripción de prueba 2...',
					estado: 'Inactivo',
					visible: true
				}
			]
        }
    },
});
</script>

<style lang="scss">
.main {
    margin: 20px;
    padding: 20px;
}
</style>
