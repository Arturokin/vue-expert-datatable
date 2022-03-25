<template>
    <div
        class="w-100 expert-datatable-input-wrapper"
        :class="clases_input"
        v-bind="$attrs"
    >
		<vue-autonumeric
			:options="options"
			:disabled="disabled"
			:placeholder="placeholder"
			class="expert-datatable-input datatable-field"
			:name="field.value"
			autocomplete="off"
			:value="value"
			@change="change"
			@blur.native="blur"
			@keydown.native="keyDown"
			v-on="inputListeners"
		>
			<slot />
		</vue-autonumeric>
    </div>
</template>

<script lang="ts">
import Field from '@/application/interface/field';
import Vue, { PropType } from 'vue';
import VueAutonumeric from 'vue-autonumeric/src/components/VueAutonumeric.vue'

export default /*#__PURE__*/Vue.extend({
    name: 'ExpertDatatableAutoNumeric',
	components: {
        VueAutonumeric
    },
    props: {
		field: {
            type: Object as PropType<Field>,
            required: true
        },
		value: {
			type: [String, Number],
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},
		readOnly: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
    },
	computed: {
		use_dollar_sign () : boolean {
			if (this.field.fieldData) {
				return this.field.fieldData.useDollarSign || false
			}
			return false
		},
		decimals () : number {
			if (this.field.fieldData) {
				return this.field.fieldData.decimals || 0
			}
			return 0
		},
		min () : number | undefined {
			if (this.field.fieldData) {
				return this.field.fieldData.min || 0
			}
			return 0
		},
        options () : any {
            return {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                currencySymbol: this.use_dollar_sign ? '$' : '',
                currencySymbolPlacement: 'p',
                readOnly: this.readOnly,
                decimalPlaces: this.decimals,
                eventBubbles: true,
                minimumValue: this.min
            }
        },
        inputListeners: function () : any {
            const vm = this
            // `Object.assign` merges objects together to form a new object
            return Object.assign({},
                // We add all the listeners from the parent
                this.$listeners,
                // Then we can add custom listeners or override the
                // behavior of some listeners.
                {
                    // This ensures that the component works with v-model
                    input: function (value: any) {
                        vm.$emit('input', value != null ? parseFloat(value) : null)
                        vm.$emit('change', value != null ? parseFloat(value) : null)
                    }
                }
            )
        },
        clases_input () : any {
            const clases: any = {}
            if (this.readOnly) {
                clases.readonly = true
            }
            // if (this.disabled) {
            //     clases['ant-input-number-disabled'] = true
            // }
            return clases
        }
	},
    methods: {
        change () {
			if (typeof this.value === 'string') {
            	this.$emit('input', this.value != null ? parseFloat(this.value) : null)
			} else {
            	this.$emit('input', this.value)
			}
        },
        blur () {
			if (typeof this.value === 'string') {
            	this.$emit('blur', this.value != null ? parseFloat(this.value) : null)
			} else {
            	this.$emit('blur', this.value)
			}
        },
        keyDown (e: any) {
            this.$emit('keydown', e)
        }
    },
});
</script>

<style lang="scss">
.expert-datatable-input-wrapper {
	box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, .65);
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    display: inline-block;
    width: 100%;
    text-align: start;

	.expert-datatable-input {
		width: 100%;
		padding: 0;
		background-color: transparent;
    	color: rgba(0, 0, 0, 0.65);
		outline: none!important;
		border: none;
	}
}
</style>