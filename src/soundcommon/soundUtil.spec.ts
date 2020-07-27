import { validateRange } from './soundUtil'
describe('soundUtil', () => {
	it('validateRange', () => {
		expect(validateRange(0.5, 0, 1)).toEqual(0.5)
		expect(validateRange(0, 0, 1)).toEqual(0)
		expect(validateRange(1, 0, 1)).toEqual(1)
		expect(validateRange(-0.01, 0, 1)).toEqual(0)
		// invalid limit params
		expect(validateRange(0.5, 1, 0)).toEqual(0.5)

	})
})
