import { MusicService } from 'app/shared/services/music.service'
import { SoundManagerService } from './soundManager.service'
import { WindowRefService } from './windowRef.service'
import { LogService } from './log.service'
import { RandomNumberMock } from './randomNumber.service.spec'
import { MyTracksService } from './myTracks.service'

describe('MusicService', () => {

	it('TestMock', () => {

		const randomNumberMock = new RandomNumberMock()

		const sms = new SoundManagerService()
		const music = new MusicService(sms, new WindowRefService(), new MyTracksService(sms), randomNumberMock, new LogService())
		console.log(music.label)

		randomNumberMock.retGenerateRandomNumber = 99
		expect(randomNumberMock.generateRandomNumber(100)).toBe(randomNumberMock.retGenerateRandomNumber)
	})

})
