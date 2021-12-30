import { Component } from '@angular/core'
import { BlogService, Post } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-1',
	templateUrl: './postTdd1.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd1Component {

	post: Post

	constructor(private blogService: BlogService) {
		this.post = this.blogService.selectedPost
	}
}
