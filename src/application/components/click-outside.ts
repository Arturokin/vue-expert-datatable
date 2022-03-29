import { DirectiveOptions } from 'vue/types/umd';
const directive : DirectiveOptions = {
    bind: function(el: any, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== "function" && vNode && vNode.context) {
            const compName = (vNode.context as any).name;
            let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
            if (compName) {
                warn += `Found in component '${compName}'`;
            }

            console.warn(warn);
        }
        // Define Handler and cache it on the element
        const bubble = binding.modifiers.bubble;
        const handler = (e: any) => {
            if (bubble || (!el.contains(e.target) && el !== e.target)) {
                binding.value(e);
            }
        };
        el.__vueClickOutside__ = handler;
        // add Event Listeners
        document.addEventListener("mousedown", handler);
    },
    unbind: function(el: any) {
        // Remove Event Listeners
        document.removeEventListener("mousedown", el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
    }
}

export default directive
