import { Component } from '@angular/core'
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

	calculatorInput = 0
	calculatorResult: Array<CreatureLifted> = []

	constructor(private liftingService: LiftingService) {

		liftingService.loadAndCalculateMyLog((myLiftingStats) => {
			this.totalKgLifted = myLiftingStats.totalKgLifted
			this.totalCreaturesLifted = myLiftingStats.totalCreaturesLifted
			this.firstDate = myLiftingStats.firstDate
			this.lastDate = myLiftingStats.lastDate
		})

	}

	convertClick(textValue: string) {

		// TODO: early input validation in textfield

		this.calculatorInput = parseFloat(textValue)
		this.calculatorResult = this.liftingService.weightInCreatures(this.calculatorInput)
	}
}
