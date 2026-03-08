import { Component, OnDestroy, ElementRef, ViewChild, OnInit } from '@angular/core'
import { globalMaxNrPlayingAtOncePerSound } from '../../soundcommon/soundUtil'
import { SoundInstance } from '../../soundcommon/interface/soundInstance'
import { Artist, LayeredMusicTrack, Track, YoutubeTrack } from '../shared/data/track'
import { MusicService } from '../shared/services/music.service'
import { LogService } from '../shared/services/log.service'
import { LogType } from '../shared/enums/logType'
import { PlayState } from 'app/shared/enums/playState'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Location } from '@angular/common'
import { LocationStrategy, PathLocationStrategy } from '@angular/common'
import { TreeNavigationNode } from 'app/shared/data/treeNavigationNode'
import { MUSIC_ARTIST_NAME, MusicArtistName, MUSIC_TRACK_ROOT_URL, MusicTrackRootUrl } from 'app/shared/data/musicTree.constants'

interface MusicTreeBranchConfig {
	label: string
	children?: MusicTreeBranchConfig[]
	trackRootUrls?: MusicTrackRootUrl[]
}

@Component({
	selector: 'app-music-page',
	templateUrl: './musicPage.component.html',
	styleUrls: ['./musicPage.component.css'],
	providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class MusicPageComponent implements OnInit, OnDestroy {
	private readonly label = 'MusicPage'
	private drawVisuals: number[] = []
	private _treeNodes?: TreeNavigationNode<Track>[]
	private playedListenerName = `${this.label} playedListener`
	private endedListenerName = `${this.label} endedListener`
	private canvases!: ElementRef<HTMLCanvasElement>[]
	private currentCanvasNr = 0
	private canvasNrAscending = false

	musicGain = 1
	musicMuted = false
	sfxGain = 1
	sfxMuted = false
	highMaxNrPlaying = globalMaxNrPlayingAtOncePerSound
	mediumMaxNrPlaying = 16
	lowMaxNrPlaying = 8
	value = 0
	highValue = 1
	range = this.highValue - this.value

	// Optional per-artist grouping config for deep trees. Any unlisted tracks are appended under the artist.
	private readonly egillBranches: MusicTreeBranchConfig[] = [{
		label: 'Tracks with real-time visuals',
		trackRootUrls: [MUSIC_TRACK_ROOT_URL.LeCube],
	}, {
		label: 'Songs',
		trackRootUrls: [
			MUSIC_TRACK_ROOT_URL.VikingsOfThuleThemeSong,
			MUSIC_TRACK_ROOT_URL.HarmoniesOfShadeAndLight,
			MUSIC_TRACK_ROOT_URL.GoneIsMyFriendJohnny,
			MUSIC_TRACK_ROOT_URL.WeWillMeetAgain,
			MUSIC_TRACK_ROOT_URL.LaughingAndSmiling,
			MUSIC_TRACK_ROOT_URL.Fortidin,
		],
	}, {
		label: 'Tracks',
		trackRootUrls: [
			MUSIC_TRACK_ROOT_URL.MagmaMerrygoround,
			MUSIC_TRACK_ROOT_URL.JustInTime,
			MUSIC_TRACK_ROOT_URL.IcelandSocksIntro,
			MUSIC_TRACK_ROOT_URL.OddTimesInSpace,
			MUSIC_TRACK_ROOT_URL.ToddlersTune,
		],
	}, ]

	private readonly sindriAndEgillBranches: MusicTreeBranchConfig[] = [{
		label: 'Kanez Kane',
		trackRootUrls: [
			MUSIC_TRACK_ROOT_URL.Glory,
			MUSIC_TRACK_ROOT_URL.TonisTimeMachine,
			MUSIC_TRACK_ROOT_URL.WinterQueen,
			MUSIC_TRACK_ROOT_URL.KomaKoma,
			MUSIC_TRACK_ROOT_URL.StrawberryCityLights,
			MUSIC_TRACK_ROOT_URL.FreeYourMime,
		],
	}, {
		label: 'Tribe Of Oranges',
		trackRootUrls: [
			MUSIC_TRACK_ROOT_URL.Introduction,
			MUSIC_TRACK_ROOT_URL.Routine,
			MUSIC_TRACK_ROOT_URL.SongForHhiCommercial,
		],
	}, ]

	private readonly kuaiBranches: MusicTreeBranchConfig[] = [{
		label: 'Live in Laugardalshöll',
		trackRootUrls: [
			MUSIC_TRACK_ROOT_URL.AndefniLive,
			MUSIC_TRACK_ROOT_URL.PirringurLive,
		],
	}, {
		label: 'The album',
		trackRootUrls: [
			MUSIC_TRACK_ROOT_URL.Pirringur,
			MUSIC_TRACK_ROOT_URL.Apollo,
			MUSIC_TRACK_ROOT_URL.Andsetinn,
			MUSIC_TRACK_ROOT_URL.Hamskipti,
			MUSIC_TRACK_ROOT_URL.Rover,
			MUSIC_TRACK_ROOT_URL.Andefni,
			MUSIC_TRACK_ROOT_URL.Agndofa,
			MUSIC_TRACK_ROOT_URL.Ofurte,
			MUSIC_TRACK_ROOT_URL.LesblindaI,
			MUSIC_TRACK_ROOT_URL.LesblindaIi,
		],
	}, ]

	private readonly gameMusicBranches: MusicTreeBranchConfig[] = [{
		label: 'Layered tracks',
		trackRootUrls: [MUSIC_TRACK_ROOT_URL.GodsruleVillage, MUSIC_TRACK_ROOT_URL.VikingsOfThuleMap],
	},]

	private readonly nestedBranchesByArtist: Partial<Record<MusicArtistName, MusicTreeBranchConfig[]>> = {
		[MUSIC_ARTIST_NAME.EgillAntonsson]: this.egillBranches,
		[MUSIC_ARTIST_NAME.SindriAndEgill]: this.sindriAndEgillBranches,
		[MUSIC_ARTIST_NAME.Kuai]: this.kuaiBranches,
		[MUSIC_ARTIST_NAME.GameMusic]: this.gameMusicBranches,
	}

	@ViewChild('trackGraphicContainer')
	trackGraphicContainerElement!: ElementRef

	@ViewChild('canvas0', { static: true })
	canvas0!: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas1', { static: true })
	canvas1!: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas2', { static: true })
	canvas2!: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas3', { static: true })
	canvas3!: ElementRef<HTMLCanvasElement>

	@ViewChild('topLine', { static: true })
	topLine!: ElementRef<HTMLCanvasElement>

	get byTracks() {
		return this.musicService.byTracks
	}

	get selectedTrack() {
		return this.musicService.selectedTrack
	}

	get selectedTrackAsYoutubeTrack() {
		return this.musicService.selectedTrack as YoutubeTrack
	}

	get treeNodes(): TreeNavigationNode<Track>[] {
		if (!this._treeNodes) {
			this._treeNodes = this.byTracks.map((artist, artistIndex) => this.toArtistTreeNode(artist, artistIndex))
		}

		return this._treeNodes
	}

	get selectedTrackNodeId(): string {
		return this.getTrackNodeId(this.selectedTrack)
	}

	constructor(private musicService: MusicService, private logService: LogService, private route: ActivatedRoute, private location: Location) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params: ParamMap) => {
			const paramName = params.get('trackName')
			if (paramName !== null) {
				this.musicService.setSelectTrackByRootUrl(paramName)
			} else {
				this.replaceUrlState()
			}
		})

		this.musicService.addInstancePlayedListener(this.playedListenerName, (soundInstance) => {
			const canvas = this.getNextCanvas()
			const canvasContext = this.tryGetCanvasContext(canvas)
			if (canvasContext && soundInstance) {
				// this.topLine.nativeElement.classList.add('hide')
				this.visualize(soundInstance, canvas, canvasContext, this.drawVisuals)
			}
			this.replaceUrlState()
		})

		this.musicService.addInstanceEndedListener(this.endedListenerName, () => {
			// this.topLine.nativeElement.classList.remove('hide')
			this.clearVisuals()
		})

		this.canvases = [this.canvas0, this.canvas1, this.canvas2, this.canvas3]
	}

	private replaceUrlState() {
		this.location.replaceState(`${this.musicService.urlPathRoot}${this.selectedTrack.rootUrl}`)
	}

	ngOnDestroy() {
		this.musicService.removeInstancePlayedListener(this.playedListenerName)
		this.musicService.removeInstanceEndedListener(this.endedListenerName)
	}

	onTrackClick(track: Track) {
		if (this.musicService.playState === PlayState.Loading) {
			this.logService.log(LogType.Info, 'MusicPage onTrackClick: is loading, returning without processing')
			return
		}
		this.musicService.onUiTrackSelected(track)
	}

	onTreeNodeSelected(node: TreeNavigationNode<unknown>) {
		if (node.value) {
			this.onTrackClick(node.value as Track)
		}
	}

	get layerText(): string {
			if (this.musicService.selectedTrack instanceof LayeredMusicTrack && this.musicService.selectedTrack.layeredMusicController.layerSoundInstances) {
			const layers =  this.musicService.selectedTrack.layeredMusicController.layerSoundInstances
			if (layers[layers.length - 1].gainWrapper.instanceMuted) {
				return 'add layer'
			}
		}
		return 'keep layer'
	}

	private getNextCanvas():  ElementRef<HTMLCanvasElement> {
		if (this.currentCanvasNr === 0) {
			this.currentCanvasNr++
			this.canvasNrAscending = true
		} else if (this.currentCanvasNr === 3) {
			this.currentCanvasNr--
			this.canvasNrAscending = false
		} else {
			this.canvasNrAscending ? this.currentCanvasNr++ : this.currentCanvasNr--
		}

		return this.canvases[this.currentCanvasNr]
	}

	private tryGetCanvasContext(canvas: ElementRef<HTMLCanvasElement>) {
		const canvasContext = canvas.nativeElement.getContext('2d')
		if (!canvasContext) {
			this.logService.log(LogType.Error, '"canvasContext" was "null"')
		}
		return canvasContext
	}

	visualize(inst: SoundInstance, canvas:  ElementRef<HTMLCanvasElement>, canvasContext: CanvasRenderingContext2D, drawVisuals: number[]) {
		const analyser = inst.analyzerNode
		analyser.fftSize = 2048
		const bufferLength = analyser.fftSize
		const dataArray = new Uint8Array(bufferLength)

		const canvasWidth = canvas.nativeElement.width
		const canvasHeight = canvas.nativeElement.height

		canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
		canvas.nativeElement.classList.remove('hide') //  class in styles.css

		const draw = () => {
			drawVisuals.push(requestAnimationFrame(draw))
			analyser.getByteTimeDomainData(dataArray)
			canvasContext.fillStyle = '#111' // styles.css colorBackground
			canvasContext.fillRect(0, 0, canvasWidth, canvasHeight)
			canvasContext.lineWidth = 3
			canvasContext.strokeStyle = '#B9CA4A' // styles.css colorActive
			canvasContext.beginPath()
			const sliceWidth = canvasWidth * 1.0 / bufferLength
			let x = 0
			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0
				const y = v * canvasHeight / 2
				if (i === 0) {
					canvasContext.moveTo(x, y)
				} else {
					canvasContext.lineTo(x, y)
				}
				x += sliceWidth
			}
			canvasContext.lineTo(canvasWidth, canvasHeight / 2)
			canvasContext.stroke()
		}

		draw()
	}

	private clearVisuals() {
		this.drawVisuals.forEach(dv => {
			window.cancelAnimationFrame(dv)
		})
		this.drawVisuals = []
		this.canvases.forEach(canvas => {
			const canvasContext = this.tryGetCanvasContext(canvas)
			canvasContext?.clearRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height)
			canvas.nativeElement.classList.add('hide')
		})
		this.currentCanvasNr = 1
		this.canvasNrAscending = false
	}

	private toArtistTreeNode(artist: Artist, artistIndex: number): TreeNavigationNode<Track> {
		const configuredRootUrls = new Set<string>()
		const tracksByRootUrl = new Map<string, Track>(artist.tracks.map(track => [track.rootUrl, track]))
		const artistNodeId = `artist:${artistIndex}:${artist.name}`

		const configuredTreeNodes = this.toConfiguredBranchNodes(
			this.getBranchesForArtist(artist.name),
			tracksByRootUrl,
			configuredRootUrls,
			artistNodeId,
		)

		const unconfiguredTrackNodes = artist.tracks
			.filter(track => !configuredRootUrls.has(track.rootUrl))
			.map(track => this.toTrackTreeNode(track))

		return {
			id: artistNodeId,
			label: artist.name,
			children: [...configuredTreeNodes, ...unconfiguredTrackNodes],
		}
	}

	private toConfiguredBranchNodes(
		configs: MusicTreeBranchConfig[],
		tracksByRootUrl: Map<string, Track>,
		configuredRootUrls: Set<string>,
		parentNodeId: string,
	): TreeNavigationNode<Track>[] {
		return configs.map((config, branchIndex) => {
			const branchNodeId = `${parentNodeId}/branch:${branchIndex}:${config.label}`
			const childBranchNodes = this.toConfiguredBranchNodes(
				config.children || [],
				tracksByRootUrl,
				configuredRootUrls,
				branchNodeId,
			)

			const configuredTrackNodes = (config.trackRootUrls || [])
				.map(rootUrl => {
					const track = tracksByRootUrl.get(rootUrl)
					if (!track) {
						this.logService.log(LogType.Warn, `Track rootUrl "${rootUrl}" not found for branch "${config.label}"`)
						return undefined
					}

					configuredRootUrls.add(rootUrl)
					return this.toTrackTreeNode(track)
				})
				.filter((trackNode): trackNode is TreeNavigationNode<Track> => !!trackNode)

			return {
				id: branchNodeId,
				label: config.label,
				children: [...childBranchNodes, ...configuredTrackNodes],
			}
		})
	}

	private toTrackTreeNode(track: Track): TreeNavigationNode<Track> {
		return {
			id: this.getTrackNodeId(track),
			label: track.name,
			value: track,
			selectable: true,
		}
	}

	private getTrackNodeId(track: Track): string {
		return `track:${track.rootUrl}`
	}

	private getBranchesForArtist(artistName: string): MusicTreeBranchConfig[] {
		if (Object.values(MUSIC_ARTIST_NAME).includes(artistName as MusicArtistName)) {
			return this.nestedBranchesByArtist[artistName as MusicArtistName] || []
		}

		return []
	}
}
