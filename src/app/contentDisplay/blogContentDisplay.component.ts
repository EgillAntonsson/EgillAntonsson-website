import { Component } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { BlogService, Post, Series } from "app/shared/services/blog.service"
import { MusicService } from "app/shared/services/music.service"
import { ContentDisplayComponent } from "./contentDisplay.component"

@Component({
	selector: 'app-blog-content-display',
	templateUrl: './contentDisplay.component.html',
	styleUrls: [
		'./../blog/blog.component.css'
	]
})
export class BlogContentDisplayComponent extends ContentDisplayComponent {
	get series(): Series[] {
		return this.blogService.series
	}
	getPost(path: string): Post | undefined {
		return this.blogService.getPost(path)
	}
	get defaultPost(): Post {
		return this.blogService.defaultPost
	}

	get urlEnd(): string {
		return this.blogService.urlEnd
	}

	get selectedPost() {
		return this.blogService.selectedPost
	}
	set selectedPost(post: Post) {
		this.blogService.selectedPost = post
	}

	private blogService: BlogService

	constructor(
		blogService: BlogService,
		router: Router,
		activatedRoute: ActivatedRoute,
		musicService: MusicService,
	) {
		super(router, activatedRoute, musicService)
		this.blogService = blogService
	}

}
