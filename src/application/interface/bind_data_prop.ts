export default interface BindDataProp {
	top_header: any;
	header: any;
	header_row: any;
	footer_row: any;
	add_row: any;
	row: (row: any, index: number) => any;
	bottom_footer: any;
}
