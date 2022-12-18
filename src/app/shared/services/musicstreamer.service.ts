import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root',
})

export class MusicStreamer {

	widget: any

	// constructor(private logService: LogService) {
	// }

	initThirdPartyStreamer() {
		var SoundcloudWidget = require('soundcloud-widget')
		var iframe = 'scWidget' // can also pass in an iframe node()

		this.widget = new SoundcloudWidget(iframe)

		console.log("********** init *************")



		// widget = new SoundcloudWidget(iframe)
		// widget.on(SoundcloudWidget.events.PLAY, function () {
		// 	console.log("on Play on widget ***************")
		// 	widget.getVolume().then(function (volume: any) {
		// 		console.log("on volume", volume)
		// 	})
		// })
	}

	load(url: string) {
		console.log("********** url *************")
		console.log(url)
		this.widget.load(url).then(function () {
			console.log("********** sound loaded *************")
			// sound has been loaded
		})
	}

	play() {
		console.log("********** play via Soundcloud *************")
		this.widget.play()
	}

	pause() {
		console.log("********** pause via Soundcloud *************")
		this.widget.pause()
	}


}
