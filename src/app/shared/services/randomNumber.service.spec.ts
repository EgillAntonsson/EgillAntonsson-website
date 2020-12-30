import { RandomNumber, RandomNumberError, RandomNumberService } from './randomNumber.service'

describe('RandomNumberService', () => {
	let randomNumberService: RandomNumberService

	beforeEach(() => {
		randomNumberService = new RandomNumberService()
	})

	it('getRandomNumber', () => {
		const rand = randomNumberService.generateRandomNumber(2)
		expect(rand).toBeGreaterThanOrEqual(0)
		expect(rand).toBeLessThanOrEqual(1)
	})

	it('startUniqueNumberTracking_invalidParamForHighestBorder', () => {
		const highestBorder = -1
		expect( function() { randomNumberService.startUniqueNumberTracking(highestBorder) } ).toThrow(new RandomNumberError(RandomNumberError.msgNumberMustBeHigherThanZero))
	})

	it('getUniqueRandomNumber_toBeLessThanOrEqual', () => {
		expect(randomNumberService.generateUniqueRandomNumber()).toBeLessThanOrEqual(9)

	})

	it('getUniqueRandomNumber', () => {
		const highestBorder = 10
		randomNumberService.startUniqueNumberTracking(highestBorder)

		const randoms: number[] = []

		for (let i = 0; i < highestBorder; i++) {
			randoms.push(randomNumberService.generateUniqueRandomNumber())
		}

		console.log('random number list before sorting, should be 0 - 9 in random order:', randoms)
		randoms.sort()
		console.log('random number list after sorting, should be sorted 0, 1..., 9:', randoms)

		for (let i = 0; i < randoms.length; i++) {
			expect(randoms[i]).toBe(i)
		}
	})

})

export class RandomNumberMock implements RandomNumber {
	retGenerateUniqueRandomNumber = 0
	retGenerateRandomNumber = 0

	generateUniqueRandomNumber(): number {
		return this.retGenerateUniqueRandomNumber
	}
	generateRandomNumber(highestNotIncluded: number): number {
		return this.retGenerateRandomNumber
	}
	startUniqueNumberTracking(highestBorder: number): void {
	}
	stopUniqueNumberTracking(): void {
	}
}
