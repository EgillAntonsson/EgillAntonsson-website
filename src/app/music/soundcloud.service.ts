import { Injectable } from '@angular/core'

export interface ScUser {
	avatar_url: string
}
export interface ScTrack {
	description: string
	duration: number
	artwork_url: string
	purchase_url: string
	permalink_url: string
	favoritings_count: number
}

@Injectable({
	providedIn: 'root',
})

export class SoundCloudService {
	private soundcloud

	constructor() {
		this.soundcloud  = require('soundcloud')
	}

	initialize(obj) {
		this.soundcloud.initialize(obj)
	}

	stream(trackUrl: string, cb) {
		this.soundcloud.stream(trackUrl).then((player) => {
			cb(player)
		})
	}

	get(getParam: string, cb) {
		this.soundcloud.get(getParam).then((cbParam) => {
			cb(cbParam)
		})
	}
}
