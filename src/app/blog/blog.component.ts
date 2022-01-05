import { Component } from '@angular/core'
import { BlogService, Post } from '../shared/services/blog.service'
import {Location} from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: [
		'./blog.component.css'
	]
})
export class BlogComponent {
	openedUiSeriesIndex = 0
	selectedSeriesIndex = 0

	get blogSeries() {
		return this.blogService.series
	}

	get selectedPost() {
		return this.blogService.selectedPost
	}

	constructor(private blogService: BlogService, private location: Location, private router: Router, private route: ActivatedRoute) {
		const blogPath = '/blog/'
		if (this.location.isCurrentPathEqualTo(blogPath)) {
			this.router.navigate([this.selectedPost.routePath], {relativeTo: this.route})
		}
		else {
			const urlSplit = this.router.url.split('/')
			const routePath = urlSplit[urlSplit.length - 2] + '/' + urlSplit[urlSplit.length - 1]
			const foundPost = this.blogService.getPostWith(routePath)
			if (foundPost) {
				this.blogService.selectedPost = foundPost
			}
		}

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

		this.router.navigate([this.selectedPost.routePath], {relativeTo: this.route})

		window.scroll(0, 0)
	}

}
