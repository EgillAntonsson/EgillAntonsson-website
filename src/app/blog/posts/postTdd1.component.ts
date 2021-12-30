import { Component, OnDestroy } from '@angular/core'
import { BlogService, Post } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-1',
	templateUrl: './postTdd1.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd1Component implements OnDestroy {

	post: Post

	form

	constructor(private blogService: BlogService) {
		this.post = this.blogService.selectedPost

		this.form  = document.getElementById('formId')
		if (this.form) {

			this.form.parentNode?.removeChild(this.form)

			document.body.appendChild(this.form)
		}
	}

	ngOnDestroy(): void {
		if (this.form) {
			document.body.removeChild(this.form)
		}
	}
}
