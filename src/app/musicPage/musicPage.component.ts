import { Component, OnDestroy, ElementRef, ViewChild, OnInit } from '@angular/core'
import { globalMaxNrPlayingAtOncePerSound } from '../../soundcommon/soundUtil'
import { SoundInstance } from '../../soundcommon/interface/soundInstance'
import { ITrack, LayeredMusicTrack } from '../shared/data/track'
import { MusicService } from '../shared/services/music.service'
import { LogService } from '../shared/services/log.service'
import { MessageService, MessageType } from 'app/shared/services/message.service'
import { LogType } from '../../shared/enums/logType'
import { PlayState } from 'app/shared/enums/playState'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Location } from '@angular/common'
import { LocationStrategy, PathLocationStrategy } from '@angular/common'
import { WindowRefService } from '../shared/services/windowRef.service'

@Component({
	selector: 'app-music-page',
	templateUrl: './musicPage.component.html',
	styleUrls: ['./musicPage.component.css'],
	providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class MusicPageComponent implements OnDestroy, OnInit {
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
	selectedByIndex = 0
	openedUiByIndex = -1 // all deselected

	private canvases!: ElementRef<HTMLCanvasElement>[]
	private currentCanvasNr = 0
	private canvasNrAscending = false

	@ViewChild('canvas0', { static: true })
	canvas0!: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas1', { static: true })
	canvas1!: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas2', { static: true })
	canvas2!: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas3', { static: true })
	canvas3!: ElementRef<HTMLCanvasElement>

	@ViewChild('topLine', { static: true })
	topLine!: ElementRef<HTMLCanvasElement>

	get byTracks() {
		return this.musicService.byTracks
	}

	get selectedTrack() {
		return this.musicService.selectedTrack
	}

	constructor(private musicService: MusicService, private messageService: MessageService, private logService: LogService, private route: ActivatedRoute, private location: Location, private windowRef: WindowRefService) {
		this.windowRef.nativeWindow["onPlayerReady"] = (player: YT.Player) => this.onPlayerReady(player);
	}

	onPlayerReady(player: YT.Player) {
		this.musicService.onYoutubePlayerReady(player)
  }

	onPlayerStateChange(event: any) {
		this.musicService.OnYoutubePlayerStateChange(event.data)
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params: ParamMap) => {
			const paramName = params.get('trackName')
			if (paramName !== null) {
				this.musicService.setSelectTrackByRootUrl(paramName)
			} else {
				this.replaceUrlState()
			}
		})

		this.musicService.addInstancePlayedListener(this.playedListenerName, (soundInstance) => {
			const canvas = this.getNextCanvas()
			const canvasContext = this.tryGetCanvasContext(canvas)
			if (canvasContext && soundInstance) {
				this.topLine.nativeElement.classList.add('hide')
				this.visualize(soundInstance, canvas, canvasContext, this.drawVisuals)
			}
			this.replaceUrlState()
		})

		this.musicService.addInstanceEndedListener(this.endedListenerName, () => {
			// this.topLine.nativeElement.classList.remove('hide')
			this.clearVisuals()
		})

		this.canvases = [this.canvas0, this.canvas1, this.canvas2, this.canvas3]
	}

	private replaceUrlState() {
		this.location.replaceState(`${this.musicService.urlPathRoot}${this.selectedTrack.rootUrl}`)
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

	private tryGetCanvasContext(canvas: ElementRef<HTMLCanvasElement>) {
		const canvasContext = canvas.nativeElement.getContext('2d')
		if (!canvasContext) {
			this.logService.log(LogType.Error, '"canvasContext" was "null"')
		}
		return canvasContext
	}

	visualize(inst: SoundInstance, canvas:  ElementRef<HTMLCanvasElement>, canvasContext: CanvasRenderingContext2D, drawVisuals: number[]) {
		const analyser = inst.analyzerNode
		analyser.fftSize = 2048
		const bufferLength = analyser.fftSize
		const dataArray = new Uint8Array(bufferLength)

		const canvasWidth = canvas.nativeElement.width
		const canvasHeight = canvas.nativeElement.height

		canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
		canvas.nativeElement.classList.remove('hide') //  class in styles.css

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

		this.canvases.forEach(canvas => {
			const canvasContext = this.tryGetCanvasContext(canvas)
			canvasContext?.clearRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height)

			canvas.nativeElement.classList.add('hide')
		})

		this.currentCanvasNr = 1
		this.canvasNrAscending = false
	}

	onSoundCloudClick() {

	}
}
