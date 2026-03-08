import { Component } from "@angular/core"
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router"
import { Post, Series } from "app/shared/services/blog.service"
import { MusicService } from "app/shared/services/music.service"
import { filter } from "rxjs/operators"
import { TreeNavigationNode } from "app/shared/data/treeNavigationNode"

interface BlogTreeBranchConfig {
	label: string
	children?: BlogTreeBranchConfig[]
	seriesTitles?: string[]
}

@Component({
	selector: 'app-abstract-content-display',
	template: '',
	styleUrls: [
		'./../blog/blog.component.css'
	]
})
export abstract class ContentDisplayComponent {
	private _treeNodes?: TreeNavigationNode<Post>[]

	// Optional grouping for deep blog navigation. Non-configured series are appended at root level.
	private readonly blogTreeConfig: BlogTreeBranchConfig[] = [
		{
			label: 'Test-Focused programming',
			seriesTitles: [
				'TDD: The What, How, Why and When',
				'TDD-ing Avatar Health in C# and C++',
				'TDD-ing Chess in C#'
			]
		},
		{
			label: 'Audio programming',
			children: [{
					label: 'REAPER',
					seriesTitles: ['ReaScripts'],
				}, {
					label: 'FMOD',
					seriesTitles: ['FMOD editor', 'Unity editor'],
				},
			],
		},
		{
			label: 'Lifting',
			seriesTitles: ['Lift up and down']
		},
	]

	constructor(protected router: Router, protected route: ActivatedRoute, protected musicService: MusicService) {

		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((e) => {
			const urlEnd = (e as NavigationEnd).urlAfterRedirects

			if (urlEnd === this.urlEnd) {
				this.selectedPost = this.defaultPost
				this.router.navigate([this.selectedPost.routePath], {relativeTo: this.route})
			} else {
				const post = this.getPost(urlEnd)
				if (post) {
					this.selectedPost = post
				}
			}
		})

		this.musicService.toggleMinimizeMusicPlayer(true)
	}

	abstract get urlEnd(): string;
	abstract get selectedPost(): Post
	abstract set selectedPost(post: Post)
	abstract get defaultPost(): Post
	abstract getPost(path: string): Post | undefined

	get selectedPostNodeId(): string {
		return this.getPostNodeId(this.selectedPost)
	}

	ngAfterViewChecked(): void {
		this.musicService.toggleMinimizeMusicPlayer(true)
	}

	ngOnDestroy() {
		this.musicService.toggleMinimizeMusicPlayer(false)
	}

	abstract get series(): Series[]

	get treeNodes(): TreeNavigationNode<Post>[] {
		if (!this._treeNodes) {
			const seriesByTitle = new Map<string, Series>()
			for (const series of this.series) {
				seriesByTitle.set(series.title, series)
			}

			const configuredSeriesTitles = new Set<string>()
			const configuredNodes = this.toConfiguredBlogNodes(
				this.blogTreeConfig,
				seriesByTitle,
				configuredSeriesTitles,
				'blog-root',
			)

			const unconfiguredSeriesNodes = this.series
				.filter(series => !configuredSeriesTitles.has(series.title))
				.map((series, seriesIndex) => this.toSeriesTreeNode(series, seriesIndex))

			this._treeNodes = [...configuredNodes, ...unconfiguredSeriesNodes]
		}

		return this._treeNodes
	}

	onTreeNodeSelected(node: TreeNavigationNode<unknown>) {
		if (node.value) {
			this.onPostClick(node.value as Post)
		}
	}

	onPostClick(post: Post) {
		this.selectedPost = post
		this.router.navigate([this.selectedPost.routePath], { relativeTo: this.route });
	}

	private getPostNodeId(post: Post): string {
		return `post:${post.routePath}`
	}

	private toConfiguredBlogNodes(
		configs: BlogTreeBranchConfig[],
		seriesByTitle: Map<string, Series>,
		configuredSeriesTitles: Set<string>,
		parentNodeId: string,
	): TreeNavigationNode<Post>[] {
		return configs.map((config, configIndex) => {
			const branchNodeId = `${parentNodeId}/branch:${configIndex}:${config.label}`
			const childBranchNodes = this.toConfiguredBlogNodes(
				config.children || [],
				seriesByTitle,
				configuredSeriesTitles,
				branchNodeId,
			)

			const seriesNodes = (config.seriesTitles || [])
				.map((seriesTitle, seriesIndex) => {
					const series = seriesByTitle.get(seriesTitle)
					if (!series) {
						return undefined
					}

					configuredSeriesTitles.add(seriesTitle)
					return this.toSeriesTreeNode(series, seriesIndex, branchNodeId)
				})
				.filter((seriesNode): seriesNode is TreeNavigationNode<Post> => !!seriesNode)

			return {
				id: branchNodeId,
				label: config.label,
				children: [...childBranchNodes, ...seriesNodes]
			}
		})
	}

	private toSeriesTreeNode(series: Series, seriesIndex: number, parentNodeId = 'series-root'): TreeNavigationNode<Post> {
		return {
			id: `${parentNodeId}/series:${seriesIndex}:${series.title}`,
			label: series.title,
			children: series.posts.map(post => ({
				id: this.getPostNodeId(post),
				label: post.title,
				value: post
			}))
		}
	}
}
