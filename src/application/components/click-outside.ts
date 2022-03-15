import { DirectiveOptions } from 'vue/types/umd';
const directive : DirectiveOptions = {
    bind: function (el: any, binding, vnode: any) {
        el.clickOutsideEvent = function (event: any) {
        // here I check that click was outside the el and his children
            let call_function = true
            console.log(event.target.classList)
            if (event.target.classList) {
                if (event.target.classList.contains('expert-row') || event.target.classList.contains('expert-item')) {
                    call_function = false
                }
            }
            if (!(el == event.target || el.contains(event.target)) && call_function) {
                // and if it did, call method provided in attribute value
                if (vnode.context && binding.expression) {
                    vnode.context[binding.expression](event);
                }
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unbind: function (el: any) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    }
}

export default directive