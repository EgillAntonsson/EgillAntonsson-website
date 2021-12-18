import {CreatureLifted, LiftingService } from './lifting.service'
import { HttpClient } from '@angular/common/http'
import { LogService } from './log.service'

describe('LiftingService', () => {

	it('weightInCreatures, returns lifted creatures (heaviest first order) of same kg weight', () => {

		const httpClientSpy = jasmine.createSpyObj(HttpClient, ['http'])
		const logServiceSpy = jasmine.createSpyObj(LogService, ['log'])
		const service = new LiftingService(httpClientSpy, logServiceSpy)

		// INFO: testing against actual json data 'creatures.json',
		// as implementation uses 'require' and not sure how to mock away.
		// If json data changes much and breaks test, thenS find a way to mock to mock
		const testAssert = (sentInKg: number, expectedCreatureLifted: Array<CreatureLifted>) => {

			const ret = service.weightInCreatures(sentInKg)
			expect(expectedCreatureLifted).toEqual(ret)
		}

		let expCreatureLifted: Array<CreatureLifted> = [{count: 1, creature: {name: 'African hedgehog', kg: 0.5, url: undefined}}]
		testAssert(0.5, expCreatureLifted)

		expCreatureLifted = [
			{count: 1, creature: {name: 'Brown hyena', kg: 42, url: undefined}},
			{count: 1, creature: {name: 'Guinea pig', kg: 1, url: undefined}}
		]
		testAssert(43, expCreatureLifted)

		const goldDragonKg = 580600
		expCreatureLifted = [
			{count: 2, creature: {name: 'Gold dragon', kg: goldDragonKg, url: 'http://forgottenrealms.wikia.com/wiki/Gold_dragon'}},
		]
		testAssert(goldDragonKg * 2, expCreatureLifted)
	})
})
