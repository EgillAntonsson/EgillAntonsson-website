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


	const mockRandomNumber: IRandomNumber = {getRandomNumber: (highest: number) => {
	console.log('in R N mock func')
	return 5
}}

		const music = new MusicService(new SoundManagerService(), new WindowRefService(), new LogService(), mockRandomNumber)

		console.log('bla bla')
		expect(music).toBeTruthy()
		expect(mockRandomNumber.getRandomNumber(5)).toBe(5)
	})

})
