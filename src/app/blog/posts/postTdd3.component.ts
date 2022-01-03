import { Component } from '@angular/core'
import { Post, BlogService } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-3',
	templateUrl: './postTdd3.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd3Component {

	post: Post

	constructor(private blogService: BlogService) {
		this.post = this.blogService.selectedPost
	}
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
		public void HasStartingValue()
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
public void ThrowsError_WhenStartingValueIsInvalid()
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
			var paramName = nameof(startingPoints);
			var message = $"Value '{startingPoints}' is invalid, it should be higher than '0'";
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
		public void HasStartingValue(int startingPoints)
		{
			var health = new Health(startingPoints);
			Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
		}

		[TestCase(0)]
		[TestCase(-1)]
		public void ThrowsError_WhenStartingValueIsInvalid(int startingPoints)
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
