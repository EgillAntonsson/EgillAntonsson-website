import { Injectable } from '@angular/core'
import { LogType } from 'shared/enums/logType'

@Injectable({ providedIn: 'root' })
export class LogService {

	logEnabled = false

	log(logType: LogType, message?: any, ...rest: any[]) {
		if (this.logEnabled) {
			// NOTE: currently only thinking of console.log
			switch (logType) {
				case LogType.Error:
					console.error(message, rest.join(' '))
					break

				case LogType.Warn:
					console.warn(message, rest.join(' '))
					break

				case LogType.Info:
					console.log(message, rest.join(' '))
			}
		}
	}
}
