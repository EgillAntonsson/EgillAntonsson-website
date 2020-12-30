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
	private readonly label = 'MusicPage'

	private canvases!: ElementRef<HTMLCanvasElement>[]
	private drawVisuals: number[] = []
	private currentCanvasNr = 0
	private canvasNrAscending = false
	private playedListenerName = `${this.label} playedListener`
	private endedListenerName = `${this.label} endedListener`

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
	canvas0!: ElementRef<HTMLCanvasElement>
	@ViewChild('canvas1', { static: true })
	canvas1!: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas2', { static: true })
	canvas2!: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas3', { static: true })
	canvas3!: ElementRef<HTMLCanvasElement>

	selectedByIndex = 0
	openedUiByIndex = 0

	get byTracksArr() {
		return this.musicService.byTracksArr
	}

	get selectedTrack() {
		return this.musicService.selectedTrack
	}

	constructor(private musicService: MusicService, private messageService: MessageService, private logService: LogService) {

		this.musicService.addInstancePlayedListener(this.playedListenerName, (soundInstance) => {
			const canvas = this.getNextCanvas()
			const canvasContext = this.tryGetCanvasContext(canvas)
			if (canvasContext) {
				this.visualize(soundInstance, canvas, canvasContext, this.drawVisuals)
			}
		})

		this.musicService.addInstanceEndedListener(this.endedListenerName, () => {
			this.clearVisuals()
		})

	}

	ngOnInit(): void {
		this.canvases = [this.canvas0, this.canvas1, this.canvas2, this.canvas3]
	}

	ngOnDestroy() {
		this.musicService.removeInstancePlayedListener(this.playedListenerName)
		this.musicService.removeInstanceEndedListener(this.endedListenerName)
	}

	private getNextCanvas():  ElementRef<HTMLCanvasElement> {
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

	visualize(inst: SoundInstance, canvas:  ElementRef<HTMLCanvasElement>, canvasContext: CanvasRenderingContext2D, drawVisuals: number[]) {
			// const canvasContext = canvas.nativeElement.getContext('2d')
		const analyser = inst.analyzerNode
		analyser.fftSize = 2048
		const bufferLength = analyser.fftSize
		const dataArray = new Uint8Array(bufferLength)

		const canvasWidth = canvas.nativeElement.width
		const canvasHeight = canvas.nativeElement.height

		canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)

		const draw = () => {
			drawVisuals.push(requestAnimationFrame(draw))

			analyser.getByteTimeDomainData(dataArray)

			canvasContext.fillStyle = '#111' // styles.css colorDarkDark
			canvasContext.fillRect(0, 0, canvasWidth, canvasHeight)

			canvasContext.lineWidth = 3
			canvasContext.strokeStyle = '#b9ca4a' // styles.css colorActive

			canvasContext.beginPath()

			const sliceWidth = canvasWidth * 1.0 / bufferLength
			let x = 0

			for (let i = 0; i < bufferLength; i++) {

				const v = dataArray[i] / 128.0
				const y = v * canvasHeight / 2

				if (i === 0) {
					canvasContext.moveTo(x, y)
				} else {
					canvasContext.lineTo(x, y)
				}

				x += sliceWidth
			}

			canvasContext.lineTo(canvasWidth, canvasHeight / 2)
			canvasContext.stroke()
		}

		draw()
	}

	private clearVisuals() {
		this.drawVisuals.forEach(dv => {
			window.cancelAnimationFrame(dv)
		})
		this.drawVisuals = []
		this.canvases.forEach(canvas => {
			const canvasContext = this.tryGetCanvasContext(canvas)
			canvasContext?.clearRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height)
		})

		this.currentCanvasNr = 1
		this.canvasNrAscending = false
	}

	private tryGetCanvasContext(canvas: ElementRef<HTMLCanvasElement>) {
		const canvasContext = canvas.nativeElement.getContext('2d')
		if (!canvasContext) {
			this.logService.log(LogType.Error, '"canvasContext" was "null"')
		}
		return canvasContext
	}
}
