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
		const dateMonth = 'December'
		const dateDay = '30'

		const part1Comments = Array<Comment>()
		part1Comments.push( {
			handle: 'Fabio Paes Pedro',
			comment:
`I'm no expert but the value TDD provides became clear to me quite fast.
I believe this requires a mindset/process change though, a different way of thinking things through that might extend outside of our team, into a company level.
I can't wait to read the rest of this series!`,
			myResponse:
`Thank you for your comment Fabio.
I agree that TDD requires a mindset/process change, where ideally the whole team and the company are aligned on using TDD to reap its benefits (maybe synced on a sensible approach, e.g. that the value of TDD dwindles near boundary edges).
I aim to continue writing blog post parts and complete this series at an appropriate point, stay tuned :)`
})

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
		let index = 0
		for (let i = 0; i < this.series.length; i++) {
			for (let j = 0; j < this.series[i].posts.length; j++) {
				const post = this.series[i].posts[j]
				post.index = index++
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
	index!: number

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
	myResponse: string
}

