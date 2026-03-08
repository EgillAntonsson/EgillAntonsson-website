import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { TreeNavigationNode } from 'app/shared/data/treeNavigationNode'

@Component({
	selector: 'app-tree-container',
	templateUrl: './treeContainer.component.html',
})
export class TreeContainerComponent implements OnChanges {
	@Input() nodes: TreeNavigationNode[] = []
	@Input() selectedNodeId = ''
	@Output() nodeSelected = new EventEmitter<TreeNavigationNode>()

	expandedNodeIds = new Set<string>()

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selectedNodeId'] || changes['nodes']) {
			this.expandPathToSelectedNode()
		}
	}

	onNodeClick(node: TreeNavigationNode, event: MouseEvent) {
		event.stopPropagation()

		if (this.hasChildren(node)) {
			if (this.expandedNodeIds.has(node.id)) {
				this.expandedNodeIds.delete(node.id)
			} else {
				this.expandedNodeIds.add(node.id)
			}
		}

		if (node.selectable === true || !this.hasChildren(node)) {
			this.nodeSelected.emit(node)
		}
	}

	hasChildren(node: TreeNavigationNode): boolean {
		return !!node.children && node.children.length > 0
	}

	isExpanded(node: TreeNavigationNode): boolean {
		return this.expandedNodeIds.has(node.id)
	}

	isSelected(node: TreeNavigationNode): boolean {
		return node.id === this.selectedNodeId
	}

	private expandPathToSelectedNode() {
		if (!this.selectedNodeId) {
			return
		}

		const selectedPathNodeIds = this.tryGetNodePathIds(this.nodes, this.selectedNodeId)
		if (!selectedPathNodeIds) {
			return
		}

		for (let i = 0; i < selectedPathNodeIds.length - 1; i++) {
			this.expandedNodeIds.add(selectedPathNodeIds[i])
		}
	}

	private tryGetNodePathIds(nodes: TreeNavigationNode[], targetNodeId: string): string[] | undefined {
		for (const node of nodes) {
			if (node.id === targetNodeId) {
				return [node.id]
			}

			if (node.children && node.children.length > 0) {
				const childPathNodeIds = this.tryGetNodePathIds(node.children, targetNodeId)
				if (childPathNodeIds) {
					return [node.id, ...childPathNodeIds]
				}
			}
		}

		return undefined
	}
}
