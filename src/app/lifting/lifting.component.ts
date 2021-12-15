import { Component, } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { LiftingService, CreatureLifted } from '../shared/services/lifting.service'

@Component({
	selector: 'app-lift',
	templateUrl: './lifting.component.html',
	styleUrls: ['./lifting.component.css']
})
export class LiftingComponent {

	firstDate: Date = new Date(2016, 6, 15)
	lastDate: Date = new Date()
	totalKgLifted = 0
	totalCreaturesLifted: Array<CreatureLifted> = []



	convertLastInputSubmit = 0
	convertResult: Array<CreatureLifted> = []
	convertForm: FormGroup
	inputKgControl
	maximumInputAllowed = 999999999
	minimumInputAllowed = 0.5

	constructor(private liftingService: LiftingService, private fb: FormBuilder) {

		liftingService.loadAndCalculateMyLog((myLiftingStats) => {
			this.totalKgLifted = myLiftingStats.totalKgLifted
			this.totalCreaturesLifted = myLiftingStats.totalCreaturesLifted
			this.firstDate = myLiftingStats.firstDate
			this.lastDate = myLiftingStats.lastDate
		})


		const initialKgValue = 120
		this.convertForm = this.fb.group({
			inputKg: [initialKgValue,[
					Validators.pattern(/^\d+\.*\d*$/),
					Validators.max(this.maximumInputAllowed),
					Validators.min(this.minimumInputAllowed)
				]
			]
		})
		this.inputKgControl = this.convertForm.controls['inputKg']

		this.convert(initialKgValue)
	}


	inputEvent() {
		const inputNumber = parseFloat(this.inputKgControl.value)

		if (this.inputKgControl.invalid || inputNumber === this.convertLastInputSubmit) {
			return
		}

		this.convertLastInputSubmit = inputNumber
		this.convert(inputNumber)
	}

	private convert(number: number) {
		this.convertResult = this.liftingService.weightInCreatures(number)
	}

}
