import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'

import {HomeComponent} from './home/home.component'
import {ProgrammingComponent} from './programming/programming.component'
import {LiftingComponent} from './lifting/lifting.component'
import {MusicPageComponent} from './music/musicPage.component'
import {PageNotFoundComponent} from './pagenotfound.component'

const routes: Routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
	{path: 'home',  component: HomeComponent},
	{path: 'music', component: MusicPageComponent},
	{path: 'code',  component: ProgrammingComponent},
	{path: 'lifting', component: LiftingComponent},
	{path: '**', component: PageNotFoundComponent }
]

@NgModule({
	imports: [RouterModule.forRoot(routes,  { enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
