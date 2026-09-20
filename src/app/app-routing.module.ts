import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import {HomeComponent} from './home/home.component'
import {BlogComponent} from './blog/blog.component'
import {MusicPageComponent} from './musicPage/musicPage.component'
import {PageNotFoundComponent} from './pagenotfound.component'
import {PostFmodBatchRenameComponent} from './blog/posts/fmod/postFmodBatchRename.component'
import {MyReaScriptsComponent} from './blog/posts/reascripts/myReaScripts.component'
import {RenameTracksComponent} from './blog/posts/reascripts/renameTracks.component'
import {ShipmentEvaluatorComponent} from './blog/posts/reascripts/shipmentEvaluator.component'
import { PostTddWhatHowComponent } from './blog/posts/tdd/postTddWhatHow.component'
import { PostFpComponent } from './blog/posts/fp/postFp.component'
import { PostHealth1Component } from './blog/posts/health/postHeath1.component'
import { PostHealth2Component } from './blog/posts/health/postHealth2.component'
import { PostHealth3Component } from './blog/posts/health/postHealth3.component'
import { PostTdd5Component } from './blog/posts/tdd/postTdd5.component'
import { PostTdd6Component } from './blog/posts/tdd/postTdd6.component'
import { PostTdd7Component } from './blog/posts/tdd/postTdd7.component'
import { PostTdd8Component } from './blog/posts/tdd/postTdd8.component'
import { PostChess1Component } from './blog/posts/chess/postChess1.component'
import { PostRoutePath } from './shared/services/blog.service'
import { KgToCreatureComponent } from './blog/posts/lifting/kgToCreature.component'
import { JonAndMeComponent } from './blog/posts/lifting/jonAndMe.component'
import { PostFmodReloadShortcutComponent } from './blog/posts/fmod/postFmodReloadShortcut.component'
import { PostFmodBuildAllPlatformsComponent } from './blog/posts/fmod/postFmodBuildAllPlatforms.component'
import { PostFmodUnitySetupComponent } from './blog/posts/fmod/postFmodUnitySetup.component'
import { SoundDesignReelDig } from './blog/posts/soundDesignReel/soundDesignReelDig.component'


const routes: Routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{path: 'home', component: HomeComponent},
	{path: 'blog', component: BlogComponent, children: [
		{path: PostRoutePath.fmodReloadShortcut, component: PostFmodReloadShortcutComponent},
		{path: PostRoutePath.fmodBatchRename, component: PostFmodBatchRenameComponent},
		{path: PostRoutePath.fmodUnitySetup, component: PostFmodUnitySetupComponent},
		{path: PostRoutePath.fmodBuildAllPlatforms, component: PostFmodBuildAllPlatformsComponent},
		{path: PostRoutePath.antonssonScripts, component: MyReaScriptsComponent},
		{path: PostRoutePath.renameTracks, component: RenameTracksComponent},
		{path: PostRoutePath.shipmentEvaluator, component: ShipmentEvaluatorComponent},
		{path: PostRoutePath.tddWhatHowWhyWhen, component: PostTddWhatHowComponent},
		{path: PostRoutePath.fp, component: PostFpComponent},
		{path: PostRoutePath.tddHealthPart1, component: PostHealth1Component},
		{path: PostRoutePath.tddHealthPart2, component: PostHealth2Component},
		{path: PostRoutePath.tddHealthPart3, component: PostHealth3Component},
		{path: PostRoutePath.tddHealthPart4, component: PostTdd5Component},
		{path: PostRoutePath.tddHealthPart5, component: PostTdd6Component},
		{path: PostRoutePath.tddHealthPart6, component: PostTdd7Component},
		{path: PostRoutePath.tddHealthPart7, component: PostTdd8Component},
		{path: PostRoutePath.tddChessPart1, component: PostChess1Component},
		{path: PostRoutePath.kgToCreature, component: KgToCreatureComponent},
		{path: PostRoutePath.jonAndMe, component: JonAndMeComponent},
		{path: PostRoutePath.soundDesignReelDig, component: SoundDesignReelDig},
	]},
	{path: 'music', component: MusicPageComponent},
	{path: 'music/:trackName', component: MusicPageComponent},
	{path: '**', component: PageNotFoundComponent }
]

@NgModule({
	imports: [RouterModule.forRoot(routes, { enableTracing: false })],
	exports: [RouterModule]
})

export class AppRoutingModule {

}
