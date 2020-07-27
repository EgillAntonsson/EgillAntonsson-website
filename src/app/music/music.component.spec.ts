import { SoundCloudService, ScTrack } from './soundcloud.service'
import { MusicComponent } from './music.component'
import { ActivatedRoute, ActivatedRouteSnapshot, UrlSegment, Params, Route, Data, ParamMap } from '@angular/router'
import { Observable, of } from 'rxjs'
import { Type } from '@angular/core'

// TODO: Try to find a less verbose way to mock the Route classes
export class MockActivatedRoute implements ActivatedRoute {
	snapshot: MockActivatedRouteSnapshot
	url: Observable<UrlSegment[]>
	params: Observable<Params>
	queryParams: Observable<Params>
	fragment: Observable<string>
	data: Observable<Data>
	outlet: string
	component: Type<any> | string | null
	routeConfig: Route | null
	root: ActivatedRoute
	parent: ActivatedRoute | null
	firstChild: ActivatedRoute | null
	children: ActivatedRoute[]
	pathFromRoot: ActivatedRoute[]
	paramMap: Observable<ParamMap>
	queryParamMap: Observable<ParamMap>
}

export class MockActivatedRouteSnapshot implements ActivatedRouteSnapshot {
	routeConfig: Route | null
	url: UrlSegment[]
	params: Params
	queryParams: Params
	fragment: string
	data: Data
	outlet: string
	component: Type<any> | string | null
	root: ActivatedRouteSnapshot
	parent: ActivatedRouteSnapshot | null
	firstChild: ActivatedRouteSnapshot | null
	children: ActivatedRouteSnapshot[]
	pathFromRoot: ActivatedRouteSnapshot[]
	paramMap: MockParamMap
	queryParamMap: ParamMap
}

export class MockParamMap implements ParamMap {
	keys: string[]
	has(name: string) { return false}
	get(name: string) { return null }
	getAll(name: string) { return []}
}


describe('MusicComponent', () => {
	let nrOfPlayCalls: number
	let nrOfKillCalls: number
	let mockService: SoundCloudService
	let mockRoute: MockActivatedRoute
	let keyToCb

	beforeEach(() => {
		nrOfPlayCalls = 0
		nrOfKillCalls = 0
		keyToCb = {}
		const mockPlayer = {
			on: (key, cb) => {
				keyToCb[key] = cb
			},
			play: () => {
				nrOfPlayCalls++
			},
			pause: () => {

			},
			kill: () => {
				nrOfKillCalls++
			},
			isPlaying: () => false
		}

		const mockTrack: ScTrack = {description: 'mock Pirringur description', duration: 2000, artwork_url: '"https://i1.sndcdn.com/artworks-000397905813-v2hftr-large.jpg"', permalink_url: '', purchase_url: '', favoritings_count: 99}

		mockService = <SoundCloudService> {initialize: (obj) => {}, stream: (trackUrl: string, callback) => callback(mockPlayer), get: (trackUrl: string, callback) => callback(mockTrack) }

		mockRoute = new MockActivatedRoute()
		mockRoute.snapshot = new MockActivatedRouteSnapshot()
		mockRoute.snapshot.paramMap = new MockParamMap()
	})

	it('play track', () => {
		const comp = new MusicComponent(mockService, mockRoute)
		expect(comp.selectedByIndex).toEqual(0)
		expect(comp.selectedTrack.indexWithinBy).toEqual(0)
		expect(comp.isPlaying).toBeFalsy()
		comp.onPlayPause()
		expect(comp.isPlaying).toBeTruthy()
	})

	it('nav to url with route params and play track', () => {
		// url egill.rocks/music;by=4;track=0
		mockRoute.snapshot.paramMap.get = (name: string) => {
			if (name === 'by') {
				return '4'} else if ('track') {
					return '2'
				} else {
					return null
			}
		}
		const comp = new MusicComponent(mockService, mockRoute)
		expect(comp.selectedByIndex).toEqual(4)
		expect(comp.selectedTrack.indexWithinBy).toEqual(2)
		expect(comp.isPlaying).toBeFalsy()
		comp.onPlayPause()
		expect(comp.isPlaying).toBeTruthy()
	})

	it('"finish" should play next track in list, and after last song should start playing first track', () => {
		const comp = new MusicComponent(mockService, mockRoute)
		comp.onPlayPause()
		let nrTotal = 0
		for (let i = 0; i < comp.byTracksArr.length; i++) {
			expect(comp.selectedByIndex).toEqual(i)
			for (let index = 0; index < comp.byTracksArr[i].tracks.length; index++) {
				expect(comp.selectedTrack.indexWithinBy).toEqual(index)
				expect(nrOfPlayCalls).toEqual(1 + index + nrTotal)
				expect(nrOfKillCalls).toEqual(index + nrTotal)
				keyToCb['finish']()
			}
			nrTotal = nrTotal + comp.byTracksArr[i].tracks.length
		}
		// after last track should play first track
		expect(comp.selectedByIndex).toEqual(0)
		expect(comp.selectedTrack.indexWithinBy).toEqual(0)
		expect(nrOfPlayCalls).toEqual(nrTotal + 1)
		expect(nrOfKillCalls).toEqual(nrTotal)
	})
})
