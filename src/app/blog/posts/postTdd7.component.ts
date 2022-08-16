import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-7',
	templateUrl: './postTdd7.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd7Component extends PostComponent {

	refactorHealth = `// Health.cs
public const int PointsPerUnit = 4;
public const int MaxNegativeUnitsForInstantKillProtection = -5;

public Health(int startingUnits)
{
	ValidatePoints(startingUnits, 1);
	FullPoints = CurrentPoints = startingUnits * PointsPerUnit;
}

// PointsPerUnit also used in InstantKillProtection calculation,
// which is not shown.
`

	refactorHealthTest = `// HealthTest.cs
[TestCase(3)]
[TestCase(1)]
public void CurrentPoints_HasStartingValue(int startingUnits)
{
	var health = new Health(startingUnits);
	Assert.That(health.CurrentPoints, Is.EqualTo(startingUnits * health.PointsPerUnit));
}

// other similar refactoring not shown.
`

	red_increaseByUnit_fullPointsIncrease = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void FullPoints_Increase()
{
	var health = new Health(3);
	health.IncreaseByUnit();
	Assert.That(health.FullPoints, Is.EqualTo(16));
}
`

	green_increaseByUnit_fullPointsIncrease = `// Health.cs
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
	var health = new Health(3);
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

	red_IsMaxUnitsReached = `// HealthTest.cs
// inside nested class IsMaxUnitsReached
[Test]
public void ReturnsTrue_WhenStartingUnitsAtMax()
{
	int startingUnits = Health.MaxUnits;
	var health = new Health(startingUnits);
	Assert.That(health.IsMaxUnitsReached, Is.True);
}

[Test]
public void ReturnsFalse_WhenStartingUnitsNotAtMax()
{
	int startingUnits = Health.MaxUnits - 1;
	var health = new Health(startingUnits);
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
	int startingUnits = Health.MaxUnits;
	var health = new Health(startingUnits);
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
	CurrentPoints = FullPoints;
}
`

}
