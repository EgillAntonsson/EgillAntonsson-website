import { Component } from '@angular/core'
import { Post, BlogService } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-4',
	templateUrl: './postTdd4.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd4Component {

	post: Post

	constructor(private blogService: BlogService) {
		this.post = this.blogService.selectedPost
	}
	test_1_Red = `//HealthTest.cs
using NUnit.Framework;
`

}
