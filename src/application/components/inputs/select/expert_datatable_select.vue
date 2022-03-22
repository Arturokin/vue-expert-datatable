<template>
	<div class="expert-datatable-select-wrapper">
		<div
            v-click-outside="blur"
            class="expert-datatable-select ant-input-affix-wrapper"
            :tabindex="tabindex"
        >
            <input
                v-model="codigo"
				type="text"
                :placeholder="placeholder"
                class="expert-datatable-select-search-input"
                v-bind="$attrs"
                @blur="blurInput"
                @click="clickInput"
            />
            <span class="expert-datatable-select-suffix border-left pl-2">
                
            </span>
            <div
                class="expert-datatable-select-items at-bottom"
                :class="{ 'show-select': open && cuentas_contables_filtradas.length > 0 }"
            >
                <div class="expert-datatable-select-list-items">
                    <div
                        v-for="cuenta in cuentas_contables_filtradas"
                        :key="'cuenta_contable_' + cuenta.id"
                        class="item IZ-select__item"
                        @click="clickItem(cuenta)"
                    >
                        <span>{{ cuenta.codigo }} - {{ cuenta.nombre }}</span>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: 'ExpertDatatableSelect'
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
		}
	}
}
</style>
