export default interface Header {
    align?: 'left' | 'center' | 'right',
    colSpan?: number,
    value: string,
    filterIcon?: string,
    sortable?: boolean,
    title: string,
    width?: string | number
}