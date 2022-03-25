export default interface Alert {
	type: 'error' | 'info' | 'warning' | 'success',
	message: string,
	code: number
}
