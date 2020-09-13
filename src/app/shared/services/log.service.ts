import { Injectable } from '@angular/core'
import { LogType } from 'shared/enums/logType'

@Injectable({ providedIn: 'root' })
export class LogService {

	static logEnabled = false

	log(logType: LogType, msg?: any, ...rest: any[]) {
		if (LogService.logEnabled) {
			// NOTE: currently only thinking of console.log
			switch (logType) {
				case LogType.Error:
					console.error(msg, rest.join(' '))
					break

				case LogType.Warn:
					console.warn(msg, rest.join(' '))
					break

				case LogType.Info:
					console.log(msg, rest.join(' '))
			}
		}
	}
}
