export const globalMaxNrPlayingAtOncePerSound = 24

export class SoundUtil {
	static validateNumberForRange(number: number, lowerLimit: number, upperLimit: number) {
		if (lowerLimit >= upperLimit) {
			throw new SoundUtilError(SoundUtilError.msgLowerLimitMustBeLowerThanUpperLimit)
		}
		if (number > upperLimit) {
			throw new SoundUtilError(SoundUtilError.msgNumberMustNotBeHigherThenUpperLimit)
		}
		if (number < lowerLimit) {
			throw new SoundUtilError(SoundUtilError.msgNumberMustNotBeLowerThenLowerLimit)
		}
		return number
	}

}

export class SoundUtilError implements Error {
	name = 'SoundUtilError'
	message: string
	stack?: string

	static msgLowerLimitMustBeLowerThanUpperLimit = 'Lower Limit must be lower than Upper  Limit'
	static msgNumberMustNotBeHigherThenUpperLimit = 'number must not be higher than Upper Limit'
	static msgNumberMustNotBeLowerThenLowerLimit = 'number must not be lower than Lower Limit'
	constructor(message: string) {
		this.message = message
	}

}
