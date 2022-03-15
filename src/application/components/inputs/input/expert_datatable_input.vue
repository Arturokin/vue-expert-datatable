<template>
	<div class="expert-datatable-input-wrapper">
		<input
			class="expert-datatable-input datatable-field"
			:placeholder="placeholder"
			:value="value"
			@input="input"
		>

		</input>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import DataInterface from './data-interface'

export default /*#__PURE__*/Vue.extend({
    name: 'ExpertDatatableInput',
    data(): DataInterface {
        return {
            focused: false
        }
    },
    props: {
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
				return !valids.includes(htmlType)
			}
        }
    },
    watch: {
        
    },
    beforeMount() {
        
    },
    mounted() {
        
    },
    methods: {
        input (val: string | number) {
			this.$emit('input', val)
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
    font-size: 14px;
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
    	height: 32px;
		padding: 4px 11px;
    	color: rgba(0, 0, 0, 0.65);
		outline: none!important;
		border: none;
	}
}
</style>
