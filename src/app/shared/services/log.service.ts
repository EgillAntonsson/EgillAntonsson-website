import { Injectable } from '@angular/core'
import { LogType } from 'shared/enums/logType'

@Injectable({ providedIn: 'root' })
export class LogService {

	// Set to 'true' to enable logging while developing,
	// should always be set to 'false' for deployment.
	private static IS_ENABLED = true

	log(logType: LogType, msg?: any, ...rest: any[]) {
		if (LogService.IS_ENABLED) {
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
