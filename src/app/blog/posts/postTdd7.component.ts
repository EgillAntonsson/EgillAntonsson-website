import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-7',
	templateUrl: './postTdd7.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd7Component extends PostComponent {

	red_fullPointsIncrease = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void FullPointsIncrease()
{
	var health = new Health(4);
	health.IncreaseByUnit(1);
	Assert.That(health.FullPoints, Is.EqualTo(8));
}
`

	green_fullPointsIncrease = `// Health.cs
public void IncreaseByUnit(int unit)
{
	FullPoints += unit * 4;
}
`

	refactor_fullPointsIncrease = `// Health.cs
public const int PointsPerUnit = 4;

public void IncreaseByUnit(int unit)
{
	FullPoints += unit * PointsPerUnit;
}
`

refactor_fullPointsIncrease_addTests = `// Health.cs
// inside nested class IncreaseByUnit
[TestCase(8, 4, 1)]
[TestCase(12, 4, 2)]
[TestCase(16, 4, 3)]
public void FullPoints_WhenStartingPoints_ThenIncreaseByUnit(
	int fullPoints,
	int startingPoints,
	int unit)
{
	var health = new Health(startingPoints);
	health.IncreaseByUnit(unit);
	Assert.That(health.FullPoints, Is.EqualTo(fullPoints));
}
`

red_fullPointsIncrease_invalidInput = `// HealthTest.cs
// inside nested class IncreaseByUnit
[TestCase(0)]
[TestCase(-1)]
public void ThrowsError_WhenUnitParamIsInvalid(int unit)
{
	var health = new Health(4);
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
		delegate
		{
			health.IncreaseByUnit(unit);
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`

green_fullPointsIncrease_invalidInput = `// HealthTest.cs
public void IncreaseByUnit(int unit)
{
	ValidatePoints(unit, 1); // method not shown
	FullPoints += unit * PointsPerUnit;
}
`

	red_fullPointsIncrease_currentPoints = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void CurrentPointsIncrease()
{
	var health = new Health(4);
	health.IncreaseByUnit(1);
	Assert.That(health.CurrentPoints, Is.EqualTo(8));
}
`

	green_fullPointsIncrease_currentPoints = `// Health.cs
public void IncreaseByUnit(int unit)
{
	ValidatePoints(unit, 1);
	FullPoints += unit * PointsPerUnit;
	CurrentPoints = FullPoints;
}
`

red_fullPointsIncrease_currentPoints_moreCases = `// HealthTest.cs
// inside nested class IncreaseByUnit
[TestCase(7, 4, 1, 1)]
[TestCase(6, 4, 2, 1)]
[TestCase(11, 4, 1, 2)]
[TestCase(10, 4, 2, 2)]
public void CurrentPoints_WhenStartingPoints_ThenDamagePoints_ThenIncreaseByUnit(
	int currentPoints,
	int startingPoints,
	int damagePoints,
	int unit)
{
	var health = new Health(startingPoints);
	health.TakeDamage(damagePoints);
	health.IncreaseByUnit(unit);
	Assert.That(health.CurrentPoints, Is.EqualTo(currentPoints));
}
`

green_fullPointsIncrease_currentPoints_moreCases = `// Health.cs
public void IncreaseByUnit(int unit)
{
	ValidatePoints(unit, 1);
	FullPoints += unit * PointsPerUnit;
	CurrentPoints += unit * PointsPerUnit;
}
`

}

