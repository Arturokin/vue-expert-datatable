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
				@updated-data="updatedData"
            >
                <template v-slot:[`header.actions`]="{ header }">
                    Acciones
                </template>
                <template v-slot:[`item.id`]="{ value }">
                    ID: {{ value }}
                </template>
                <template v-slot:[`item.nombre`]="{ value, show, events }">
                    <span v-show="show" v-on="events">{{ value }}</span>
                </template>
                <template v-slot:[`edit.descripcion`]="{ value, events }">
                    <input type="text" :value="value" name="descripcion" v-on="events">
                    <!-- <input type="text" name="descripcion" :value="value" placeholder="Descripción..."> -->
                </template>
                <template v-slot:[`add.descripcion`]="{ value, events }">
                    <input type="text" :value="value" name="descripcion" v-on="events">
                    <!-- <input type="text" name="descripcion" :value="value" placeholder="Descripción..."> -->
                </template>
            </vue-expert-datatable>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueExpertDatatable from '@/entry.esm';
Vue.use(VueExpertDatatable, { lang: 'ES' })
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
                    title: 'Monto',
                    align: 'left',
                    value: 'monto',
                    fieldType: 'autonumeric',
                    pronoun: 'el',
					editable: true,
					rules: 'required|numeric',
					fieldData: {
						useDollarSign: true,
						thousandSeparator: '.',
						decimalSeparator: ','
					}
                },
                {
                    title: 'Tipo',
                    align: 'left',
                    value: 'tipo_id',
                    fieldType: 'select',
                    pronoun: 'el',
					editable: true,
					rules: 'required',
					selectData: {
						items: [
							{
								text: 'Tipo 1',
								value: '1'
							},
							{
								text: 'Tipo 2',
								value: '2'
							},
							{
								text: 'Tipo 3',
								value: '3'
							},
							{
								text: 'Tipo 4',
								value: '4'
							},
							{
								text: 'Tipo 5',
								value: '5'
							}
						],
						itemText: 'text',
						itemValue: 'value'
					}
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
					visible: true,
					monto: '',
					tipo_id: ''
				},
				{
					id: 2,
					nombre: 'Prueba 2',
					descripcion: 'Descripción de prueba 2...',
					estado: 'Inactivo',
					visible: true,
					monto: '',
					tipo_id: ''
				}
			]
        }
    },
	methods: {
		updatedData (data: any) {
			this.test_data = data
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
