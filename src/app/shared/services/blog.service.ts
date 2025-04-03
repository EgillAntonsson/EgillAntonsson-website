import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})

export class BlogService {

	series: Series[]
	selectedPost: Post
	posts: Post[]

	constructor() {

		this.series = []
		const seriesReaScriptsTitle = 'ReaScripts for Cockos REAPER'
		this.series.push({title: seriesReaScriptsTitle, posts: [
			new Post('My scripts', PostRoutePath.reaScriptsMyScripts, seriesReaScriptsTitle, new Date(2025, 3, 3)),
			new Post('The Shipment Evaluator', PostRoutePath.reaScriptsShipmentEvaluator, seriesReaScriptsTitle, new Date(2025, 3, 3))
		]})

		const seriesTddWhatWhyWhenTitle = 'Test-Focused Development'
		this.series.push({title: 'Test-Focused Development', posts: [
			new Post('The What, How, Why and When', PostRoutePath.tddWhatHowWhyWhen, seriesTddWhatWhyWhenTitle, new Date(2021, 11, 30), new Date(2023, 10, 13))
		]})

		const seriesTddTitle = 'TDD-ing Avatar Health in C# and C++'
		this.series.push({title: seriesTddTitle, posts: [
			new Post('Part 1&2 - The Avatar Health assignment', 'tdd-health/part2', seriesTddTitle, new Date(2021, 11, 30), new Date(2023, 10, 13)),
			new Post( 'Part 3 - Implementation begins - C#', PostRoutePath.tddHealthPart3, seriesTddTitle, new Date(2021, 11, 30), new Date(2023, 5, 8)),
			new Post( 'Part 3 - Implementation begins - C++', PostRoutePath.tddHealthPart3_Cpp, seriesTddTitle, new Date(2023, 5, 8)),
			new Post( 'Part 4 - Taking Damage', 'tdd-health/part4', seriesTddTitle, new Date(2022, 0, 4), new Date(2022, 4, 14)),
			new Post( 'Part 5 - The Dying part', 'tdd-health/part5', seriesTddTitle, new Date(2022, 1, 1), new Date(2022, 4, 14)),
			new Post( 'Part 6 - The Replenishing part', 'tdd-health/part6', seriesTddTitle, new Date(2022, 4, 9), new Date(2022, 4, 14)),
			new Post( 'Part 7 - The Increasing and Max part', 'tdd-health/part7', seriesTddTitle, new Date(2022, 4, 14), new Date(2022, 7, 16)),
			new Post( 'Part 8 - Adding the Config', 'tdd-health/part8', seriesTddTitle, new Date(2022, 7, 16))
		]})
		const seriesTddChessTitle = 'TDD-ing Chess in C#'
		this.series.push({title: seriesTddChessTitle, posts: [
			new Post('Part 1 - The Position - C#', PostRoutePath.tddChessPart1, seriesTddChessTitle, new Date(2023, 9, 23), new Date(2023, 10, 13))
		]})

		this.selectedPost = this.series[0].posts[0]

		this.posts = []
		for (let i = 0; i < this.series.length; i++) {
			for (let j = 0; j < this.series[i].posts.length; j++) {
				const post = this.series[i].posts[j]
				post.index = j
				this.posts.push(post)
			}
		}
	}

	tryGetPostWithRoutePath(routePath: string) {
		let foundPost = null;
		this.posts.filter((post) => {
			if (post.routePath === routePath) {
				foundPost = post
			}
		})
		return foundPost
	}
}

export enum PostRoutePath {
	tddWhatHowWhyWhen = 'tdd/what-how-why-when',
	tddHealthPart3 = 'tdd-health/part3',
	tddHealthPart3_Cpp = 'tdd-health/part3-cpp',
	tddChessPart1 = 'tdd-chess/part1-csharp',
	reaScriptsMyScripts = 'rea-scripts/my-scripts',
	reaScriptsShipmentEvaluator = 'rea-scripts/shipment-evaluator'
}

export class Post {
	readonly title: string
	readonly routePath: string
	readonly seriesTitle: string
	readonly publishedDate: Date
	readonly updatedDate?: Date
	index!: number

	constructor(title: string, routePath: string, seriesTitle: string, publishedDate: Date, updatedDate?: Date) {
		this.title = title
		this.routePath = routePath
		this.seriesTitle = seriesTitle
		this.publishedDate = publishedDate
		this.updatedDate = updatedDate
	}
}

export interface Series {
	title: string
	posts: Post[]
}

export interface Comment {
	handle: string
	comment: string
	response: string
}

