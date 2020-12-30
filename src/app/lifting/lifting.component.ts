import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-lift',
	templateUrl: './lifting.component.html',
	styleUrls: ['./lifting.component.css']
})
export class LiftingComponent {
	categoryKg: CategoryKg
	allCreaturesLifted: Array<Object>
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
}
