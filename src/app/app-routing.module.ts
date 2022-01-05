import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import {HomeComponent} from './home/home.component'
import {BlogComponent} from './blog/blog.component'
import {LiftingComponent} from './lifting/lifting.component'
import {MusicPageComponent} from './musicPage/musicPage.component'
import {PageNotFoundComponent} from './pagenotfound.component'
import { PostTdd1Component } from './blog/posts/postTdd1.component'
import { PostTdd2Component } from './blog/posts/postTdd2.component'
import { PostTdd3Component } from './blog/posts/postTdd3.component'
import { PostTdd4Component } from './blog/posts/postTdd4.component'

const routes: Routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{path: 'home',  component: HomeComponent},
	{path: 'home/post', redirectTo: '/home', pathMatch: 'full'},
	{path: 'blog', component: BlogComponent, children: [
		{path: 'tdd-health/part1', component: PostTdd1Component},
		{path: 'tdd-health/part2', component: PostTdd2Component},
		{path: 'tdd-health/part3', component: PostTdd3Component},
		{path: 'tdd-health/part4', component: PostTdd4Component}
	]},
	{path: 'music', component: MusicPageComponent},
	{path: 'lifting', component: LiftingComponent},
	{path: '**', component: PageNotFoundComponent }
]

@NgModule({
	imports: [RouterModule.forRoot(routes, {enableTracing: false, relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})

export class AppRoutingModule {

}
