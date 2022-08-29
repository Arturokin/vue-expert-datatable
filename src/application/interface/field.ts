export interface FieldData {
	placeholder?: string;
	thousandSeparator?: '.' | ','; // for autonumeric,
	decimalSeparator?: ',' | '.'; // for autonumeric,
	useDollarSign?: boolean;
	decimals?: number;
	min?: number;
	showEditingIcon?: boolean;
	currencySymbolPlacement?: 'p' | 's';
	date_format?: string;
}

export interface SelectData {
	items?: Array<any>;
	itemText?: string;
	itemValue?: string;
	allowClear?: boolean;
	allowSearch?: boolean;
}

export interface BindData {
	custom_row: (row: any, index: number) => any;
	custom_header: (field: Field) => any;
	custom_field: (row: any, field: Field, index: number) => any;
	custom_add_field: (field: Field) => any;
	custom_header_row: (field: Field) => any;
	custom_header_footer: (field: Field) => any;
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
    fieldType?: 'text' | 'longtext' | 'number' | 'autonumeric' | 'select' | 'range' | 'checkbox' | 'switch' | 'date' | 'datetime' | 'time' | 'week' | 'month' | 'autocomplete' | 'custom' | undefined,
	fieldData?: FieldData,
	fieldAlwaysVisible?: boolean,
    editable?: boolean,
    pronoun?: string,
	rules?: string | ((field: Field, item: any, index: any) => string)
	selectData?: SelectData,
	bind_data?: BindData
	default_value?: any;
}
