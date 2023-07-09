import { Component, OnDestroy } from '@angular/core'
import { BlogService, Post } from '../shared/services/blog.service'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators'
import { MusicService } from 'app/shared/services/music.service'

@Component({
	selector: 'app-blog',
	templateUrl: './blog.component.html',
	styleUrls: [
		'./blog.component.css'
	]
})
export class BlogComponent implements OnDestroy {
	openedUiSeriesIndex = 0
	selectedSeriesIndex = 0

	get blogSeries() {
		return this.blogService.series
	}

	get selectedPost() {
		return this.blogService.selectedPost
	}

	constructor(private blogService: BlogService, private router: Router, private route: ActivatedRoute, private musicService: MusicService) {
		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((e) => {
			const urlEnd = (e as NavigationEnd).urlAfterRedirects

			if (urlEnd === '/blog') {
				this.blogService.selectedPost = this.blogService.posts[0]
				this.router.navigate([this.selectedPost.routePath], {relativeTo: this.route})
			} else {
				const post = this.blogService.tryGetPostWithRoutPath(urlEnd)
				if (post !== null) {
					this.blogService.selectedPost = post
				}
			}
		})

		this.musicService.toggleMinimizeMusicPlayer(true)
	}

	ngOnDestroy() {
		this.musicService.toggleMinimizeMusicPlayer(false)
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
