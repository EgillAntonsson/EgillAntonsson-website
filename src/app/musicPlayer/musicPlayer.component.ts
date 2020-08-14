import { Component, OnInit } from '@angular/core'
import { MusicService } from 'app/shared/services/music.service'
import { BooleanEmitter } from 'soundcommon/emitter/booleanEmitter'
import { Options, ChangeContext } from 'ng5-slider'
import { EmitterEvent } from 'soundcommon/enum/emitterEvent';
import { SoundManagerService } from '../shared/services/soundManager.service'
import { Subscription } from 'rxjs'
import { MessageService, MessageType } from 'app/shared/services/message.service'

@Component({
	selector: 'app-music-player',
	templateUrl: './musicPlayer.component.html',
	styleUrls: ['./musicPlayer.component.css']
})
export class MusicPlayerComponent implements OnInit {

	get selectedTrack() {
		return this.musicService.selectedTrack
	}
	get isPlaying() {
		return this.musicService.isPlaying
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
	private gainsDisabled: BooleanEmitter = new BooleanEmitter(false)
	gainsDisabledForView = false

	optionsMasterGain: Options = {
		floor: 0,
		ceil: 1,
		step: 0.01,
		showSelectionBar: true,
		getSelectionBarColor: this.sliderColors,
		getPointerColor: this.sliderColors
	}

	private sliderColors(value: number): string {
		if (value <= 0.2) { return '#394a00' }
		if (value <= 0.4) { return '#596a06' }
		if (value <= 0.6) { return '#798a0a' }
		if (value <= 0.8) { return '#99aa2a' }
		if (value <= 1) { return '#b9ca4a' }
	}
	private sliderColorsMuted(value: number): string {
		if (value <= 0.2) { return '#5d0800' }
		if (value <= 0.4) { return '#7d2800' }
		if (value <= 0.6) { return '#9d4800' }
		if (value <= 0.8) { return '#bd6800' }
		if (value <= 1) { return '#dd8800' }
	}

	private sliderColorsDisabled(_: number): string {
		return '#8B91A2'
	}

	ngOnInit(): void {
		console.log('music player ngInit')
	}

	constructor(private musicService: MusicService, private soundManager: SoundManagerService, private messageService: MessageService) {

		this.enableGains = (value: boolean) => {
			// INFO: view html seems not to be able to dig into enableGains.value, thus gainsDisabledForView is needed
			this.gainsDisabledForView = value
			if (value) {
				this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
			} else {
			this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, {disabled: false, getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
			}
		}
		this.gainsDisabled.on(EmitterEvent.Change, this.enableGains)

		this.subscription = this.messageService.onMessage().subscribe(message => {
			if (message.messageType === MessageType.Play) {
				this.play()
			}
		})
	}

	onPlayStop() {
		if (this.musicService.isPlaying) {
			this.musicService.stop()
		} else {
			this.play()
		}
	}

	play() {
		if (this.musicService.awaitingFirstPlay) {
			return
		}

		this.musicService.play(this.gainsDisabled)
	}

	// onMasterGainChange(changeCxt: ChangeContext) {
	// 	this.soundManager.instance.masterGain = this.masterGain = changeCxt.value
	// }

	onMasterMuteChange() {
		if (this.gainsDisabled.value) { return }
		this.soundManager.instance.masterMuted = this.masterMuted = !this.masterMuted
		this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, { getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
	}
}
