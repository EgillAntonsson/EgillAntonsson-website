import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatRippleModule } from '@angular/material/core'
import { NgxSliderModule } from '@angular-slider/ngx-slider'
import { ReactiveFormsModule } from '@angular/forms'
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs'

import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { BlogComponent } from './blog/blog.component'
import { LiftingComponent } from './lifting/lifting.component'
import { PageNotFoundComponent } from './pagenotfound.component'
import { MusicPageComponent } from './musicPage/musicPage.component'
import { MyNumberPipe } from './pipes/mynumber.pipe'
import { MinutesSecondsPipe } from './pipes/minutesSeconds.pipe'
import { MusicPlayerComponent } from './musicPlayer/musicPlayer.component'
import { RandomNumber, RandomNumberService } from './shared/services/randomNumber.service'
import { PostTdd1Component } from './blog/posts/postTdd1.component'
import { PostTdd2Component } from './blog/posts/postTdd2.component'
import { PostTdd3Component } from './blog/posts/postTdd3.component'
import { PostTdd4Component } from './blog/posts/postTdd4.component'
import { PostTdd5Component } from './blog/posts/postTdd5.component'
import { PostTdd6Component } from './blog/posts/postTdd6.component'
import { PostTdd7Component } from './blog/posts/postTdd7.component'
import { PostTdd8Component } from './blog/posts/postTdd8.component'
import { PostTdd9Component } from './blog/posts/postTdd9.component'
import { NgxYoutubePlayerModule } from 'ngx-youtube-player'

@NgModule({
	imports: [
		AppRoutingModule,
		BrowserModule,
		HttpClientModule,
		MatRippleModule,
		NgxSliderModule,
		MatButtonToggleModule,
		ReactiveFormsModule,
		HighlightModule,
		NgxYoutubePlayerModule.forRoot()
	],
	declarations: [
		AppComponent,
		HomeComponent,
		BlogComponent,
		LiftingComponent,
		MusicPageComponent,
		MusicPlayerComponent,
		PageNotFoundComponent,
		MyNumberPipe,
		MinutesSecondsPipe,
		PostTdd1Component,
		PostTdd2Component,
		PostTdd3Component,
		PostTdd4Component,
		PostTdd5Component,
		PostTdd6Component,
		PostTdd7Component,
		PostTdd8Component,
		PostTdd9Component
	],
	bootstrap: [AppComponent],
	providers: [{
		provide: RandomNumber, useExisting: RandomNumberService,
	}, {
		provide: HIGHLIGHT_OPTIONS,
		useValue: {
			coreLibraryLoader: () => import('highlight.js/lib/core'),
			languages: {
				typescript: () => import('highlight.js/lib/languages/csharp')
			}
		}
	}]
})

export class AppModule {}
