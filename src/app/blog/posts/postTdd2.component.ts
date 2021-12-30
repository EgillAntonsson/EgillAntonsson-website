import { Component } from '@angular/core'
import { Post, BlogService } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-2',
	templateUrl: './postTdd2.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd2Component {

	post: Post

	constructor(private blogService: BlogService) {
		this.post = this.blogService.selectedPost
	}

}
