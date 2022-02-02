import { Component } from '@angular/core'
import {BlogService } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-5',
	templateUrl: './postTdd5.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd5Component {

	get post() {
		return this.blogService.selectedPost
	}

	constructor(private blogService: BlogService) {}

	test_1_red = `//HealthTest.cs
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

		[Test]
		public void IsDeadIsFalse()
		{
			var health = new Health(12);
			Assert.That(health.IsDead, Is.False);
		}
	}

	public class TakeDamage
	{
		[Test]
		public void CurrentPointsDecrease()
		{
			var health = new Health(12);
			health.TakeDamage(1);
			Assert.That(health.CurrentPoints, Is.EqualTo(11));
		}

		[TestCase(0)]
		[TestCase(-1)]
		public void ThrowsError_WhenDamagePointsIsInvalid(int damagePoints)
		{
			var health = new Health(12);
			Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
			delegate
			{
				health.TakeDamage(damagePoints);
			});
		}
	}
}
`

impl_1_green = `//Health.cs
using System;

public class Health
{
	public int CurrentPoints { get; private set; }
	public bool IsDead => false;

	public Health(int startingPoints)
	{
		ValidatePoints(startingPoints, 1, nameof(startingPoints));
		CurrentPoints = startingPoints;
	}

	public void TakeDamage(int damagePoints)
	{
		ValidatePoints(damagePoints, 1, nameof(damagePoints));
		CurrentPoints -= damagePoints;
	}

	private void ValidatePoints(int points, int lowestValidValue, string paramName)
	{
		if (points < lowestValidValue)
		{
			var message = $"Value '{points}' is invalid, it should be equal or higher than '{lowestValidValue}'";
			throw new ArgumentOutOfRangeException(paramName, message);
		}
	}
}
`

test_2_red = `//HealthTest.cs (only showing the new test)
[Test]
public void IsDead_InTwoTakeDamageCalls()
{
	var health = new Health(10);
	health.TakeDamage(9);
	Assert.That(health.IsDead, Is.False);
	health.TakeDamage(1);
	Assert.That(health.IsDead, Is.True);
}
`

impl_2_green = `//Health.cs (only showing the new implementation)
public bool IsDead => CurrentPoints < 1;
`

test_3_red = `//HealthTest.cs (only showing the new test inside nested Constructor class)
[TestCase(12)]
[TestCase(1)]
public void FullPointsHasStartingValue(int startingPoints)
{
	var health = new Health(startingPoints);
	Assert.That(health.FullPoints, Is.EqualTo(startingPoints));
}
`

impl_3_green = `//Health.cs
using System;

public class Health
{
	public int CurrentPoints { get; private set; }
	public int FullPoints { get; private set; }
	public bool IsDead => CurrentPoints < 1;

	public Health(int startingPoints)
	{
		ValidatePoints(startingPoints, 1, nameof(startingPoints));
		FullPoints = CurrentPoints = startingPoints;
	}

	public void TakeDamage(int damagePoints)
	{
		ValidatePoints(damagePoints, 1, nameof(damagePoints));

		if (CurrentPoints < FullPoints || CurrentPoints > damagePoints || damagePoints > CurrentPoints + 20)
		{
			CurrentPoints -= damagePoints;
		}
		else
		{
			CurrentPoints = 1;
		}
	}

	private void ValidatePoints(int points, int lowestValidValue, string paramName)
	{
		if (points < lowestValidValue)
		{
			var message = $"Value '{points}' is invalid, it should be equal or higher than '{lowestValidValue}'";
			throw new ArgumentOutOfRangeException(paramName, message);
		}
	}
}
`

test_4_red =  `//HealthTest.cs (only showing the new test inside nested TakeDamage)
[TestCase(1, 2, 2)]
[TestCase(1, 2, 3)]
[TestCase(1, 2, 22)]
[TestCase(-21, 2, 23)]
public void CurrentPoints_WhenStartingPoints_andDamagePoints(int currentPoints, int startingPoints, int damagePoints)
{
	var health = new Health(startingPoints);
	health.TakeDamage(damagePoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(currentPoints));
}
`

}
