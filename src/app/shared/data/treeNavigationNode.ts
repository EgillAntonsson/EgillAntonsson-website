export interface TreeNavigationNode<T = unknown> {
	id: string
	label: string
	children?: TreeNavigationNode<T>[]
	value?: T
	selectable?: boolean
}
