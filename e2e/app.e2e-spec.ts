import { EgillAntonssonWebsitePage } from './app.po'

describe('egill-antonsson-website App', () => {
	let page: EgillAntonssonWebsitePage

	beforeEach(() => {
		page = new EgillAntonssonWebsitePage()
	})

	it('should display welcome message', () => {
		page.navigateTo()
		expect(page.getParagraphText()).toEqual('Egill Antonsson')
	})
})
