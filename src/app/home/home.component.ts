import { Component } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'

})
export class HomeComponent {

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

	constructor( private fb: FormBuilder) {
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
		console.log('Send clicked')
		console.log(this.commentForm)

		// this.showCommentForm = false
	}


}
