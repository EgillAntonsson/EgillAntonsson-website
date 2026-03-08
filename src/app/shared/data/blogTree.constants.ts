export const BLOG_SERIES_TITLE = {
	TddWhatHowWhyWhen: 'TDD: The What, How, Why and When',
	TddAvatarHealth: 'TDD-ing Avatar Health in C# and C++',
	TddChess: 'TDD-ing Chess in C#',
	ReaScripts: 'ReaScripts',
	FmodEditor: 'FMOD editor',
	UnityEditor: 'Unity editor',
	Lifting: 'Lift up and down',
} as const

export type BlogSeriesTitle = (typeof BLOG_SERIES_TITLE)[keyof typeof BLOG_SERIES_TITLE]
