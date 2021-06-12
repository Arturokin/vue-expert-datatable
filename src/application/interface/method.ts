export default interface Method {
    url: string;
    type: 'GET' | 'POST' | 'PUT' | 'DELETE',
    transformData?: any
}