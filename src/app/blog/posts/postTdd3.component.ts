import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-3',
	templateUrl: './postTdd3.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd3Component extends PostComponent {

	test_1_Red = `// HealthTest.cs
using NUnit.Framework;

public class HealthTest
{
	public class Constructor
	{
		[Test]
		public void PointsHasStartingValue()
		{
			var health = new Health();
			Assert.That(health.Points, Is.EqualTo(12));
		}
	}
}
`

test_1_Red2 = `// Health.cs
public class Health
{
	public int Points;
}
`

	impl_1_Green = `// Health.cs
public class Health
{
	public int Points = 12;
}
`

	test_1_refactor = `// HealthTest.cs
// inside nested Constructor class.
[Test]
public void CurrentPointsHasStartingValue()
{
	int startingPoints = 12;
	var health = new Health(startingPoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
}
`
	impl_1_refactor = `// Health.cs
public class Health
{
	public int CurrentPoints { get;  private set; }

	public Health(int startingPoints)
	{
		CurrentPoints = startingPoints;
	}
}
`

	test_2_Red = `// HealthTest.cs
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

	impl_2_Green = `//Health.cs
using System;

public class Health
{
	public int CurrentPoints { get;  private set; }

	public Health(int startingPoints)
	{
		if (startingPoints < 1)
		{
			throw new ArgumentOutOfRangeException("startingPoints", "Invalid value");
		}

		CurrentPoints = startingPoints;
	}
}
`

impl_2_Refactor = `//Health.cs
public Health(int startingPoints)
{
	int lowestValidValue = 1;
	if (startingPoints < lowestValidValue)
	{
		var message = $"Value 'startingPoints} is invalid, it should be equal or higher than {lowestValidValue}";
		var paramName = nameof(startingPoints);
		throw new ArgumentOutOfRangeException(paramName, message);
	}

	CurrentPoints = startingPoints;
}
`

	test_3_Green = `// HealthTest.cs
// inside nested class Constructor
[TestCase(12)]
[TestCase(1)]
public void CurrentPointsHasStartingValue(int startingPoints)
{
	var health = new Health(startingPoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
}

[TestCase(0)]
[TestCase(-1)]
public void ThrowsError_WhenStartingPointsIsInvalid(int startingPoints)
{
	Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
	delegate
	{
		new Health(startingPoints);
	});
}
`

}
