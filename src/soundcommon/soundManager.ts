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
	private sounds: Map<string, Sound> = new Map()
	private log: (logType: LogType, msg?: any, ...rest: any[]) => void
	private audioCtx: AudioContext
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
	public set masterGain(gain: number) {
		this._masterGain.value = validateRange(gain, 0, 1, this.log)
		this._masterGain.emit(EmitterEvent.GainChange)
	}

	public get masterGain() {
		if (this._masterGain.value) {
			return this._masterGain.value
		}
		return 0
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

	private _dynamicRange: DynamicRangeEmitter
	public initialized = false

	init(window: any,  logger?: (logType: LogType, msg?: any, ...rest: any[]) => void) {
		this._musicGain = new GainEmitter(1, false)
		this._sfxGain = new GainEmitter(1, false)
		this._masterGain = new GainEmitter(1, false)
		this._dynamicRange = new DynamicRangeEmitter(0, 1)
		this._maxNrPlayingAtOncePerSound = globalMaxNrPlayingAtOncePerSound

		this.log = (logType: LogType, msg?: any, ...rest: any[]) => {
			if (logger) {
				logger(logType, msg, rest)
			}
		}

		// for cross browser
		const AudioContext = window.AudioContext || window.webkitAudioContext
		this.audioCtx = new AudioContext()

		this.initialized = true
	}

	setDynamicRange(lowValue: number, highValue: number): void {
		if (lowValue > highValue) {
			this.log(LogType.Error, `Invalid params for setDynamicRange, lowValue '${lowValue}' must be lower than highValue '${highValue}', not setting new Dynamic Range`)
		}
		this._dynamicRange.lowValue = validateRange(lowValue, 0, 1, this.log)
		this._dynamicRange.highValue =  validateRange(highValue, 0, 1, this.log)
		this._dynamicRange.emit(EmitterEvent.Change, this._dynamicRange)
	}

	addSound(soundData: SoundData): Sound {
		const soundTypeGain = (soundData.soundType === SoundType.Music) ? this._musicGain : this._sfxGain
		this.updateEmitterMaxListeners(this.sounds.size + 1)

		const sound = new Sound(soundData, this._maxNrPlayingAtOncePerSound, soundTypeGain, this._masterGain, this._dynamicRange, this.audioCtx, this.log)
		this.addToList(soundData.key, sound)
		return sound
	}

	private updateEmitterMaxListeners(nrOfSounds: number): void {
		this._masterGain.setMaxListeners(2 * nrOfSounds * globalMaxNrPlayingAtOncePerSound)
		// worst case all sound are type Music
		this._musicGain.setMaxListeners(2 * nrOfSounds * globalMaxNrPlayingAtOncePerSound)
		// worst case all sounds are type SFX
		this._sfxGain.setMaxListeners(2 * nrOfSounds * globalMaxNrPlayingAtOncePerSound)
		this._dynamicRange.setMaxListeners(nrOfSounds * globalMaxNrPlayingAtOncePerSound)
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

	isSoundPlaying(key: string) {

	}

	getSound(key: string): Sound {
		return this.sounds.get(key)
	}

	hasSound(key: string): boolean {
		return this.sounds.get(key) != null
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
		if (this.audioCtx) {
			this.audioCtx.close()
		}
	}

}
