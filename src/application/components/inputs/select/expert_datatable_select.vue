<template>
	<div class="expert-datatable-select-wrapper">
		<div
            class="expert-datatable-select ant-input-affix-wrapper"
            :tabindex="tabIndex"
        >
			<div class="selected-item-div" @click="openSelect">
				<div class="selected-item" v-show="!open && selected_item">
					<slot name="selected-item" v-bind:item="selected_item">
						<span v-if="select_data.itemText && typeof selected_item === 'object'">{{ selected_item[select_data.itemText] }}</span>
						<span v-else>{{ selected_item }}</span>
					</slot>
				</div>
				<div class="select-placeholder" v-show="!open && !selected_item">
					<slot name="placeholder" v-bind:item="selected_item">
						{{ placeholder }}
					</slot>
				</div>
				<input
					v-show="open"
					v-model="search"
					:name="field.value"
					type="text"
					:placeholder="placeholder"
					class="expert-datatable-select-search-input"
					v-bind="$attrs"
					ref="input_search"
				/>
			</div>
            <span class="expert-datatable-select-suffix border-left pl-2">
                
            </span>
            <div
                class="expert-datatable-select-items at-bottom"
                :class="{ 'show-select': open && filtered_items.length > 0 }"
            >
                <div class="expert-datatable-select-list-items">
                    <div
                        v-for="(item, index) in filtered_items"
                        :key="key_item_list(item, index)"
                        class="expert-datatable-select-item"
                        @click="clickItem(item)"
                    >
						<slot name="item-list" v-bind:item="item">
							<span v-if="select_data.itemText">{{ item[select_data.itemText] }}</span>
							<span v-else>{{ item }}</span>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script lang="ts">
import Field, { SelectData } from '@/application/interface/field'
import Vue, { PropType } from 'vue'

interface Data {
	select_data: SelectData,
	open: boolean,
	search: string,
	selected_item?: any
}

