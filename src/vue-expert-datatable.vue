<template>
    <div class="vue-expert-datatable" :class="global_class">
        <table
            class="expert-datatable"
            :class="table_class"
			cellspacing="0"
			rowspacing="0"
			v-click-outside="event_blur"
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
						class="expert-row"
						:key="'record_' + index"
						:class="{
							'selected': (selected_index === index)
						}"
					>
						<ValidationObserver
							v-for="field in final_fields.filter(x => x.visible === true)"
							:key="'record_' + index + '_' + field.value"
							:ref="'form_edit_item_' + index + '_' + field.value"
							slim
						>
							<ValidationProvider
								v-slot="{ errors, validate, classes }"
								:name="field.title.toLowerCase()"
								:rules="field.rules"
								slim
							>
								<td class="expert-column" :class="expert_column_class(field, classes, index)">
									<div
										v-if="field.value !== 'actions'"
										class="expert-item"
										:class="{
											'selectable': field.fieldType !== undefined && field.editable,
											'selected': is_selected_item(index, field)
										}"
										:ref="`item_${index}_${field.value}`"
										:key="'expert_item_' + index + '_' + field.value"
									>
										<div
											class="expert-row-item"
											v-show="(!is_selected_item(index, field) || !field.editable) && !field.fieldAlwaysVisible"
										>
											<slot
												:name="'item.' + field.value"
												v-bind:events="event_listener_item(row, index, field)"
												v-bind:selectRow="event_select_row(row, index, field)"
												v-bind:deselectRow="deSelectRow"
												v-bind:item="row"
												v-bind:value="row[field.value]"
												v-bind:header="field"
												v-bind:selected="is_selected_item(index, field)"
												v-bind:selected_row="selected_index === index"
												v-bind:adding="false"
												v-bind:index="index"
												v-bind:show="(!is_selected_item(index, field) || !field.editable) && !field.fieldAlwaysVisible"
												v-bind:errors="errors"
												v-bind:validate="validate"
											>
												<template>
													<item-text
														:field="field"
														:item="row"
														v-on="event_listener_item(row, index, field)"
													/>
												</template>
											</slot>
										</div>
										<slot
											v-if="(is_selected_item(index, field) || field.fieldAlwaysVisible) && field.editable"
											:name="'edit.' + field.value"
											v-bind:events="event_listeners_input(row, index, field)"
											v-bind:selectRow="event_select_row(row, index, field)"
											v-bind:deselectRow="deSelectRow"
											v-bind:key_down="event_key_down"
											v-bind:item="row"
											v-bind:value="row[field.value]"
											v-bind:header="field"
											v-bind:selected="(selected_index === index) && field.value === selected_field.value && selected_field"
											v-bind:selected_row="selected_index === index"
											v-bind:adding="false"
											v-bind:index="index"
											v-bind:errors="errors"
											v-bind:validate="validate"
										>
											<template v-if="field.fieldType && field.editable">
												<item-field
													:field="field"
													:table-name="tableName"
													:value="row[field.value]"
													v-on="event_listeners_input(row, index, field)"
												></item-field>
											</template>
											<template v-else>
												<item-text
													:field="field"
													:item="row"
												/>
											</template>
										</slot>
										<div class="icon-editing" v-if="is_selected_item(index, field) && field.editable">
											<font-awesome-icon icon="pen-alt"></font-awesome-icon>...
										</div>
									</div>
									
									<div v-else>
										<slot
											v-if="$scopedSlots['edit_buttons.' + row[keyName]]"
											:name="'edit_buttons.' + row[keyName]"
											v-bind:item="row"
											v-bind:header="field"
											v-bind:adding="false"
											v-bind:index="index"
										>
											<a-tooltip :title="current_language.edit_button_text" v-if="showEditButton">
												<button type="button" class="expert-datatable-action-button" @click="modalEditItem(item_record)">
													<font-awesome-icon icon="edit"></font-awesome-icon>
												</button>
											</a-tooltip>
											<a-tooltip :title="current_language.delete_button_text" v-if="showDeleteButton">
												<button type="button" class="expert-datatable-action-button" @click="modalDeleteItem(row[field.value])">
													<font-awesome-icon icon="trash"></font-awesome-icon>
												</button>
											</a-tooltip>
										</slot>
										<slot
											v-else
											name="edit_buttons"
											v-bind:item="row"
											v-bind:header="field"
											v-bind:adding="false"
											v-bind:index="index"
											v-bind:edit_events="event_listeners_edit_button(row)"
											v-bind:delete_events="event_listeners_delete_button(row)"
										>
											<a-tooltip :title="current_language.edit_button_text" v-if="showEditButton">
												<button type="button" class="expert-datatable-action-button" v-on="event_listeners_edit_button(row)">
													<font-awesome-icon icon="edit"></font-awesome-icon>
												</button>
											</a-tooltip>
											<a-tooltip :title="current_language.delete_button_text" v-if="showDeleteButton">
												<button type="button" class="expert-datatable-action-button" v-on="event_listeners_delete_button(row)">
													<font-awesome-icon icon="trash"></font-awesome-icon>
												</button>
											</a-tooltip>
										</slot>
									</div>
								</td>
							</ValidationProvider>
						</ValidationObserver>
					</tr>
                </template>
                <ValidationObserver tag="tr" ref="form_add_item" class="expert-row add-item-row" v-if="allowAdding" key="tr_add_1">
                    <ValidationProvider
                        v-for="field in final_fields.filter(x => x.visible === true)"
                        :key="'record_add_' + field.value"
						v-slot="{ errors, validate, classes }"
						:name="field.title.toLowerCase()"
						:rules="field.rules"
						slim
                    >
						<td class="expert-column" :class="expert_column_class(field, classes, undefined)">
							<div
								v-if="field.value !== 'actions'"
								class="expert-item"
								:ref="`item_add_${field.value}`"
								:key="'expert_item_add_' + field.value"
							>
								<slot
									v-if="$scopedSlots['add.' + field.value]"
									:name="'add.' + field.value"
									v-bind:events="event_listeners_input(undefined, undefined, field)"
									v-bind:selectRow="event_select_row(undefined, undefined, field)"
									v-bind:deselectRow="deSelectRow"
									v-bind:key_down="event_key_down"
									v-bind:item="item_record"
									v-bind:value="item_record[field.value]"
									v-bind:header="field"
									v-bind:selected="undefined"
									v-bind:selected_row="undefined"
									v-bind:adding="true"
									v-bind:errors="errors"
									v-bind:validate="validate"
									v-bind:index="'adding'"
								>
									<item-field
										:field="field"
										:table-name="tableName"
										:value="item_record[field.value]"
										is-adding
										v-on="event_listeners_input(undefined, undefined, field)"
									></item-field>
								</slot>
								<slot
									v-else
									:name="'edit.' + field.value"
									v-bind:events="event_listeners_input(undefined, undefined, field)"
									v-bind:selectRow="event_select_row(undefined, undefined, field)"
									v-bind:deselectRow="deSelectRow"
									v-bind:key_down="event_key_down"
									v-bind:item="item_record"
									v-bind:value="item_record[field.value]"
									v-bind:header="field"
									v-bind:selected="undefined"
									v-bind:selected_row="undefined"
									v-bind:adding="true"
									v-bind:errors="errors"
									v-bind:validate="validate"
									v-bind:index="'adding'"
								>
									<item-field
										:field="field"
										:table-name="tableName"
										:value="item_record[field.value]"
										is-adding
										v-on="event_listeners_input(undefined, undefined, field)"
									></item-field>
								</slot>
							</div>
							<span v-else>
								<slot
									name="add_buttons"
									v-bind:item="item_record"
									v-bind:header="field"
									v-bind:index="undefined"
									v-bind:events="event_listeners_add_button"
								>
									<a-tooltip>
										<span slot="title">
											{{ current_language.add_button_text }}
										</span>
										<button type="button" class="expert-datatable-action-button" v-on="event_listeners_add_button()">
											<font-awesome-icon icon="save"></font-awesome-icon>
										</button>
									</a-tooltip>
								</slot>
							</span>
						</td>
                    </ValidationProvider>
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
import AlertInterface from './application/interface/alert'
import CustomEvents from './application/interface/custom_events'
import ItemField from './application/components/item-field/item-field.vue'
import initLanguage from './application/language/init-language'
import ItemText from './application/components/item-text/item_text.vue'

