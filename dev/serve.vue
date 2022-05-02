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
					rules: 'required',
					fieldData: {
						showEditingIcon: false
					}
                },
                {
                    title: 'Monto debe',
                    value: 'monto_debe',
                    fieldType: 'autonumeric',
                    pronoun: 'el',
                    rules: 'numeric',
                    editable: true,
                    fieldData: {
                        useDollarSign: true,
                        thousandSeparator: '.'
                    },
                    align: 'right'
                },
                {
                    title: 'Monto haber',
                    value: 'monto_haber',
                    fieldType: 'autonumeric',
                    pronoun: 'el',
                    rules: 'numeric',
                    editable: true,
                    fieldData: {
                        useDollarSign: true,
                        thousandSeparator: '.'
                    },
                    align: 'right'
                }
            ],
            api_url: 'https://crudcrud.com/api/d5e1605ccb3e4c509de1c4601906f3c4/users',
			test_type: 'API',
			test_data: []
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
		beforeSave (row: any, _index: number | undefined, _field: Field) : Promise<any> {
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
