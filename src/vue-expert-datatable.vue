<template>
    <div class="vue-expert-datatable" :class="global_class">
        <table
            class="expert-datatable"
            :class="table_class"
			cellspacing="0"
			rowspacing="0"
        >
            <thead>
                <tr>
                    <th v-for="field in final_fields.filter(x => x.visible === true)" :key="'field_' + field.value">
                        <slot :name="'header.' + field.value" v-bind:header="field">
                            <span>{{ field.title }}</span>
                        </slot>
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(row, index) in table_data">
                    <tr
						:key="'record_' + index"
						class="expert-row"
						:class="{ 'selected': (selected_index === index) }"
					>
                        <td
                            v-for="field in final_fields.filter(x => x.visible === true)"
                            :key="'record_' + index + '_' + field.value"
                            class="expert-column"
                        >
                            <div 
                                v-if="field.value !== 'actions'"
                                class="expert-item"
                                :class="{
                                    'selectable': field.fieldType !== undefined,
									'selected': (selected_index === index) && field.value === selected_field.value && selected_field
                                }"
								:ref="`item_${index}_${field.value}`"
                                @click="selectRow(row, index, field)"
                            >
                                <slot 
                                    :name="'item.' + field.value"
                                    v-bind:input="event_input"
                                    v-bind:blur="event_blur"
                                    v-bind:focus="event_focus"
                                    v-bind:key_down="event_key_down"
                                    v-bind:item="row"
                                    v-bind:value="row[field.value]"
                                    v-bind:header="field"
                                    v-bind:selected="(selected_index === index) && field.value === selected_field.value && selected_field"
									v-bind:selected_row="selected_index === index"
									v-bind:adding="false"
                                >
									<template v-if="field.fieldType && field.editable">
										<item-field
											:field="field"
											:table-name="tableName"
											v-model="row[field.value]"
										></item-field>
									</template>
									<template v-else>
										<span>
											{{ row[field.value] }}
										</span>
									</template>
                                </slot>
                            </div>
                            
                            <div v-else>
								<a-tooltip :title="current_language.edit_button_text">
									<font-awesome-icon icon="edit" class="expert-datatable-button" @click="modalEditItem(item_record)"></font-awesome-icon>
								</a-tooltip>
								<a-tooltip :title="current_language.delete_button_text">
									<font-awesome-icon icon="trash" class="expert-datatable-button" @click="modalDeleteItem(row[field.value])"></font-awesome-icon>
								</a-tooltip>
                            </div>
                        </td>
                    </tr>
                </template>
                <ValidationObserver tag="tr" ref="form_add_item" class="expert-row add-item-row">
                    <td
                        v-for="field in final_fields.filter(x => x.visible === true)"
                        :key="'record_item_record_' + field.value"
                        class="expert-column"
                    >
						<ValidationProvider
							v-if="field.value !== 'actions'"
							v-slot="{ errors, validate }"
							class="expert-item"
							:name="field.title.toLowerCase()"
							:rules="field.rules"
						>
							<slot
								:name="'item.' + field.value"
								v-bind:input="event_input"
								v-bind:blur="event_blur"
								v-bind:focus="event_focus"
								v-bind:key_down="event_key_down"
								v-bind:item="item_record"
								v-bind:value="item_record[field.value]"
								v-bind:header="field"
								v-bind:selected="undefined"
								v-bind:selected_row="undefined"
								v-bind:adding="true"
								v-bind:errors="errors"
								v-bind:validate="validate"
							>
								<item-field
									:field="field"
									:table-name="tableName"
									v-model="item_record[field.value]"
								></item-field>
							</slot>
						</ValidationProvider>
                        <span v-else>
							<a-tooltip>
								<span slot="title">
									{{ current_language.add_button_text }}
								</span>
								<font-awesome-icon icon="save" class="expert-datatable-button" @click="modalEditItem(item_record)"></font-awesome-icon>
							</a-tooltip>
                        </span>
                    </td>
                </ValidationObserver>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import axios, { AxiosResponse } from 'axios'
import DataInterface from './application/interface/data'
import FieldsInterface from './application/interface/field'
import MethodInterface from './application/interface/method'
import ItemField from './application/components/item-field/item-field.vue'
import initLanguage from './application/language/init-language'

