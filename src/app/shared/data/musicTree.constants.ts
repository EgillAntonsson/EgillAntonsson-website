export const MUSIC_ARTIST_NAME = {
	EgillAntonsson: 'Egill Antonsson',
	SindriAndEgill: 'Sindri and Egill',
	Kuai: 'KUAI',
	GameMusic: 'Game Music',
} as const

export type MusicArtistName = (typeof MUSIC_ARTIST_NAME)[keyof typeof MUSIC_ARTIST_NAME]

export const MUSIC_TRACK_ROOT_URL = {
	LeCube: 'le-cube',
	VikingsOfThuleThemeSong: 'vikings-of-thule-theme-song',
	HarmoniesOfShadeAndLight: 'harmonies-of-shade-and-light',
	GoneIsMyFriendJohnny: 'gone-is-my-friend-johnny',
	WeWillMeetAgain: 'we-will-meet-again',
	LaughingAndSmiling: 'laughing-and-smiling',
	Fortidin: 'fortidin',
	MagmaMerrygoround: 'magma-merrygoround',
	JustInTime: 'just-in-time',
	IcelandSocksIntro: 'iceland-socks-intro',
	OddTimesInSpace: 'odd-times-in-space',
	ToddlersTune: 'toddlers-tune',
	Glory: 'glory',
	TonisTimeMachine: 'tonis-time-machine',
	WinterQueen: 'winter-queen',
	KomaKoma: 'koma-koma',
	StrawberryCityLights: 'strawberry-city-lights',
	FreeYourMime: 'free-your-mime',
	Introduction: 'introduction',
	Routine: 'routine',
	SongForHhiCommercial: 'song-for-hhi-commercial',
	AndefniLive: 'andefni-live',
	PirringurLive: 'pirringur-live',
	Pirringur: 'pirringur',
	Apollo: 'apollo',
	Andsetinn: 'andsetinn',
	Hamskipti: 'hamskipti',
	Rover: 'rover',
	Andefni: 'andefni',
	Agndofa: 'agndofa',
	Ofurte: 'ofurte',
	LesblindaI: 'lesblinda-i',
	LesblindaIi: 'lesblinda-ii',
	GodsruleVillage: 'godsrule-village',
	VikingsOfThuleMap: 'vikings-of-thule-map',
} as const

export type MusicTrackRootUrl = (typeof MUSIC_TRACK_ROOT_URL)[keyof typeof MUSIC_TRACK_ROOT_URL]
