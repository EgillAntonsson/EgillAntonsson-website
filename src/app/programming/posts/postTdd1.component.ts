import { Component } from '@angular/core'
import { BlogService, Post } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-1',
	templateUrl: './postTdd1.component.html'
})

export class PostTdd1Component {

	post: Post
	get postTitle() {
		return this.post.title
	}

	get seriesTitle() {
		return this.post.seriesTitle
	}

	constructor(private blogService: BlogService) {
		this.post = this.blogService.selectedPost
	}
}
