import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { MatButtonToggleGroup, MatButtonToggle, MatRippleModule, MatButtonToggleModule } from '@angular/material'
import { Ng5SliderModule } from 'ng5-slider'

import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { ProgrammingComponent } from './programming/programming.component'
// import { MusicComponent } from './music/music.component'
import { LiftingComponent } from './lifting/lifting.component'
import { PageNotFoundComponent } from './pagenotfound.component'
import { GameAudioComponent } from './game-audio/game-audio.component'
import { MyNumberPipe } from './pipes/mynumber.pipe'
import { MinutesSecondsPipe } from './pipes/minutesSeconds.pipe'
import { WindowRef } from './window-ref.service'

@NgModule({
	imports: [
		AppRoutingModule,
		BrowserModule,
		HttpClientModule,
		MatRippleModule,
		Ng5SliderModule,
		MatButtonToggleModule
	],
	declarations: [
		AppComponent,
		HomeComponent,
		ProgrammingComponent,
		// MusicComponent,
		LiftingComponent,
		GameAudioComponent,
		PageNotFoundComponent,
		MyNumberPipe,
		MinutesSecondsPipe,
		// MatButtonToggleGroup,
		// MatButtonToggle
	],
	providers: [WindowRef],
	bootstrap: [AppComponent]
})

export class AppModule {}
