<template>
    <div class="expert-item-field">
        <a-input
            v-if="field.fieldType === 'text'"
            :ref="'input_' + field.value"
            v-model="localValue"
            :placeholder="inputPlaceholder(field)"
        ></a-input>
        <a-textarea
            v-if="field.fieldType === 'longtext'"
            :ref="'input_' + field.value"
            v-model="localValue"
            :placeholder="inputPlaceholder(field)"
        ></a-textarea>
        <a-input-number
            v-if="field.fieldType === 'number'"
            :ref="'input_' + field.value"
            v-model="localValue"
            :placeholder="inputPlaceholder(field)"
        ></a-input-number>
        <a-checkbox
            v-if="field.fieldType === 'checkbox'"
            :ref="'input_' + field.value"
        ></a-checkbox>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import FieldsInterface from '../../interface/field'
import DataInterface from './data-interface'
import enEN from '../../language/en-EN'
import initLanguage from '../../language/init-language'

export default /*#__PURE__*/Vue.extend({
    name: 'VueExpertDatatable',
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
            text = text.replace('{value}', field.value)
            return text
        }
    },
});
</script>

<style lang="scss">

</style>
