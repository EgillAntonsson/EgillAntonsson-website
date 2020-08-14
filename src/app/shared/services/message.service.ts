import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class MessageService {
	private subject = new Subject<IMessage>()

	sendMessage(messageType: MessageType) {
			this.subject.next({ messageType: messageType })
	}

	onMessage(): Observable<IMessage> {
			return this.subject.asObservable()
	}
}

export const enum MessageType {
	Play = 'Play'
}

export interface IMessage {
	messageType: MessageType
}
