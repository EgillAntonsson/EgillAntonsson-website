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
public void FullPoints_Increase()
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
public void CurrentPoints_Increase()
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

	red_IsMaxUnitsReached = `// HealthTest.cs
// inside nested class IsMaxUnitsReached
[Test]
public void ReturnsTrue()
{
	var startingPointsAtMax = Health.MaxUnits * Health.PointsPerUnit;
	var health = new Health(startingPointsAtMax);
	Assert.That(health.IsMaxUnitsReached, Is.True);
}

[Test]
public void ReturnsFalse()
{
	var startingPointsBelowMax = Health.MaxUnits * Health.PointsPerUnit - 1;
	var health = new Health(startingPointsBelowMax);
	Assert.That(health.IsMaxUnitsReached, Is.False);
}
`

	green_IsMaxUnitsReached = `// Health.cs
public const int MaxUnits = 30;

public bool IsMaxUnitsReached => MaxUnits == FullPoints / PointsPerUnit;
`

	red_IncreaseByUnit_ThrowsError = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void ThrowsError_WhenMaxUnitsReached()
{
	var startingPointsAtMax = Health.MaxUnits * Health.PointsPerUnit;
	var health = new Health(startingPointsAtMax);
	var exception = Assert.Throws(Is.TypeOf<InvalidOperationException>(),
		delegate
		{
			health.IncreaseByUnit();
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`

	green_IncreaseByUnit_ThrowsError = `// Health.cs
public void IncreaseByUnit()
{
	if (IsMaxUnitsReached)
	{
		var message = $"Method invocation is invalid as {nameof(IsMaxUnitsReached)} is true";
		throw new InvalidOperationException(message);
	}

	FullPoints += PointsPerUnit;
	CurrentPoints += PointsPerUnit;
}
`

}
