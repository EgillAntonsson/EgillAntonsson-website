export class Log {
	static consoleLog = (logType: LogType, message?: any, ...restOfMessages: any[]) => {
		switch (logType) {
			// tslint:disable-next-line: no-use-before-declare
			case LogType.Error:
				console.error(message, restOfMessages.join(' '))
				break

			// tslint:disable-next-line: no-use-before-declare
			case LogType.Warn:
				console.warn(message, restOfMessages.join(' '))
				break

			// tslint:disable-next-line: no-use-before-declare
			case LogType.Info:
				console.log(message, restOfMessages.join(' '))
		}
	}
}

export const enum LogType {
	Info = 'Info',
	Warn = 'Warn',
	Error = 'Error'
}
