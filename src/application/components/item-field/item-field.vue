<template>
    <div class="expert-item-field">
		<form action="" @submit.prevent="blur" autocomplete="off">
			<expert-datatable-input
				v-if="field.fieldType === 'text'"
				:ref="'input_' + field.value"
				v-model="localValue"
				:placeholder="inputPlaceholder(field)"
				:field="field"
				:inputName="field.value"
				@blur="event_blur"
				@focus="event_focus"
				@keydown="event_key_down"
			></expert-datatable-input>
			<a-textarea
				v-if="field.fieldType === 'longtext'"
				:ref="'input_' + field.value"
				v-model="localValue"
				:placeholder="inputPlaceholder(field)"
				:field="field"
				:inputName="field.value"
				@blur="event_blur"
				@focus="event_focus"
				@keydown="event_key_down"
			></a-textarea>
			<a-input-number
				v-if="field.fieldType === 'number'"
				:ref="'input_' + field.value"
				v-model="localValue"
				:placeholder="inputPlaceholder(field)"
				:field="field"
				:inputName="field.value"
				@blur="event_blur"
				@focus="event_focus"
				@keydown="event_key_down"
			></a-input-number>
			<expert-datatable-autonumeric
				v-if="field.fieldType === 'autonumeric'"
				:ref="'input_' + field.value"
				v-model="localValue"
				:placeholder="inputPlaceholder(field)"
				:field="field"
				:inputName="field.value"
				@blur="event_blur"
				@focus="event_focus"
				@keydown="event_key_down"
			></expert-datatable-autonumeric>
			<expert-datatable-select
				v-if="field.fieldType === 'select'"
				:ref="'input_' + field.value"
				v-model="localValue"
				:placeholder="inputPlaceholder(field)"
				:field="field"
				:inputName="field.value"
				:focus-on-init="!isAdding"
				@blur="event_blur"
				@focus="event_focus"
				@keydown="event_key_down"
				@deselect-row="deselectRow"
			></expert-datatable-select>
			<div
				v-if="field.fieldType === 'checkbox'"
				:ref="'input_' + field.value"
				:field="field"
				:inputName="field.value"
				@blur="event_blur"
				@focus="event_focus"
				@keydown="event_key_down"
			></div>
		</form>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import FieldsInterface from '../../interface/field'
import DataInterface from './data-interface'
import enEN from '../../language/en-EN'
import initLanguage from '../../language/init-language'

import ExpertDatatableInput from '../inputs/input/expert_datatable_input.vue'
import ExpertDatatableInputNumber from '../inputs/input-number/expert_datatable_input_number.vue'
import ExpertDatatableAutonumeric from '../inputs/auto-numeric/expert_datatable_auto_numeric.vue'
import ExpertDatatableSelect from '../inputs/select/expert_datatable_select.vue'

export default /*#__PURE__*/Vue.extend({
    name: 'ExpertDatatableItemField',
	components: {
		'expert-datatable-input': ExpertDatatableInput,
		'expert-datatable-input-number': ExpertDatatableInputNumber,
		'expert-datatable-autonumeric': ExpertDatatableAutonumeric,
		'expert-datatable-select': ExpertDatatableSelect
	},
    data(): DataInterface {
        return {
            localValue: this.value,
            language: enEN
        }
    },
    props: {
        value: {
            required: true
        },
        field: {
            type: Object as PropType<FieldsInterface>,
            required: true
        },
        tableName: {
            type: String,
            required: true
        },
        isAdding: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        localValue (newValue) {
            this.$emit('input', newValue)
        },
        value (newValue) {
            this.localValue = newValue
        }
    },
    beforeMount() {
        this.language = initLanguage(this.$expert_datatable_config.lang, this.tableName)
    },
    mounted() {
        
    },
    methods: {
        inputPlaceholder(field: FieldsInterface) : string {
            let text = this.language.input_placeholder.replace(' {pronoun} ', field.pronoun ? ` ${field.pronoun} ` : ' ')
            text = text.replace('{title}', field.title.toLowerCase())
            return text
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
		deselectRow () {
			this.$emit('deselect-row')
		}
    },
});
</script>

<style lang="scss">

</style>
