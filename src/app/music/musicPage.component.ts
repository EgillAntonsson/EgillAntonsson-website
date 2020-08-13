import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Options, ChangeContext } from 'ng5-slider'
import { SoundManagerService } from '../shared/services/soundManager.service'
import { WindowRef } from '../shared/services/windowRef.service'
import { globalMaxNrPlayingAtOncePerSound } from '../../soundcommon/soundUtil'
import { SoundInstance } from '../../soundcommon/interface/soundInstance'
import { ITrack, LayeredMusicTrack } from '../shared/data/track'
import { EmitterEvent } from '../../soundcommon/enum/emitterEvent'
import { BooleanEmitter } from '../../soundcommon/emitter/booleanEmitter'
import { MusicService } from '../shared/services/music.service'
import { Log, LogType } from '../shared/Log'

@Component({
	selector: 'app-music-page',
	templateUrl: './musicPage.component.html',
	styleUrls: ['./musicPage.component.css']
})
export class MusicPageComponent implements OnDestroy, OnInit {
	readonly label = 'MusicPage'
	get selectedTrack() {
		return this.musicService.selectedTrack
	}
	get awaitingFirstPlay() {
		return this.musicService.awaitingFirstPlay
	}
	// gainsDisabledForView = false
	// private gainsDisabled: BooleanEmitter = new BooleanEmitter(false)
	private canvases: ElementRef<HTMLCanvasElement>[]
	private drawVisuals = []
	private enableGains: (value: boolean) => void
	musicGain = 1
	musicMuted = false
	sfxGain = 1
	sfxMuted = false
	masterGain = 1

	masterMuted = false
	highMaxNrPlaying = globalMaxNrPlayingAtOncePerSound
	mediumMaxNrPlaying = 16
	lowMaxNrPlaying = 8
	value = 0
	highValue = 1
	range = this.highValue - this.value

	@ViewChild('canvas0', { static: true })
	canvas0: ElementRef<HTMLCanvasElement>
	@ViewChild('canvas1', { static: true })
	canvas1: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas2', { static: true })
	canvas2: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas3', { static: true })
	canvas3: ElementRef<HTMLCanvasElement>

	private currentCanvasNr = 0
	private canvasNrAscending = false
	private playedListenerName = `${this.label} playedListener`
	private endedListenerName = `${this.label} endedListener`
	selectedByIndex = 0
	openedUiByIndex = 0

	get byTracksArr() {
		return this.musicService.byTracksArr
	}

	optionsDR: Options = {
		floor: 0,
		ceil: 1,
		step: 0.1,
		minRange: 0.1,
		draggableRange: true,
		noSwitching: true,
		showTicks: true,
	}

	optionsMusicGain: Options = {
		floor: 0,
		ceil: 1,
		step: 0.01,
		showSelectionBar: true,
		getSelectionBarColor: this.sliderColors,
		getPointerColor: this.sliderColors
	}
	optionsSfxGain = Object.assign({}, this.optionsMusicGain)
	optionsMasterGain = Object.assign({}, this.optionsMusicGain)
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
	private log = (logType: LogType, msg?: any, ...optionalParams: any[]) => {}
	ngOnInit(): void {
		this.canvases = [this.canvas0, this.canvas1, this.canvas2, this.canvas3]
	}

	constructor(private musicService: MusicService, private soundManager: SoundManagerService, private windowRef: WindowRef) {

		this.log = Log.consoleLog

		// this.enableGains = (value: boolean) => {
		// 	// INFO: view html seems not to be able to dig into enableGains.value, thus gainsDisabledForView is needed
		// 	this.gainsDisabledForView = value
		// 	if (value) {
		// 		this.optionsMusicGain = Object.assign({}, this.optionsMusicGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
		// 		this.optionsSfxGain = Object.assign({}, this.optionsSfxGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
		// 		this.optionsMasterGain = Object.assign({}, this.optionsMusicGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
		// 		this.optionsDR = Object.assign({}, this.optionsDR, {disabled: true})
		// 	} else {
		// 		this.optionsMusicGain = Object.assign({}, this.optionsMusicGain, {disabled: false, getSelectionBarColor: this.musicMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.musicMuted ? this.sliderColorsMuted : this.sliderColors})
		// 	this.optionsSfxGain = Object.assign({}, this.optionsSfxGain, {disabled: false, getSelectionBarColor: this.sfxMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.sfxMuted ? this.sliderColorsMuted : this.sliderColors})
		// 	this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, {disabled: false, getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
		// 	this.optionsDR = Object.assign({}, this.optionsDR, {disabled: false})
		// 	}
		// }
		// this.gainsDisabled.on(EmitterEvent.Change, this.enableGains)

		// soundManager.instance.init(this.windowRef.nativeWindow, this.musicGain, this.musicMuted, this.sfxGain, this.sfxMuted, this.masterGain, this.masterMuted, this.highMaxNrPlaying, this.log)


		this.musicService.setLog(this.log)

		this.musicService.addInstancePlayedListener(this.playedListenerName, (soundInstance) => {
			this.visualize(soundInstance, this.getNextCanvas() , this.drawVisuals)
		})

		this.musicService.addInstanceEndedListener(this.endedListenerName, (trackEnded?: boolean, timeout?: NodeJS.Timeout) => {
			if (timeout) {
				clearInterval(timeout)
			}
			if (trackEnded) {
				this.stopMusic()
			} else {
				this.clearVisuals()
			}
		})

	}

