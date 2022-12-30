import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})

// Example of usage in a component or another service
// this.screenService.onBpMaxWidthXS().subscribe((state: BreakpointState) => {
// 	if (state.matches) {
// 		console.log('** Is within XS');
// 	} else {
// 		console.log('** Is beyond XS');
// 	}
// });
// related blog:
// https://www.prestonlamb.com/blog/angular-cdks-breakpoint-observer
export class ScreenService {

	currentWidthRange = WidthRange.XS

	// These max-width values are the truth source, e.g. max-width values in style css should match them
	// The most min-width to be considered is 360px (Galaxy S8+)

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
	constructor(private observer: BreakpointObserver) {
		this.onBpMaxWidthXS().subscribe((state: BreakpointState) => {
			if (state.matches) {
				// console.log('** Is within XS')
				this.currentWidthRange = WidthRange.XS
				console.log('********************', this.currentWidthRange)
			} else {
				// console.log('** Is beyond XS')
				this.currentWidthRange = WidthRange.S
				console.log('****************************', this.currentWidthRange)
			}
		})

		this.onBpMaxWidthS().subscribe((state: BreakpointState) => {
			if (state.matches) {
				// console.log('** Is within XS')
				this.currentWidthRange = WidthRange.S
				console.log('********************', this.currentWidthRange)
			} else {
				// console.log('** Is beyond XS')
				this.currentWidthRange = WidthRange.M
				console.log('****************************', this.currentWidthRange)
			}
		})


	}

}

export enum WidthRange {
	XS = 0,
	S = 1,
	M = 2,
	L = 3,
	XL = 4
}
