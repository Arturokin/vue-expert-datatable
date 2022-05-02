<template>
	<div class="expert-datatable-input-wrapper">
		<input
			class="expert-datatable-input datatable-field"
			:placeholder="placeholder"
			:value="value"
			:name="field.value"
			:key="key"
			ref="input"
			@input="input"
			@blur="event_blur"
			@focus="event_focus"
			@keydown="event_key_down"
		/>
	</div>
</template>

<script lang="ts">
import Field from '@/application/interface/field';
import Vue, { PropType } from 'vue';
import DataInterface from './data-interface'

export default /*#__PURE__*/Vue.extend({
    name: 'ExpertDatatableInput',
    data(): DataInterface {
        return {
            focused: false
        }
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
		decimals: {
			type: Number,
			default: 0
		},
		key: {
			type: String,
			default: 'key'
		}
    },
    watch: {
        
    },
    beforeMount() {
        
    },
    mounted() {
		if (this.decimals === 0) {
			this.setInputFilter(this.$refs.input as any, function (value: any) {
				return /^-?\d*$/.test(value);
			})
		} else {
			const context = this
			this.setInputFilter(this.$refs.input as any, function (value: any) {
				const pattern = `/^-?\d*[.,]?\d{0,${context.decimals}}$/`
				return (new RegExp(pattern)).test(value)
			})
		}
    },
    methods: {
        input (e: InputEvent) {
			const target: any = e.target
			this.$emit('input', target && !isNaN(parseInt(target.value)) ? parseInt(target.value) : '')
		},
		event_focus (e: FocusEvent) {
			this.$emit('focus', e)
		},
		event_blur (e: FocusEvent) {
			this.$emit('blur', e)
		},
		event_key_down (e: any) {
			this.$emit('keydown', e)
		},
		setInputFilter(textbox: Element, inputFilter: (value: string) => boolean): void {
			["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
				textbox.addEventListener(event, function(this: (HTMLInputElement | HTMLTextAreaElement) & {oldValue: string; oldSelectionStart: number | null, oldSelectionEnd: number | null}) {
					if (inputFilter(this.value)) {
						this.oldValue = this.value;
						this.oldSelectionStart = this.selectionStart;
						this.oldSelectionEnd = this.selectionEnd;
					} else if (Object.prototype.hasOwnProperty.call(this, 'oldValue')) {
						this.value = this.oldValue;
						if (this.oldSelectionStart !== null &&
							this.oldSelectionEnd !== null) {
							this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
						}
					} else {
						this.value = "";
					}
				});
			});
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
