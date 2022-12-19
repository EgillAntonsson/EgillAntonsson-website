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
}
