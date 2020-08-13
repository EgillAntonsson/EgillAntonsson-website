import { Component, OnInit } from '@angular/core'
import { MusicService } from 'app/shared/services/music.service'

@Component({
	selector: 'app-music-player',
	templateUrl: './musicPlayer.component.html',
	styleUrls: ['./musicPlayer.component.css']
})
export class MusicPlayerComponent implements OnInit {

	get selectedTrack() {
		return this.musicService.selectedTrack
	}
	isPlaying = false

	ngOnInit(): void {
		console.log('music player ngInit')
	}

	constructor(private musicService: MusicService) {
	}

	onPlayStop() {
		if (this.musicService.awaitingFirstPlay) {
			// this.log(LogType.Info, 'onTrackClick, awaitingFirstPlay is true, returning without processing')
			return
		}

		this.musicService.stop()
		this.musicService.play(this.musicService.byTracksArr[0].tracks[0], null)


		this.isPlaying = !this.isPlaying


		// if (this.scPlayer != null) {
		// 	if (this.scPlayer.isPlaying()) {
		// 		this.scPlayer.pause()
		// 		this.isPlaying = false
		// 	} else {
		// 		this.scPlayer.play()
		// 		this.isPlaying = true
		// 	}
		// }
	}
}
