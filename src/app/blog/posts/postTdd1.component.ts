import { Component, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { BlogService, Post } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-1',
	templateUrl: './postTdd1.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd1Component implements OnDestroy {

	post: Post

	// form


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

	constructor(private blogService: BlogService, private fb: FormBuilder) {
		this.post = this.blogService.selectedPost

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

		// this.form  = document.getElementById('formId')
		// if (this.form) {

		// 	this.form.parentNode?.removeChild(this.form)

		// 	document.body.appendChild(this.form)
		// }
	}

	onSendClick() {
		console.log('Send clicked')
		console.log(this.commentForm)
	}

	ngOnDestroy(): void {
		// if (this.form) {
		// 	document.body.removeChild(this.form)
		// }
	}
}
