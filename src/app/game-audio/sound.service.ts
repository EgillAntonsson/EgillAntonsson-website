import { Injectable } from '@angular/core'
import { SoundManagerService } from './soundManager.service'
import { Track, ByTracks } from 'app/interface/track'
import { SoundType } from 'soundcommon/enum/soundType'
import { LayeredMusicController } from 'soundcommon/layeredMusicController';
import { SoundInstance } from 'soundcommon/interface/soundInstance';
import { Listener } from 'selenium-webdriver';

export interface PlayReturn {
	instance: SoundInstance
	endedPromise: Promise<SoundInstance>
}

@Injectable({
	providedIn: 'root',
})

export class SoundService {

	private _selectedLayeredMusic: LayeredMusicController
	get selectedLayeredMusic() {
		return this._selectedLayeredMusic
	}
	private _byTracksArr: ByTracks[]
	get byTracksArr() {
		return this._byTracksArr
	}

	private _awaitingFirstPlay = false
	get awaitingFirstPlay() {
		return this._awaitingFirstPlay
	}

	readonly pathMusic = '../../assets/audio/game'
	readonly instancePlayedListeners: Map<string, (soundInstance: SoundInstance) => void>
	readonly instanceEndedListeners: Map<string, () => void>

	constructor(private soundManager: SoundManagerService) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()

		this.setupTracks()
	}

	play(track: Track) {
		if (!this.soundManager.instance.hasSound(track.soundDatas[0].key)) {
			for (let i = 0; i < track.soundDatas.length; i++) {
				this.soundManager.instance.addSound(track.soundDatas[i])
				console.log('adding sound')
			}
		}

		this._awaitingFirstPlay = true
		track.play(track)()

		if (track.layeredMusicController) {
			this._selectedLayeredMusic = track.layeredMusicController
		}
	}

	stopMusic() {
		this.soundManager.instance.stopMusic()
		if (this._selectedLayeredMusic) {
			this._selectedLayeredMusic.stop()
			this._selectedLayeredMusic = null
		}
	}

	addInstancePlayedListener(name: string, listener: (soundInstance: SoundInstance) => void) {
		this.instancePlayedListeners.set(name, listener)
	}

	addInstanceEndedListener(name: string, listener: () => void) {
		this.instanceEndedListeners.set(name, listener)
	}

	removeInstancePlayedListener(name: string) {
		this.instancePlayedListeners.delete(name)
	}

	removeInstanceEndedListener(name: string) {
		this.instanceEndedListeners.delete(name)
	}

	private setupTracks() {
		const wyf = new Track('Who\'s Your Friend', [
{url: `${this.pathMusic}/WYF_ThemeSong.ogg`, key: 'wyf', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
(track: Track) => {
	return async () => {
		const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
		const {instance} = await sound.play()
		this._awaitingFirstPlay = false
		this.instancePlayedListeners.forEach((listener) => {
			listener(instance)
		})
	}
})

		const sff = new Track('Soft Freak Fiesta', [
{url: `${this.pathMusic}/SFF_IntroMenuMusic.ogg`, key: 'sffIntroMenuMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_MenuMusic.ogg`, key: 'sffMenuMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LevelMusic_noEnv.ogg`, key: 'sffLevelMusicNoEnv', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LevelMusic_bubbling.ogg`, key: 'sffLevelMusicBubbling', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LoseJingle.ogg`, key: 'sffLoseJingle', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_WinJingle.ogg`, key: 'sffWinJingle', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
(track: Track) => {
	return async () => {
		const introMenu = this.soundManager.instance.getSound(track.soundDatas[0].key)
		const mainMenu = this.soundManager.instance.getSound(track.soundDatas[1].key)
		const levelNoEnv = this.soundManager.instance.getSound(track.soundDatas[2].key)
		const levelBubbling = this.soundManager.instance.getSound(track.soundDatas[3].key)
		const loseJingle = this.soundManager.instance.getSound(track.soundDatas[4].key)
		const winJingle = this.soundManager.instance.getSound(track.soundDatas[5].key)
		let playLose = true

		let playReturn: PlayReturn
		playReturn = await introMenu.play()
		this._awaitingFirstPlay = false
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		let nrOfLoop = 4
		do {
			playReturn = await mainMenu.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await levelNoEnv.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await levelBubbling.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			if (playLose) {
				playReturn = await loseJingle.play()
			} else {
				playReturn = await winJingle.play()
			}
			playLose = !playLose
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			--nrOfLoop
		} while (nrOfLoop > 0)
	}
})

		this._byTracksArr = [
			{by: 'Music', tracks: [
				// hhiaugl
			]},
			{by: 'Game Music - Layered', tracks: [
				// godsruleLayered,
				// votLayered
			]},
			{by: 'Game Music', tracks: [
				// cpp,
				// ssix,
				sff,
				// habitarium,
				// tp,
				// jol2008,
				// jol2009,
				wyf,
				// kyf,
				// stackem,
				// glow,
				// godsrule,
				// vot,
				// crisis
			]}
		]
	}

}
