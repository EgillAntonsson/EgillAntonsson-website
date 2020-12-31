import { Component } from '@angular/core';

@Component({
	selector: 'app-lift',
	templateUrl: './lifting.component.html',
	styleUrls: ['./lifting.component.css']
})
export class LiftingComponent {
	categoryKg: CategoryKg
	allCreaturesLifted: Array<CreatureLifted>
	firstDate: Date
	lastDate: Date

	constructor() {
		const lifting_data = require('../../assets/lifting.json')
		this.categoryKg = lifting_data.category_kg as CategoryKg
		this.allCreaturesLifted = lifting_data.all_creatures_lifted
		this.firstDate = new Date(lifting_data.first_date)
		this.lastDate = new Date(lifting_data.last_date)
	}
}

interface CategoryKg {
	All: number
	Shoulders: number
	Back: number
	Abs: number
	Triceps: number
	Chest: number
	Legs: number
	Calves: number
	Biceps: number
}

interface CreatureLifted {

	total_kg: number
	count: number
	creature: Creature
}

interface Creature {
	name: string
	kg: number
	url: string
}
