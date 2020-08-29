import { MusicService } from 'app/shared/services/music.service'
import { TestBed, inject } from '@angular/core/testing'
import { SoundManagerService } from './soundManager.service'
import { WindowRefService } from './windowRef.service'
import { LogService } from './log.service'
import { RandomNumberService, IRandomNumber } from './randomNumber.service'

describe('MusicService', () => {

	beforeEach(() => {
		// TestBed.configureTestingModule({
		// 	providers: [MusicService, SoundManagerService, WindowRefService, LogService, RandomNumberService]
		// })
	})

	// it('should be initialized', inject([MusicService], (musicService: MusicService) => {
	// 	expect(musicService).toBeTruthy()
	// }))

	it('random', () => {

	// 	const returnsGetRandomNumber = [0, 1, 2, 3]
	// 	let returnsIndex = 0
	// 	const mockRandomNumber: IRandomNumber = {
	// 		getRandomNumber: (highest: number) => {
	// 	console.log('in R N mock func')
	// 	return returnsGetRandomNumber[returnsIndex++]
	// 	},
	// 	get

	// }

		const music = new MusicService(new SoundManagerService(), new WindowRefService(), new LogService(), new RandomNumberService)

		console.log('in music.service.spec')
		expect(music).toBeTruthy()
		// expect(mockRandomNumber.getRandomNumber(0)).toBe(0)
		// expect(mockRandomNumber.getRandomNumber(0)).toBe(1)
	})

})
