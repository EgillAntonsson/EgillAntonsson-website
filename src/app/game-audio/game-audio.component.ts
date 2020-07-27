import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Options, ChangeContext } from 'ng5-slider'
import { SoundManagerService } from './soundManager.service'
import { SoundType } from '../../soundcommon/enum/soundType'
import { WindowRef } from '../window-ref.service'
import { globalMaxNrPlayingAtOncePerSound } from '../../soundcommon/soundUtil'
import { SoundInstance } from '../../soundcommon/interface/soundInstance'
import { ByTracks, Track } from '../interface/track'
import { LayeredMusicController } from '../../soundcommon/layeredMusicController'
import { EmitterEvent } from '../../soundcommon/enum/emitterEvent'
import { BooleanEmitter } from '../../soundcommon/emitter/booleanEmitter'

@Component({
	selector: 'app-game-audio',
	templateUrl: './game-audio.component.html',
	styleUrls: ['./game-audio.component.css']
})
export class GameAudioComponent implements OnDestroy, OnInit {

	private pathMusic = '../../assets/audio/music'
	public gainsDisabledForView = false
	private gainsDisabled: BooleanEmitter = new BooleanEmitter(false)
	public selectedLayeredMusic: LayeredMusicController
	private canvases: ElementRef<HTMLCanvasElement>[]
	private drawVisuals = []
	private enableGains: (value: boolean) => void
	private votFeudTimeout: NodeJS.Timeout
	musicGain = 1
	musicMuted = false
	sfxGain = 1
	sfxMuted = false
	masterGain = 1
	masterMuted = false
	highMaxNrPlaying = globalMaxNrPlayingAtOncePerSound
	mediumMaxNrPlaying = 16
	lowMaxNrPlaying = 8

	value = 0
	highValue = 1
	range = this.highValue - this.value

	@ViewChild('canvas0', { static: true })
	canvas0: ElementRef<HTMLCanvasElement>
	@ViewChild('canvas1', { static: true })
	canvas1: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas2', { static: true })
	canvas2: ElementRef<HTMLCanvasElement>

	@ViewChild('canvas3', { static: true })
	canvas3: ElementRef<HTMLCanvasElement>
	emptyTrack: Track = {name: 'select a track', soundDatas: [{key: 'key', url: 'url', soundType: SoundType.Music, maxGain: 1, loop: false}], play: null}
	selectedTrack: Track
	selectedByIndex = 0
	openedUiByIndex = 0
	byTracksArr: ByTracks[]
	optionsDR: Options = {
		floor: 0,
		ceil: 1,
		step: 0.1,
		minRange: 0.1,
		draggableRange: true,
		noSwitching: true,
		showTicks: true,
	}

	optionsMusicGain: Options = {
		floor: 0,
		ceil: 1,
		step: 0.01,
		showSelectionBar: true,
		getSelectionBarColor: this.sliderColors,
		getPointerColor: this.sliderColors
	}
	optionsSfxGain = Object.assign({}, this.optionsMusicGain)
	optionsMasterGain = Object.assign({}, this.optionsMusicGain)
	private sliderColors(value: number): string {
		if (value <= 0.2) { return '#394a00' }
		if (value <= 0.4) { return '#596a06' }
		if (value <= 0.6) { return '#798a0a' }
		if (value <= 0.8) { return '#99aa2a' }
		if (value <= 1) { return '#b9ca4a' }
	}
	private sliderColorsMuted(value: number): string {
		if (value <= 0.2) { return '#5d0800' }
		if (value <= 0.4) { return '#7d2800' }
		if (value <= 0.6) { return '#9d4800' }
		if (value <= 0.8) { return '#bd6800' }
		if (value <= 1) { return '#dd8800' }
	}
	private sliderColorsDisabled(_: number): string {
		return '#8B91A2'
	}
	private log: (msg?: any, ...optionalParams: any[]) => void

	ngOnInit(): void {
		this.canvases = [this.canvas0, this.canvas1, this.canvas2, this.canvas3]
	}

