import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ScreenService {

	constructor(private observer: BreakpointObserver) {}

// These max-width values are the truth source, e.g. max-width values in style css should match them
// The most min-width to be considered is 360px (Galaxy S8+)

	// Returns BreakpointState obj, where .matches returns true if within width and false if beyond
	onBpMaxWidthXS(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 451px)']);
	}

	isBelowS(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 703px)']);
	}

	isBelowM(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 1053px)']);
	}

	isBelowL(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 1403px)']);
	}

	isBelowXL(): Observable<BreakpointState> {
		return this.observer.observe(['(max-width: 2000px)']);
	}
}
