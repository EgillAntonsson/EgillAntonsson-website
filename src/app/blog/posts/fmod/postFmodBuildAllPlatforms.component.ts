import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'app-post-fmod-build-all-platforms',
	templateUrl: './postFmodBuildAllPlatforms.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class PostFmodBuildAllPlatformsComponent extends PostComponent {

	get buildBanksAndDoCustomStep() {
		return `// Assets/Code/Editor/BuildBanksAndDoCustomStep.cs
[MenuItem("Audio/Build Banks and do custom step %#&b")] // Ctrl+Shift+Alt+B
public static void BuildSoundBanksAndDoCustomStep()
{
	string msg = "Building all the banks to all the platforms listed in the build tab of the preferences dialog."
	EditorUtility.DisplayProgressBar("Building FMOD Banks", msg, 0.5f);
	bool success = FMODUnity.EditorUtils.SendScriptCommand("studio.project.build();");
	if(!success)
	{
		msg = "Likely because FMOD is not running. Cancelling the process.";
		EditorUtility.ClearProgressBar();
		EditorUtility.DisplayDialog("FAILED to connect to FMOD Studio", msg, "Ok");
		// This is what likely causes the failure but we do not get what exactly failed back from the FMOD API.
		// This script command does not check if you are building banks for the correct FMOD project so we need to make sure the correct one is open in FMOD Studio.
		return;
	}
	// TODO: to the custom step here, for example generate a Voice Over file with the duration of each VO .wav file.
	EditorUtility.ClearProgressBar();
	// Show a dialog that the process is done, with errors if any.
}`
	}
}
