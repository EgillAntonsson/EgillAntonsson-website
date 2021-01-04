import { SoundUtil, SoundUtilError } from './soundUtil'
describe('soundUtil', () => {
	it('validateRange', () => {
		expect(SoundUtil.validateNumberForRange(0.5, 0, 1)).toEqual(0.5)
		expect(SoundUtil.validateNumberForRange(0, 0, 1)).toEqual(0)
		expect(SoundUtil.validateNumberForRange(1, 0, 1)).toEqual(1)

		expect( function() { SoundUtil.validateNumberForRange(-0.01, 0, 1) } )
			.toThrow(new SoundUtilError(SoundUtilError.msgNumberMustNotBeLowerThenLowerLimit))

		expect( function() { SoundUtil.validateNumberForRange(1.001, 0, 1) } )
			.toThrow(new SoundUtilError(SoundUtilError.msgNumberMustNotBeHigherThenUpperLimit))

		expect( function() { SoundUtil.validateNumberForRange(0.5, 1, 0) } )
			.toThrow(new SoundUtilError(SoundUtilError.msgLowerLimitMustBeLowerThanUpperLimit))
	})
})
