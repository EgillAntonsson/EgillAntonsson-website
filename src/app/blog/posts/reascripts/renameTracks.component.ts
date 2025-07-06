import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'not-using',
	templateUrl: './renameTracks.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class RenameTracksComponent extends PostComponent {}