export default /*#__PURE__*/Vue.extend({
    name: 'VueExpertDatatable',
    components: {
        'item-field': ItemField,
		ItemText
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
            selected_row_before: {},
            selected_index: undefined,
            selected_field: undefined,
            item_record: {},
            item_record_before: {},
            item_record_default: {},
            current_language: undefined,
			is_canceling: false
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
            default: null
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
        showAlerts: {
            type: Boolean,
            default: true
        },
        useEditModal: {
            type: Boolean,
            default: true
        },
        useDeleteModal: {
            type: Boolean,
            default: true
        },
		allowAdding: {
			type: Boolean,
			default: true
		},
		addButtonIcon: {
			type: String,
			default: ''
		},
		showEditButton: {
			type: Boolean,
			default: true
		},
		showDeleteButton: {
			type: Boolean,
			default: true
		},
		customEvents: {
			type: Object as PropType<CustomEvents>,
			default: () : CustomEvents => {
				return {}
			}
		}
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
                field.editable = field.editable ? field.editable : true
                field.fieldType = field.fieldType ? field.fieldType : undefined
                field.fieldData = field.fieldData ? field.fieldData : undefined
                field.fieldAlwaysVisible = field.fieldAlwaysVisible ? field.fieldAlwaysVisible : false
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
                    visible: true,
					fieldAlwaysVisible: true
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
		},
		adding_row_selected () : boolean {
			return this.selected_field !== undefined && this.selected_index === undefined
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
			if (this.lang) {
            	this.current_language = initLanguage(this.lang, this.tableName)
			} else {
				this.current_language = initLanguage(this.$expert_datatable_config.lang || 'EN', this.tableName)
			}
            for (let index = 0; index < this.fields.length; index++) {
                const item_field = this.fields[index];
				Vue.set(this.item_record, item_field.value, '')
				Vue.set(this.item_record_default, item_field.value, '')
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
        saveTableData(is_adding = false) {
			return new Promise(async (resolve) => {
				if (this.is_canceling) {
					return resolve(undefined)
				}
				console.log('saveTableData', JSON.parse(JSON.stringify(this.item_record)))
				const formName = is_adding ? 'form_add_item' : `form_edit_item_${this.selected_index}_${this.selected_field?.value}`
				let form: any = this.$refs[formName]
				if (form) {
					if (Array.isArray(this.$refs[formName])) {
						form = form[0]
					}
					form.validate().then(async (result: boolean) => {
						if (result) {
							if (is_adding) {
								if (this.isWithApi) {
									if(this.add_method) {
										this.loading_data = true
										const item_record_copy = JSON.parse(JSON.stringify(this.item_record))
										if (this.customEvents.before_add && this.selected_field) {
											await this.customEvents.before_add(item_record_copy, this.selected_index, this.selected_field)
										}
										if (this.customEvents.before_save && this.selected_field) {
											await this.customEvents.before_save(item_record_copy, this.selected_index, this.selected_field)
										}
										const http_method : Promise<AxiosResponse<any>> | undefined = this.getHttpByMethod(this.add_method, item_record_copy)
										if(http_method) {
											http_method.then(async (result) => {
												if (result.data.update_table || result.data[this.itemName] === undefined) {
													this.getTableData()
												} else {
													const item: any = result.data[this.itemName]
													this.table_data.push(item)
													this.$emit('updated-data', this.table_data)
													this.$emit('inserted-item', item)
												}
												if (this.customEvents.after_add && this.selected_field) {
													await this.customEvents.after_add(item_record_copy, this.selected_index, this.selected_field)
												}
												if (this.customEvents.after_save && this.selected_field) {
													await this.customEvents.after_save(item_record_copy, this.selected_index, this.selected_field)
												}
												this.deSelectRow()
												return resolve(item_record_copy)
											})
												.catch((error) => {
													this.item_record = Object.assign({}, this.item_record_before)
													this.$emit('error', error)
													return resolve(undefined)
												})
										}
									} else {
										console.error('you haven\'t provided an add method')
									}
								} else {
									const item_record_copy = JSON.parse(JSON.stringify(this.item_record))
									if (this.customEvents.before_add && this.selected_field) {
										await this.customEvents.before_add(item_record_copy, this.selected_index, this.selected_field)
									}
									if (this.customEvents.before_save && this.selected_field) {
										await this.customEvents.before_save(item_record_copy, this.selected_index, this.selected_field)
									}
									console.log('item_record_copy', item_record_copy)
									this.table_data.push(item_record_copy)
									this.item_record = Object.assign({}, this.item_record_default)
									this.$nextTick(async () => {
										if (this.customEvents.after_add && this.selected_field) {
											await this.customEvents.after_add(item_record_copy, this.selected_index, this.selected_field)
										}
										if (this.customEvents.after_save && this.selected_field) {
											await this.customEvents.after_save(item_record_copy, this.selected_index, this.selected_field)
										}
										this.$emit('updated-data', this.table_data)
										this.$emit('added-item', item_record_copy)
										this.deSelectRow()
										return resolve(this.item_record)
									})
								}
							} else {
								if (this.isWithApi) {
									if(this.update_method) {
										this.loading_data = true
										const selected_row_copy = JSON.parse(JSON.stringify(this.selected_row))
										if (this.customEvents.before_edit && this.selected_field) {
											await this.customEvents.before_edit(selected_row_copy, this.selected_index, this.selected_field)
										}
										if (this.customEvents.before_save && this.selected_field) {
											await this.customEvents.before_save(selected_row_copy, this.selected_index, this.selected_field)
										}
										const http_method : Promise<AxiosResponse<any>> | undefined = this.getHttpByMethod(this.update_method, selected_row_copy)
										if(http_method) {
											http_method.then(async (result) => {
												if (result.data.update_table || result.data[this.itemName] === undefined) {
													this.getTableData()
												} else {
													this.$emit('updated-data', this.table_data)
												}
												if (this.customEvents.after_edit && this.selected_field) {
													await this.customEvents.after_edit(selected_row_copy, this.selected_index, this.selected_field)
												}
												if (this.customEvents.after_save && this.selected_field) {
													await this.customEvents.after_save(selected_row_copy, this.selected_index, this.selected_field)
												}
												this.$emit('updated-item', result.data[this.itemName])
												this.deSelectRow()
												return resolve(result.data[this.itemName])
											})
												.catch((error) => {
													this.selected_row = Object.assign({}, this.selected_row_before)
													this.$emit('error', error)
													return resolve(undefined)
												})
										}
									} else {
										console.error('you haven\'t provided an update method')
									}
								} else {
									const selected_row_copy = JSON.parse(JSON.stringify(this.selected_row))
									if (this.customEvents.before_edit && this.selected_field) {
										await this.customEvents.before_edit(selected_row_copy, this.selected_index, this.selected_field)
									}
									if (this.customEvents.before_save && this.selected_field) {
										await this.customEvents.before_save(selected_row_copy, this.selected_index, this.selected_field)
									}
									this.$emit('updated-data', this.table_data)
									this.$emit('updated-item', selected_row_copy)

									if (this.customEvents.after_edit && this.selected_field) {
										await this.customEvents.after_edit(selected_row_copy, this.selected_index, this.selected_field)
									}
									if (this.customEvents.after_save && this.selected_field) {
										await this.customEvents.after_save(selected_row_copy, this.selected_index, this.selected_field)
									}
									this.deSelectRow()
									return resolve(selected_row_copy)
								}
							}
						} else {
							this.showAlert({
								type: 'error',
								message: this.current_language?.fill_required_fields || '',
								code: 10
							})
							this.deSelectRow()
							return resolve(undefined)
						}
					})
				} else {
					return resolve(undefined)
				}
			})
        },
        modalEditItem(item_record: any) {
			this.$emit('edit-item', item_record)
        },
        modalDeleteItem(item_record: any) {
			this.$emit('delete-item', item_record)
        },
        getHttpByMethod(method: MethodInterface, data: any | undefined = undefined) {
            if(this.http_client) {
                let final_data: any = this.transformData(data)
                if (method.transformData) {
                    final_data = method.transformData(final_data)
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
            this.$nextTick(() => {
				if (field.fieldType !== undefined && field.editable) {
					this.selected_row = row
					this.selected_index = index
					this.selected_field = field
					this.copyItem(row)
					this.focusSelectedInput(field, index)
				} else {
					this.deSelectRow()
				}
			})
        },
		copyItem (item: any) {
			if (this.adding_row_selected) {
				this.item_record_before = JSON.parse(JSON.stringify(this.item_record))
			} else {
				if (item) {
					this.selected_row_before = JSON.parse(JSON.stringify(item))
				}
			}
		},
        deSelectRow () {
			this.resetForm()
			this.$nextTick(() => {
				this.selected_field = undefined
				this.selected_row = undefined
				this.selected_index = undefined
			})
        },
		focusSelectedInput (field: FieldsInterface, index: number | undefined = undefined) {
			this.$nextTick(() => {
				if (field && (index || index === 0)) {
					const refName = `item_${index}_${field.value}`
					let target = this.$refs[refName]
					if (Array.isArray(target)) {
						target = target[0]
					}
					if (target instanceof Vue && target) {
						target = (target as Vue).$el
					}
					if (target instanceof Element) {
						const input: any = target.querySelector(`[name="${field.value}"]`)

						if (input && input.focus) {
							input.focus()
						}
					}
				}
			})
		},
        is_selected_row (row: any) {
            if (this.selected_row !== undefined) {
                return this.selected_row[this.keyName] == row[this.keyName]
            } else {
                return false
            }
        },
		cancel_editing () {
			this.is_canceling = true
			if (this.adding_row_selected) {
				Object.assign(this.item_record, this.item_record_default)
			} else {
				Object.assign(this.selected_row, this.selected_row_before)
				this.deSelectRow()
			}
		},
		event_input (e: any) {
            if (this.selected_field) {
                const name = this.selected_field.value
                const is_adding = this.selected_index === undefined
                if (name) {
					let inputValue = null
					if (typeof e === 'object' && e && e.target) {
						inputValue = e.target.value
					} else {
						inputValue = e
					}
					if (this.selected_row && !is_adding) {
						Vue.set(this.selected_row, name, inputValue)
						// this.selected_row[name] = inputValue
					} else if (is_adding && this.item_record && this.adding_row_selected) {
						Vue.set(this.item_record, name, inputValue)
						// this.item_record[name] = inputValue
					}
                } else {
                    console.error('input does not have name attribute')
                }
            }
		},
		async event_blur (_e: FocusEvent) {
			if (!this.adding_row_selected && !this.is_canceling) {
				if (this.saveOnBlur) {
					await this.saveTableData()
				} else {
					this.cancel_editing()
				}
			}
			this.is_canceling = false
		},
		event_key_down (e: any) {
			if (e.keyCode === 13 || e.which === 13) {
                this.saveTableData(this.adding_row_selected !== undefined)
            }
            if (e.keyCode === 27 || e.which === 27 || e.key === 'Escape') {
                this.cancel_editing()
            }
		},
		event_focus (row: any, index: number, field: FieldsInterface) {
			if (!row && !index) {
				this.selectRow(row, index, field)
			}
		},
		is_selected_item (index: number | undefined, field: FieldsInterface) {
			if ((this.selected_index === index) && this.selected_field && field.value === this.selected_field.value) {
				return true
			}
			return false
		},
		showAlert (alert: AlertInterface) {
			if (this.showAlerts) {

			}
			this.$emit('alert', alert)
		},
		expert_column_class(field: FieldsInterface, bindClasses: any, index: number) {
			bindClasses[`align-${field.align}`] = true
			if (this.is_selected_item(index, field)) {
				bindClasses['column-selected'] = true
			}
			return bindClasses
		},
		resetForm () {
			const formName = this.adding_row_selected ? 'form_add_item' : `form_edit_item_${this.selected_index}_${this.selected_field?.value}`
			let form: any = this.$refs[formName]
			if (form) {
				if (Array.isArray(this.$refs[formName])) {
					form = form[0]
				}
				if (this.adding_row_selected) {
					this.$nextTick(() => {
						form.reset()
					})
				} else {
					form.reset()
				}
			}
		},
		event_listeners_input (row: any, index: number, field: FieldsInterface) : any {
			const context = this
			return {
				input: function (e: any) {
					context.event_input(e)
				},
				change: function (e: any) {
					context.event_input(e)
				},
				blur: function (e: any) {
					context.event_blur(e)
				},
				focus: function () {
					context.event_focus(row, index, field)
				},
				keydown: function (e: any) {
					context.event_key_down(e)
				},
				deselectRow: function () {
					context.deSelectRow()
				}
			}
		},
		event_listeners_add_button () : any {
			const context = this
			return {
				click: function (_e: any) {
					context.saveTableData(true)
				}
			}
		},
		event_listeners_edit_button (row: any) : any {
			const context = this
			return {
				click: function (_e: any) {
					context.modalEditItem(row)
				}
			}
		},
		event_listeners_delete_button (row: any) : any {
			const context = this
			return {
				click: function (_e: any) {
					context.modalDeleteItem(row)
				}
			}
		},
		event_listener_item (row: any, index: number, field: FieldsInterface) : any {
			const context = this
			return {
				click: function () {
					context.selectRow(row, index, field)
				}
			}
		},
		event_select_row (row: any, index: number, field: FieldsInterface) : any {
			const context = this
			return {
				click: function () {
					context.selectRow(row, index, field)
				}
			}
		},
    },
});
</script>

<style lang="scss">
@import 'style.module.scss';
</style>
