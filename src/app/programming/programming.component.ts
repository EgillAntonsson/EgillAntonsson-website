import { Component } from '@angular/core'
import { BlogService, Post } from '../shared/services/blog.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'

@Component({
	selector: 'app-programming',
	templateUrl: './programming.component.html',
	styleUrls: [
		'./programming.component.css'
	]
})
export class ProgrammingComponent {
	openedUiSeriesIndex = 0
	selectedSeriesIndex = 0

	commentForm: FormGroup
	maximumCommentLength = 10
	inputCommentControl
	inputNameControl
	inputEmailControl
	initialCommentText = `Write your comment here.
On 'Send' button press it will become pending for moderation.
After moderation (e.g. spam will be no go through) I'll publish the comment here
(I might also add a short response).
`
	initialNameText = 'Anonymous'
	initialEmailText = 'myemail@somemail.com'

	get blogSeries() {
		return this.blogService.blogSeries
	}

	get selectedPost() {
		return this.blogService.selectedPost
	}

	constructor(private blogService: BlogService,  private fb: FormBuilder) {

		this.commentForm = this.fb.group({
			inputComment: [this.initialCommentText, [
					Validators.required
				]
			],
			inputName: [this.initialNameText, []],
			inputEmail: [this.initialEmailText, [
				Validators.email
			]
		],
		})
		this.inputCommentControl = this.commentForm.controls['inputComment']
		this.inputNameControl = this.commentForm.controls['inputName']
		this.inputEmailControl = this.commentForm.controls['inputEmail']

	}

	commentClick() {
		if (this.inputCommentControl.value === this.initialCommentText) {
			this.inputCommentControl.setValue('')
		}
	}

	nameClick() {
		if (this.inputNameControl.value === this.initialNameText) {
			this.inputNameControl.setValue('')
		}
	}

	commentInput() {


		// this.inputKgControl.setValue('')

		// const inputNumber = parseFloat(this.inputKgControl.value)

		// if (this.inputKgControl.invalid || inputNumber === this.convertLastInputSubmit) {
		// 	return
		// }

		// this.convertLastInputSubmit = inputNumber
		// this.convert(inputNumber)
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

		window.scroll(0, 0)
		this.inputCommentControl.reset(this.initialCommentText)
		this.inputNameControl.reset(this.initialNameText)
		this.inputEmailControl.reset(this.initialEmailText)
	}

}
