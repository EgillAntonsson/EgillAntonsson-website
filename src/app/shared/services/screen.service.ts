import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

export class ScreenService {

	/**
	 * The current width range of the screen.
	 * The number should to be in sync the media queries in the styles \ css
	 * @param windowWidth
	 * @returns
	 */
	getCurrentWidthRange(windowWidth: number): WidthRange {
		if (windowWidth <= 451) {
			return WidthRange.XXS
		} else if (windowWidth <= 703) {
			return WidthRange.XS
		} else if (windowWidth <= 1053) {
			return WidthRange.S
		} else if (windowWidth <= 1403) {
			return WidthRange.M
		} else if (windowWidth <= 2000) {
			return WidthRange.L
		} else {
			return WidthRange.XL
		}
	}


	constructor() {}

}

export enum WidthRange {
	XXS = 0,
	XS = 1,
	S = 2,
	M = 3,
	L = 4,
	XL = 5
}
