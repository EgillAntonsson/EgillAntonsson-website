import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-3',
	templateUrl: './postTdd3.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd3Component extends PostComponent {

	test1Red = `// HealthTest.cs
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

test1Red2 = `// Health.cs
public class Health
{
	public int points;
}
`
	impl1Green = `// Health.cs
public class Health
{
	public int points = 12;
}
`

	test1Refactor = `// HealthTest.cs
// inside nested Constructor class.
[Test]
public void CurrentPoints_HasStartingValue()
{
	int startingPoints = 12;
	var health = new Health(startingPoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
}
`
	impl1Refactor = `// Health.cs
public int CurrentPoints { get; private set; }

public Health(int startingPoints)
{
	CurrentPoints = startingPoints;
}
`

	test2Red = `// HealthTest.cs
// inside nested Constructor class.
[Test]
public void ThrowsError_WhenStartingPointsIsInvalid()
{
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
		delegate
		{
			new Health(0);
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`

	impl2Green = `//Health.cs
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

impl2Refactor = `//Health.cs
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

	test_3_Green = `// HealthTest.cs
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
