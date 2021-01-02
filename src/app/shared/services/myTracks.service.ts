import { Injectable } from '@angular/core'
import { SoundType } from 'soundcommon/enum/soundType'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { Track } from '../data/track'
import { SoundManagerService } from './soundManager.service'

export interface ByTracks {
	by: string
	tracks: Track[]
	byBio?: string
}

@Injectable({
	providedIn: 'root',
})
export class MyTracksService {
	readonly pathRoot = '../../assets/audio'
	readonly pathGame = `${this.pathRoot}/game`
	readonly pathKuai = `${this.pathRoot}/kuai`
	readonly pathBrothers = `${this.pathRoot}/braedraminning`

	private _isInitialized = false
	get isInitialized() {
		return this._isInitialized
	}

	private _byTracks!: ByTracks[]
	get byTracks() {
		return this._byTracks
	}

	private _flatTracks!: Track[]
	get flatTracks() {
		return this._flatTracks
	}

	private instancePlayedListeners!: Map<string, (soundInstance: SoundInstance) => void>
	private instanceEndedListeners!: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>

	constructor(private soundManager: SoundManagerService) {
	}

	init(
		instancePlayedListeners: Map<string, (soundInstance: SoundInstance) => void>,
		instanceEndedListeners: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>
	) {

		if (this._isInitialized) {
			return
		}

		// listeners are set as instance vars so that they don't have to be passed into each 'setupTrack' method for the to call them. This class should not modify the listeners.
		this.instancePlayedListeners = instancePlayedListeners
		this.instanceEndedListeners = instanceEndedListeners

		this._byTracks = [
			{by: 'Egill Antonsson', tracks: [
				this.setupJustInTime()
			]}
		]

		this.flattenTracks()

		this._isInitialized = true
	}

	private flattenTracks() {
		this._flatTracks = []
		let index = 0
		for (let i = 0; i < this._byTracks.length; i++) {
			for (let j = 0; j < this._byTracks[i].tracks.length; j++) {
				const track = this._byTracks[i].tracks[j]
				track.index = index++
				this._flatTracks.push(track)
			}
		}
	}


	private setupJustInTime() {
		const track =  new Track('Just in Time', [
			{url: `${this.pathRoot}/Just_in_Time.ogg`, key: 'justInTime', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
			],
			() => {
			return async () => {
				const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
				let nrOfLoops = 2
				do {
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(nrOfLoops === 1))
					nrOfLoops--
				} while (nrOfLoops > 0)
			}
			})

			return track
	}
}
