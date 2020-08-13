import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'mynumber'})
export class MyNumberPipe implements PipeTransform {
	transform(value: number, decimalDigits: number = 0, conversionSign: string = '*', conversionAmount: number = 1): string {
		let conversedValue
		switch (conversionSign) {
			case '/':
				conversedValue = value / conversionAmount
				break
			case '*':
				conversedValue = value * conversionAmount
				break;
			default:
				throw new RangeError('parameter "conversionSign" can only have value "/" or "*"')
		}
		const originalString = conversedValue.toFixed(decimalDigits)

		const formattedStringList: string[] = []
		let index = originalString.includes('.') ? originalString.indexOf('.') : originalString.length

		const formatLength = 3
		if (index < formatLength) {
			return originalString
		}
		let firstLoop = true
		while (index > 0) {
			index = index - 3
			if (index <= 0) {
				formattedStringList.unshift(originalString.substr(0, formatLength + index))
			} else {
				if (firstLoop) {
					formattedStringList.unshift(originalString.substr(index))
					firstLoop = false
				} else {
					formattedStringList.unshift(originalString.substr(index, formatLength))
				}
			}
		}
		return formattedStringList.join('\'')
	}
}
