import { DatePipe } from '@angular/common'
import { Component } from '@angular/core'
import { BlogService } from '../../shared/services/blog.service'

@Component(
	{
		template: '<h1>base class template not used</h1>'
	}
)

export class PostComponent {

	constructor(private blogService: BlogService) {}

	get post() {
		return this.blogService.selectedPost
	}

	get publishedDateToString(): string {
		return this.dateToString(this.post.publishedDate)
	}

	get hasUpdatedDate(): boolean {
		if (this.post.updatedDate === undefined) {
			return false
		}
		return true
	}

	get updatedDateToString(): string {
		if (this.post.updatedDate === undefined) {
			return ''
		}
		return this.dateToString(this.post.updatedDate)
	}

	private dateToString(date: Date) {
		const datePipe: DatePipe = new DatePipe('en-US')
		const ret = datePipe.transform(date, 'YYYY MMM dd')
		if (ret === null) {
			return ''
		}
		return ret
	}

	get aboutCodeHtml() {
		return `<h2>The code</h2>
<p>
	The displayed code is focused on the current cycle step,<br>
	thus likely shows only relevant part/s of said class.<br>
	The complete code and the Unity project is on <a href="https://github.com/EgillAntonsson/tdd-avatar-health-in-unity">GitHub</a>.
</p>`
	}

	get completeRequirementListHtml() {
		return `<sup>The complete requirement list, from the user perspective is in <a href="./blog/tdd-health/part2">Part 2</a></sup>`
	}

	get rewordRequirement() {
		return `Let's reword this focusing on the domain model and using its terminology:`
	}

}
