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

}
