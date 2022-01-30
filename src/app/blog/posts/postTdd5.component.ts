import { Component } from '@angular/core'
import { Post, BlogService } from '../../shared/services/blog.service'

@Component({
	selector: 'app-post-tdd-5',
	templateUrl: './postTdd5.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd5Component {

	post: Post

	constructor(private blogService: BlogService) {
		this.post = this.blogService.selectedPost
	}
	test_1_Red = `//HealthTest.cs
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

	public class IsDead
	{
		[Test]
		public void IsFalse_AtStart()
		{
			var health = new Health(12);
			Assert.That(health.IsDead, Is.False);
		}
	}
}
`

impl_1_Green = `//Health.cs
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

test_2_Red = `//HealthTest.cs (only showing the new test)
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
`

impl_2_Green = `//Health.cs
using System;

public class Health
{
	public int CurrentPoints { get; private set; }

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

	public void TakeDamage(int damagePoints)
	{
		int lowestValidValue = 1;
		if (damagePoints < lowestValidValue)
		{
			var paramName = nameof(damagePoints);
			var message = $"Value '{damagePoints}' is invalid, it should be equal or higher than '{lowestValidValue}'";
			throw new ArgumentOutOfRangeException(paramName, message);
		}
		CurrentPoints -= damagePoints;
	}
}
`

impl_2_Refactor = `//Health.cs
using System;

public class Health
{
	public int CurrentPoints { get; private set; }

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

test_final = `//HealthTest.cs
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

}
