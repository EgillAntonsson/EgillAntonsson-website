import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-7',
	templateUrl: './postTdd7.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd7Component extends PostComponent {

	red_increaseByUnit_fullPointsIncrease = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void FullPointsIncrease()
{
	var health = new Health(12);
	health.IncreaseByUnit();
	Assert.That(health.FullPoints, Is.EqualTo(16));
}
`

	green_increaseByUnit_fullPointsIncrease = `// Health.cs
public void IncreaseByUnit()
{
	FullPoints += 4;
}
`

	refactor_increaseByUnit_fullPointsIncrease = `// Health.cs
public const int PointsPerUnit = 4;

public void IncreaseByUnit()
{
	FullPoints += PointsPerUnit;
}
`

	red_increaseByUnit_currentPointsIncrease = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void CurrentPointsIncrease()
{
	var health = new Health(12);
	health.IncreaseByUnit();
	Assert.That(health.CurrentPoints, Is.EqualTo(16));
}
`

	green_increaseByUnit_currentPointsIncrease = `// Health.cs
public void IncreaseByUnit()
{
	FullPoints += PointsPerUnit;
	CurrentPoints = FullPoints;
}
`

	red_increaseByUnit_currentPoints_moreCases = `// HealthTest.cs
// inside nested class IncreaseByUnit
[TestCase(7, 4, 1)]
[TestCase(6, 4, 2)]
[TestCase(5, 4, 3)]
public void CurrentPoints_WhenStartingPoints_ThenDamagePoints(
	int currentPoints,
	int startingPoints,
	int damagePoints)
{
	var health = new Health(startingPoints);
	health.TakeDamage(damagePoints);
	health.IncreaseByUnit();
	Assert.That(health.CurrentPoints, Is.EqualTo(currentPoints));
}
`

	green_increaseByUnit_currentPoints_moreCases = `// Health.cs
public void IncreaseByUnit()
{
	FullPoints += PointsPerUnit;
	CurrentPoints += PointsPerUnit;
}
`

	red_IsMaxFullPointsReached = `// HealthTest.cs
// inside nested class IsMaxFullPointsReached
[Test]
public void ReturnsFalse()
{
	var health = new Health(Health.MaxFullPoints / 2);
	Assert.That(health.IsMaxFullPointsReached, Is.False);
}

[Test]
public void ReturnsTrue()
{
	var health = new Health(Health.MaxFullPoints);
	Assert.That(health.IsMaxFullPointsReached, Is.True);
}
`

	green_IsMaxFullPointsReached = `// Health.cs
public const int MaxFullPoints = 120;

public bool IsMaxFullPointsReached => FullPoints == MaxFullPoints;
`

	red_IncreaseByUnit_ThrowsError = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void ThrowsError_WhenMaxFullPointsReached()
{
	var health = new Health(Health.MaxFullPoints);
	var exception = Assert.Throws(Is.TypeOf<InvalidOperationException>(),
		delegate
		{
			health.IncreaseByUnit();
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}`

	green_IncreaseByUnit_ThrowsError = `// Health.cs
public void IncreaseByUnit()
{
	if (IsMaxFullPointsReached)
	{
		var message = $"Method invocation is invalid as {nameof(IsMaxFullPointsReached)} is true";
		throw new InvalidOperationException(message);
	}

	FullPoints += PointsPerUnit;
	CurrentPoints += PointsPerUnit;
}
`

}
