import { Component } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { HttpParams, HttpClient } from '@angular/common/http'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {


	placeholderComment = `This is a required field.
After you press 'Send' button:
* the comment will be pending for moderation
* This comment form will hide
After approval I will publish it here
(I might also add a short response).`
	placeholderHandle = 'This is a required field'

	showCommentForm = true

	commentForm: FormGroup
	formName = 'CommentForm'
	netlifyFormName = 'form-name'
	commentName = 'Comment'
	handleName = 'Handle'
	botFieldName = 'BotField'

	url = ''

	constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {

		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((e) => {
			this.url = (e as NavigationEnd).urlAfterRedirects
		})

		this.commentForm = this.fb.group({
			[this.commentName]: ['', [Validators.required]],
			[this.botFieldName]: ['', [Validators.required]]
		})

	}

	onSendClick() {

		const body = new HttpParams()
		.set(this.netlifyFormName, this.formName)
		.append(this.commentName, this.commentForm.value[this.commentName])
		.append(this.handleName, this.commentForm.value[this.handleName])

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
