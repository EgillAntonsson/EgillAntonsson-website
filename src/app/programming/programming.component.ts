import { Component } from '@angular/core'
// import {Highlight } from 'ngx-highlightjs'

@Component({
	selector: 'app-programming',
	templateUrl: './programming.component.html',
	styleUrls: [
		'./programming.component.css'
	]
})
export class ProgrammingComponent {


	lineNumbers = false

test_1_Red = `//HealthTest.cs
using NUnit.Framework;

public class HealthTest
{
	[TestFixture]
	public class PointsTest
	{
		[Test]
		public void HasStartingValue()
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
	[TestFixture]
	public class PointsTest
	{
		[Test]
		public void HasStartingValue()
		{
			int startingPoints = 12;
			var health = new Health(startingPoints);
			Assert.That(health.Points, Is.EqualTo(startingPoints));
		}
	}
}

//Health.cs
public class Health
{
	public int Points { get;  private set; }

	public Health(int points)
	{
		Points = points;
	}
}
`

test_2_Red = `//HealthTest.cs (continuing)
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
	public int Points { get;  private set; }

	public Health(int points)
	{
		if (points < 1)
		{
			var msg = $"Value '{points}' for parameter 'points' is invalid, it should be higher than '0'";
			throw new ArgumentOutOfRangeException(msg);
		}
		Points = points;
	}
}
`
test_3_Green = `//HealthTest.cs
using NUnit.Framework;
using System;

public class HealthTest
{
	[TestFixture]
	public class PointsTest
	{

		[TestCase(12)]
		[TestCase(1)]
		public void HasStartingValue(int startingPoints)
		{
			var health = new Health(startingPoints);
			Assert.That(health.Points, Is.EqualTo(startingPoints));
		}

		[TestCase(0)]
		[TestCase(-1)]
		public void ThrowsError_WhenStartingValueIsInvalid(int startingPoints)
		{
			Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
			delegate {
				new Health(startingPoints);
			});
		}
	}
}
`

}
