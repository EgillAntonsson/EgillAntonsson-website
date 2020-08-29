import { Injectable } from '@angular/core'

export interface IRandomNumber {
	readonly getRandomNumber: (highest: number) => number
	readonly getUniqueRandomNumber: () => number
}

@Injectable({
	providedIn: 'root'
})
export class RandomNumberService implements IRandomNumber {

	private highestUniqueBorder: number
	private uniqueNumberTracking = false
	readonly uniqueNumbers: Map<number, boolean>
	readonly getRandomNumber: (highest: number) => number
	readonly getUniqueRandomNumber: () => number

	constructor() {

		this.uniqueNumbers = new Map<number, boolean>()

		//  0 <= 'returned number' < 'highBorder' param
		this.getRandomNumber = (highBorder: number) => {
			return Math.floor(highBorder * Math.random())
		}

		this.getUniqueRandomNumber = () => {
			if (!this.uniqueNumberTracking) {
				return -1
			}

			if (this.uniqueNumbers.size === this.highestUniqueBorder) {
				console.log('clearing uniqueNumbers')
				this.uniqueNumbers.clear()
			}

			let num: number

			if (this.uniqueNumbers.size === this.highestUniqueBorder - 1) {
				console.log('one number left to set')

				for (let i = 0; i <= this.uniqueNumbers.size; i++) {
					if (!this.uniqueNumbers.has(i)) {
						num = i
						console.log('last num', num)
						break
					}
				}
			} else {
				do {
					num = this.getRandomNumber(this.highestUniqueBorder)

					// console.log('.has', this.uniqueNumbers.has(num))
				} while (this.uniqueNumbers.has(num))
			}

			this.uniqueNumbers.set(num, true)
			// console.log('setting uniqueNumbers with: ', num, 'new keys size')
			// console.log('this.uniqueNumbers.size', this.uniqueNumbers.size)

			return num
		}
	}

	startUniqueNumberTracking(highestBorder: number) {
		this.uniqueNumberTracking = true
		this.highestUniqueBorder = highestBorder >= 1 ? highestBorder : 1
		this.uniqueNumbers.clear()
	}

	stopUniqueNumberTracking() {
		this.uniqueNumberTracking = false
		this.uniqueNumbers.clear()
	}


}
