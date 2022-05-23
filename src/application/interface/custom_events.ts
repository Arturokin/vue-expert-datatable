import Field from "./field";

export default interface CustomEvents {
	before_save?: (row: any, index: number | undefined, field?: Field) => Promise<any>;
	before_edit?: (row: any, index: number | undefined, field?: Field) => Promise<any>;
	before_add?: (row: any, index: number | undefined, field?: Field) => Promise<any>;
	after_save?: (row: any, index: number | undefined, field?: Field) => Promise<any>;
	after_edit?: (row: any, index: number | undefined, field?: Field) => Promise<any>;
	after_add?: (row: any, index: number | undefined, field?: Field) => Promise<any>;
}
