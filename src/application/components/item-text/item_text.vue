<template>
	<span @click="clickEvent" class="expert-item-text">
		{{ formattedText }}
	</span>
</template>

<script lang="ts">
import Field from '@/application/interface/field'
import Vue, { PropType } from 'vue'
import moment from 'moment'
export default Vue.extend({
	name: 'ExpertDatatableItemText',
	props: {
		field: {
            type: Object as PropType<Field>,
            required: true
        },
		item: {
			type: Object as PropType<any>,
			default: () => {
				return {}
			}
		}
	},
	computed: {
		field_select_selected () : any {
			if (this.field.selectData && this.field.selectData.items) {
				if (this.field.selectData.itemValue && this.field.selectData.itemText) {
					return this.field.selectData.items.find(x => {
						if (typeof x === 'object' && this.field.selectData && this.field.selectData.itemValue) {
							return x[this.field.selectData.itemValue] === this.item[this.field.value]
						} else {
							return false
						}
					})
				} else {
					return this.field.selectData.items.find(x => {
						return x === this.item[this.field.value]
					})
				}
			}
			return undefined
		},
		is_date () {
			return ['date', 'datetime', 'time', 'month', 'year'].includes(this.field.fieldType)
		},
		date_format () {
			if (this.is_date) {
				if (this.field.fieldData.date_format) {
					return this.field.fieldData.date_format
				}
				if (this.field.fieldType === 'date') {
					return 'YYYY-MM-DD'
				} else if (this.field.fieldType === 'datetime') {
					return 'YYYY-MM-DD HH:mm:ss'
				} else if (this.field.fieldType === 'time') {
					return 'HH:mm:ss'
				} else if (this.field.fieldType === 'month') {
					return 'YYYY-MM'
				} else if (this.field.fieldType === 'year') {
					return 'YYYY'
				} else {
					return 'YYYY-MM-DD'
				}
			} else {
				return 'YYYY-MM-DD'
			}
		},
		formattedText () : any {
			let formatted: any = ''
			if (this.field.selectData && this.field.selectData.itemText && !this.field_select_selected && this.item) {
				const item_object = this.item[this.field.value]
				if (item_object && typeof this.item[this.field.value] === 'object') {
					formatted = this.item[this.field.value][this.field.selectData.itemText]
				} else {
					formatted = this.item[this.field.value]
				}
			} else if (this.field_select_selected && this.field.selectData && this.field.selectData.itemText) {
				formatted = this.field_select_selected[this.field.selectData.itemText]
			} else if (this.is_date) {
				formatted = this.item[this.field.value] && moment(this.item[this.field.value]).isValid() ? moment(this.item[this.field.value]).format(this.date_format) : ''
			} else {
				formatted = this.item[this.field.value]
			}
			
			if (this.field.fieldData) {
				if (this.field.fieldData.thousandSeparator) {
					formatted = this.formatNumber(formatted, this.field.fieldData.thousandSeparator)
				}
				if (this.field.fieldData.useDollarSign) {
					formatted = `$${formatted}`
				}
			}
			return formatted
		}
	},
	methods: {
		clickEvent () {
			this.$emit('click')
		},
		formatNumber (number: any, separator: string) {
			if (typeof number === 'undefined') {
				return 0
			}
			if (!number || isNaN(parseInt(number))) {
				return 0
			}
			return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
		}
	}
})
</script>
