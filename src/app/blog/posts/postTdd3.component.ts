import { Component } from '@angular/core'
import { BlogService } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-3',
	templateUrl: './postTdd3.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd3Component {

	get post() {
		return this.blogService.selectedPost
	}


	constructor(private blogService: BlogService) {}

	test_1_Red = `//HealthTest.cs
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

test_1_Red2 = `//Health.cs
public class Health
{
	public int Points;
}
`

	impl_1_Green = `//Health.cs
public class Health
{
	public int Points = 12;
}
`

	code_1_Refactor = `//HealthTest.cs
using NUnit.Framework;

public class HealthTest
{
	public class Constructor
	{
		[Test]
		public void CurrentPointsHasStartingValue()
		{
			int startingPoints = 12;
			var health = new Health(startingPoints);
			Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
		}
	}
}

//Health.cs
public class Health
{
	public int CurrentPoints { get;  private set; }

	public Health(int startingPoints)
	{
		CurrentPoints = startingPoints;
	}
}
`

	test_2_Red = `//HealthTest.cs (only showing the new test)
[Test]
public void ThrowsError_WhenStartingPointsIsInvalid()
{
	Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
	delegate {
		new Health(0);
	});
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
using System;

public class Health
{
	public int CurrentPoints { get;  private set; }

	public Health(int startingPoints)
	{
		int lowestValidValue = 1;
		if (startingPoints < lowestValidValue)
		{
			var paramName = nameof(startingPoints);
			var message = $"Value '{startingPoints}' is invalid, it should be equal or higher than '{lowestValidValue}'";
			throw new ArgumentOutOfRangeException(paramName, message);
		}
		CurrentPoints = startingPoints;
	}
}
`

	test_3_Green = `//HealthTest.cs
using NUnit.Framework;
using System;

public class HealthTest
{
	public class Constructor
	{

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
	}
}
`

}
