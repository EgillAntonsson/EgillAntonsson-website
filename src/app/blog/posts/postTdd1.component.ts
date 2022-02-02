import { Component } from '@angular/core'
import { BlogService } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-1',
	templateUrl: './postTdd1.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd1Component {

	get post() {
		return this.blogService.selectedPost
	}

	constructor(private blogService: BlogService) {}

}
