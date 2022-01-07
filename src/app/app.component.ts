import { Component } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { HttpParams, HttpClient } from '@angular/common/http'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { LogService } from './shared/services/log.service'
import { LogType } from 'shared/enums/logType'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {


	placeholderComment = `This is a required field.
After you press 'Send' button:
* the comment will become pending for moderation.
* This comment form will become hidden.
After approval I will publish the Comment and Name here.
(I might also add a short response).`

placeholderMessage = `This is a required field.
After you press 'Send' button,
the Contact form will become hidden.
I have your email to get back to you if it's appropriate.`
	placeholderHandle = 'This is a required field'
	placeholderEmail = 'Required field, I will never give to 3rd party'

	showCommentForm = true

	headerText = ''
	messageForm: FormGroup
	formName = 'MessageForm'
	netlifyFormName = 'form-name'
	botFieldName = 'BotField'
	messageName = 'Message'
	messageLabel = ''
	handleName = 'Handle'
	emailName = 'Email'
	emailControl

	emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	urlEndName = 'UrlEnd'
	urlEnd = ''

	formType: FormType = FormType.Contact

	constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private logService: LogService) {

		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((e) => {
			this.showCommentForm = true
			this.emailControl.reset('')

			this.urlEnd = (e as NavigationEnd).urlAfterRedirects
			this.formType = this.urlEnd === '/home' ? FormType.Contact : FormType.Comment

			this.logService.log(LogType.Info, 'urlEnd:', this.urlEnd)
			this.logService.log(LogType.Info, 'emailControl before:', this.emailControl)

			this.messageForm.reset()

			if (this.formType === FormType.Contact) {
				this.headerText = 'Contact'
				this.messageLabel = '* Your Message:'
				this.emailControl.addValidators(Validators.required)

			} else {
				this.headerText = 'Comments'
				this.messageLabel = '* Your Comment:'
				this.emailControl.removeValidators(Validators.required)
			}

			this.logService.log(LogType.Info, 'emailControl after:', this.emailControl)

		})

		this.messageForm = this.fb.group({
			[this.botFieldName]: ['', []],
			[this.messageName]: ['', [Validators.required]],
			[this.handleName]: ['', [Validators.required]],
			[this.emailName]: ['', [Validators.pattern(this.emailRegex)]]
		})

		this.emailControl = this.messageForm.controls[this.emailName]

	}

	onSendClick() {

		const body = new HttpParams()
		.set(this.netlifyFormName, this.formName)
		.append(this.botFieldName, this.messageForm.value[this.botFieldName])
		.append(this.messageName, this.messageForm.value[this.messageName])
		.append(this.handleName, this.messageForm.value[this.handleName])
		.append(this.emailName, this.messageForm.value[this.emailName])
		.append(this.urlEndName, this.urlEnd)

		this.logService.log(LogType.Info, 'form send clicked and doing http post with:')
		this.logService.log(LogType.Info, 'messageForm:', this.messageForm)
		this.logService.log(LogType.Info, 'body:', body)

		this.http.post('/', body.toString(), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).subscribe(
			res => {
				this.logService.log(LogType.Info, 'result handler:', res)
			},
			err => {
				if (err instanceof ErrorEvent) {
					// client side error
					this.logService.log(LogType.Error, 'Client side error: Something went wrong when sending your comment:', err.error)
				} else {
					// backend error. If status is 200, then the message successfully sent
					if (err.status === 200) {
						this.logService.log(LogType.Info, 'Your comment has been successfully sent (status == 200)')
					} else {
						this.logService.log(LogType.Error, 'Backend side error: Something went wrong when sending your comment:')
						this.logService.log(LogType.Error, 'Error status:', err.status)
						this.logService.log(LogType.Error, 'Error body:', err.error)
					}
				}
			}
		)

		this.showCommentForm = false
		this.headerText = 'Thank you for sending :)'
		this.messageForm.reset()

	}
}

export const enum FormType {
	Comment = 'Comment',
	Contact = 'Contact'

}
