import { RandomNumberService } from './randomNumber.service'

describe('RandomNumberService', () => {
	let randomNumberService: RandomNumberService

	beforeEach(() => {
		randomNumberService = new RandomNumberService()
	})

	it('getRandomNumber', () => {
		console.log('in randomNumber.service ***************')

		const rand = randomNumberService.getRandomNumber(2)
		expect(rand).toBeGreaterThanOrEqual(0)
		expect(rand).toBeLessThanOrEqual(1)
	})

	it('getUniqueRandomNumber', () => {
		console.log('in randomNumber.service ***************')

		const highestBorder = 10
		randomNumberService.startUniqueNumberTracking(highestBorder)

		const randoms: number[] = []

		for (let i = 0; i < highestBorder; i++) {
			randoms.push(randomNumberService.getUniqueRandomNumber())
		}

		console.log('random number list before sorting:', randoms)
		randoms.sort()
		console.log('random number list after sorting:', randoms)

		for (let i = 0; i < randoms.length; i++) {
			expect(randoms[i]).toBe(i)
		}

		expect(randomNumberService.getUniqueRandomNumber()).toBeLessThanOrEqual(9)

	})

})
