import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})

export class BlogService {

	series: Series[]
	selectedPost: Post
	posts: Post[]

	constructor() {

		const seriesTddTitle = 'TDD-ing Avatar Health in Unity (C# .NET)'
		const dateYear = '2021'
		const dateMonth = 'Dec'
		const dateDay = '30'

		this.series = [
			{title: seriesTddTitle, posts: [
				new Post('Part 1 - TDD: What, Why, When ?', 'tdd-health/part1', dateYear, dateMonth, dateDay, seriesTddTitle),
				new Post('Part 2 - The assignment: The Avatar Health', 'tdd-health/part2', dateYear, dateMonth, dateDay, seriesTddTitle),
				new Post( 'Part 3 - The implementation begins', 'tdd-health/part3', dateYear, dateMonth, dateDay, seriesTddTitle),
				new Post( 'Part 4 - Implementing Taking Damage', 'tdd-health/part4', '2022', 'January', '4', seriesTddTitle)
			]
		}
		]

		this.selectedPost = this.series[0].posts[0]

		this.posts = []
		for (let i = 0; i < this.series.length; i++) {
			for (let j = 0; j < this.series[i].posts.length; j++) {
				const post = this.series[i].posts[j]
				this.posts.push(post)
			}
		}
	}

	getPostWith(routePath: string) {
		let foundPost = null;
		this.posts.filter((post) => {
			if (post.routePath === routePath) {
				foundPost = post
			}
		})
		return foundPost
	}

}

export class Post {
	readonly title: string
	readonly routePath: string
	readonly seriesTitle: string
	readonly dateYear: string
	readonly dateMonth: string
	readonly dateDay: string

	constructor(title: string, routePath: string, dateYear: string, dateMonth: string, dateDay: string, seriesTitle: string) {
		this.title = title
		this.routePath = routePath
		this.dateYear = dateYear
		this.dateMonth = dateMonth
		this.dateDay = dateDay
		this.seriesTitle = seriesTitle
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