export default /*#__PURE__*/Vue.extend({
    name: 'VueExpertDatatable',
    components: {
        'item-field': ItemField
    },
    data(): DataInterface {
        return {
            base_url_testing: 'http://localhost:1337/',
            get_method: undefined,
            add_method: undefined,
            update_method: undefined,
            delete_method: undefined,
            http_client: undefined,
            current_item: undefined,
            drawer: false,
            modal_delete: false,
            loading_data: false,
            loading_add_update: false,
            loading_delete: false,
            table_data: [],
            selected_row: undefined,
            selected_index: undefined,
            selected_field: undefined,
            item_record: {},
            item_record_before: {},
            current_language: undefined,
        }
    },
    props: {
        tableName: {
            type: String,
            default: 'record'
        },
        fields: {
            type: Array as PropType<Array<FieldsInterface>>,
            default: () : Array<FieldsInterface> => {
                return [
                    {
                        title: 'id',
                        align: 'left',
                        value: 'id',
                        visible: true,
                        pronoun: 'the'
                    },
                    {
                        title: 'Name',
                        align: 'left',
                        value: 'name',
                        visible: true,
                        fieldType: 'text',
                        pronoun: 'the'
                    },
                    {
                        title: 'Description',
                        align: 'left',
                        value: 'description',
                        visible: true,
                        fieldType: 'longtext',
                        pronoun: 'the'
                    },
                    {
                        title: 'Actions',
                        align: 'left',
                        value: 'actions',
                        visible: true
                    }
                ]
            }
        },
		data: {
			type: Array,
			default: () => {
				return undefined
			}
		},
        restApiUrl: {
            type: String,
            default: undefined
        },
        addMethod: {
            type: Object as PropType<MethodInterface>,
            default: () : MethodInterface => {
                return {
                    url: 'http://localhost:1337/test',
                    type: 'POST'
                }
            }
        },
        updateMethod: {
            type: Object as PropType<MethodInterface>,
            default: () : MethodInterface => {
                return {
                    url: 'http://localhost:1337/test',
                    type: 'PUT'
                }
            }
        },
        getMethod: {
            type: Object as PropType<MethodInterface>,
            default: () : MethodInterface => {
                return {
                    url: 'http://localhost:1337/test',
                    type: 'GET'
                }
            }
        },
        deleteMethod: {
            type: Object as PropType<MethodInterface>,
            default: () : MethodInterface => {
                return {
                    url: 'http://localhost:1337/test',
                    type: 'DELETE'
                }
            }
        },
        itemName: {
            type: String,
            default: 'item'
        },
        keyName: {
            type: String,
            default: 'id'
        },
        httpClient: {
            type: Object,
            default: () => {
                return undefined
            }
        },
        httpHeaders: {
            type: Object,
            default: () => {
                return { 
                    'Content-Type': 'application/json'
                }
            }
        },
        item: {
            type: Object,
            default: () => {
                return {
                    id: undefined,
                    name: 'Testing',
                    description: 'Testing'
                }
            }
        },
        disableAutoCrud: {
            type: Boolean,
            default: true
        },
        lang: {
            type: String,
            default: 'EN'
        },
        size: {
            type: String,
            default: 'normal',
			validator (htmlType: string) {
				const valids = ['small', 'normal', 'large']
				return valids.includes(htmlType)
			}
        },
        transformData: {
            type: Function,
            default: (data: any) => {
                return data
            }
        },
        bordered: {
            type: Boolean,
            default: true
        },
        saveOnBlur: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        final_fields() : Array<FieldsInterface> {
            const fields : Array<FieldsInterface> = []
            for (let index = 0; index < this.fields.length; index++) {
                const field = this.fields[index];
                field.align = field.align ? field.align : 'center'
                field.colSpan = field.colSpan ? field.colSpan : 1
                field.filterIcon = field.filterIcon ? field.filterIcon : 'fas fa-arrow'
                field.sortable = field.sortable ? field.sortable : true
                field.width = field.width ? field.width : 'auto'
                field.visible = field.visible ? field.visible : true
                field.editable = field.editable ? field.editable : false
                fields.push(field)
            }

            const exists_actions_field = this.fields.find(x => x.value === 'actions')
            if (exists_actions_field === undefined) {
                const actions_field: FieldsInterface = {
                    align: 'center',
                    colSpan: 1,
                    filterIcon: undefined,
                    sortable: false,
                    width: 'auto',
                    title: 'Actions',
                    value: 'actions',
                    visible: true
                }
                fields.push(actions_field)
            }
            return fields
        },
        table_class() {
            const classes: string[] = []
            classes.push('expert-datatable-' + this.size)
			if (this.bordered) {
				classes.push('bordered')
			}
            return classes
        },
		global_class () {
			const classes: String[] = []
			classes.push(this.$expert_datatable_config.theme)
			return classes
		},
		isWithApi () {
			if (this.restApiUrl) {
				return true
			}
			return false
		}
    },
    watch: {
        item: function (newVal) {
            this.current_item = Object.assign({}, newVal)
        },
        current_item: function (newVal) {
            this.$emit('update:item', newVal)
        },
		data: function (newval: any) {
			this.table_data = newval
		}
    },
    beforeMount() {
        this.initData()
    },
    mounted() {
        this.initComponent()
        this.getTableData()
    },
    methods: {
        initComponent() {
			if (this.isWithApi) {
            	this.initHttpClient()
            	this.initMethods()
			}
        },
        initMethods() : void {
            if (this.restApiUrl) {
                this.get_method = {
                    url: this.cleanUrl(this.restApiUrl),
                    type: 'GET'
                }
                this.add_method = {
                    url: this.cleanUrl(this.restApiUrl),
                    type: 'POST'
                }
                this.update_method = {
                    url: this.cleanUrl(this.restApiUrl),
                    type: 'PUT'
                }
                this.delete_method = {
                    url: this.cleanUrl(this.restApiUrl),
                    type: 'DELETE'
                }
            } else {
                this.get_method = this.getMethod
                this.add_method = this.addMethod
                this.update_method = this.updateMethod
                this.delete_method = this.deleteMethod
            }
        },
        initHttpClient() : void {
            if (this.httpClient) {
                this.http_client = this.httpClient
            } else {
                this.http_client = axios.create({
                    headers: this.httpHeaders,
                })
            }
        },
        initData() : void {
            this.current_language = initLanguage(this.lang, this.tableName)
            for (let index = 0; index < this.fields.length; index++) {
                const item_field = this.fields[index];
                this.item_record[item_field.value] = null
            }
        },
        cleanUrl (url: string) : string {
            const final_url = url.replace(/\/$/, "");
            return final_url
        },
        getTableData() {
            if (this.isWithApi) {
				if(this.get_method) {
					this.loading_data = true
					const http_method : Promise<AxiosResponse<any>> | undefined = this.getHttpByMethod(this.get_method)
					if(http_method) {
						http_method.then((result) => {
							this.table_data = result.data
							this.$emit('updated-data', this.table_data)
						})
							.catch((error) => {
								this.$emit('error', error)
							})
					}
				} else {
					console.error('you haven\'t provided a GET method')
				}
			} else {
				this.table_data = this.data as any
				this.$emit('load-data')
			}
        },
        saveTableData(is_edit: boolean = true) {
            if (this.isWithApi) {
				if (!is_edit) {
					if(this.add_method) {
						this.loading_data = true
						const http_method : Promise<AxiosResponse<any>> | undefined = this.getHttpByMethod(this.add_method)
						if(http_method) {
							http_method.then((result) => {
								if (result.data.update_table || result.data[this.itemName] === undefined) {
									this.getTableData()
								} else {
									const item: any = result.data[this.itemName]
									this.table_data.push(item)
									this.$emit('updated-data', this.table_data)
								}
								this.$emit('inserted-item', result.data[this.itemName])
							})
								.catch((error) => {
									this.$emit('error', error)
								})
						}
					} else {
						console.error('you haven\'t provided an add method')
					}
				} else {
					if(this.update_method) {
						this.loading_data = true
						const http_method : Promise<AxiosResponse<any>> | undefined = this.getHttpByMethod(this.update_method)
						if(http_method) {
							http_method.then((result) => {
								if (result.data.update_table || result.data[this.itemName] === undefined) {
									this.getTableData()
								} else {
									const item: any = result.data[this.itemName]
									this.table_data.push(item)
									this.$emit('updated-data', this.table_data)
								}
								this.$emit('updated-item', result.data[this.itemName])
							})
								.catch((error) => {
									this.$emit('error', error)
								})
						}
					} else {
						console.error('you haven\'t provided an update method')
					}
				}
			} else {
				this.$emit('save-item', this.selected_row)
			}
        },
        modalEditItem(item_record: any) {
            this.item_record = item_record
        },
        modalDeleteItem(item_record: any) {
            this.item_record = item_record
        },
        getHttpByMethod(method: MethodInterface) {
            if(this.http_client) {
                let data: any = this.item_record
                data = this.transformData(data)
                if (method.transformData) {
                    data = method.transformData(data)
                }
                switch (method.type) {
                    case 'GET':
                        return this.http_client.get(method.url)
                        break;

                    case 'POST':
                        return this.http_client.post(method.url, data)
                        break;

                    case 'PUT':
                        return this.http_client.put(method.url, data)
                        break;

                    case 'DELETE':
                        return this.http_client.delete(method.url)
                        break;
                
                    default:
                        return this.http_client.post(method.url, data)
                        break;
                }
            }
			return undefined
        },
        selectRow (row: any, index: number, field: FieldsInterface) {
            if (field.fieldType !== undefined && field.editable) {
                this.selected_row = row
				this.selected_index = index
				this.selected_field = field
				this.copyItem(row)
				this.subscribeInputEvents()
            }
        },
		copyItem (item: any) {
			this.item_record_before = JSON.parse(JSON.stringify(item))
		},
        deSelectRow () {
            console.log('click outside')
            this.selected_row = undefined
        },
        is_selected_row (row: any) {
            if (this.selected_row !== undefined) {
                return this.selected_row[this.keyName] == row[this.keyName]
            } else {
                return false
            }
        },
		cancel_editing () {
			Object.assign(this.selected_row, this.item_record_before)
		},
		// inputs events
		subscribeInputEvents () {
			if ((this.selected_index || this.selected_index === 0) && this.selected_field) {
				let target = this.$refs[`item_${this.selected_index}_${this.selected_field.value}`]
				if (Array.isArray(target)) {
					target = target[0]
				}
				if (target instanceof Element) {
					const input: any = target.querySelector(`[name="${this.selected_field.value}"]`)
					console.log('subscribeInputEvents', input)

					if (input) {
						const elementTag = input.tagName

						const doesTriggerInputTags = ['INPUT', 'TEXTAREA']
						const doesTriggerChangeTags = ['SELECT', 'DATALIST']
						const doesTriggerEventsTags = [...doesTriggerInputTags, ...doesTriggerChangeTags]

						if (doesTriggerEventsTags.includes(elementTag)) {
							console.log('elementTag', elementTag)
							if (doesTriggerInputTags.includes(elementTag)) {
								input.removeEventListener('input', this.event_input)
							}
							if (doesTriggerChangeTags.includes(elementTag)) {
								input.removeEventListener('change', this.event_input)
							}
							input.removeEventListener('focus', this.event_focus)
							input.removeEventListener('blur', this.event_blur)
							input.removeEventListener('keydown', this.event_key_down)
							input.oninput = this.event_input
							input.onfocus = this.event_focus
							input.onblur = this.event_blur
							input.onkeydown = this.event_key_down
						}
					}
				}
			}
		},
		event_input (e: any) {
			if (this.selected_field) {
				if (this.$scopedSlots[`item.${this.selected_field.value}`]) {
					const inputValue = e.target.value
					console.log('inputValue', inputValue)
					this.selected_row[this.selected_field.value] = inputValue
				}
			}
		},
		event_focus (e: FocusEvent) {
			console.log('event_focus', e)
		},
		event_blur (e: FocusEvent) {
			console.log('event_blur', e)
			if (this.saveOnBlur) {
				this.saveTableData()
			} else {
				this.cancel_editing()
			}
		},
		event_key_down (e: any) {
			if (e.keyCode === 13 || e.which === 13) {
                this.saveTableData()
            }
            if (e.keyCode === 27 || e.which === 27 || e.key === 'Escape') {
                this.cancel_editing()
            }
		}
    },
});
</script>

<style lang="scss">
@import 'style.module.scss';
</style>
