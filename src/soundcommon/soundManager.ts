import { Sound } from './sound'
import { SoundType } from './enum/soundType'
import { validateRange, globalMaxNrPlayingAtOncePerSound } from './soundUtil'
import { GainEmitter } from './emitter/gainEmitter'
import { EmitterEvent } from './enum/emitterEvent'
import { DynamicRangeEmitter } from './emitter/dynamicRangeEmitter'
import { SoundData } from './interface/soundData'
import { LogType } from '../shared/enums/logType'

export class SoundManager {
	readonly label = 'SoundManager'
	readonly sounds: Map<string, Sound>

	private _musicGain: GainEmitter
	public set musicGain(gain: number) {
		this._musicGain.value = validateRange(gain, 0, 1, this.log)
		this._musicGain.emit(EmitterEvent.GainChange)
	}
	public set musicMuted(muted: boolean) {
		this._musicGain.muted = muted
		this._musicGain.emit(EmitterEvent.MuteChange)
	}

	private _sfxGain: GainEmitter
	public set sfxGain(gain: number) {
		this._sfxGain.value = validateRange(gain, 0, 1, this.log)
		this._sfxGain.emit(EmitterEvent.GainChange)
	}
	public set sfxMuted(muted: boolean) {
		this._sfxGain.muted = muted
		this._sfxGain.emit(EmitterEvent.MuteChange)
	}

	private _masterGain: GainEmitter
	public get masterGain() {
		return this._masterGain.value
	}
	public set masterGain(gain: number) {
		this._masterGain.value = validateRange(gain, 0, 1, this.log)
		this._masterGain.emit(EmitterEvent.GainChange)
	}
	public set masterMuted(muted: boolean) {
		this._masterGain.muted = muted
		this._masterGain.emit(EmitterEvent.MuteChange)
	}

	private _maxNrPlayingAtOncePerSound: number
	public set maxNrPlayingAtOncePerSound(value: number) {
		this._maxNrPlayingAtOncePerSound = validateRange(value, 1, globalMaxNrPlayingAtOncePerSound, this.log)
		this.sounds.forEach(sound => {
			sound.configMaxNrPlayingAtOnce = this._maxNrPlayingAtOncePerSound
		})
	}

	private dynamicRange: DynamicRangeEmitter

	private log!: (logType: LogType, msg?: any, ...rest: any[]) => void
	private audioContext!: AudioContext

	constructor() {
		this.sounds = new Map()
		this.dynamicRange = new DynamicRangeEmitter(0, 1)
		this._musicGain = new GainEmitter(1, false)
		this._sfxGain = new GainEmitter(1, false)
		this._masterGain = new GainEmitter(1, false)
		this._maxNrPlayingAtOncePerSound = globalMaxNrPlayingAtOncePerSound
	}
	init(window: any, log: (logType: LogType, msg?: any, ...rest: any[]) => void) {
		this.log = log

		// for cross browser
		const AudioContext = window.AudioContext || window.webkitAudioContext
		this.audioContext = new AudioContext()
	}

	setDynamicRange(lowValue: number, highValue: number): void {
		if (lowValue > highValue) {
			this.log(LogType.Error, `Invalid params for setDynamicRange, lowValue '${lowValue}' must be lower than highValue '${highValue}', not setting new Dynamic Range`)
		}
		this.dynamicRange.lowValue = validateRange(lowValue, 0, 1, this.log)
		this.dynamicRange.highValue =  validateRange(highValue, 0, 1, this.log)
		this.dynamicRange.emit(EmitterEvent.Change, this.dynamicRange)
	}

	addSound(soundData: SoundData): Sound {
		const soundTypeGain = (soundData.soundType === SoundType.Music) ? this._musicGain : this._sfxGain
		this.updateEmitterMaxListeners(this.sounds.size + 1)

		const sound = new Sound(soundData, this._maxNrPlayingAtOncePerSound, soundTypeGain, this._masterGain, this.dynamicRange, this.audioContext, this.log)
		this.addToList(soundData.key, sound)
		return sound
	}

	private updateEmitterMaxListeners(nrOfSounds: number): void {
		// worst case all sound are of specific type, e.g Music or SFX
		const maxNr = 2 * nrOfSounds * globalMaxNrPlayingAtOncePerSound
		this._masterGain.setMaxListeners(maxNr)
		this._musicGain.setMaxListeners(maxNr)
		this._sfxGain.setMaxListeners(maxNr)
		this.dynamicRange.setMaxListeners(maxNr)
	}

	private addToList(key: string, sound: Sound): void {
		if (this.sounds.has(key)) {
			this.log(LogType.Warn, `Sound with the key '${key}' is already in to SoundManager, not adding it again`)
			return
		}
		this.sounds.set(key, sound)
	}

	playSound(key: string) {
		const sound = this.sounds.get(key)
		if (!sound) {
			this.log(LogType.Warn, `[${this.label}]`, `Cannot play sound with key '${key}', not in SoundManager`)
			return
		}
		return sound.play()
	}

	getSound(key: string): Sound | undefined {
		return this.sounds.get(key)
	}

	hasSound(key: string): boolean {
		return this.sounds.has(key)
	}

	stopSound(key: string): void {
		const sound = this.sounds.get(key)
		if (!sound) {
			this.log(LogType.Info, 'Cannot stop Sound, not in SoundManager')
			return
		}
		sound.stop()
	}

	stopMusic(): void {
		this.sounds.forEach(sound => {
			if (sound.soundData.soundType === SoundType.Music) {
				sound.stop()
			}
		})
	}

	stopAllSounds(): void {
		this.sounds.forEach(sound => {
			sound.stop()
		})
	}

	purge(): void {
		this.sounds.forEach((sound) => {
			sound.dispose()
		})
		this.sounds.clear()
		this.updateEmitterMaxListeners(0)
		if (this.audioContext) {
			this.audioContext.close()
		}
	}

}
