export interface FieldData {
	placeholder?: string,
	thousandSeparator?: '.' | ',', // for autonumeric,
	useDollarSign?: boolean,
	decimals?: number,
	min?: number
}

export interface SelectData {
	items?: Array<any>,
	itemText?: string,
	itemValue?: string
	allowClear?: boolean,
	allowSearch?: boolean
}
export default interface Field {
    align?: 'left' | 'center' | 'right',
    colSpan?: number,
    value: string,
    filterIcon?: string,
    sortable?: boolean,
    title: string,
    width?: string | number,
    visible?: boolean,
    fieldType?: 'text' | 'longtext' | 'number' | 'autonumeric' | 'select' | 'range' | 'checkbox' | 'switch' | 'date' | 'datetime' | 'autocomplete' | 'custom' | undefined,
	fieldData?: FieldData,
	fieldAlwaysVisible?: boolean,
    editable?: boolean,
    pronoun?: string,
	rules?: string;
	selectData?: SelectData
}
