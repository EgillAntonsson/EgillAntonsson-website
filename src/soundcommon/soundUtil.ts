export const validateRange = (value: number, lowerLimit: number, upperLimit: number, log?: (message?: any, ...optionalParams: any[]) => void): number => {
	if (lowerLimit >= upperLimit) {
		if (log) {
			log('Info', `Invalid params for validateRange, lowerLimit '${lowerLimit}' must be lower than upperLimit '${upperLimit}', returning sent in value '${value}'`)
		}
		return Number(value)
	}
	let validValue = value
	if (value > upperLimit) {
		validValue = upperLimit
	} else if (value < lowerLimit) {
		validValue = lowerLimit
	}
	if (log && (value !== validValue)) {
		log('Info', `Invalid value '${value}' sent to validateRange, was corrected to ${validValue}`)
	}
	return Number(validValue)
}

export const globalMaxNrPlayingAtOncePerSound = 24
