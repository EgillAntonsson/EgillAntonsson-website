import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

/**
 * The number values should to be in sync with the styles \ css
 */
export class ScreenService {

	// The margin percentage of the body, both left and right. E.g. 0.05 means 5%.
	public readonly bodyMargin = 0.05;

	/**
	 * The current width range of the screen.
	 * The number values should to be in sync the media queries in the styles \ css
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

	/**
	 * Returns the size of a rectangle that is centered horizontally.
	 * @param windowWidth
	 * @param rectMarginPercentageByWidthRange Percentage of the margin, both left and right, of the rectangle.
	 * @param rectWidthCorrectionByWidthRange Correction of the width of the rectangle.
	 * @returns The width and height of the rectangle.
	 */
	getRectSizeForHorizontalCenter(windowWidth: number, rectMarginPercentageByWidthRange: Map<WidthRange, number>, rectWidthCorrectionByWidthRange: Map<WidthRange, number>) {
		const widthRange = this.getCurrentWidthRange(windowWidth)
		let rectMarginPercentage = rectMarginPercentageByWidthRange.get(widthRange)
		if (rectMarginPercentage === undefined) {
			rectMarginPercentage = rectMarginPercentageByWidthRange.get(WidthRange.Default)
			if (rectMarginPercentage === undefined) {
				rectMarginPercentage = 0
			}
		}
		let rectWidthCorrection = rectWidthCorrectionByWidthRange.get(widthRange)
		if (rectWidthCorrection === undefined) {
			rectWidthCorrection = rectWidthCorrectionByWidthRange.get(WidthRange.Default)
			if (rectWidthCorrection === undefined) {
				rectWidthCorrection = 0
			}
		}

		let playerContainerWidth = windowWidth * (1 - (this.bodyMargin * 2))
		// let playerContainerWidth = windowWidth - (offsetLeft * 2)
		let width = playerContainerWidth * (1 - (rectMarginPercentage * 2))
		width = width - rectWidthCorrection

		let nineSixteenRatio = 0.5625
		let height = width * nineSixteenRatio

		return { width, height }
	}

	constructor() {}

}

export enum WidthRange {
	Default = 0,
	XXS = 1,
	XS = 2,
	S = 3,
	M = 4,
	L = 5,
	XL = 6
}
