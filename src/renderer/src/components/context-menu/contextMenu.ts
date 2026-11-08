export interface ContextMenuItem {
	icon?: any;
	label: string;
	action?: (data: any | undefined) => void;
	subItems?: ContextMenuItem[];
}