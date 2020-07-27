import { MinutesSecondsPipe } from './minutesSeconds.pipe'

describe('MinutesSecondsPipe', () => {
	let pipe: MinutesSecondsPipe

	beforeEach(() => {
		pipe = new MinutesSecondsPipe()
	})

	it('test cases', () => {
		expect(pipe.transform(0)).toBe('0:00')
		expect(pipe.transform(9)).toBe('0:09')
		expect(pipe.transform(10)).toBe('0:10')
		expect(pipe.transform(59)).toBe('0:59')
		expect(pipe.transform(60)).toBe('1:00')
		expect(pipe.transform(69)).toBe('1:09')
		expect(pipe.transform(70)).toBe('1:10')
		expect(pipe.transform(599)).toBe('9:59')
		expect(pipe.transform(600)).toBe('10:00')
		expect(pipe.transform(609)).toBe('10:09')
		expect(pipe.transform(610)).toBe('10:10')
		expect(pipe.transform(660)).toBe('11:00')
		expect(pipe.transform(3599)).toBe('59:59')
		// NOTE: Will only implement >= an Hour if I ever publish a song that long on the website
	})
})