	constructor(private soundManager: SoundManagerService, private windowRef: WindowRef) {
		// this.log = (msg?: any, optionalParams?: any[]) => {
		// 		optionalParams ? console.log(msg, optionalParams) : console.log(msg)
		// }
		this.log = (msg?: any, optionalParams?: any[]) => {
					// do nothing when in production env.
			}

		this.enableGains = (value: boolean) => {
			// INFO: view html seems not to be able to dig into enableGains.value, thus gainsDisabledForView is needed
			this.gainsDisabledForView = value
			if (value) {
				this.optionsMusicGain = Object.assign({}, this.optionsMusicGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
				this.optionsSfxGain = Object.assign({}, this.optionsSfxGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
				this.optionsMasterGain = Object.assign({}, this.optionsMusicGain, {disabled: true, getSelectionBarColor: this.sliderColorsDisabled, getPointerColor: this.sliderColorsDisabled})
				this.optionsDR = Object.assign({}, this.optionsDR, {disabled: true})
			} else {
				this.optionsMusicGain = Object.assign({}, this.optionsMusicGain, {disabled: false, getSelectionBarColor: this.musicMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.musicMuted ? this.sliderColorsMuted : this.sliderColors})
			this.optionsSfxGain = Object.assign({}, this.optionsSfxGain, {disabled: false, getSelectionBarColor: this.sfxMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.sfxMuted ? this.sliderColorsMuted : this.sliderColors})
			this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, {disabled: false, getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
			this.optionsDR = Object.assign({}, this.optionsDR, {disabled: false})
			}
		}
		this.gainsDisabled.on(EmitterEvent.Change, this.enableGains)

		soundManager.instance.init(windowRef.nativeWindow, this.musicGain, this.musicMuted, this.sfxGain, this.sfxMuted, this.masterGain, this.masterMuted, this.highMaxNrPlaying, this.log)
		soundManager.instance.setDynamicRange(this.value, this.highValue)

		this.selectedTrack = this.emptyTrack
		this.setupTracks()
	}

	setupTracks() {

const hhiaugl = {name: 'Song for commercial', soundDatas: [
{url: `${this.pathMusic}/hhiaugl.flac`, key: 'hhiaugl', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
	this.visualize(this.soundManager.instance.getSound(track.soundDatas[0].key).play(), this.canvas0, this.drawVisuals)
}}

const godsruleLayered = {name: 'Godsrule: Village', soundDatas: [
{url: `${this.pathMusic}/loton_MusicVillageEnvironmentLayer.flac`, key: 'godsruleEnvironmentLayer', soundType: SoundType.Music, maxGain: 0.075, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillageStringLayer.flac`, key: 'godsruleStringLayer', soundType: SoundType.Music, maxGain: 0.55, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillageHarpLayer.flac`, key: 'godsruleHarpLayer', soundType: SoundType.Music, maxGain: 0.4, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillagePianoLayer.flac`, key: 'godsrulePianoLayer', soundType: SoundType.Music, maxGain: 0.35, loop: true, maxNrPlayingAtOnce: 1}
],
play: (track) => {
if (!track.layeredMusicController) {
	const sounds = [
		this.soundManager.instance.getSound(track.soundDatas[0].key),
		this.soundManager.instance.getSound(track.soundDatas[1].key),
		this.soundManager.instance.getSound(track.soundDatas[2].key),
		this.soundManager.instance.getSound(track.soundDatas[3].key)
	]
	track.layeredMusicController = new LayeredMusicController(sounds, this.gainsDisabled, 3, this.log)
}
track.layeredMusicController.play((instances: SoundInstance[]) => {
	for (let i = 0; i < instances.length; i++) {
		this.visualize(instances[i], this.canvases[i], this.drawVisuals)
	}
})
}}

const votLayered = {name: 'Vikings of Thule: Map', soundDatas: [
{url: `${this.pathMusic}/VOT_InterfaceMusic_0.mp3`, key: 'votWindLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_InterfaceMusic_3.flac`, key: 'votChoirLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_InterfaceMusic_2.flac`, key: 'votHarpLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_InterfaceMusic_1.flac`, key: 'votMelodyLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1}
],
play: (track) => {
if (!track.layeredMusicController) {
	const sounds = [
		this.soundManager.instance.getSound(track.soundDatas[0].key),
		this.soundManager.instance.getSound(track.soundDatas[1].key),
		this.soundManager.instance.getSound(track.soundDatas[2].key),
		this.soundManager.instance.getSound(track.soundDatas[3].key)
	]
	track.layeredMusicController = new LayeredMusicController(sounds, this.gainsDisabled, 3, this.log)
}
track.layeredMusicController.play((instances: SoundInstance[]) => {
	for (let i = 0; i < instances.length; i++) {
		this.visualize(instances[i], this.canvases[i], this.drawVisuals)
	}
})
}}

const cpp = {name: 'Cake Pop Party', soundDatas: [
{url: `${this.pathMusic}/CPP_workMusicIntroScreen.flac`, key: 'cppMusicIntro', soundType: SoundType.Music, maxGain: 0.7, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/CPP_musicTransitionBeatFade.flac`, key: 'cppMusicScaleBeat', soundType: SoundType.Music, maxGain: 0.6, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/CPP_workMusicMakePopLoop.flac`, key: 'cppMusicMakePop', soundType: SoundType.Music, maxGain: 0.7, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const intro = this.soundManager.instance.getSound(track.soundDatas[0].key)
const scaleBeat = this.soundManager.instance.getSound(track.soundDatas[1].key)
const makePop = this.soundManager.instance.getSound(track.soundDatas[2].key)
this.visualize(intro.play(() => {
	this.clearVisuals()
	this.visualize(intro.play(() => {
		this.clearVisuals()
		this.visualize(scaleBeat.play(() => {
			this.clearVisuals()
			this.visualize(makePop.play(() => {
				this.clearVisuals()
				this.visualize(intro.play(), this.canvas0, this.drawVisuals)
			}), this.canvas3, this.drawVisuals)
		}), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}

const ssix = {name: 'Symbol 6', soundDatas: [
{url: `${this.pathMusic}/SSIX_menu.flac`, key: 'ssixMenu', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SSIX_game.flac`, key: 'ssixGame', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SSIX_HexagoTune.flac`, key: 'ssixHexago', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const menu = this.soundManager.instance.getSound(track.soundDatas[0].key)
const game = this.soundManager.instance.getSound(track.soundDatas[1].key)
const hexago = this.soundManager.instance.getSound(track.soundDatas[2].key)
this.visualize(menu.play(() => {
	this.clearVisuals()
	this.visualize(game.play(() => {
		this.clearVisuals()
		this.visualize(hexago.play(() => {
			this.clearVisuals()
			this.visualize(menu.play(), this.canvas3, this.drawVisuals)
		}), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}

const sff = {name: 'Soft Freak Fiesta', soundDatas: [
{url: `${this.pathMusic}/SFF_IntroMenuMusic.flac`, key: 'sffIntroMenuMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_MenuMusic.flac`, key: 'sffMenuMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LevelMusic_noEnv.flac`, key: 'sffLevelMusicNoEnv', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LevelMusic_bubbling.flac`, key: 'sffLevelMusicBubbling', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LoseJingle.flac`, key: 'sffLoseJingle', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_WinJingle.flac`, key: 'sffWinJingle', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const introMenu = this.soundManager.instance.getSound(track.soundDatas[0].key)
const mainMenu = this.soundManager.instance.getSound(track.soundDatas[1].key)
const levelNoEnv = this.soundManager.instance.getSound(track.soundDatas[2].key)
const levelBubbling = this.soundManager.instance.getSound(track.soundDatas[3].key)
const loseJingle = this.soundManager.instance.getSound(track.soundDatas[4].key)
const winJingle = this.soundManager.instance.getSound(track.soundDatas[5].key)
let playLose = true
this.visualize(introMenu.play(() => {
	this.clearVisuals()
	this.visualize(mainMenu.play(() => {
		this.clearVisuals()
		this.visualize(levelNoEnv.play(() => {
			this.clearVisuals()
			this.visualize(levelBubbling.play(() => {
				this.clearVisuals()
				const endCb = () => {
					this.clearVisuals()
					this.visualize(mainMenu.play(), this.canvas0, this.drawVisuals)
				}
				if (playLose) {
					this.visualize(loseJingle.play(endCb), this.canvas1, this.drawVisuals)
				} else {
					this.visualize(winJingle.play(endCb), this.canvas1, this.drawVisuals)
				}
				playLose = !playLose
			}), this.canvas3, this.drawVisuals)
		}), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}

const habitarium = {name: 'Habitarium', soundDatas: [
{url: `${this.pathMusic}/Habitarium_main_theme.flac`, key: 'habitariumMainTheme', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/Habitarium_InGameLoop.flac`, key: 'habitariumInGameLoop', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const main = this.soundManager.instance.getSound(track.soundDatas[0].key)
const inGame = this.soundManager.instance.getSound(track.soundDatas[1].key)
this.visualize(main.play(() => {
	this.clearVisuals()
	this.visualize(inGame.play(() => {
		this.clearVisuals()
		this.visualize(main.play(), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}

const tp = {name: 'Tiny Places', soundDatas: [
{url: `${this.pathMusic}/TP_mainThemeIntro.flac`, key: 'tpMainThemeIntro', soundType: SoundType.Music, maxGain: 0.65, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_mainThemeBridge.flac`, key: 'tpMainThemeBridge', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_spaceWorld.flac`, key: 'tpSpaceWorld', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_tomb.flac`, key: 'tpTomb', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_lazyStyle.flac`, key: 'tpLazyStyle', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_cutScene.flac`, key: 'tpCutScene', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_inGame.flac`, key: 'tpInGame', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_outoftime.flac`, key: 'tpOutOfTime', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const intro = this.soundManager.instance.getSound(track.soundDatas[0].key)
const bridge = this.soundManager.instance.getSound(track.soundDatas[1].key)
const space = this.soundManager.instance.getSound(track.soundDatas[2].key)
const tomb = this.soundManager.instance.getSound(track.soundDatas[3].key)
const lazy = this.soundManager.instance.getSound(track.soundDatas[4].key)
const cut = this.soundManager.instance.getSound(track.soundDatas[5].key)
const inGame = this.soundManager.instance.getSound(track.soundDatas[6].key)
const time = this.soundManager.instance.getSound(track.soundDatas[7].key)
const introInst = intro.play(() => {
	this.clearVisuals()
	this.visualize(bridge.play(() => {
		this.clearVisuals()
		this.visualize(space.play(() => {
			this.clearVisuals()
			this.visualize(space.play(() => {
				this.clearVisuals()
				this.visualize(tomb.play(() => {
					this.clearVisuals()
					this.visualize(tomb.play(() => {
						this.clearVisuals()
						this.visualize(lazy.play(() => {
							this.clearVisuals()
							this.visualize(lazy.play(() => {
								this.clearVisuals()
								this.visualize(cut.play(() => {
									this.clearVisuals()
									this.visualize(inGame.play(() => {
										this.clearVisuals()
										this.visualize(time.play(() => {
											this.stopMusic()
										}), this.canvas0, this.drawVisuals)
									}), this.canvas3, this.drawVisuals)
								}), this.canvas2, this.drawVisuals)
							}), this.canvas1, this.drawVisuals)
						}), this.canvas0, this.drawVisuals)
					}), this.canvas1, this.drawVisuals)
				}), this.canvas2, this.drawVisuals)
			}), this.canvas3, this.drawVisuals)
		}), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
})
introInst.gainWrapper.value = 0.01
introInst.gainWrapper.linearRampToValueAtTime(1, introInst.audioCtx.currentTime + 0.25)
this.visualize(introInst, this.canvas0, this.drawVisuals)
}}

const jol2008 = {name: 'Christmas Game 2008', soundDatas: [
{url: `${this.pathMusic}/jolagogo2008_main_music.flac`, key: 'jol2008mainMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/jolagogo2008_game_over.flac`, key: 'jol2008gameOver', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const main = this.soundManager.instance.getSound(track.soundDatas[0].key)
const gameOver = this.soundManager.instance.getSound(track.soundDatas[1].key)
this.visualize(main.play(() => {
	this.clearVisuals()
	this.visualize(main.play(() => {
		this.clearVisuals()
		this.visualize(gameOver.play(() => {
			this.clearVisuals()
		}), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}

const jol2009 = {name: 'Christmas Game 2009', soundDatas: [
{url: `${this.pathMusic}/jolagogo2009_Bridge.flac`, key: 'jol2009bridge', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/jolagogo2009_Chorus.flac`, key: 'jol2009chorus', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const bridge = this.soundManager.instance.getSound(track.soundDatas[0].key)
const chorus = this.soundManager.instance.getSound(track.soundDatas[1].key)
const bridgeInst = bridge.play(() => {
	this.clearVisuals()
	const chorusInst = chorus.play(() => {
		this.stopMusic()
	})
	this.visualize(chorusInst, this.canvas1, this.drawVisuals)
	chorusInst.gainWrapper.setTargetAtTime(0.01, chorus.audioCtx.currentTime + chorusInst.source.buffer.duration - 1.25, 1)
})
this.visualize(bridgeInst, this.canvas0, this.drawVisuals)
const curTime = bridge.audioCtx.currentTime
bridgeInst.gainWrapper.setValueAtTime(0.1, curTime).exponentialRampToValueAtTime(1, curTime + 0.25)
}}

const wyf = {name: 'Who\'s Your Friend', soundDatas: [
{url: `${this.pathMusic}/WYF_ThemeSong.flac`, key: 'wyf', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
this.visualize(this.soundManager.instance.getSound(track.soundDatas[0].key).play(), this.canvas0, this.drawVisuals)
}}

const kyf = {name: 'Know Your Friend', soundDatas: [
{url: `${this.pathMusic}/KYF_IntroMusic_WithAudience.flac`, key: 'kyfIntroMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/KYF_90secondsMusic.flac`, key: 'kyf90secMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const intro = this.soundManager.instance.getSound(track.soundDatas[0].key)
const seconds = this.soundManager.instance.getSound(track.soundDatas[1].key)
this.visualize(seconds.play(() => {
	this.clearVisuals()
	this.visualize(intro.play(() => {
		this.clearVisuals()
		this.visualize(intro.play(() => {
			this.stopMusic()
		}), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}

const stackem = {name: 'Stack\'em', soundDatas: [
{url: `${this.pathMusic}/Stackem_Tune_loop.flac`, key: 'stackem', soundType: SoundType.Music, maxGain: 0.9, loop: true}
],
play: (track) => {
this.visualize(this.soundManager.instance.getSound(track.soundDatas[0].key).play(), this.canvas0, this.drawVisuals)
}}

const glow = {name: 'Glowbulleville', soundDatas: [
{url: `${this.pathMusic}/GLOB_main_music.mp3`, key: 'glowMainMusic', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/GLOB_village_music.mp3`, key: 'glowVillageMusic', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/GLOB_wack_a_mole.mp3`, key: 'glowWack', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const main = this.soundManager.instance.getSound(track.soundDatas[0].key)
const village = this.soundManager.instance.getSound(track.soundDatas[1].key)
const wack = this.soundManager.instance.getSound(track.soundDatas[2].key)
this.visualize(main.play(() => {
	this.clearVisuals()
	this.visualize(wack.play(() => {
		this.clearVisuals()
		this.visualize(village.play(() => {
			this.clearVisuals()
			this.visualize(village.play(() => {
				this.visualize(main.play(), this.canvas0, this.drawVisuals)
			}), this.canvas3, this.drawVisuals)
		}), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}

const godsrule = {name: 'Godsrule: Battle', soundDatas: [
{url: `${this.pathMusic}/LOTON_BattleBaseLayer.flac`, key: 'godsruleBattle', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/LOTON_CombatDefeatMusic.flac`, key: 'godsruleDefeat', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/LOTON_CombatVictory.flac`, key: 'godsruleVictory', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const battle = this.soundManager.instance.getSound(track.soundDatas[0].key)
const defeat = this.soundManager.instance.getSound(track.soundDatas[1].key)
const victory = this.soundManager.instance.getSound(track.soundDatas[2].key)
this.visualize(battle.play(() => {
	this.clearVisuals()
	this.visualize(defeat.play(() => {
		this.clearVisuals()
		this.visualize(victory.play(() => {
			this.clearVisuals()
			this.visualize(battle.play(), this.canvas0, this.drawVisuals)
		}), this.canvas2, this.drawVisuals)
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}

const vot = {name: 'Vikings of Thule: Feud', soundDatas: [
{url: `${this.pathMusic}/VOT_FeudMusic_drums.flac`, key: 'votFeudDrums', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_FeudMusic.flac`, key: 'votFeud', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_FeudEnding.flac`, key: 'votFeudEnding', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
	const feudDrums = this.soundManager.instance.getSound(track.soundDatas[0].key)
	const feud = this.soundManager.instance.getSound(track.soundDatas[1].key)
	const feudEnding = this.soundManager.instance.getSound(track.soundDatas[2].key)
	this.visualize(feudDrums.play(() => {
		this.clearVisuals()
		this.visualize(feud.play(() => {
			const feudInst = feud.play(() => {
				this.clearVisuals()
			})
			this.visualize(feudInst, this.canvas2, this.drawVisuals)
			this.votFeudTimeout = setTimeout(() => {
				feudInst.gainWrapper.linearRampToValueAtTime(0, feudInst.audioCtx.currentTime + 0.2)
				this.visualize(feudEnding.play(() => {
					this.stopMusic()
				}), this.canvas3, this.drawVisuals)
			}, (feudInst.source.buffer.duration * 1000) - 799)
		}), this.canvas1, this.drawVisuals)
	}), this.canvas0, this.drawVisuals)
}}

const crisis = {name: 'The Crisis Game', soundDatas: [
{url: `${this.pathMusic}/Krepp_Byrjun.flac`, key: 'crisisBegin', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/Krepp_Endir.flac`, key: 'crisisEnd', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1}
],
play: (track) => {
const begin = this.soundManager.instance.getSound(track.soundDatas[0].key)
const end = this.soundManager.instance.getSound(track.soundDatas[1].key)
this.visualize(begin.play(() => {
	this.clearVisuals()
	this.visualize(end.play(() => {
		this.clearVisuals()
	}), this.canvas1, this.drawVisuals)
}), this.canvas0, this.drawVisuals)
}}


		this.byTracksArr = [
			{by: 'Music', tracks: [
				hhiaugl
			]},
			{by: 'Game Music - Layered', tracks: [
				godsruleLayered,
				votLayered
			]},
			{by: 'Game Music', tracks: [
				cpp,
				ssix,
				sff,
				habitarium,
				tp,
				jol2008,
				jol2009,
				wyf,
				kyf,
				stackem,
				glow,
				godsrule,
				vot,
				crisis
			]}
		]
	}

	onTrackClick(track: Track) {
		this.selectedByIndex = this.openedUiByIndex

		this.stopMusic()
		this.selectedTrack = track


		if (!this.soundManager.instance.hasSound(track.soundDatas[0].key)) {
			for (let i = 0; i < track.soundDatas.length; i++) {
				this.soundManager.instance.addSound(track.soundDatas[i])
			}
		}
		track.play(track)

		if (track.layeredMusicController) {
			this.selectedLayeredMusic = track.layeredMusicController
		}
	}

	onByClick(byIndex: number) {
		if (this.openedUiByIndex === byIndex) {
			// deselect
			this.openedUiByIndex = -1
		} else {
			this.openedUiByIndex = byIndex
		}
	}

	onMaxNrPlayingChange(value: number) {
		this.soundManager.instance.maxNrPlayingAtOncePerSound =  value
	}

	onMusicGainChange(changeCxt: ChangeContext) {
		this.soundManager.instance.musicGain = changeCxt.value
	}

	onMusicMuteChange() {
		if (this.gainsDisabled.value) { return }
		this.soundManager.instance.musicMuted = this.musicMuted = !this.musicMuted
		this.optionsMusicGain = Object.assign({}, this.optionsMusicGain, { getSelectionBarColor: this.musicMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.musicMuted ? this.sliderColorsMuted : this.sliderColors})
	}

	onSfxGainChange(changeCxt: ChangeContext) {
		this.soundManager.instance.sfxGain = this.sfxGain = changeCxt.value
	}

	onSfxMuteChange() {
		if (this.gainsDisabled.value) { return }
		this.soundManager.instance.sfxMuted = this.sfxMuted = !this.sfxMuted
		this.optionsSfxGain = Object.assign({}, this.optionsSfxGain, { getSelectionBarColor: this.sfxMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.sfxMuted ? this.sliderColorsMuted : this.sliderColors})
	}

	onMasterGainChange(changeCxt: ChangeContext) {
		this.soundManager.instance.masterGain = this.masterGain = changeCxt.value
	}

	onMasterMuteChange() {
		if (this.gainsDisabled.value) { return }
		this.soundManager.instance.masterMuted = this.masterMuted = !this.masterMuted
		this.optionsMasterGain = Object.assign({}, this.optionsMasterGain, { getSelectionBarColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors, getPointerColor: this.masterMuted ? this.sliderColorsMuted : this.sliderColors})
	}

	dynamicRangeChange(changeCxt: ChangeContext) {
		this.soundManager.instance.setDynamicRange(changeCxt.value, changeCxt.highValue)
	}

	public stopMusic() {
		this.soundManager.instance.stopMusic()

		if (this.gainsDisabled.value) {
			this.gainsDisabled.value = false
			this.gainsDisabled.emit(EmitterEvent.Change, false)
		}
		clearInterval(this.votFeudTimeout)
		this.selectedTrack = this.emptyTrack
		if (this.selectedLayeredMusic) {
			this.selectedLayeredMusic.stop()
			this.selectedLayeredMusic = null
		}
		this.clearVisuals()
	}
	get layerText(): string {
		if (this.selectedLayeredMusic && this.selectedLayeredMusic.layerSoundInstances) {
			const layers = this.selectedLayeredMusic.layerSoundInstances
			if (layers[layers.length - 1].gainWrapper.instanceMuted) {
				return 'add layer'
			}
		}
		return 'keep layer'
	}

	incrementMusicLayerValue() {
		this.selectedLayeredMusic.incrementLayerValue()
	}

	visualize(inst: SoundInstance, canvas: ElementRef<HTMLCanvasElement>, drawVisuals: number[]) {
		const canvasCtx = canvas.nativeElement.getContext('2d')
		const analyser = inst.analyzerNode
		analyser.fftSize = 2048
		const bufferLength = analyser.fftSize
		const dataArray = new Uint8Array(bufferLength)

		const WIDTH = canvas.nativeElement.width
		const HEIGHT = canvas.nativeElement.height

		canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

		const draw = () => {
			drawVisuals.push(requestAnimationFrame(draw))

			analyser.getByteTimeDomainData(dataArray)

			canvasCtx.fillStyle = '#111' // styles.css colorDarkDark
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

			canvasCtx.lineWidth = 3
			canvasCtx.strokeStyle = '#b9ca4a' // styles.css colorActive

			canvasCtx.beginPath()

			const sliceWidth = WIDTH * 1.0 / bufferLength
			let x = 0

			for (let i = 0; i < bufferLength; i++) {

				const v = dataArray[i] / 128.0
				const y = v * HEIGHT / 2

				if (i === 0) {
					canvasCtx.moveTo(x, y)
				} else {
					canvasCtx.lineTo(x, y)
				}

				x += sliceWidth
			}

			canvasCtx.lineTo(WIDTH, HEIGHT / 2)
			canvasCtx.stroke()
		}

		draw()
	}

	private clearVisuals() {
		this.drawVisuals.forEach(dv => {
			window.cancelAnimationFrame(dv)
		})
		this.drawVisuals = []
		this.canvases.forEach(canvas => {
			const canvasCtx = canvas.nativeElement.getContext('2d')
			canvasCtx.clearRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height)
		})
	}

	ngOnDestroy() {
		this.stopMusic()
	}
}
