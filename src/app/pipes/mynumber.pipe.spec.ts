import { MyNumberPipe } from './mynumber.pipe'

describe('MyNumberPipe', () => {
	let pipe: MyNumberPipe

	beforeEach(() => {
		pipe = new MyNumberPipe()
	})


	it('Should format number with upper comma before thousand', () => {
		expect(pipe.transform(2580600)).toBe('2\'580\'600')
	})

	it('Should use fraction accordingly when provided', () => {
		expect(pipe.transform(0.523, 2)).toBe('0.52')
	})

	it('Should not use fraction when provided, if value is fraction that is same as int (e.g x.0)', () => {
		expect(pipe.transform(9.0, 1)).toBe('9')
	})

	it('Should divide number accordingly when using /', () => {
		expect(pipe.transform(2191011.8, 0, '/', 1000)).toBe('2\'191')
	})

	it('Should multiply number when using *, and use fraction', () => {
		expect(pipe.transform(12.3, 1, '*', 1000)).toBe('12\'300.0')
	})

	it('Should throw error when something else than * or / provide', () => {
		expect( () => {pipe.transform(0.5, 0, '+')}).toThrow(new RangeError('parameter "conversionSign" can only have value "/" or "*"'))
	})
})
