<template>
    <div class="expert-item-field" :key="`div_item_field_${index}_${field.value}`">
		<form action="" @submit.prevent="event_blur" autocomplete="off" :key="`form_item_field_${index}_${field.value}`">
			<expert-datatable-input
				v-if="field.fieldType === 'text'"
				:ref="'input_' + field.value"
				v-model="localValue"
				:placeholder="inputPlaceholder(field)"
				:field="field"
				:inputName="field.value"
				:input-key="`item_field_input_${index}_${field.value}`"
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
				:input-key="`item_field_input_${index}_${field.value}`"
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
				:input-key="`item_field_input_${index}_${field.value}`"
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
				:input-key="`item_field_input_${index}_${field.value}`"
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
				:input-key="`item_field_input_${index}_${field.value}`"
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
				:input-key="`item_field_input_${index}_${field.value}`"
				@blur="event_blur"
				@focus="event_focus"
				@keydown="event_key_down"
			></div>
			<date-picker
				v-if="field.fieldType === 'date' || field.fieldType === 'datetime' || field.fieldType === 'time' || field.fieldType === 'year' || field.fieldType === 'week'"
				v-model="localValue"
				:ref="'input_' + field.value"
				:inputName="field.value"
				:input-key="`item_field_input_${index}_${field.value}`"
				:placeholder="inputPlaceholder(field)"
				:format="field.fieldData.date_format || 'YYYY-MM-DD'"
				:append-to-body="false"
				:open.sync="open"
				:type="field.fieldType"
				@close="event_blur"
				@open="event_focus"
				@keydown="event_key_down"
				@deselect-row="deselectRow"
			></date-picker>
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
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

const datePickerLangEs = () => import('vue2-datepicker/locale/es.js')

export default /*#__PURE__*/Vue.extend({
    name: 'ExpertDatatableItemField',
	components: {
		'expert-datatable-input': ExpertDatatableInput,
		'expert-datatable-input-number': ExpertDatatableInputNumber,
		'expert-datatable-autonumeric': ExpertDatatableAutonumeric,
		'expert-datatable-select': ExpertDatatableSelect,
		DatePicker
	},
    data(): DataInterface {
        return {
            localValue: this.value,
            language: enEN,
			open: false
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
        },
		index: {
			type: [Number, String],
			default: 1
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
		if (this.$expert_datatable_config.lang === 'ES') {
			datePickerLangEs()
		}
    },
    mounted() {
        if (!this.isAdding) {
			this.open = true
		}
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
			this.$nextTick(() => {
				console.log('event blur field')
				this.$emit('blur', e)
			})
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
.mx-datepicker {
	width: 100%;

	.mx-input {
		background-color: transparent;
		border: none;
		box-shadow: none;
	}
}
</style>
