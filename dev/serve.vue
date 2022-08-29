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
				:custom-events="custom_events"
				:show-delete-button="false"
				logging
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
				<template v-slot:[`footer_row.monto`]>
					hola
				</template>
            </vue-expert-datatable>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueExpertDatatable from '@/entry.esm';
import Field from '@/application/interface/field';
import CustomEvents from '@/application/interface/custom_events';
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
                    title: 'Cta. Cte.',
                    value: 'cuentaBancariaId',
                    fieldType: 'select',
                    pronoun: 'la',
                    rules: 'required',
                    editable: true,
                    fieldData: {
                        showEditingIcon: false
                    },
                    selectData: {
                        items: [{ nombre: 'Cuenta 1', id: '1' }, { nombre: 'Cuenta 2', id: '2' }],
                        itemText: 'nombre',
                        itemValue: 'id'
                    }
                },
                {
                    title: 'Nº Comprobante',
                    value: 'n_comprobante',
                    fieldType: 'text',
                    pronoun: 'el',
                    rules: 'numeric|required',
                    editable: true,
                    fieldData: {
                        showEditingIcon: false
                    },
                    align: 'left'
                },
                {
                    title: 'Fecha',
                    value: 'fecha',
                    fieldType: 'date',
                    pronoun: 'la',
                    rules: 'required',
                    editable: true,
                    fieldData: {
                        showEditingIcon: false,
						date_format: 'DD/MM/YYYY'
                    },
                    align: 'left'
                },
                {
                    title: 'Monto',
                    value: 'monto',
                    fieldType: 'autonumeric',
                    pronoun: 'el',
                    rules: 'numeric|required',
                    editable: true,
                    fieldData: {
                        useDollarSign: true,
                        thousandSeparator: '.'
                    },
                    align: 'right'
                },
                {
                    title: 'Cajero',
                    value: 'cajeroId',
                    fieldType: 'select',
                    pronoun: 'el',
                    rules: 'required',
                    editable: true,
                    fieldData: {
                        showEditingIcon: false
                    },
                    selectData: {
                        items: [{"id":2,"login":"cajero","password":"$2b$10$RuJ0jsEyAglq.WKV7F9gpO5ghT5sEc.OfJkP1oXCVknSQRCRhWxrS","requiere_cambio_password":2,"estado":1,"created_at":"2022-06-08T15:48:55.312Z","personaId":2,"timbre":null,"updated_in":"2022-06-08T15:48:55.312Z","perfiles":[{"id":9,"nombre":"Cajero","estado":1,"alias":"alias_cajero","con_filtro_perfil":1,"entorno":["[\"administracion\"]"],"created_at":"2022-06-08T15:48:55.312Z","updated_in":"2022-06-08T15:48:55.312Z","es_perfil_publico":false}]}],
                        itemText: 'login',
                        itemValue: 'id'
                    }
                }
            ],
            api_url: 'https://crudcrud.com/api/d5e1605ccb3e4c509de1c4601906f3c4/users',
			test_type: 'API',
			test_data: [
				{
					id: 1,
					nombre: 'sin editar',
					descripcion: 'sin eliminar',
					monto_debe: 0,
					monto_haber: 500000,
					ved_can_edit: false,
					ved_can_delete: false
				}
			]
        }
    },
	computed: {
		custom_events () : CustomEvents {
			return {
				before_save: this.beforeSave
			}
		}
	},
	methods: {
		updatedData (data: any) {
			this.test_data = data
		},
		beforeSave (row: any, _index: number | undefined, _field?: Field) : Promise<any> {
			return new Promise((resolve) => {
				row.id = this.getRandomArbitrary(1, 200)
				return resolve(row)
			})
		},
		getRandomArbitrary(min: number, max: number) : number {
			return parseInt((Math.random() * (max - min) + min).toString());
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
