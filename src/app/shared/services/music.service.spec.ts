import { MusicService } from 'app/shared/services/music.service'
import { SoundManagerService } from './soundManager.service'
import { WindowRefService } from './windowRef.service'
import { LogService } from './log.service'
import { RandomNumberMock } from './randomNumber.service.spec'

describe('MusicService', () => {

	it('TestMock', () => {

		const randomNumberMock = new RandomNumberMock()

		const music = new MusicService(new SoundManagerService(), new WindowRefService(), new LogService(), randomNumberMock)

		randomNumberMock.retGenerateRandomNumber = 99
		expect(randomNumberMock.generateRandomNumber(100)).toBe(randomNumberMock.retGenerateRandomNumber)
	})

})
