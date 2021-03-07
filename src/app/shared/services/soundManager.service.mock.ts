import { Injectable } from '@angular/core'
import { SoundManagerImp } from 'soundcommon/soundManager'
import { SoundManagerService } from './soundManager.service'

@Injectable({
	providedIn: 'root',
})
export class SoundManagerServiceMock implements SoundManagerService {
	public get instance(): SoundManagerImp {
		throw new Error('Method not implemented.')
	}
}
