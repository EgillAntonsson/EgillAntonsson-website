import { Component, OnInit } from '@angular/core'
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms'
import { HttpParams, HttpClient } from '@angular/common/http'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { LogService } from './shared/services/log.service'
import { LogType } from 'shared/enums/logType'
import { MusicService } from './shared/services/music.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {


	placeholderComment = `This is a required field.
After you press 'Send' button:
* your comment will pend for moderation
* this Comment-form will become hidden
After approval I will publish your comment,
I might also include a short response.`


	placeholderMessage = `This is a required field.
After you press 'Send' button
this Contact form will become hidden.
I have your email as a means to get back to you,
I'll never give it to 3rd party or display it publicly.`

	placeholderText = ''
	placeholderHandle = 'This is a required field'
	placeholderEmail = 'Required field, I will never give to 3rd party'

	showCommentForm = true

	headerText = ''
	messageForm: UntypedFormGroup
	formName = 'MessageForm'
	netlifyFormName = 'form-name'
	messageName = 'Message'
	messageLabel = ''
	handleName = 'Handle'
	emailName = 'Email'
	emailControl

	honeyLabel = 'Do not, fill this field out if you are human'
	honeyValue = 'Do not, fill this field out if you are human'

	emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	urlEndName = 'UrlEnd'
	urlEnd = ''

	formType: FormType = FormType.Contact

	constructor(private fb: UntypedFormBuilder, private http: HttpClient, private router: Router, private logService: LogService, private musicService: MusicService) {
		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((e) => {
			this.showCommentForm = true

			this.urlEnd = (e as NavigationEnd).urlAfterRedirects
			this.formType = this.urlEnd === '/home' ? FormType.Contact : FormType.Comment

			this.logService.log(LogType.Info, 'urlEnd:', this.urlEnd)


			if (this.formType === FormType.Contact) {
				this.headerText = 'Contact'
				this.messageLabel = '* Your Message:'
				this.placeholderText = this.placeholderMessage
				this.emailControl.addValidators(Validators.required)

			} else {
				this.headerText = 'Write a Comment'
				this.messageLabel = '* Your Comment:'
				this.placeholderText = this.placeholderComment
				this.emailControl.removeValidators(Validators.required)
			}

			this.messageForm.reset()

		})

		this.messageForm = this.fb.group({
			[this.messageName]: ['', [Validators.required]],
			[this.handleName]: ['', [Validators.required]],
			[this.emailName]: ['', [Validators.pattern(this.emailRegex)]]
		})

		this.emailControl = this.messageForm.controls[this.emailName]

	}
	ngOnInit(): void {
		this.musicService.initStreamer()
	}

	onSendClick() {
		let body = new HttpParams()
		.set(this.netlifyFormName, this.formName)
		.append(this.messageName, this.messageForm.value[this.messageName])
		.append(this.handleName, this.messageForm.value[this.handleName])
		.append(this.urlEndName, this.urlEnd)

		if (this.formType === FormType.Contact) {
			body = body.append(this.emailName, this.messageForm.value[this.emailName])
		} else {
			body = body.append(this.emailName, 'notusedforcomment@gmail.com')
		}

		this.logService.log(LogType.Info, 'form send clicked and doing http post with:')
		this.logService.log(LogType.Info, 'messageForm:')
		this.logService.log(LogType.Info, this.messageForm)
		this.logService.log(LogType.Info, 'body:', body)

		this.http.post('/', body.toString(), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).subscribe(
			res => {
				this.logService.log(LogType.Info, 'result handler:', res)
				this.showCommentForm = false
				this.headerText = 'Thank you for sending :)'
			},
			err => {
				this.showCommentForm = false
				if (err instanceof ErrorEvent) {
					// client side error
					this.logService.log(LogType.Error, 'Client side error: Something went wrong when sending your comment:', err.error)
					this.headerText = 'Something went wrong with sending'
				} else {
					// backend error. If status is 200, then the message successfully sent
					if (err.status === 200) {
						this.headerText = 'Thank you for sending :)'
						this.logService.log(LogType.Info, 'Your comment has been successfully sent (status == 200)')
					} else {
						this.headerText = 'Something went wrong with sending'
						this.logService.log(LogType.Error, 'Backend side error: Something went wrong when sending your comment:')
						this.logService.log(LogType.Error, 'Error status:', err.status)
						this.logService.log(LogType.Error, 'Error body:', err.error)
					}
				}
			}
		)


		this.messageForm.reset()

	}
}

export const enum FormType {
	Comment = 'Comment',
	Contact = 'Contact'

}
