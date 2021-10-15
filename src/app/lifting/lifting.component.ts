import { Component } from '@angular/core'
import * as Papa from 'papaparse'
import { HttpClient } from '@angular/common/http'

@Component({
	selector: 'app-lift',
	templateUrl: './lifting.component.html',
	styleUrls: ['./lifting.component.css']
})
export class LiftingComponent {

	creatures: Array<Creature>

	// categoryKg: CategoryKg
	allCreaturesLifted: Array<CreatureLifted> = []
	firstDate!: Date
	lastDate!: Date

	egillTotalLifted: number

	constructor(private http: HttpClient) {
		/**
	 * Sorts by the heaviest first.
	 * mammals: gathered from https://thewebsiteofeverything.com/animals/mammals/adult-weight.html
	 * 	Only having one mammal (most known or funny) from the list when many have the same weight.
	 * dragons: Using maximum weight from https://en.wikipedia.org/wiki/Metallic_dragon
	 * dinosaurs: Using maximum weight https://en.wikipedia.org/wiki/Dinosaur_size#Record_sizes
	 */
		this.creatures = require('../../assets/data/creatures.json')
		this.creatures.sort((a, b) => a.kg > b.kg ? -1 : 1)

		this.egillTotalLifted = 0.0
		// Parse local CSV file

		const pathFitNotes = '../../assets/data/FitNotes_Export.csv'

		// let csv = 'Date,Exercise,Category,Weight (kgs),Reps,Distance,Distance Unit,Time\n2016-07-15,Deadlift,Back,40.0,8,,,'

		// let csv: string


		this.http.get(pathFitNotes, {responseType: 'text'}).subscribe(data => {

			let config = {header: true, skipEmptyLines: true}
			let parseRes = Papa.parse(data, config)

			let theData = parseRes.data as Array<FitNoteRow>
			let errors = parseRes.errors


			let error
			for (let i = errors.length - 1 ; i >= 0; i--) {
				error = errors[i]
				// console.log('Removing row "' + error.row + '". ' + error.type + '. ' + error.code + '. ' + error.message)
				theData.splice(error.row, 1)
			}

			theData.forEach(FitNoteRow => {
				// let weight: number =  parseFloat(FitNoteRow['weight (kgs)'])
				const weight = FitNoteRow['Weight (kgs)']
				const reps = FitNoteRow.Reps

				// console.log('weight', weight)
				// console.log('egillTotalLifted', this.egillTotalLifted)
				if (weight !== '' && reps !== '') {
					this.egillTotalLifted += parseFloat(weight) * parseFloat(reps)
					// console.log(date)
					// console.log(weight)
					// console.log('egillTotalLifted after', this.egillTotalLifted)
				}
			})

			console.log(this.egillTotalLifted)
			// console.log(date)
			this.allCreaturesLifted = this.weightToCreatures(this.egillTotalLifted)
			this.firstDate = new Date(theData[0].Date)
		this.lastDate = new Date(theData[theData.length - 1].Date)
			// console.log(this.allCreaturesLifted)
		})

		// const lifting_data = require('../../assets/data/lifting.json')
		// this.categoryKg = lifting_data.category_kg as CategoryKg
	}

	clickme(textValue: string) {

		// TODO: good and early input validation in textfield

		console.log('please work', textValue)
		this.weightToCreatures(parseFloat(textValue))
	}

	weightToCreatures(weightInKg: number) {

		let tempWeightInKg = weightInKg

		const creaturesLifted: Array<CreatureLifted> = []

		this.creatures.forEach(creature => {

			let count = 0
			while (creature.kg <= tempWeightInKg) {
				tempWeightInKg -= creature.kg
				count++
			}

			if (count > 0) {
				creaturesLifted.push({count: count, creature: {name: creature.name, kg: creature.kg, url: creature.url}})
			}

		})

		return creaturesLifted
	}

}

interface FitNoteRow {
	Date: string
	'Weight (kgs)': string
	Reps: string
}

interface Creature {
	name: string
	kg: number
	url: string
}

// interface CategoryKg {
// 	All: number
// 	Shoulders: number
// 	Back: number
// 	Abs: number
// 	Triceps: number
// 	Chest: number
// 	Legs: number
// 	Calves: number
// 	Biceps: number
// }

interface CreatureLifted {
	count: number
	creature: Creature
}
