import { Component } from '@angular/core'
import { PostComponent } from '../post.component'
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms'
import { LiftingService, Creature } from '../../../shared/services/lifting.service'
import { BlogService } from 'app/shared/services/blog.service'

@Component({
	selector: 'app-kg-to-creature',
	templateUrl: './kgToCreature.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class KgToCreatureComponent extends PostComponent {

	firstDate: Date = new Date(2016, 6, 15)
	lastDate: Date = new Date()
	totalKgLifted = 0
	totalCreaturesLifted: Array<CreatureLiftedRenderer> = []

	convertLastInputSubmit = 0
	convertResult: Array<CreatureLiftedRenderer> = []
	convertForm: UntypedFormGroup
	inputKgControl
	maximumInputAllowed = 999999999
	minimumInputAllowed = 0.5

	constructor(private liftingService: LiftingService, private fb: UntypedFormBuilder, blogService: BlogService) {
		super(blogService)

		liftingService.loadAndCalculateMyLog((myLiftingStats) => {
			this.totalKgLifted = myLiftingStats.totalKgLifted
			this.totalCreaturesLifted = []
			for (const creatureLifted of myLiftingStats.totalCreaturesLifted) {
				this.totalCreaturesLifted.push(new CreatureLiftedRenderer(creatureLifted.count, creatureLifted.creature))
			}
			this.firstDate = myLiftingStats.firstDate
			this.lastDate = myLiftingStats.lastDate
		})


		// Input html should be set to type "number", which does not allow characters on desktop.
		// Also adding Validators.pattern as it might be needed for mobile.
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
		const creaturesLifted = this.liftingService.weightInCreatures(number)
		this.convertResult = []
		for (const creatureLifted of creaturesLifted) {
			this.convertResult.push(new CreatureLiftedRenderer(creatureLifted.count, creatureLifted.creature))
		}
	}

}

export class CreatureLiftedRenderer {
	readonly count: number
	readonly creature: Creature

	constructor(count: number, creature: Creature) {
		this.count = count
		this.creature = creature
	};

	render() {
		let creatureName = this.creature.name
		if (this.creature.url !== '' && this.creature.url !== undefined) {
			creatureName = `<a href="${this.creature.url}" target="_blank">${this.creature.name}</a>`
		}
		console.log('creatureName', creatureName)
		return `${this.count}x ${creatureName}`
	}
}
