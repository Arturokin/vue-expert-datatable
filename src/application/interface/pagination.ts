export default interface Pagination {
    page: number,
    defaultPage?: number,
    pageSize: number,
    defaultPageSize?: number,
    disabled: boolean,
    visible: boolean,
    showTotal: boolean,
    size: 'small' | 'normal'
    total: number
}