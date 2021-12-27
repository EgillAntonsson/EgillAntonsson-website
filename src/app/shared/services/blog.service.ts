import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})

export class BlogService {

	blogSeries: BlogSeries[]
	selectedPost: Post
	posts: Post[]
	constructor() {

		const seriesTddTitle = 'TDD-ing Avatar Health in C# via Unity'
		const dateYear = '2021'
		const dateMonth = 'December'
		const dateDay = '27'
		this.blogSeries = [
			{title: seriesTddTitle, posts: [
				new Post('Post 1 - TDD: What, Why, When', 'tdd-1', dateYear, dateMonth, dateDay, seriesTddTitle),
				new Post('Post 2 - The assignment: The Avatar Health', 'tdd-2', dateYear, dateMonth, dateDay, seriesTddTitle),
				new Post( 'Post 3 - The implementation begins', 'tdd-3', dateYear, dateMonth, dateDay, seriesTddTitle)
			]
		}
		]

		this.selectedPost = this.blogSeries[0].posts[0]

		this.posts = []
		let index = 0
		for (let i = 0; i < this.blogSeries.length; i++) {
			for (let j = 0; j < this.blogSeries[i].posts.length; j++) {
				const post = this.blogSeries[i].posts[j]
				post.index = index++
				this.posts.push(post)
			}
		}
	}

}

// export interface IPost {
// 	title: string
// 	component: string
// 	seriesTitle: string
// 	dateYear: string
// 	dateMonth: string
// 	dateDay: string
// 	index: number
// }

export class Post {
	readonly title: string
	readonly component: string
	readonly seriesTitle: string
	readonly dateYear: string
	readonly dateMonth: string
	readonly dateDay: string
	index!: number

	constructor(title: string, component: string, dateYear: string, dateMonth: string, dateDay: string, seriesTitle: string) {
		this.title = title
		this.component = component
		this.dateYear = dateYear
		this.dateMonth = dateMonth
		this.dateDay = dateDay
		this.seriesTitle = seriesTitle
	}

}
export interface BlogSeries {
	title: string
	posts: Post[]
}

