import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core'
import { globalMaxNrPlayingAtOncePerSound } from '../../soundcommon/soundUtil'
import { SoundInstance } from '../../soundcommon/interface/soundInstance'
import { ITrack, LayeredMusicTrack } from '../shared/data/track'
import { MusicService } from '../shared/services/music.service'
import { LogService } from '../shared/services/log.service'
import { MessageService, MessageType } from 'app/shared/services/message.service'
import { LogType } from '../../shared/enums/logType'
import { PlayState } from 'app/shared/enums/playState'

@Component({
	selector: 'app-music-page',
	templateUrl: './musicPage.component.html',
	styleUrls: ['./musicPage.component.css']
})
export class MusicPageComponent implements OnDestroy {
	private readonly label = 'MusicPage'
	private drawVisuals: number[] = []
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

	@ViewChild('visualStream', { static: true })
	visualStream!: ElementRef<HTMLCanvasElement>

	selectedByIndex = 0
	openedUiByIndex = 0

	get byTracks() {
		return this.musicService.byTracks
	}

	get selectedTrack() {
		return this.musicService.selectedTrack
	}

	constructor(private musicService: MusicService, private messageService: MessageService, private logService: LogService) {

		this.musicService.addInstancePlayedListener(this.playedListenerName, (soundInstance) => {
			const canvasContext = this.visualStream.nativeElement.getContext('2d')
			if (canvasContext) {
				this.visualize(soundInstance, this.visualStream, canvasContext, this.drawVisuals)
			}
		})

		this.musicService.addInstanceEndedListener(this.endedListenerName, () => {
			this.clearVisuals()
		})
	}

	ngOnDestroy() {
		this.musicService.removeInstancePlayedListener(this.playedListenerName)
		this.musicService.removeInstanceEndedListener(this.endedListenerName)
	}

	onTrackClick(track: ITrack) {
		if (this.musicService.playState === PlayState.Loading) {
			this.logService.log(LogType.Info, 'onTrackClick: is loading, returning without processing')
			return
		}
		this.selectedByIndex = this.openedUiByIndex
		this.musicService.nextSelectedTrack = track
		this.messageService.sendMessage({type: MessageType.Play})
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

			canvasContext.fillStyle = '#111' // styles.css colorBackground
			canvasContext.fillRect(0, 0, canvasWidth, canvasHeight)

			canvasContext.lineWidth = 3
			canvasContext.strokeStyle = '#B9CA4A' // styles.css colorActive

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

		const canvasContext = this.visualStream.nativeElement.getContext('2d')
		canvasContext?.clearRect(0, 0, this.visualStream.nativeElement.width, this.visualStream.nativeElement.height)
	}
}
