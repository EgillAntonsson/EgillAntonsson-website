import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core'
import { MusicService } from 'app/shared/services/music.service'
import { BooleanEmitter } from 'soundcommon/emitter/booleanEmitter'
import { Options } from '@angular-slider/ngx-slider'
import { EmitterEvent } from 'soundcommon/enum/emitterEvent';
import { Subscription } from 'rxjs'
import { MessageService, MessageType } from 'app/shared/services/message.service'
import { Color } from 'app/shared/enums/color'
import { RealtimeVisualTrack, YoutubeTrack } from 'app/shared/data/track';
import { HtmlElementService } from 'app/shared/services/htmlElement.service';

@Component({
	selector: 'app-music-player',
	templateUrl: './musicPlayer.component.html',
	styleUrls: ['./musicPlayer.component.css']
})
export class MusicPlayerComponent implements AfterViewChecked, OnDestroy {
	readonly label = 'MusicPlayer'

	@ViewChild('youtubePlayer')
	youtubePlayerElement!: ElementRef
	@ViewChild('WebGLCanvas')
  WebGlCanvasElement!: ElementRef;

	get selectedTrack() {
		return this.musicService.selectedTrack
	}

	get selectedTrackAsYoutubeTrack() {
		return this.musicService.selectedTrack as YoutubeTrack
	}

	get selectedTrackAsRealtimeVisualTrack() {
		return this.musicService.selectedTrack as RealtimeVisualTrack
	}

	get playState() {
		return this.musicService.playState
	}

	get isShuffle() {
		return this.musicService.isShuffle
	}
	get masterGain() {
		return this.musicService.masterGain;
	}

	set masterGain(value: number) {
		this.musicService.masterGain = value
	}

	get masterMuted() {
		return this.musicService.masterMuted
	}

	private subscription: Subscription

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

	constructor(private musicService: MusicService, private messageService: MessageService, private changeDetectorRef: ChangeDetectorRef, private htmlElementService: HtmlElementService) {
		this.enableGains = (value: boolean) => {
			if (value) {
				this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
			} else {
			this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, {disabled: false, getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
			}
		}
		this._gainsDisabled.on(EmitterEvent.Change, this.enableGains)
		this.musicService.playerUiInitialized(this._gainsDisabled)

		this.subscription = this.messageService.onMessage().subscribe(message => {
			if (message.type === MessageType.YoutubeVolumeChange) {
				this.updateMuteUI()
			}
		})

		this.musicService.addPlayStateChangeListener(() => {
			this.changeDetectorRef.detectChanges()
		})
	}

	private ngInitiated = false

	ngAfterViewChecked(): void {
		if (!this.ngInitiated && this.htmlElementService.isInitialized) {
			this.ngInitiated = true
			console.log(this.WebGlCanvasElement);
			let offsetLeft = 0;
			if (this.WebGlCanvasElement.nativeElement.offsetLeft !== undefined) {
				offsetLeft = this.WebGlCanvasElement.nativeElement.offsetLeft;
			}
			this.musicService.init(this.youtubePlayerElement, window.innerWidth, window.innerHeight, offsetLeft)
		}
  }

  ngOnDestroy() {
		if (this.subscription instanceof Subscription) {
			this.subscription.unsubscribe();
		}
	}

	@HostListener('window:resize', ['$event'])
  onWindowResize() {
		let offsetLeft = 0;
			if (this.WebGlCanvasElement.nativeElement.offsetLeft !== undefined) {
				offsetLeft = this.WebGlCanvasElement.nativeElement.offsetLeft;
			}
		this.musicService.onWindowResize(window.innerWidth, window.innerHeight, offsetLeft)
  }

	onPlayerReady(player: YT.Player) {
		this.musicService.onYoutubePlayerReady(player, window.innerWidth, window.innerHeight)
  }

	onPlayerStateChange(event: any) {
		this.musicService.OnYoutubePlayerStateChange(event.data)
	}

	onPlayPauseBtn() {
		this.musicService.OnUiPlayOrPause()
	}

	onNextBtn() {
		this.musicService.onUiNextTrack()
	}

	onShuffleBtn() {
		this.musicService.toggleShuffle()
	}

	onMasterMuteBtn() {
		if (this._gainsDisabled.value) {
			return
		}
		this.musicService.masterMuted = !this.masterMuted
	}

	updateMuteUI() {
		this.optionsMasterGain = Object.assign({}, this.optionsMasterGain,
			{getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
	}
}
