import { SoundManagerService } from './soundManager.service'
import { MyTracksService } from './myTracks.service'
import { SoundManagerMock } from '../../../soundcommon/soundManager.mock'
import { LogService } from './log.service'

describe('MyTrackService', () => {

	it('init', () => {

		const soundManager = new SoundManagerService()
		soundManager.injectMocksForTests(new SoundManagerMock())

		const myTracks = new MyTracksService(soundManager, new LogService())

		expect(myTracks.isInitialized).toBeFalse()
		myTracks.init()
		expect(myTracks.isInitialized).toBeTrue()
	})

})
