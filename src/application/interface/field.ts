export interface FieldData {
	placeholder?: string,
	thousandSeparator?: '.' | ',', // for autonumeric,
	useDollarSign?: boolean,
	decimals?: number,
	min?: number,
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
    editable?: boolean,
    pronoun?: string,
	rules?: string;
}
