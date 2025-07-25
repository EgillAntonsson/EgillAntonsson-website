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
import { PostRoutePath } from './shared/services/blog.service'
import { KgToCreatureComponent } from './blog/posts/lifting/kgToCreature.component'
import { JonAndMeComponent } from './blog/posts/lifting/jonAndMe.component'


const routes: Routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{path: 'home', component: HomeComponent},
	{path: 'blog', component: BlogComponent, children: [
		{path: PostRoutePath.fmodBatchRename, component: PostFmodBatchRenameComponent},
		{path: PostRoutePath.antonssonScripts, component: MyReaScriptsComponent},
		{path: PostRoutePath.renameTracks, component: RenameTracksComponent},
		{path: PostRoutePath.shipmentEvaluator, component: ShipmentEvaluatorComponent},
		{path: PostRoutePath.tddWhatHowWhyWhen, component: PostTdd1Component},
		{path: 'tdd-health/part2', component: PostTdd2Component},
		{path: PostRoutePath.tddHealthPart3, component: PostTdd3Component},
		{path: PostRoutePath.tddHealthPart3_Cpp, component: PostTdd3CppComponent},
		{path: 'tdd-health/part4', component: PostTdd4Component},
		{path: 'tdd-health/part5', component: PostTdd5Component},
		{path: 'tdd-health/part6', component: PostTdd6Component},
		{path: 'tdd-health/part7', component: PostTdd7Component},
		{path: 'tdd-health/part8', component: PostTdd8Component},
		{path:  PostRoutePath.tddChessPart1, component: PostChess1Component},
		{path:  PostRoutePath.kgToCreature, component: KgToCreatureComponent},
		{path:  PostRoutePath.jonAndMe, component: JonAndMeComponent},
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
