export class SoundError extends Error {

	constructor(message?: string) {
		super(message)
		Object.setPrototypeOf(this, SoundError.prototype) // restore prototype chain
			this.name = SoundError.name // correct name in stack trace
	}
}
