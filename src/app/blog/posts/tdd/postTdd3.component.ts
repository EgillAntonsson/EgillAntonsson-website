import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'app-post-tdd-3',
	templateUrl: './postTdd3.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class PostTdd3Component extends PostComponent {

	get requirements() {
		return `<h2>The start state requirements</h2>
<p>Let's recap these requirements from the user perspective</p>
<ul class="list inline">
	<li>The Life Gauge measures Link's (the avatar) current amount of health</li>
	<li>Health is visually represented in the form of Hearts, and they are in fractions of 4</li>
	<li>The Life Gauge starts with 3 Hearts</li>
</ul>`
	+ this.completeRequirementListHtml +
`<p>Focusing only on the domain logic I filter and reword into one requirement:</p>
<ul class="list inline">
	<li>Avatar Health starts with 12 Health Points (equals to the visual representation of 3 Hearts * 4 Fractions)</li>
</ul>
`
}

	redDoesNotCompileStartingValue() {
		return `<p>I create the test file and write the first test and it is failing as the code does not compile.</p>`
	}


	codeTestRedDoesNotCompileStartingValue() {
		return `// HealthTest.cs
using NUnit.Framework;

public class HealthTest
{
	[Test]
	public void Points_HasStartingValue()
	{
		var healthState = new HealthState();
		Assert.That(healthState.Points, Is.EqualTo(12));
	}
}
`
	}

	redAfterDoesNotCompileStartingValue() {
		return `<p>I'm using the <a href="https://docs.nunit.org/articles/nunit/writing-tests/assertions/assertions.html#two-models">Constraint Model of Assertions</a>.</p>`
	}

	redStartingValue1() {
		return `<p>I write the minimal product code to compile successfully and run the test to see it fail to verify that the test does not pass when it should not.</p>`
	}

	codeTestRedStartingValue() {
		return `// HealthState.cs
public readonly record struct HealthState(int PointsPerUnit) {}
`
	}

	redStartingValueImgUrl() {
		return "../assets/images/blog/tdd/part3/TestRunner_first-test-fails.PNG"
	}

	redStartingValueImgCaption() {
		return "The test runner after first test fail"
	}

	redStartingValueImg() {
		return `<figure>
<img src="${this.redStartingValueImgUrl()}
"alt="${this.redStartingValueImgCaption()}" title="${this.redStartingValueImgCaption()}" class="imageSmallText">
<figcaption>${this.redStartingValueImgCaption()}</figcaption>
</figure>`
	}

	redStartingValue2() {
		return `<p>Going forward I will only show one RED step that contains both 'does not compile' and 'test fails' steps, but I do both steps when coding to keep the steps as short as possible.
	</p>`
	}

	greenStartingValue() {
		return `<p>I make the test pass by simply passing in 12 into to the constructor. I could have written it in at the beginning but then we would not have verified that the test does not pass when it should not. Going forward I'll only show only the focusd code and not the whole file.</p>`
	}

	codeImplGreenStartingValue() {
		return `// HealthTest.cs
[Test]
public void Points_HasStartingValue()
{
	var healthState = new HealthState(12);
	Assert.That(healthState.Points, Is.EqualTo(12));
}
`
	}

	greenStartingValue1() {
		return `<p>I had already chosen to have HealthState as a readonly record struct that makes it immutable.</p>`
	}

	// I get an error when I remove this func but I do not know why, so I keep it for now. It is not used in the html.
	greenStartingValue2() {
		return ''
	}

	codeTestRefactorStartingValue() {
		return ''
	}

	greenStartingValue3() {
		return ''
	}

	codeImplRefactorStartingValue() {
		return `// Health.cs
public int CurrentPoints { get; private set; }

public Health(int startingPoints)
{
	CurrentPoints = startingPoints;
}
`
	}

	invalidStartingPoints() {
		return `<p>It comes to mind that invalid values can be passed into the constructor, as our avatar should never start with less than 1 points, e.g. not start dead, but this should be handled at the earliest point by the code that uses the Health.</p>
`
	}

	codeTestRedInvalidStartingPoints() {
		return `// HealthTest.cs
// inside nested Constructor class.
[Test]
public void ThrowsError_WhenStartingPointsIsInvalid()
{
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(), delegate
		{
			new Health(0);
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`
	}

	redInvalidStartingPoints1() {
		return `<p>I deem I can use an existing system exception for this case. I choose the value <code>0</code> for the <span class="code">StartingPoints</span> param because it's on the edge of the invalidation (as <code>1</code> is valid).</p>`
}

	redInvalidStartingPoints2() {
		return `<p>I assert that the message contains "invalid" (ignoring the case), intentionally not being more specific so the assert does not fail later because of potential rewording improvements.</p>`
	}

	testNamingConvention() {
		return `<h4>My test naming convention</h4>
<p>After the <i>entry point</i> has been stated (as I've already done) the rest of the test naming should be one of the following:</p>
<ul class="list">
	<li>[ <i>Exit point</i> ] _ [ will be in state (after 'happy success path') ]</li>
		<ul><li>e.g. <code>CurrentPoints_HasStartingValue</code></li></ul>
	<li>[ <i>Exit point</i> ] _ When [ Scenario (other than 'happy success path') ]</li>
	<li>[ Expected behavior of <i>Unit of Work</i> ] _ When [ Scenario ]</li>
	<ul><li>e.g. <code>ThrowsEx_WhenStartingPointsIsInvalid</code></li></ul>
</ul>
<p><i>Exit point</i> and <i>Unit of Work</i> are defined in <i>What is a good Unit Test section</i> in <a href="./blog/tdd-health/part1">Part 1</a>. Underscores are skipped if not allowed.</p>`
	}

	codeImplGreenInvalidStartingPoints() {
		return `//Health.cs
public int CurrentPoints { get;  private set; }

public Health(int startingPoints)
{
	if (startingPoints < 1)
	{
		throw new ArgumentOutOfRangeException(nameof(startingPoints), "Invalid value");
	}

	CurrentPoints = startingPoints;
}
`
	}

	greenInvalidStartingPoints() {
		return `<p>I'm confident that the implementation of the <code>if</code> conditional handles all potential input values properly. However I just did the bare minimum for the exception message and I will refactor it in the next step:</p>`
	}

	codeImplRefactorInvalidStartingPoints() {
		return `//Health.cs
public Health(int startingPoints)
{
	const int lowestValidValue = 1;
	if (startingPoints < lowestValidValue)
	{
		var message = $"Value {startingPoints} is invalid, it should be equal or higher than {lowestValidValue}";
		throw new ArgumentOutOfRangeException(nameof(startingPoints), message);
	}

	CurrentPoints = startingPoints;
}
`
	}

	refactorInvalidStartingPoints() {
		return `<p>
		I define <code>lowestValidValue</code> and use it both in the condition and the message. This makes the message informative and makes sure the conditional and message will always be in sync. I verify the message displays as expected (with debug breakpoint):
	<i>Value 0 is invalid, it should be equal or higher than 1.</i></p>`
	}

	testingMoreValues() {
		return `<p>I'll test a few more values more values (more for demonstration as the implementation ).</p>`
	}

	parameterizedRefactor1() {
		return `<p>I refactor the tests and add test cases where the value is close to the valid/invalid edge.</p>`
	}

	parameterizedRefactor2() {
		return `<p>To achieve this in a maintainable way I use <a href="https://docs.nunit.org/articles/nunit/technical-notes/usage/Parameterized-Tests.html">Parameterized Tests</a> with inline <a href="https://docs.nunit.org/articles/nunit/writing-tests/attributes/testcase.html">TestCase</a> attribute.</p>`
	}

	codeTestRefactorParameterized() {
		return `// HealthTest.cs
// inside nested class Constructor
[TestCase(12)]
[TestCase(1)]
public void CurrentPoints_HasStartingValue(int startingPoints)
{
	var health = new Health(startingPoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
}

[TestCase(0)]
[TestCase(-1)]
public void ThrowsError_WhenStartingPointsIsInvalid(int startingPoints)
{
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
		delegate
		{
			new Health(startingPoints);
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`
	}

	parameterizedRefactor3() {
		return `<p>Now total 4 test cases are run and the test runner looks like this:</p>`
	}

	parameterizedRefactorImgUrl() {
		return "../assets/images/blog/tdd/part3/TestRunner_after-parameterized-refactor.PNG"
	}

	parameterizedRefactorImgCaption() {
		return "The test runner after parameterized refactor"
	}

	parameterizedRefactorImg() {
		return `<figure>
<img src="` + this.parameterizedRefactorImgUrl() +
`"alt="` + this.parameterizedRefactorImgCaption() +
`"title="` + this.parameterizedRefactorImgCaption() +
`"class="imageSmallText">
<figcaption>` + this.parameterizedRefactorImgCaption() + `</figcaption>
</figure>`
	}

}
