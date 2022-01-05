import { HttpHeaders, HttpClient } from '@angular/common/http'
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

	constructor( private fb: FormBuilder, private http: HttpClient) {
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
		// console.log(e)
		console.log('Send clicked')
		console.log(this.commentForm)

		const body = new URLSearchParams()
		body.set('inputComment', 'this is a static input comment text string')

		const httpOptions  = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		}

		this.http.post('/', body, httpOptions)

		console.log('after posting')

		// fetch('/', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		// 	body: encode({ 'form-name': 'blogCommentForm', ...this.state })
		// })
		// 	.then(() => alert("Success!"))
		// 	.catch(error => alert(error));

		// e.preventDefault();


		// this.showCommentForm = false
	}


}

