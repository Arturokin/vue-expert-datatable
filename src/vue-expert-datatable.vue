<template>
    <div class="vue-expert-datatable">
        <table>
            <thead>
                <tr>
                    <th v-for="header in final_headers" :key="'header_' + header.id">{{ header.title }}</th>
                </tr>
            </thead>
        </table>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DataInterface from './application/interface/data'
import HeadersInterface from './application/interface/header'
//import PaginationInterface from './application/interface/pagination'

export default /*#__PURE__*/Vue.extend({
    name: 'VueExpertDatatable',
    data(): DataInterface {
        return {
            
        };
    },
    props: {
        headers: {
            type: Array as PropType<Array<HeadersInterface>>,
            default: () : Array<HeadersInterface> => {
                return [
                    {
                        title: 'id',
                        align: 'left',
                        value: 'id',
                    }
                ]
            }
        },
        data: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    computed: {
        final_headers() : Array<HeadersInterface> {
            const headers : Array<HeadersInterface> = []
            for (let index = 0; index < this.headers.length; index++) {
                const header = this.headers[index];
                header.align = header.align ? header.align : 'center'
                header.colSpan = header.colSpan ? header.colSpan : 1
                header.filterIcon = header.filterIcon ? header.filterIcon : 'fas fa-arrow'
                header.sortable = header.sortable ? header.sortable : true
                header.width = header.width ? header.width : 'auto'
                headers.push(header)
            }
            return headers
        }
    },
    methods: {

    },
});
</script>

<style scoped lang="scss">
    .vue-expert-datatable {
        width: 100%;
    }
</style>
