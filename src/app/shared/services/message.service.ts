import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class MessageService {
	private subject = new Subject<IMessage>()

	sendMessage(message: IMessage) {
			this.subject.next(message)
	}

	onMessage(): Observable<IMessage> {
			return this.subject.asObservable()
	}
}

export const enum MessageType {
	Play = 'Play',
	Page = 'Page',
	YoutubeVolumeChange = 'YoutubeVolumeChange'
}

export interface IMessage {
	type: MessageType
	msg?: string
}
