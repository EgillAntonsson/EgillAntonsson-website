import { Injectable } from '@angular/core'
import * as Papa from 'papaparse'
import { HttpClient } from '@angular/common/http'
import { LogService } from './log.service'
import { LogType } from 'shared/enums/logType'


@Injectable({ providedIn: 'root' })


export class LiftingService {

	creatureList: Array<Creature> = []
	myLiftingStats!: MyLiftingStats
	hasCalculatedMyStats = false

	constructor(private http: HttpClient, private logService: LogService) {
	}

	loadAndCalculateMyLog(callback: (myLiftingStats: MyLiftingStats) => void) {

		if (this.hasCalculatedMyStats) {
			callback(this.myLiftingStats)
		}

		/** Load creature list
		* Sorts by the heaviest first.
		* mammals: gathered from https://thewebsiteofeverything.com/animals/mammals/adult-weight.html
		* 	Only having one mammal (most known or funny) from the list when many have the same weight.
		* dragons: Using maximum weight from https://en.wikipedia.org/wiki/Metallic_dragon
		* dinosaurs: Using maximum weight https://en.wikipedia.org/wiki/Dinosaur_size#Record_sizes
		*/
		this.creatureList = require('../../../assets/data/creatures.json')
		this.creatureList.sort((a, b) => a.kg > b.kg ? -1 : 1)


		// calculate egillTotalLifted
		let totalKgLifted = 0.0

		const pathFitNotes = '../../assets/data/FitNotes_Export.csv'

		// Parse local CSV file
		this.http.get(pathFitNotes, {responseType: 'text'}).subscribe(data => {

			const config = {header: true, skipEmptyLines: true}
			const parseRes = Papa.parse(data, config)

			const theData = parseRes.data as Array<FitNoteRow>
			const errors = parseRes.errors


			let error
			for (let i = errors.length - 1 ; i >= 0; i--) {
				error = errors[i]
				this.logService.log(LogType.Warn, 'Removing row "' + error.row + '". ' + error.type + '. ' + error.code + '. ' + error.message)
				theData.splice(error.row, 1)
			}

			theData.forEach(fitNoteRow => {
				const weight = fitNoteRow['Weight (kgs)']
				const reps = fitNoteRow.Reps

				if (weight !== '' && reps !== '') {
					totalKgLifted += parseFloat(weight) * parseFloat(reps)
				}
			})

			const totalCreaturesLifted = this.weightInCreatures(totalKgLifted)
			const firstDate = new Date(theData[0].Date)
			const lastDate = new Date(theData[theData.length - 1].Date)

			this.myLiftingStats = {totalKgLifted: totalKgLifted, totalCreaturesLifted: totalCreaturesLifted, firstDate: firstDate, lastDate: lastDate}
			this.hasCalculatedMyStats = true
			callback(this.myLiftingStats)
		})

	}

	weightInCreatures(weightInKg: number) {
		let tempWeightInKg = weightInKg

		const creaturesLifted: Array<CreatureLifted> = []

		this.creatureList.forEach(creature => {

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

export interface Creature {
	name: string
	kg: number
	url: string
}

export interface CreatureLifted {
	count: number
	creature: Creature
}

export interface FitNoteRow {
	Date: string
	'Weight (kgs)': string
	Reps: string
}

export interface MyLiftingStats {
	totalKgLifted: number
	totalCreaturesLifted: Array<CreatureLifted>
	firstDate: Date
	lastDate: Date
}
