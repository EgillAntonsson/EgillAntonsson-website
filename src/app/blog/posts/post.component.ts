import { DatePipe } from '@angular/common'
import { Component } from '@angular/core'
import { BlogService } from '../../shared/services/blog.service'

@Component(
	{
		template: '<h1>base class template not used</h1>'
	}
)

export class PostComponent {

	constructor(private blogService: BlogService) {}

	get post() {
		return this.blogService.selectedPost
	}

	get publishedDateToString(): string {
		return this.dateToString(this.post.publishedDate)
	}

	get hasUpdatedDate(): boolean {
		if (this.post.updatedDate === undefined) {
			return false
		}
		return true
	}

	get updatedDateToString(): string {
		if (this.post.updatedDate === undefined) {
			return ''
		}
		return this.dateToString(this.post.updatedDate)
	}

	private dateToString(date: Date) {
		const datePipe: DatePipe = new DatePipe('en-US')
		const ret = datePipe.transform(date, 'YYYY MMM dd')
		if (ret === null) {
			return ''
		}
		return ret
	}

	usingUnity(projectRepoUrl: string) {
		return `<h2>Using Unity</h2>
		<p>
			I will use <a href="https://unity.com">Unity</a> and its packages  <a href="https://docs.unity3d.com/Packages/com.unity.test-framework@1.1/manual/index.html" target="_blank">Test Framework</a>, a Unity integration of the <a href="https://nunit.org" target="_blank">NUnit</a> framework, and <a href="https://docs.unity3d.com/Packages/com.unity.testtools.codecoverage@1.2/manual/index.html" target="_blank">Code Coverage</a> analysis tool. Other C# .NET framework could be used instead, but Unity was the handiest for me to use. The whole project is on <a href="${projectRepoUrl}">GitHub</a>.</p>`
	}
	get setup() {
		return `<h2>Setup</h2>
<p>
	I create a new Unity project (3D). Both packages <i>Test Framework</i> and <i>Code Coverage</i> are already installed as they are part of the already installed <i>Engineering</i> feature set. The package <a href="https://docs.unity3d.com/Packages/com.unity.test-framework@1.1/manual/index.html">doc</a> detail how to setup tests for a project. My project structure starts simple:
</p>
<ul class="list inline">
	<li>Test code: <i>Scripts/Tests/EditMode/[ClassName]Test.cs</i></li>
	<li>Production code: <i>Scripts/Runtime/[ClassName].cs</i></li>
</ul>
<p>
	As the folder structure implies I'll do <i>EditMode</i> tests for the <i>Runtime</i> production code. My main reasons to prefer <i>EditMode</i> (over <i>PlayMode</i>) tests are:
</p>
<ul class="list inline">
	<li>They run faster as there is no PlayMode startup cost (in line with <i>What is a good Unit Test</i> section in <a href="./blog/tdd-health/part1">Part 1</a>)</li>
	<li>Tests for the domain logic should not need the <i>PlayMode</i> test feature to run as <a href="https://docs.unity3d.com/Manual/Coroutines.html">Coroutine</a> to wait or step through frames."</li>
</ul>
<p>
	The doc <a href="https://docs.unity3d.com/Packages/com.unity.test-framework@1.1/manual/edit-mode-vs-play-mode-tests.html">EditMode vs. PlayMode tests</a> explains the difference further.
</p>`
	}

	get aboutCodeHtml() {
		return `<h2>The code</h2>
<p>
	The code shown below is focused on the current cycle step, thus only showing the relevant lines	.<br>
	The complete code and the Unity project is on <a href="https://github.com/EgillAntonsson/tdd-avatar-health-in-unity">GitHub</a>.
</p>`
	}

	get completeRequirementListHtml() {
		return `<sup>The complete requirement list from the user perspective is in <a href="./blog/tdd-health/part2">Part 2</a></sup>`
	}

	get rewordRequirement() {
		return `Let's reword this focusing on the domain model and using its terminology:`
	}

}
