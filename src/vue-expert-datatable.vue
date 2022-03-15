<template>
    <div class="vue-expert-datatable" :class="global_class">
        <table
            class="expert-datatable"
            :class="table_class"
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
                    <tr :key="'record_' + index" class="expert-row">
                        <td
                            v-for="field in final_fields.filter(x => x.visible === true)"
                            :key="'record_' + index + '_' + field.value"
                            class="expert-column"
                        >
                            <span 
                                v-if="field.value !== 'actions'"
                                class="expert-item"
                                :class="{ 
                                    'selectable': field.fieldType !== undefined
                                }"
                                @click="selectRow(row, field)"
                                v-click-outside="deSelectRow"
                            >
                                <slot 
                                    :name="'item.' + field.value"
                                    v-bind:item="row"
                                    v-bind:value="row[field.value]"
                                    v-bind:header="field"
                                    v-if="(!is_selected_row(row, field.value) || field.fieldType === undefined) && !field.alwaysEditable"
                                >
                                    {{ row[field.value] }}
                                </slot>
                                <slot 
                                    :name="'edit_item.' + field.value"
                                    v-bind:item="row"
                                    v-bind:value="row[field.value]"
                                    v-bind:header="field"
                                    v-else-if="row[field.value]"
                                >
                                    <item-field
                                        :field="field"
                                        :table-name="tableName"
                                        item_record[field.value]
                                    ></item-field>
                                </slot>
                                <span v-else>
                                    
                                </span>
                            </span>
                            
                            <span v-else>
                                <a-button-group>
                                    <a-tooltip>
                                        <span slot="title">
                                            {{ current_language.edit_button_text }}
                                        </span>
                                        <a-button size="small" type="primary" icon="edit" @click="modalEditItem(item_record)"></a-button>
                                    </a-tooltip>
                                    <a-tooltip>
                                        <span slot="title">
                                            {{ current_language.delete_button_text }}
                                        </span>
                                        <a-button size="small" type="danger" icon="delete" @click="modalDeleteItem(row[field.value])"></a-button>
                                    </a-tooltip>
                                </a-button-group>
                            </span>
                        </td>
                    </tr>
                </template>
                <tr class="expert-row add-item-row">
                    <td
                        v-for="field in final_fields.filter(x => x.visible === true)"
                        :key="'record_item_record_' + field.value"
                        class="expert-column"
                    >
                        <span 
                            v-if="field.value !== 'actions'"
                            class="expert-item"
                        >
                            <slot 
                                :name="'edit_item.' + field.value"
                                v-bind:item="item_record"
                                v-bind:value="item_record[field.value]"
                                v-bind:header="field"
                            >
                                <item-field
                                    :field="field"
                                    :table-name="tableName"
                                    v-model="item_record[field.value]"
                                ></item-field>
                            </slot>
                        </span>
                        <span v-else>
                            <!-- <a-button-group>
                                <a-tooltip>
                                    <span slot="title">
                                        {{ current_language.save_button_text }}
                                    </span>
                                    <a-button size="small" type="primary" icon="check" @click="saveTableData(false)"></a-button>
                                </a-tooltip>
                            </a-button-group> -->
                        </span>
                    </td>
                </tr>
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
            item_record: {},
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
            default: 'normal'
        },
        transformData: {
            type: Function,
            default: (data: any) => {
                return data
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
                field.alwaysEditable = field.alwaysEditable ? field.alwaysEditable : false
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
            return classes
        },
		global_class () {
			return this.$expert_datatable_config.theme
		}
    },
    watch: {
        item: function (newVal) {
            this.current_item = Object.assign({}, newVal)
        },
        current_item: function (newVal) {
            this.$emit('update:item', newVal)
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
            this.initHttpClient()
            this.initMethods()
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
            if(this.get_method) {
                this.loading_data = true
                const http_method : Promise<AxiosResponse<any>> | undefined = this.getHttpByMethod(this.get_method)
                if(http_method) {
                    http_method.then((result) => {
                        this.table_data = result.data
                    })
                        .catch((error) => {
                            this.$emit('error', error)
                        })
                }
            } else {
                console.error('you haven\'t provided a GET method')
            }
        },
        saveTableData(is_edit: boolean = true) {
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
                            }
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
                            }
                        })
                            .catch((error) => {
                                this.$emit('error', error)
                            })
                    }
                } else {
                    console.error('you haven\'t provided an update method')
                }
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
        },
        selectRow (row: any, field: FieldsInterface) {
            if (field.fieldType !== undefined && !field.alwaysEditable) {
                this.selected_row = JSON.parse(JSON.stringify(row))
                this.item_record = JSON.parse(JSON.stringify(row))
                this.$nextTick(() => {
                    const input : any = this.$refs['input_' + field.value]
                    if (Array.isArray(input)) {
                        if (input[0].$el) {
                            input[0].$el.focus()
                        }
                    } else {
                        if (input.$el) {
                            input.$el.focus()
                        }
                    }
                })
            }
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
        }
    },
});
</script>

<style lang="scss">
@import 'style.module.scss';
</style>
