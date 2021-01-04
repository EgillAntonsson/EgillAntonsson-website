import { Sound } from './sound'
import { SoundType } from './enum/soundType'
import { globalMaxNrPlayingAtOncePerSound, SoundUtil } from './soundUtil'
import { GainEmitter } from './emitter/gainEmitter'
import { EmitterEvent } from './enum/emitterEvent'
import { DynamicRangeEmitter } from './emitter/dynamicRangeEmitter'
import { SoundData } from './interface/soundData'
import { LogType } from '../shared/enums/logType'

export interface SoundManager {

	readonly label: string
	readonly sounds: Map<string, Sound>
	musicGain: number
	musicMuted: boolean
	sfxGain: number
	sfxMuted: boolean
	masterGain: number
	masterMuted: boolean
	maxNrPlayingAtOncePerSound: number
	init(window: any, log: (logType: LogType, msg?: any, ...rest: any[]) => void): void
	setDynamicRange(lowValue: number, highValue: number): void
	addSound(soundData: SoundData): Sound
	playSound(key: string): void
	getSound(key: string): Sound
	hasSound(key: string): boolean
	stopSound(key: string): void
	stopMusic(): void
	stopAllSounds(): void
	purge(): void
}

export class SoundManagerImp implements SoundManager {
	readonly label = 'SoundManager'
	readonly sounds: Map<string, Sound>

	private _musicGain: GainEmitter
	public set musicGain(gain: number) {
		this._musicGain.value = SoundUtil.validateNumberForRange(gain, 0, 1)
		this._musicGain.emit(EmitterEvent.GainChange)
	}
	public set musicMuted(muted: boolean) {
		this._musicGain.muted = muted
		this._musicGain.emit(EmitterEvent.MuteChange)
	}

	private _sfxGain: GainEmitter
	public set sfxGain(gain: number) {
		this._sfxGain.value = SoundUtil.validateNumberForRange(gain, 0, 1)
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
		this._masterGain.value = SoundUtil.validateNumberForRange(gain, 0, 1)
		this._masterGain.emit(EmitterEvent.GainChange)
	}
	public set masterMuted(muted: boolean) {
		this._masterGain.muted = muted
		this._masterGain.emit(EmitterEvent.MuteChange)
	}

	private _maxNrPlayingAtOncePerSound: number
	public set maxNrPlayingAtOncePerSound(value: number) {
		this._maxNrPlayingAtOncePerSound = SoundUtil.validateNumberForRange(value, 1, globalMaxNrPlayingAtOncePerSound)
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

	setDynamicRange(lowValue: number, highValue: number) {
		if (lowValue > highValue) {
			this.log(LogType.Error, `Invalid params for setDynamicRange, lowValue '${lowValue}' must be lower than highValue '${highValue}', not setting new Dynamic Range`)
		}
		this.dynamicRange.lowValue = SoundUtil.validateNumberForRange(lowValue, 0, 1)
		this.dynamicRange.highValue =  SoundUtil.validateNumberForRange(highValue, 0, 1)
		this.dynamicRange.emit(EmitterEvent.Change, this.dynamicRange)
	}

	addSound(soundData: SoundData) {
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

	getSound(key: string) {
		const sound = this.sounds.get(key)
		if (!sound) {
			throw new SoundManagerError(SoundManagerError.msgSoundNotInManager)
		}
		return sound
	}

	hasSound(key: string) {
		return this.sounds.has(key)
	}

	stopSound(key: string) {
		const sound = this.sounds.get(key)
		if (!sound) {
			this.log(LogType.Info, 'Cannot stop Sound, not in SoundManager')
			return
		}
		sound.stop()
	}

	stopMusic() {
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

export class SoundManagerError implements Error {
	name = 'SoundManagerError'
	message: string
	stack?: string

	static msgSoundNotInManager = 'Sound Not In Manager'

	constructor(message: string) {
		this.message = message
	}

}
