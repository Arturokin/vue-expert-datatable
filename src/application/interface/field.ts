export default interface Field {
    align?: 'left' | 'center' | 'right',
    colSpan?: number,
    value: string,
    filterIcon?: string,
    sortable?: boolean,
    title: string,
    width?: string | number,
    visible?: boolean,
    fieldType?: 'text' | 'longtext' | 'number' | 'select' | 'range' | 'checkbox' | 'switch' | 'date' | 'datetime' | 'autocomplete' | 'custom' | undefined,
    alwaysEditable?: boolean,
    pronoun?: string
}