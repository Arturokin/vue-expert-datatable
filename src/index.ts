import _vue from "vue"
import Configuration from "./application/interface/configuration";
import VueExpertDatatable from './vue-expert-datatable.vue'
import ClickOutside from './application/components/click-outside'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faTrashAlt, faPlus, faSave } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faTrashAlt as faTrashRegular, faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Tooltip } from 'ant-design-vue'
import 'ant-design-vue/lib/tooltip/style/css'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Validator from './application/utils/validator'

declare module 'vue/types/vue' {
    interface Vue {
        $expert_datatable_config: Configuration;
    }
}
library.add(faEdit, faTrash, faTrashAlt, faPlus, faTrashCan, faTrashRegular, faPlusSquare, faSave)

export function VueExpertDatatablePlugin(Vue: typeof _vue, options: Configuration | undefined = undefined): void {
    if (options === undefined) {
        options = {
            lang: 'ES',
            theme: 'vue-expert-datatable'
        }
    }
    Validator(options.lang)
    Vue.prototype.$expert_datatable_config = options;
    Vue.component('vue-expert-datatable', VueExpertDatatable)
    Vue.directive('click-outside', ClickOutside)
    Vue.component('FontAwesomeIcon', FontAwesomeIcon)
    Vue.component('ValidationProvider', ValidationProvider)
    Vue.component('ValidationObserver', ValidationObserver)
    Vue.use(Tooltip)
}

export default VueExpertDatatablePlugin