	private getNextCanvas() {
		if (this.currentCanvasNr === 0) {
			this.currentCanvasNr++
			this.canvasNrAscending = true
		} else if (this.currentCanvasNr === 3) {
			this.currentCanvasNr--
			this.canvasNrAscending = false
		} else {
			this.canvasNrAscending ? this.currentCanvasNr++ : this.currentCanvasNr--
		}

		return this.canvases[this.currentCanvasNr]
	}

	onTrackClick(track: ITrack) {
		if (this.musicService.awaitingFirstPlay) {
			this.log(LogType.Info, 'onTrackClick, awaitingFirstPlay is true, returning without processing')
			return
		}
		this.selectedByIndex = this.openedUiByIndex

		this.stopMusic()

		this.musicService.play(track, this.gainsDisabled)
	}

	public stopMusic() {
		if (this.gainsDisabled.value) {
			this.gainsDisabled.value = false
			this.gainsDisabled.emit(EmitterEvent.Change, false)
		}

		this.musicService.stop()

		this.clearVisuals()
		this.currentCanvasNr = 1
		this.canvasNrAscending = false
	}

	onByClick(byIndex: number) {
		if (this.openedUiByIndex === byIndex) {
			// deselect
			this.openedUiByIndex = -1
		} else {
			this.openedUiByIndex = byIndex
		}
	}

	onMaxNrPlayingChange(value: number) {
		this.soundManager.instance.maxNrPlayingAtOncePerSound =  value
	}

	onMusicGainChange(changeCxt: ChangeContext) {
		this.soundManager.instance.musicGain = changeCxt.value
	}

	onMusicMuteChange() {
		if (this.gainsDisabled.value) { return }
		this.soundManager.instance.musicMuted = this.musicMuted = !this.musicMuted
		this.optionsMusicGain = Object.assign({}, this.optionsMusicGain, { getSelectionBarColor: this.musicMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.musicMuted ? this.sliderColorsMuted : this.sliderColors})
	}

	onSfxGainChange(changeCxt: ChangeContext) {
		this.soundManager.instance.sfxGain = this.sfxGain = changeCxt.value
	}

	onSfxMuteChange() {
		if (this.gainsDisabled.value) { return }
		this.soundManager.instance.sfxMuted = this.sfxMuted = !this.sfxMuted
		this.optionsSfxGain = Object.assign({}, this.optionsSfxGain, { getSelectionBarColor: this.sfxMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.sfxMuted ? this.sliderColorsMuted : this.sliderColors})
	}

	onMasterGainChange(changeCxt: ChangeContext) {
		this.soundManager.instance.masterGain = this.masterGain = changeCxt.value
	}

	onMasterMuteChange() {
		if (this.gainsDisabled.value) { return }
		this.soundManager.instance.masterMuted = this.masterMuted = !this.masterMuted
		this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, { getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
	}

	dynamicRangeChange(changeCxt: ChangeContext) {
		this.soundManager.instance.setDynamicRange(changeCxt.value, changeCxt.highValue)
	}

	get layerText(): string {
			if (this.musicService.selectedTrack instanceof LayeredMusicTrack && this.musicService.selectedTrack.layeredMusicController.layerSoundInstances) {
			const layers =  this.musicService.selectedTrack.layeredMusicController.layerSoundInstances
			if (layers[layers.length - 1].gainWrapper.instanceMuted) {
				return 'add layer'
			}
		}
		return 'keep layer'
	}

	incrementMusicLayerValue() {
		(this.musicService.selectedTrack as LayeredMusicTrack).layeredMusicController.incrementLayerValue()
	}

	visualize(inst: SoundInstance, canvas: ElementRef<HTMLCanvasElement>, drawVisuals: number[]) {
		const canvasCtx = canvas.nativeElement.getContext('2d')
		const analyser = inst.analyzerNode
		analyser.fftSize = 2048
		const bufferLength = analyser.fftSize
		const dataArray = new Uint8Array(bufferLength)

		const WIDTH = canvas.nativeElement.width
		const HEIGHT = canvas.nativeElement.height

		canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

		const draw = () => {
			drawVisuals.push(requestAnimationFrame(draw))

			analyser.getByteTimeDomainData(dataArray)

			canvasCtx.fillStyle = '#111' // styles.css colorDarkDark
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

			canvasCtx.lineWidth = 3
			canvasCtx.strokeStyle = '#b9ca4a' // styles.css colorActive

			canvasCtx.beginPath()

			const sliceWidth = WIDTH * 1.0 / bufferLength
			let x = 0

			for (let i = 0; i < bufferLength; i++) {

				const v = dataArray[i] / 128.0
				const y = v * HEIGHT / 2

				if (i === 0) {
					canvasCtx.moveTo(x, y)
				} else {
					canvasCtx.lineTo(x, y)
				}

				x += sliceWidth
			}

			canvasCtx.lineTo(WIDTH, HEIGHT / 2)
			canvasCtx.stroke()
		}

		draw()
	}

	private clearVisuals() {
		this.drawVisuals.forEach(dv => {
			window.cancelAnimationFrame(dv)
		})
		this.drawVisuals = []
		this.canvases.forEach(canvas => {
			const canvasCtx = canvas.nativeElement.getContext('2d')
			canvasCtx.clearRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height)
		})
	}

	ngOnDestroy() {
		this.musicService.removeInstancePlayedListener(this.playedListenerName)
		this.musicService.removeInstanceEndedListener(this.endedListenerName)
	}
}
