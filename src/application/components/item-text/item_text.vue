<template>
	<span @click="clickEvent" class="expert-item-text">
		<template v-if="field.selectData && field.selectData.itemText && !field_select_selected">
			{{ typeof item[field.value] === 'object' ? item[field.value][field.selectData.itemText] : item[field.value] }}
		</template>
		<template v-else-if="!field_select_selected">
			{{ item[field.value] }}
		</template>
		<template v-else-if="field_select_selected">
			{{ field_select_selected[this.field.selectData.itemText] }}
		</template>
	</span>
</template>

<script lang="ts">
import Field from '@/application/interface/field'
import Vue, { PropType } from 'vue'
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
						console.log('x', x)
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
		}
	},
	methods: {
		clickEvent () {
			this.$emit('click')
		}
	}
})
</script>
