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
import { PageNotFoundComponent } from './pagenotfound.component'
import { MusicPageComponent } from './musicPage/musicPage.component'
import { MyNumberPipe } from './pipes/mynumber.pipe'
import { MinutesSecondsPipe } from './pipes/minutesSeconds.pipe'
import { MusicPlayerComponent } from './musicPlayer/musicPlayer.component'
import { NgxYoutubePlayerModule } from 'ngx-youtube-player'
import { RandomNumber, RandomNumberService } from './shared/services/randomNumber.service'
import { PostTdd1Component } from './blog/posts/tdd/postTdd1.component'
import { PostTdd2Component } from './blog/posts/tdd/postTdd2.component'
import { PostTdd3Component } from './blog/posts/tdd/postTdd3.component'
import { PostTdd3CppComponent } from './blog/posts/tdd/postTdd3Cpp.component'
import { PostTdd4Component } from './blog/posts/tdd/postTdd4.component'
import { PostTdd5Component } from './blog/posts/tdd/postTdd5.component'
import { PostTdd6Component } from './blog/posts/tdd/postTdd6.component'
import { PostTdd7Component } from './blog/posts/tdd/postTdd7.component'
import { PostTdd8Component } from './blog/posts/tdd/postTdd8.component'
import { PostChess1Component } from './blog/posts/chess/postChess1.component'
import { KgToCreatureComponent } from './blog/posts/lifting/kgToCreature.component'
import { BlogContentDisplayComponent } from './contentDisplay/blogContentDisplay.component'


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
		MusicPageComponent,
		MusicPlayerComponent,
		PageNotFoundComponent,
		MyNumberPipe,
		MinutesSecondsPipe,
		PostTdd1Component,
		PostTdd2Component,
		PostTdd3Component,
		PostTdd3CppComponent,
		PostTdd4Component,
		PostTdd5Component,
		PostTdd6Component,
		PostTdd7Component,
		PostTdd8Component,
		PostChess1Component,
		KgToCreatureComponent,
		BlogContentDisplayComponent
	],
	bootstrap: [AppComponent],
	providers: [{
		provide: RandomNumber, useExisting: RandomNumberService,
	}, {
		provide: HIGHLIGHT_OPTIONS,
		useValue: {
			coreLibraryLoader: () => import('highlight.js/lib/core'),
			languages: {
				csharp: () => import('highlight.js/lib/languages/csharp'),
				cpp: () => import('highlight.js/lib/languages/cpp')
			}
		}
	}]
})

export class AppModule {}
