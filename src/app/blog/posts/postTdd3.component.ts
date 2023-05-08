import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-3',
	templateUrl: './postTdd3.component.html',
	styleUrls: ['./../blog.component.css']
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
		return `<p>The domain model focus will be the <code>Health</code> class (not created yet), thus I create the test file and write the first test and see it fail (as the code does not compile).
</p>`
	}


	codeTestRedDoesNotCompileStartingValue() {
		return `// HealthTest.cs
using NUnit.Framework;

public class HealthTest
{
	public class Constructor
	{
		[Test]
		public void Points_HasStartingValue()
		{
			var health = new Health();
			Assert.That(health.points, Is.EqualTo(12));
		}
	}
}
`
	}

	redAfterDoesNotCompileStartingValue() {
		return `<p>I create and name a nested class after the <i>entry point</i> of the test (<i>entry point</i> is defined in <i>What is a good Unit Test section</i> in <a href="./blog/tdd-health/part1">Part 1</a>), thus is named <code>Constructor</code> in this case. I got the idea from post <a href="https://daedtech.com/tdd-and-modeling-a-chess-game/">TDD and modeling a chess game</a> (author Erik Dietrich) that references <a href="https://haacked.com/archive/2012/01/02/structuring-unit-tests.aspx/">Structuring Unit Tests</a> (author Phil Haack).</p>
<p>I'm using the <a href="https://docs.nunit.org/articles/nunit/writing-tests/assertions/assertions.html#two-models">Constraint Model of Assertions.</a>.</p>`
	}

	redStartingValue1() {
		return `<p>I write the minimal production code for the compiler to compile successfully and then run the test and I want to see it fail to verify that the test is not passing when it should not.</p>`
	}

	codeTestRedStartingValue() {
		return `// Health.cs
public class Health
{
	public int points;
}
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
<img src="` + this.redStartingValueImgUrl() +
`"alt="` + this.redStartingValueImgCaption() +
`"title="` + this.redStartingValueImgCaption() +
`"class="imageSmallText">
<figcaption>` + this.redStartingValueImgCaption() + `</figcaption>
</figure>`
	}

	redStartingValue2() {
		return `<p>Going forward I will skip demonstrating both 'red' steps and only demonstrate one and simply call it RED (although I do both steps when coding).
	</p>`
	}

	greenStartingValue() {
		return `<p>I make the test pass with this very simple implementation:</p>`
	}

	codeImplGreenStartingValue() {
		return `// Health.cs
public class Health
{
	public int points = 12;
}
`
	}

	greenStartingValue1() {
		return `<p>It comes to mind that it's good to be able to tweak the starting points at compile time for game design balancing, thus I refactor the value to be passed as param into the constructor.</p>`
	}

	greenStartingValue2() {
		return `<p>
		I rename the member variable and thus the test case to current points. I name the constructor param <span class="code">startingPoints</span>.
		</p>`
	}

	codeTestRefactorStartingValue() {
		return `// HealthTest.cs
// inside nested Constructor class.
[Test]
public void CurrentPoints_HasStartingValue()
{
	int startingPoints = 12;
	var health = new Health(startingPoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
}
`
	}

greenStartingValue3() {
	return `<p>I encapsulate current points by providing a 'getter'. I want to <a href="https://medium.com/swlh/the-importance-of-code-encapsulation-ce19efbcfe57">encapsulate</a> the production code so that the only exposure comes from the requirements that the TDD cycles drives (more exposure could be required in certain cases but should be kept to the bare minimum).</p>`
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
		return `<p>It comes to mind that invalid values can be passed into the constructor, as our avatar should never start with less than 1 points (starting up being dead is a 'no show'). I deem it appropriate that the production code throws an exception when the value is invalid and I write a test that expects this, and it expectedly fails as the throwing has not been implemented.</p>
<p>Going forward I'll present only the code that's the focus of the current TDD step.</p>
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
		return `<p>I'm confident that this implementation works for any passed in param value. But I'll test a few more values to verify it and demonstrate how to do it in a maintainable way.</p>`
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
