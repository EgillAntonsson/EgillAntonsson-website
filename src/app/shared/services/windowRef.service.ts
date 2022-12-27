import {Injectable} from '@angular/core'
// import { Spotify } from '@types/spotify-api'

function _window(): any {
	// return the native window obj
	return window
}

@Injectable({
	providedIn: 'root',
})
export class WindowRefService {

	constructor() {	}

	// private contentWindow!: Window | null;

	get nativeWindow(): any {
		return _window()
	}

	// keepIFrameContentWindow(contentWindow: Window | null) {
	// 	console.log('keepIFrameContentWindow')
	// 	console.log(contentWindow)
	// 	// this.contentWindow = contentWindow

	// 	this.nativeWindow.addEventListener("message", function(event: { source: any; data: string; }) {

	// 		console.log('****** event')
	// 		console.log(contentWindow)
	// 		// Check that the event was sent from the YouTube IFrame.
	// 		if (event.source === contentWindow) {
	// 			var data = JSON.parse(event.data);

	// 			// The "infoDelivery" event is used by YT to transmit any
	// 			// kind of information change in the player,
	// 			// such as the current time or volume change.
	// 			if (
	// 				data.event === "infoDelivery" &&
	// 				data.info &&
	// 				data.info.volume
	// 			) {
	// 				console.log(data.info.volume)
	// 				console.log(data.info.muted)
	// 			}
	// 		}
	// 	});
	// }

}
