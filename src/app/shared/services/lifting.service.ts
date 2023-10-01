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

		/** Load creature list
		* Sorts by the heaviest first.
		* mammals: gathered from https://thewebsiteofeverything.com/animals/mammals/adult-weight.html
		* 	Only having one mammal (most known or funny) from the list when many have the same weight.
		* dragons: Using maximum weight from https://en.wikipedia.org/wiki/Metallic_dragon
		* dinosaurs: Using maximum weight https://en.wikipedia.org/wiki/Dinosaur_size#Record_sizes
		*/
		this.creatureList = require('../../../assets/data/creatures.json')
		this.creatureList.sort((a, b) => a.kg > b.kg ? -1 : 1)
	}

	loadAndCalculateMyLog(callback: (myLiftingStats: MyLiftingStats) => void) {

		if (this.hasCalculatedMyStats) {
			callback(this.myLiftingStats)
		}


		// calculate egillTotalLifted
		let totalKgLifted = 0.0

		const pathFitNotes = '../../assets/data/FitNotes_Export_Processed.csv'

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

			var hasFaultyCalculation = false

			theData.forEach(fitNoteRow => {
				const weight = fitNoteRow.Weight
				const reps = fitNoteRow.Reps

				if (weight !== '' && reps !== '') {
					const kgLiftedForRow = parseFloat(weight) * parseFloat(reps)
					totalKgLifted += kgLiftedForRow

					if (isNaN(totalKgLifted)) {
						if (!hasFaultyCalculation) {
							this.logService.log(LogType.Error, `totalKgLifted is NaN. FitNoteRow: Date: ${fitNoteRow.Date}, Exercise:  ${fitNoteRow.Exercise}, Weight: ${weight}, Reps: ${reps}`)
							hasFaultyCalculation = true
						}
					}
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
				// const creatureImpl = new CreatureImpl(creature.name, creature.kg, creature.url)
				// creaturesLifted.push({count: count, creature: creatureImpl})
				creaturesLifted.push({count: count, creature: creature})
			}

		})

		return creaturesLifted
	}

}

export interface Creature {
	name: string
	kg: number
	url: string | undefined
}

// export class CreatureImpl implements Creature {
// 	name: string
// 	kg: number
// 	readonly url: string | undefined

// 	constructor(name: string, kg: number, url: string | undefined) {
// 		this.name = name
// 		this.kg = kg
// 		this.url = url
// 	}

// 	getNameAndUrl() {
// 		if (this.url === undefined || this.url === '') {
// 			return this.name
// 		}
// 		return `<a href="${this.url}">${this.name}</a>`
// 	}

// }

export interface CreatureLifted {
	count: number
	creature: Creature
}

export interface FitNoteRow {
	Date: string
	Exercise: string
	Weight: string
	Reps: string
}

export interface MyLiftingStats {
	totalKgLifted: number
	totalCreaturesLifted: Array<CreatureLifted>
	firstDate: Date
	lastDate: Date
}
