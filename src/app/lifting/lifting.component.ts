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

	categoryKg: CategoryKg
	allCreaturesLifted: Array<CreatureLifted> = []
	firstDate: Date
	lastDate: Date

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


		// Parse local CSV file

		const pathFitNotes = '../../assets/data/FitNotes_Export.csv'

		// let csv = 'Date,Exercise,Category,Weight (kgs),Reps,Distance,Distance Unit,Time\n2016-07-15,Deadlift,Back,40.0,8,,,'

		// let csv: string

		let sum = 0

		this.http.get(pathFitNotes, {responseType: 'text'}).subscribe(data => {
			// const list = data.split('\n')
			// list.forEach( line => {
			// 	csv += line
			// })

			let config = {header: true}
			let parseRes = Papa.parse(data, config)

			let theData = parseRes.data as Array<FitNoteRow>

			theData.forEach(FitNoteRow => {
				// let weight: number =  parseFloat(FitNoteRow['weight (kgs)'])
				let date =  FitNoteRow.Date
				let weight = FitNoteRow['Weight (kgs)']
				sum += parseFloat(weight)
				// console.log(date)
				// console.log(weight)
				// console.log(sum)
			})

			console.log(sum)

			this.allCreaturesLifted = this.weightToCreatures(sum)
			console.log(this.allCreaturesLifted)
		})

// 	Papa.parse(new File()), {
// 	complete: function(results) {
// 		console.log("Finished:", results.data)
// 	}
// });


		const lifting_data = require('../../assets/data/lifting.json')
		this.categoryKg = lifting_data.category_kg as CategoryKg
		this.firstDate = new Date(lifting_data.first_date)
		this.lastDate = new Date(lifting_data.last_date)

		// this.allCreaturesLifted = lifting_data.all_creatures_lifted
		// this.allCreaturesLifted = this.weightToCreatures(2928036.2)
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

		// console.log('weightInKg', weightInKg)
		// console.log(creaturesLifted)
		// console.log(tempWeightInKg)
		// console.log(this.creatures)
	}

}

interface FitNoteRow {
	'Weight (kgs)': string
	Date: string
}

interface Creature {
	name: string
	kg: number
	url: string
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
	count: number
	creature: Creature
}
