import { Component } from '@angular/core'
import { BlogService, Post } from '../shared/services/blog.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
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

	commentForm: FormGroup
	inputCommentControl
	inputNameControl
	inputEmailControl
	defaultCommentText = `Write your comment here.
On 'Send' button press it will be pending for moderation.
On approval I'll publish the comment here.
(I might also add a short response).
`
	defaultNameText = 'Anonymous'
	defaultEmailText = 'email@domain.com'

	showCommentForm = true

	get blogSeries() {
		return this.blogService.series
	}

	get selectedPost() {
		return this.blogService.selectedPost
	}

	constructor(private blogService: BlogService,  private fb: FormBuilder, private location: Location, private router: Router, private route: ActivatedRoute) {
		const blogPath = '/blog/'
		if (this.location.isCurrentPathEqualTo(blogPath)) {
			this.router.navigate([this.selectedPost.routePath], {relativeTo: this.route})
		}

		this.commentForm = this.fb.group({
			inputComment: ['', [
					Validators.required
				]
			],
			inputName: ['', []],
			inputEmail: ['', [
				Validators.email
			]
		],
		})
		this.inputCommentControl = this.commentForm.controls['inputComment']
		this.inputNameControl = this.commentForm.controls['inputName']
		this.inputEmailControl = this.commentForm.controls['inputEmail']

	}

	onSendClick() {
		// this.d
		// document.body.appendChild(form);

		// this.showCommentForm = false
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
