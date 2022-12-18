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

	get nativeWindow(): any {
		return _window()
	}

	// spotify(): void {
	// 		this.nativeWindow.onSpotifyWebPlaybackSDKReady = () => {
	// 		const token = '[My access token]';
	// 		const player = new Spotify.Player({
	// 			name: 'Web Playback SDK Quick Start Player',
	// 			getOAuthToken: cb => { cb(token); },
	// 			volume: 0.5
	// 		});
	// 	}
	// }

}



// https://open.spotify.com/track/25b0X0FtFt10ma5rOxHZRq?si=252eeaaa91b84a6a
