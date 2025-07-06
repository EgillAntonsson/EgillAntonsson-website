import { ChangeDetectorRef, Component } from "@angular/core"
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router"
import { Post, Series } from "app/shared/services/blog.service"
import { MusicService } from "app/shared/services/music.service"
import { filter } from "rxjs/operators"

@Component({
	selector: 'app-abstract-content-display',
	template: '',
	styleUrls: [
		'./../blog/blog.component.css'
	]
})
export abstract class ContentDisplayComponent {

	protected openedUiSeriesIndex = -1
	protected selectedSeriesIndex = 0

	constructor(protected router: Router, protected route: ActivatedRoute, protected musicService: MusicService, private changeDetectorRef: ChangeDetectorRef) {

		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((e) => {
			const urlEnd = (e as NavigationEnd).urlAfterRedirects

			if (urlEnd === this.urlEnd) {
				this.selectedPost = this.defaultPost
				this.router.navigate([this.selectedPost.routePath], {relativeTo: this.route})
			} else {
				const post = this.getPost(urlEnd)
				if (post) {
					this.selectedPost = post
					this.router.navigate([this.selectedPost.routePath], {relativeTo: this.route})
					this.onSeriesClick(post.seriesIndex)
					this.onPostClick(post)
				}
			}
		})

		this.musicService.toggleMinimizeMusicPlayer(true)
	}

	abstract get urlEnd(): string;
	abstract get selectedPost(): Post
	abstract set selectedPost(post: Post)
	abstract get defaultPost(): Post
	abstract getPost(path: string): Post | undefined

	ngAfterViewChecked(): void {
		this.musicService.toggleMinimizeMusicPlayer(true)
	}

	ngOnDestroy() {
		this.musicService.toggleMinimizeMusicPlayer(false)
	}

	abstract get series(): Series[]

	onSeriesClick(seriesIndex: number) {
		if (this.openedUiSeriesIndex === seriesIndex) {
			this.openedUiSeriesIndex = -1
		} else {
			this.openedUiSeriesIndex = seriesIndex
		}
	}

	onPostClick(post: Post) {
		this.selectedPost = post
		history.pushState(null, '', 'blog/' + this.selectedPost.routePath);
		this.changeDetectorRef.detectChanges()
	}
}
