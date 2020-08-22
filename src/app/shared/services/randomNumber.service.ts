import { Injectable } from '@angular/core'

export interface IRandomNumber {
	readonly getRandomNumber: (highest: number) => number
}

@Injectable({
	providedIn: 'root'
})
export class RandomNumberService implements IRandomNumber {

	readonly getRandomNumber: (highest: number) => number
	constructor() {
		// return random number from the range 0 - 'highest' parameter
		this.getRandomNumber = (highest: number) => {
			return Math.floor(highest * Math.random())
		}
	}
}
