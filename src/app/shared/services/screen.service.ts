import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { LogService } from './log.service'
import { LogType } from 'shared/enums/logType';

@Injectable({
	providedIn: 'root',
})

// Example of usage in a component or another service
// this.onBpMaxWidthXS().subscribe((state: BreakpointState) => {
// 	if (state.matches) {
// 		// Is within XS
// 	} else {
// 		// Is beyond XS
// 	}
// });
// related blog:
// https://www.prestonlamb.com/blog/angular-cdks-breakpoint-observer
export class ScreenService {
	// These max-width values are the truth source, e.g. max-width values in style css should match them
	// The most min-width to be considered is 360px (Galaxy S8+)

	private _currentWidthRange = WidthRange.XXS

	get currentWidthRange() {
		return this._currentWidthRange
	}

	set currentWidthRange(value: number) {
		this.logger.log(LogType.Info, 'currentWidthRange: ' + this._currentWidthRange)
		this._currentWidthRange = value
	}

	// Returns BreakpointState obj, where .matches returns true if within width and false if beyond
	onBpMaxWidthXS(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 451px)']);
	}

	onBpMaxWidthS(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 703px)']);
	}

	onBpMaxWidthM(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 1053px)']);
	}

	onBpMaxWidthL(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 1403px)']);
	}

	onBpMaxWidthXL(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 2000px)']);
	}

	constructor(private observer: BreakpointObserver, private logger:LogService) {

		// this.onBpMaxWidthXS().subscribe((state: BreakpointState) => {
		// 	if (state.matches) {
		// 		this.logger.log(LogType.Info, 'XS is matching')
		// 		this.currentWidthRange = WidthRange.XXS
		// 	} else {
		// 		this.logger.log(LogType.Info, 'XS not matching')
		// 		this.currentWidthRange = WidthRange.XS
		// 	}
		// })
		// this.onBpMaxWidthS().subscribe((state: BreakpointState) => {
		// 	if (state.matches) {
		// 		this.logger.log(LogType.Info, 'S is matching')
		// 		this.currentWidthRange = WidthRange.XS
		// 	} else {
		// 		this.logger.log(LogType.Info, 'S not matching')
		// 		this.currentWidthRange = WidthRange.S
		// 	}
		// })
		// this.onBpMaxWidthM().subscribe((state: BreakpointState) => {
		// 	if (!state.matches) {
		// 		this.logger.log(LogType.Info, 'M not matching')
		// 		this.currentWidthRange = WidthRange.S
		// 	} else {
		// 		this.logger.log(LogType.Info, 'M is matching')
		// 		this.currentWidthRange = WidthRange.M
		// 	}
		// })
		// this.onBpMaxWidthL().subscribe((state: BreakpointState) => {
		// 	if (!state.matches) {
		// 		this.logger.log(LogType.Info, 'L not matching')
		// 		this.currentWidthRange = WidthRange.M
		// 	} else {
		// 		this.logger.log(LogType.Info, 'L is matching')
		// 		this.currentWidthRange = WidthRange.L
		// 	}
		// })
		// this.onBpMaxWidthXL().subscribe((state: BreakpointState) => {
		// 	if (!state.matches) {
		// 		this.logger.log(LogType.Info, 'XL not matching')
		// 		this.currentWidthRange = WidthRange.L
		// 	} else {
		// 		this.logger.log(LogType.Info, 'XL is matching')
		// 		this.currentWidthRange = WidthRange.XL
		// 	}
		// })

	}

}

export enum WidthRange {
	XXS = 0,
	XS = 1,
	S = 2,
	M = 3,
	L = 4,
	XL = 5
}
