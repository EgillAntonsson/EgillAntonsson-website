import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http'
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

		// const body = new URLSearchParams()
		// body.set('inputComment', 'this is a static input comment text string')

		const body = new HttpParams()
		.set('form-name', 'blogCommentForm')
		.append('inputComment', 'this is a fixed comment message, whoop')

		const httpOptions  = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		}

		const url = '/home'
		console.log(url)

		this.http.post(url, body.toString, httpOptions).subscribe(
			res => {
				console.log('post res')
				console.log(res)
			},
			err => {
				if (err instanceof ErrorEvent) {
					// client side error
					alert('Something went wrong when sending your message.')
					console.log(err.error.message)
				} else {
					// backend error. If status is 200, then the message successfully sent
					if (err.status === 200) {
						alert('Your message has been sent!, but backend error')
					} else {
						alert('Something went wrong when sending your message (backend error).');
						console.log('Error status:')
						console.log(err.status)
						console.log('Error body:')
						console.log(err.error)
					}
				}
			}
		)

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