export default Vue.extend({
	name: 'ExpertDatatableSelect',
	props: {
		field: {
            type: Object as PropType<Field>,
            required: true
        },
		value: {
			type: [String, Number, Object],
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},
		items: {
			type: Array,
			default: null
		},
		itemText: {
			type: String,
			default: null
		},
		itemValue: {
			type: String,
			default: null
		},
		allowClear: {
			type: Boolean,
			default: null
		},
		allowSearch: {
			type: Boolean,
			default: null
		},
		tabIndex: {
			type: Number,
			default: 0
		},
		focusOnInit: {
			type: Boolean,
			default: false
		}
	},
	data() : Data {
		return {
			select_data: {},
			open: false,
			search: '',
			selected_item: undefined
		}
	},
	watch: {
		'field.selectData':  {
			handler (newVal: SelectData) : void {
				this.initSelectData(newVal)
			},
			deep: true
		},
		open: function (val: any) {
			this.$emit('open', val)

			if (!val) {
				this.$emit('blur')
			}
		},
		selected_item: function (val) {
			this.$emit('selected-item', val)
		},
		selected_value: function (val) {
			this.$emit('input', val)
			this.$emit('change', val)
		},
		value: function (val: any) {
			this.changeValue(val)
		}
	},
	computed: {
		filtered_items () : Array<any> {
			if (this.select_data.items) {
				if (this.search) {
					if (this.select_data.itemText && this.select_data.itemValue) {
						return this.select_data.items.filter((x: any) => {
							let text = this.select_data.itemText ? x[this.select_data.itemText] : ''
							let value = this.select_data.itemValue ? x[this.select_data.itemValue] : ''

							if (typeof text === 'number') {
								text = text.toString()
							}
							if (typeof value === 'number') {
								value = value.toString()
							}
							if (typeof text === 'string' && typeof value === 'string') {
								return text.toLowerCase().includes(this.search.toLowerCase())
							}
							return false
						})
					} else if (this.select_data.itemText) {
						return this.select_data.items.filter((x: any) => {
							let text = this.select_data.itemText ? x[this.select_data.itemText] : ''
							if (typeof text === 'number') {
								text = text.toString()
							}
							if (typeof text === 'string') {
								return text.toLowerCase().includes(this.search.toLowerCase())
							}
							return false
						})
					} else if (this.select_data.itemValue) {
						return this.select_data.items.filter((x: any) => {
							let value = this.select_data.itemValue ? x[this.select_data.itemValue] : ''
							if (typeof value === 'number') {
								value = value.toString()
							}
							if (typeof value === 'string') {
								return value.toLowerCase().includes(this.search.toLowerCase())
							}
							return false
						})
					} else {
						return this.select_data.items.filter((x: any) => {
							if (typeof x === 'string') {
								return x.toLowerCase().includes(this.search.toLowerCase())
							}
							if (typeof x === 'number') {
								return x.toString().toLowerCase().includes(this.search.toLowerCase())
							}
						})
					}
				} else {
					return this.select_data.items
				}
			}
			return []
		},
		selected_value () : any {
			if (this.selected_item) {
				if (this.select_data.itemValue) {
					return this.selected_item[this.select_data.itemValue]
				}
				return this.selected_item
			}
			return null
		}
	},
	created () {
		if (this.field.selectData) {
			this.initSelectData(this.field.selectData)
		} else {
			this.initSelectData()
		}
	},
	mounted () {
		this.$nextTick(() => {
			if (this.focusOnInit) {
				this.openSelect(true)
			}
			this.changeValue(this.value)
		})
	},
	methods: {
		initSelectData (select_data: SelectData | undefined = undefined) {
			if (select_data) {
				this.select_data = select_data
				if (!this.select_data.items) {
					this.select_data.items = []
				}
				if (!this.select_data.allowClear) {
					this.select_data.allowClear = true
				}
				if (!this.select_data.allowSearch) {
					this.select_data.allowSearch = true
				}
			} else {
				this.select_data = {
					items: this.items ? this.items : [],
					itemText: this.itemText ? this.itemText : undefined,
					itemValue: this.itemValue ? this.itemValue : undefined,
					allowClear: this.allowClear ? this.allowClear : undefined,
					allowSearch: this.allowSearch ? this.allowSearch : undefined
				}
			}
		},
        input (e: InputEvent) {
			const target: any = e.target
			this.$emit('input', target ? target.value : '')
		},
		openSelect (triggerFocus = false) {
			this.open = true

			if (triggerFocus) {
				this.$nextTick(() => {
					const input: any = this.$refs.input_search
					if (input) {
						input.focus()
						if (input.setSelectionRange) {
							input.setSelectionRange(0, input.value.length)
						}
					}
				})
			}
		},
		event_key_down (e: any) {
			this.$emit('keydown', e)
		},
		clickItem (item: any) {
			this.selected_item = item
			this.open = false
			this.search = ''
		},
		key_item_list (item: any, index: number) {
			if (this.select_data.itemValue) {
				return `item_${item[this.select_data.itemValue]}`
			} else {
				if (typeof item !== 'number' && typeof item !== 'string') {
					return `item_${item}`
				} else {
					return `item_${index}`
				}
			}
		},
		changeValue (val: any) {
			if (val) {
				if (this.select_data.items) {
					if (this.select_data.itemValue) {
						this.selected_item = this.select_data.items.find(x => {
							if (this.select_data.itemValue) {
								return x[this.select_data.itemValue] === val
							} else {
								return false
							}
						})
						if (this.select_data.itemText) {
							this.search = this.selected_item[this.select_data.itemText]
						} else {
							this.search = this.selected_item
						}
					} else {
						this.selected_item = this.select_data.items.find(x => {
							return x === val
						})
						if (this.select_data.itemText) {
							this.search = this.selected_item[this.select_data.itemText]
						} else {
							this.search = this.selected_item
						}
					}
				} else {
					this.selected_item = undefined
					this.search = ''
				}
			} else {
				this.selected_item = undefined
				this.search = ''
			}
		}
    },
})
</script>

<style lang="scss">
.expert-datatable-select-wrapper {
	display: inline-block;
	width: 100%;
	box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-block;
    width: 100%;

	.expert-datatable-select {
		display: inline-block;
		width: 100%;
		position: relative;

		.expert-datatable-select-suffix {
			position: absolute;
			top: 50%;
			z-index: 2;
			display: flex;
			align-items: center;
			color: rgba(0, 0, 0, 0.65);
			line-height: 0;
			transform: translateY(-50%);
		}

		.expert-datatable-select-search-input {
			width: 100%;
			padding: 0;
			background-color: transparent;
			color: rgba(0, 0, 0, 0.65);
			outline: none!important;
			border: none;
		}

		.expert-datatable-select-items {
			max-width: 100%;
			width: 100%;
			pointer-events: none;
			visibility: hidden;
			opacity: 0;
			max-height: 200px;
			overflow-y: scroll;

			transition: opacity .1s;
			position: absolute;
			z-index: 8;
			transform-origin: left top 0;
			background-color: #fff;
			border: 1px solid #ced4da;
			border-radius: .25rem;
			box-shadow: 0 2px 11px -2px rgb(0 0 0 / 19%);

			&.at-bottom {
				border-top: 0;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}

			.expert-datatable-select-list-items {
				overflow-y: auto;
    			overflow-x: hidden;
			}

			&.show-select {
				pointer-events: auto;
				visibility: visible;
				opacity: 1;
			}

			.expert-datatable-select-item {
				cursor: pointer;
				padding: 8px 12px;
				transition: .3s cubic-bezier(.25,.8,.5,1);

				&:hover {
					background-color: #f2f2f2;
				}
			}
		}
	}
}
</style>
