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

		this.series = [
			{title: seriesTddTitle, posts: [
				new Post('Part 1 - TDD: What, Why, When ?', 'tdd-health/part1', seriesTddTitle, new Date(2021, 11, 30), new Date(2022, 4, 14)),
				new Post('Part 2 - The assignment: The Avatar Health', 'tdd-health/part2', seriesTddTitle, new Date(2021, 11, 30), new Date(2022, 4, 14)),
				new Post( 'Part 3 - The implementation begins', 'tdd-health/part3', seriesTddTitle, new Date(2021, 11, 30), new Date(2022, 4, 14)),
				new Post( 'Part 4 - Taking Damage', 'tdd-health/part4', seriesTddTitle, new Date(2022, 0, 4), new Date(2022, 4, 14)),
				new Post( 'Part 5 - The Dying part', 'tdd-health/part5', seriesTddTitle, new Date(2022, 1, 1), new Date(2022, 4, 14)),
				new Post( 'Part 6 - The Replenishing part', 'tdd-health/part6', seriesTddTitle, new Date(2022, 4, 9), new Date(2022, 4, 14)),
				new Post( 'Part 7 - The Increasing and Max part', 'tdd-health/part7', seriesTddTitle, new Date(2022, 4, 14), new Date(2022, 7, 16)),
				new Post( 'Part 8 - Adding the Config', 'tdd-health/part8', seriesTddTitle, new Date(2022, 7, 16))
			]
		}
		]

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

