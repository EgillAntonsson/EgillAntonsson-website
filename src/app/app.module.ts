import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { Ng5SliderModule } from 'ng5-slider'

import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { ProgrammingComponent } from './programming/programming.component'
import { LiftingComponent } from './lifting/lifting.component'
import { PageNotFoundComponent } from './pagenotfound.component'
import { MusicPageComponent } from './music/musicPage.component'
import { MyNumberPipe } from './pipes/mynumber.pipe'
import { MinutesSecondsPipe } from './pipes/minutesSeconds.pipe'
import { MusicPlayerComponent } from './musicPlayer/musicPlayer.component'

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
		LiftingComponent,
		MusicPageComponent,
		MusicPlayerComponent,
		PageNotFoundComponent,
		MyNumberPipe,
		MinutesSecondsPipe,
	],
	bootstrap: [AppComponent]
})

export class AppModule {}
