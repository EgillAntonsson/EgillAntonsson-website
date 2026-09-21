import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'app-post-health-2',
	templateUrl: './postHealth2.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class PostHealth2Component extends PostComponent {

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
	public void HasHealthPoints()
	{
		var health = new Health();
		Assert.That(health.Points, Is.EqualTo(12));
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
	return `// Health.cs
public readonly record struct Health(int PointsPerUnit) {}
`
}

redStartingValueImg() {
	var url = '../assets/images/blog/tdd/part3/TestRunner_first-test-fails.PNG'
	var caption = 'The test runner after first test fail'
	return this.Img(url, caption)
}

Img(url: string, caption: string) {
	return `<figure>
<img src="${url}"
alt="${caption}" title="${caption}" class="imageSmallText">
<figcaption>${caption}</figcaption>
</figure>`
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

redStartingValue2() {
	return `<p>Going forward I will only show one RED step that contains both 'does not compile' and 'test fails' steps, but I do both steps when coding to keep the steps as short as possible.
</p>`
}

greenStartingValue() {
	return `<p>I make the test pass by simply passing in 12 into to the constructor. I could have written it in at the beginning but then we would not have verified that the test does not pass when it should not.</p>`
}

	codeImplGreenStartingValue() {
		return `// HealthTest.cs
[Test]
public void HasHealthPoints()
{
	var health = new Health(12);
	Assert.That(health.Points, Is.EqualTo(12));
}
`
	}

greenRefactor() {
	return `<p>There is nothing more to refactor on the product code as I'd already chosen it to be <code>readonly record struct</code> that makes it immutable, and thus <code>health.Points = 24</code> for example would not compile.<br>
<br>
But I can refactor the test code to use a <a href="https://docs.nunit.org/articles/nunit/writing-tests/attributes/testcase.html" target="_blank">parameterized test</a> that allows us to test our code with a variety of input values and <code>ExpectedResult</code> values and reuse the rest of our test code.<br>
<br>
Both of these decisions are based on <a href="http://egill.rocks/blog/function-programming" target="_blank">Functional Programming</a>.
</p>`
}


codeRefactor() {
	return `// HealthTest.cs
[TestCase(12, ExpectedResult = 12)]
[TestCase(1, ExpectedResult = 1)]
public int HasHealthPoints(int startingPoints)
{
	var health = new Health(startingPoints);
	return health.Points;
}
`
}

greenRefactorImg() {
	var url = '../assets/images/blog/tdd/part3/TestRunner_passing_after_refactor.PNG'
	var caption = 'The test runner after first test passing after refactor'
	return this.Img(url, caption)
}
}
