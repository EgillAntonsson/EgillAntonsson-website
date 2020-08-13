import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'minutesSeconds'})
export class MinutesSecondsPipe implements PipeTransform {
	transform(seconds: number): string {
		const min = Math.floor(seconds / 60).toString()
		const remainingSec = (seconds % 60).toString()
		const secondsPadding =  (seconds % 60 < 10) ? ':0' : ':'
		return min + secondsPadding + remainingSec
	}
}
