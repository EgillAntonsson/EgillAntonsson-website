import { Component } from '@angular/core'
import { BlogService } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-2',
	templateUrl: './postTdd2.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd2Component {

	get post() {
		return this.blogService.selectedPost
	}


	constructor(private blogService: BlogService) {}

}
