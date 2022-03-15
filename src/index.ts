import _vue from "vue"
import Configuration from "./application/interface/configuration";
import VueExpertDatatable from './vue-expert-datatable.vue'
import ClickOutside from './application/components/click-outside'

declare module 'vue/types/vue' {
    interface Vue {
        $expert_datatable_config: Configuration;
    }
}

export function VueExpertDatatablePlugin(Vue: typeof _vue, options: Configuration | undefined = undefined): void {
    if (options === undefined) {
        options = {
            lang: 'ES',
            theme: 'vue-expert-datatable'
        }
    }
    Vue.prototype.$expert_datatable_config = options;
    Vue.component('vue-expert-datatable', VueExpertDatatable)
    Vue.directive('click-outside', ClickOutside)
}

export default VueExpertDatatablePlugin
