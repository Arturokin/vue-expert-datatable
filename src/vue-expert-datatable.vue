<template>
    <div class="vue-expert-datatable">
        <table class="expert-datatable">
            <thead>
                <tr>
                    <th v-for="field in final_fields.filter(x => x.visible === true)" :key="'field_' + field.value">
                        <slot :name="'field.' + field.value" v-bind:field="field">
                            <span>{{ field.title }}</span>
                        </slot>
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(row, index) in table_data">
                    <tr :key="'record_' + index">
                        <td v-for="field in final_fields.filter(x => x.visible === true)" :key="'record_' + index + '_' + field.value">
                            <span v-if="field.value !== 'actions'">{{ row[field.value] }}</span>
                            <span v-else>
                                <a-button-group>
                                    <a-button size="small" type="primary" icon="edit"></a-button>
                                    <a-button size="small" type="danger" icon="delete"></a-button>
                                </a-button-group>
                            </span>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DataInterface from './application/interface/data'
import FieldsInterface from './application/interface/field'
import MethodInterface from './application/interface/method'
//import PaginationInterface from './application/interface/pagination'
import axios, { AxiosResponse } from 'axios'
import { Button, Modal, Row, Col, Icon, Drawer } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
Vue.use(Button)
Vue.use(Modal)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Drawer)

export default /*#__PURE__*/Vue.extend({
    name: 'VueExpertDatatable',
    components: {
        Button, Modal, Row, Col, Icon, Drawer
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
            table_data: []
        }
    },
    props: {
        fields: {
            type: Array as PropType<Array<FieldsInterface>>,
            default: () : Array<FieldsInterface> => {
                return [
                    {
                        title: 'id',
                        align: 'left',
                        value: 'id',
                        visible: true
                    },
                    {
                        title: 'Name',
                        align: 'left',
                        value: 'name',
                        visible: true
                    },
                    {
                        title: 'Description',
                        align: 'left',
                        value: 'description',
                        visible: true
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
        rest_api_url: {
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
    mounted() {
        this.initComponent()
        this.getData()
    },
    methods: {
        initComponent() {
            this.initHttpClient()
            this.initMethods()
        },
        initMethods() : void {
            if (this.rest_api_url) {
                this.get_method = {
                    url: this.cleanUrl(this.rest_api_url),
                    type: 'GET'
                }
                this.add_method = {
                    url: this.cleanUrl(this.rest_api_url),
                    type: 'POST'
                }
                this.update_method = {
                    url: this.cleanUrl(this.rest_api_url),
                    type: 'PUT'
                }
                this.delete_method = {
                    url: this.cleanUrl(this.rest_api_url),
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
        cleanUrl (url: string) : string {
            const final_url = url.replace(/\/$/, "");
            return final_url
        },
        getData() {
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
            }
        },
        getHttpByMethod(method: MethodInterface) {
            if(this.http_client) {
                switch (method.type) {
                    case 'GET':
                        return this.http_client.get(method.url)
                        break;

                    case 'POST':
                        return this.http_client.post(method.url)
                        break;

                    case 'PUT':
                        return this.http_client.put(method.url)
                        break;

                    case 'DELETE':
                        return this.http_client.delete(method.url)
                        break;
                
                    default:
                        return this.http_client.post(method.url)
                        break;
                }
            }
        }
    },
});
</script>

<style lang="scss">
@import 'style.module.scss';
</style>
