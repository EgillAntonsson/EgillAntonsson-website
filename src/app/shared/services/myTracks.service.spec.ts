import { SoundManagerService } from './soundManager.service'
import { MyTracksService } from './myTracks.service'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { SoundManagerMock } from '../../../soundcommon/soundManager.mock'

describe('MyTrackService', () => {

	it('init', () => {

		const soundManager = new SoundManagerService()
		soundManager.injectMocksForTests(new SoundManagerMock())

		const myTracks = new MyTracksService(soundManager)

		const instancePlayedListeners = new Map<string, (soundInstance: SoundInstance) => void>()
		const instanceEndedListeners = new Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>()

		expect(myTracks.isInitialized).toBeFalse()
		myTracks.init(instancePlayedListeners, instanceEndedListeners)
		expect(myTracks.isInitialized).toBeTrue()
	})

})
