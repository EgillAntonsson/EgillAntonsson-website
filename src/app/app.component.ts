import { Component } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { HttpParams, HttpClient } from '@angular/common/http'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	commentForm: FormGroup
	// inputCommentControl
	// inputNameControl

	defaultCommentText = `Write your comment here.
On 'Send' button press it will be pending for moderation.
On approval I'll publish the comment here.
(I might also add a short response).`
	defaultNameText = 'Anonymous'
	defaultEmailText = 'email@domain.com'

	showCommentForm = true

	formName = 'blogCommentForm'
	commentKey = 'comment'

	constructor(private fb: FormBuilder, private http: HttpClient) {
		this.commentForm = this.fb.group({
			[this.commentKey]: ['', [Validators.required]],
			inputName: ['', [Validators.required]
		]
		})
		// this.inputCommentControl = this.commentForm.controls['inputComment']
		// this.inputNameControl = this.commentForm.controls['inputName']
	}

	onSendClick() {

		// console.log(this.inputCommentControl)

		const body = new HttpParams()
		.set('form-name', this.formName)
		.append('inputComment', this.commentForm.value[this.commentKey])

		const url = '/'
		console.log(url)

		console.log('Send clicked')
		console.log(this.commentForm)
		console.log('body')
		console.log(body)

		this.http.post(url, body.toString(), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).subscribe(
			res => {
				console.log('result handler from post', res)
			},
			err => {
				if (err instanceof ErrorEvent) {
					// client side error
					console.log('Something went wrong when sending your comment')
					console.log('client side error:')
					console.log(err.error.message)
				} else {
					// backend error. If status is 200, then the message successfully sent
					if (err.status === 200) {
						console.log('Your comment has been sent')
					} else {
						console.log('Something went wrong when sending your comment')
						console.log('backend side error')
						console.log('Error status:')
						console.log(err.status)
						console.log('Error body:')
						console.log(err.error)
					}
				}
			}
		)

	}
}
