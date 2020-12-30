import { Injectable } from '@angular/core'

/**
 * Interfacing for tests.
 * Angular (11) can only DI inject 'Abstract Class' but not 'Interface', which I would have preferred.
 * https://angular.io/guide/dependency-injection-in-action
 */
export abstract class RandomNumber {
	abstract generateRandomNumber(highestNotIncluded: number): number
	abstract startUniqueNumberTracking(highestBorder: number): void
	abstract stopUniqueNumberTracking(): void
	abstract generateUniqueRandomNumber(): number
}

@Injectable({
	providedIn: 'root'
})
export class RandomNumberService implements RandomNumber {

	private highestUniqueBorder = 1
	private uniqueNumberTracking = false
	private uniqueNumbers: Map<number, boolean> = new Map<number, boolean>()

	generateRandomNumber(highestNotIncluded: number) {
		return Math.floor(highestNotIncluded * Math.random())
	}

	startUniqueNumberTracking(highestBorder: number) {
		if (highestBorder <=  0) {
			throw new RandomNumberError(RandomNumberError.msgNumberMustBeHigherThanZero)
		}
		this.uniqueNumberTracking = true
		this.highestUniqueBorder = highestBorder
		this.uniqueNumbers.clear()
	}

	stopUniqueNumberTracking() {
		this.uniqueNumberTracking = false
		this.uniqueNumbers.clear()
	}

	generateUniqueRandomNumber() {
		if (!this.uniqueNumberTracking) {
			return -1
		}

		if (this.uniqueNumbers.size === this.highestUniqueBorder) {
			// Clearing uniqueNumbers
			this.uniqueNumbers.clear()
		}

		let num: number

		if (this.uniqueNumbers.size === this.highestUniqueBorder - 1) {
			// One number left to set

			for (let i = 0; i <= this.uniqueNumbers.size; i++) {
				if (!this.uniqueNumbers.has(i)) {
					num = i
					break
				}
			}
		} else {
			do {
				num = this.generateRandomNumber(this.highestUniqueBorder)

			} while (this.uniqueNumbers.has(num))
		}

		this.uniqueNumbers.set(num, true)

		return num
	}

}

export class RandomNumberError implements Error {
	name: string
	message: string
	stack?: string

	static msgNumberMustBeHigherThanZero = 'Number must be > 0'

	constructor(message: string) {
		this.message = message
	}

}
