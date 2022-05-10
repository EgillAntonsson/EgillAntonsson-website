import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-4',
	templateUrl: './postTdd4.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd4Component extends PostComponent {

test_1_Red = `// HealthTest.cs
// inside nested class TakeDamage
[Test]
public void CurrentPointsDecrease()
{
	var health = new Health(12);
	health.TakeDamage(1);
	Assert.That(health.CurrentPoints, Is.EqualTo(11));
}
`

impl_1_Green = `// Health.cs
public int CurrentPoints { get; private set; }

public void TakeDamage(int damagePoints)
{
	CurrentPoints -= damagePoints;
}
`

test_2_Red = `// HealthTest.cs
// inside nested class TakeDamage
[TestCase(0)]
[TestCase(-1)]
public void ThrowsError_WhenDamagePointsIsInvalid(int damagePoints)
{
	var health = new Health(12);
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
	delegate
	{
		health.TakeDamage(damagePoints);
	});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`

impl_2_Green = `// Health.cs
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

public void TakeDamage(int damagePoints)
{
	const int lowestValidValue = 1;
	if (damagePoints < lowestValidValue)
	{
		var message = $"Value {damagePoints} is invalid, it should be equal or higher than {lowestValidValue}";
		throw new ArgumentOutOfRangeException(nameof(damagePoints), message);
	}

	CurrentPoints -= damagePoints;
}
`

impl_2_Refactor = `// Health.cs
public Health(int startingPoints)
{
	ValidatePoints(startingPoints, 1);
	CurrentPoints = startingPoints;
}

public void TakeDamage(int damagePoints)
{
	ValidatePoints(damagePoints, 1);
	CurrentPoints -= damagePoints;
}

private static void ValidatePoints(int points, int lowestValidValue)
{
	if (points < lowestValidValue)
	{
		var message = $"Value {points} is invalid, it should be equal or higher than {lowestValidValue}";
		throw new ArgumentOutOfRangeException(nameof(points), message);
	}
}
`

}
