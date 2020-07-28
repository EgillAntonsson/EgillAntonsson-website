import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'

import {HomeComponent} from './home/home.component'
import {ProgrammingComponent} from './programming/programming.component'
// import {MusicComponent} from './music/music.component'
import {LiftingComponent} from './lifting/lifting.component'
import {GameAudioComponent} from './game-audio/game-audio.component'
import {PageNotFoundComponent} from './pagenotfound.component'

const routes: Routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{path: 'home',  component: HomeComponent},
	{path: 'code',  component: ProgrammingComponent},
	// {path: 'music', component: MusicComponent},
	{path: 'lifting', component: LiftingComponent},
	{path: 'music', component: GameAudioComponent},
	{path: '**', component: PageNotFoundComponent }
]

@NgModule({
	imports: [RouterModule.forRoot(routes,  { enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule {}