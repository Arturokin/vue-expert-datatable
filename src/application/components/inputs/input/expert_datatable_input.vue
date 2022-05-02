<template>
	<div class="expert-datatable-input-wrapper">
		<input
			class="expert-datatable-input datatable-field"
			:placeholder="placeholder"
			:value="value"
			:name="field.value"
			:key="inputKey"
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
        htmlType: {
			type: String,
            default: 'button',
			validator (htmlType: string) {
				const valids = ['button', 'submit']
				return valids.includes(htmlType)
			}
        },
		inputKey: {
			type: String,
			default: 'key'
		}
    },
    methods: {
        input (e: InputEvent) {
			const target: any = e.target
			this.$emit('input', target ? target.value : '')
		},
		event_focus (e: FocusEvent) {
			this.$emit('focus', e)
		},
		event_blur (e: FocusEvent) {
			this.$emit('blur', e)
		},
		event_key_down (e: any) {
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
