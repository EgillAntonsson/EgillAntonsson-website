import { Component } from '@angular/core'
import { BlogService, Post } from '../shared/services/blog.service'

@Component({
	selector: 'app-programming',
	templateUrl: './programming.component.html',
	styleUrls: [
		'./programming.component.css'
	]
})
export class ProgrammingComponent {
	openedUiSeriesIndex = 0
	selectedSeriesIndex = 0
	lineNumbers = true

	get blogSeries() {
		return this.blogService.blogSeries
	}

	get selectedPost() {
		return this.blogService.selectedPost
	}

	constructor(private blogService: BlogService) {

	}

	onSeriesClick(seriesIndex: number) {
		// deselect disabled, until more than one series is defined
		// if (this.openedUiSeriesIndex === seriesIndex) {

			// this.openedUiSeriesIndex = -1
		// } else {
			this.openedUiSeriesIndex = seriesIndex
		// }
	}

	onPostClick(post: Post) {
		this.selectedSeriesIndex = this.openedUiSeriesIndex
		this.blogService.selectedPost = post

		window.scroll(0, 0)
	}

}
