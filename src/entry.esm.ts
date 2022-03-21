import _Vue, { PluginObject, VueConstructor } from 'vue';
import Configuration from "./application/interface/configuration";
import ClickOutside from './application/components/click-outside'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faTrashAlt, faPlus, faSave, faPen, faPenAlt } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan, faTrashAlt as faTrashRegular, faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Tooltip } from 'ant-design-vue'
import 'ant-design-vue/lib/tooltip/style/css'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Validator from './application/utils/validator'

// Import vue component
import component from '@/vue-expert-datatable.vue';

declare module 'vue/types/vue' {
    interface Vue {
        $expert_datatable_config: Configuration;
    }
}
library.add(faEdit, faTrash, faTrashAlt, faPlus, faTrashCan, faTrashRegular, faPlusSquare, faSave, faPen, faPenAlt)

// Define typescript interfaces for installable component
type InstallableComponent = VueConstructor<_Vue> & PluginObject<any>;

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
export default /*#__PURE__*/((): InstallableComponent => {
    // Assign InstallableComponent type
    const installable = component as unknown as InstallableComponent;
  
    // Attach install function executed by Vue.use()
    installable.install = (Vue: typeof _Vue, options: Configuration | undefined = undefined) => {
        if (!options) {
            options = {
                lang: 'EN',
                theme: 'vue-expert-datatable'
            }
        } else {
            if (!options.lang) {
                options.lang = 'EN'
            }
            if (!options.theme) {
                options.theme = 'vue-expert-datatable'
            }
        }
        Vue.prototype.$expert_datatable_config = options;
        Validator(options.lang)
        Vue.component('vue-expert-datatable', component)
        Vue.directive('click-outside', ClickOutside)
        Vue.component('FontAwesomeIcon', FontAwesomeIcon)
        Vue.component('ValidationProvider', ValidationProvider)
        Vue.component('ValidationObserver', ValidationObserver)
        Vue.use(Tooltip)
    };
    return installable;
})();
  
// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
  