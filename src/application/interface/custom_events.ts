import Field from "./field";

export default interface CustomEvents {
	before_save?: (row: any, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	before_edit?: (row: any, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	before_add?: (row: any, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	after_save?: (row: any, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	after_edit?: (row: any, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
	after_add?: (row: any, index: number | undefined, field?: Field) => Promise<boolean> | boolean;
}
