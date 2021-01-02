import { LogType } from 'shared/enums/logType';
import { SoundManager } from 'soundcommon/soundManager'
import { SoundData } from './interface/soundData';
import { Sound } from './sound';

export class SoundManagerMock implements SoundManager {
	readonly label = 'SoundManagerMock'
	readonly sounds: Map<string, Sound> = new Map()
	readonly musicGain = 1
	musicMuted = false
	sfxGain = 1
	sfxMuted = false
	masterGain = 1
	masterMuted = false
	maxNrPlayingAtOncePerSound = 9999
	setDynamicRange(_lowValue: number, _highValue: number): void {
		throw new Error('Method not implemented.')
	}
	addSound(_soundData: SoundData): Sound {
		throw new Error('Method not implemented.')
	}
	playSound(_key: string): void {
		throw new Error('Method not implemented.')
	}
	getSound(_key: string): Sound {
		throw new Error('Method not implemented.')
	}
	hasSound(_key: string): boolean {
		throw new Error('Method not implemented.')
	}
	stopSound(_key: string): void {
		throw new Error('Method not implemented.')
	}
	stopMusic(): void {
		throw new Error('Method not implemented.')
	}
	stopAllSounds(): void {
		throw new Error('Method not implemented.')
	}
	purge(): void {
		throw new Error('Method not implemented.')
	}
	init(_window: any, _log: (logType: LogType, msg?: any, ...rest: any[]) => void): void {
		throw new Error('Method not implemented.')
	}

}
