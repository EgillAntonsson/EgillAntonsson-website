import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Options } from 'ng5-slider'
import { globalMaxNrPlayingAtOncePerSound } from '../../soundcommon/soundUtil'
import { SoundInstance } from '../../soundcommon/interface/soundInstance'
import { ITrack, LayeredMusicTrack } from '../shared/data/track'
import { MusicService } from '../shared/services/music.service'
import { LogService } from '../shared/services/log.service'
import { MessageService, MessageType } from 'app/shared/services/message.service'
import { LogType } from '../../shared/enums/logType'

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
	// get awaitingFirstPlay() {
	// 	return this.musicService.awaitingFirstPlay
	// }
	private canvases: ElementRef<HTMLCanvasElement>[]
	private drawVisuals = []
	musicGain = 1
	musicMuted = false
	sfxGain = 1
	sfxMuted = false
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

	ngOnInit(): void {
		this.canvases = [this.canvas0, this.canvas1, this.canvas2, this.canvas3]
	}

	constructor(private musicService: MusicService, private messageService: MessageService, private logService: LogService) {

		this.musicService.addInstancePlayedListener(this.playedListenerName, (soundInstance) => {
			this.visualize(soundInstance, this.getNextCanvas() , this.drawVisuals)
		})

		this.musicService.addInstanceEndedListener(this.endedListenerName, () => {
			this.clearVisuals()
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
			this.logService.log(LogType.Info, 'onTrackClick, awaitingFirstPlay is true, returning without processing')
			return
		}
		this.selectedByIndex = this.openedUiByIndex
		this.musicService.nextSelectedTrack = track
		this.messageService.sendMessage(MessageType.Play)
	}

	onByClick(byIndex: number) {
		if (this.openedUiByIndex === byIndex) {
			// deselect
			this.openedUiByIndex = -1
		} else {
			this.openedUiByIndex = byIndex
		}
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

		this.currentCanvasNr = 1
		this.canvasNrAscending = false
	}

	ngOnDestroy() {
		this.musicService.removeInstancePlayedListener(this.playedListenerName)
		this.musicService.removeInstanceEndedListener(this.endedListenerName)
	}
}
