import { ChangeDetectorRef, Component } from '@angular/core'
import { MusicService } from 'app/shared/services/music.service'
import { BooleanEmitter } from 'soundcommon/emitter/booleanEmitter'
import { Options } from 'ng5-slider'
import { EmitterEvent } from 'soundcommon/enum/emitterEvent';
import { SoundManagerService } from '../shared/services/soundManager.service'
import { Subscription } from 'rxjs'
import { MessageService, MessageType } from 'app/shared/services/message.service'
import { Color } from 'app/shared/enums/color'
import { PlayState } from 'app/shared/enums/playState';

@Component({
	selector: 'app-music-player',
	templateUrl: './musicPlayer.component.html',
	styleUrls: ['./musicPlayer.component.css']
})
export class MusicPlayerComponent {
	readonly label = 'MusicPlayer'

	get selectedTrack() {
		return this.musicService.selectedTrack
	}

	get playState() {
		console.log('playState', this.musicService.playState)
		return this.musicService.playState
	}

	get isShuffle() {
		return this.musicService.isShuffle
	}
	get masterGain() {
		return this.soundManager.instance.masterGain
	}

	set masterGain(value: number) {
		this.soundManager.instance.masterGain = value
	}

	masterMuted = false

	subscription: Subscription

	private enableGains: (value: boolean) => void
	private _gainsDisabled: BooleanEmitter = new BooleanEmitter(false)
	get gainsDisabled() {
		return this._gainsDisabled.value
	}

	optionsMasterGain: Options = {
		floor: 0,
		ceil: 1,
		step: 0.01,
		showSelectionBar: true,
		getSelectionBarColor: this.sliderColors,
		getPointerColor: this.sliderColors,
		hideLimitLabels: true,
		hidePointerLabels: true
	}

	private sliderColors(value: number): string {
		if (value <= 0.2) { return Color.GreenDark }
		if (value <= 0.4) { return Color.GreenMedDark }
		if (value <= 0.6) { return Color.GreenMed }
		if (value <= 0.8) { return Color.GreenLightMed }
		if (value <= 1) { return Color.GreenLight}
		return Color.GreenLight
	}
	private sliderColorsMuted(value: number): string {
		if (value <= 0.2) { return Color.OrangeDark }
		if (value <= 0.4) { return Color.OrangeMedDark }
		if (value <= 0.6) { return Color.OrangeMed }
		if (value <= 0.8) { return Color.OrangeLightMed }
		if (value <= 1) { return Color.OrangeLight }
		return Color.OrangeLight
	}

	private sliderColorsDisabled(_: number): string {
		return Color.Disabled
	}

	constructor(private musicService: MusicService, private soundManager: SoundManagerService, private messageService: MessageService, private changeDetectorRef: ChangeDetectorRef) {

		this.enableGains = (value: boolean) => {

			if (value) {
				this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
			} else {
			this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, {disabled: false, getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
			}
		}
		this._gainsDisabled.on(EmitterEvent.Change, this.enableGains)

		this.subscription = this.messageService.onMessage().subscribe(message => {
			if (message.messageType === MessageType.Play) {
				this.play()
			}
		})

		this.musicService.addInstanceEndedListener(`${this.label} endedListener`, (trackEnded?: boolean, serviceDidStop?: boolean) => {
			if (trackEnded && !serviceDidStop) {
					this.onNext()
				}
		})

		this.musicService.addPlayStateChangeListener(() => {
			console.log('this.changeDetectorRef.detectChanges()')
			this.changeDetectorRef.detectChanges()
		})
	}

	onPlayStop() {
		if (this.musicService.playState === PlayState.Loading) {
			return
		}
		if (this.musicService.playState === PlayState.Playing) {
			this.musicService.stop()
		} else {
			this.play()
		}
	}

	onNext() {
		this.musicService.nextTrack()
		this.play()
	}

	onShuffle() {
		this.musicService.toggleShuffle()
	}

	play() {
		this.musicService.play(this._gainsDisabled)
	}

	onMasterMuteChange() {
		if (this._gainsDisabled.value) { return }
		this.soundManager.instance.masterMuted = this.masterMuted = !this.masterMuted
		this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, { getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
	}
}
