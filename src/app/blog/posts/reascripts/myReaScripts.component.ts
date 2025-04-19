import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'not-using',
	templateUrl: './myReaScripts.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class MyReaScriptsComponent extends PostComponent {}
