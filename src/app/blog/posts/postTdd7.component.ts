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
	var health = new Health(12);
	health.IncreaseByUnit();
	Assert.That(health.FullPoints, Is.EqualTo(16));
}
`

	green_fullPointsIncrease = `// Health.cs
public void IncreaseByUnit()
{
	FullPoints += 4;
}
`

	refactor_fullPointsIncrease = `// Health.cs
public const int PointsPerUnit = 4;

public void IncreaseByUnit(int unit)
{
	FullPoints += PointsPerUnit;
}
`

	red_fullPointsIncrease_currentPoints = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void CurrentPointsIncrease()
{
	var health = new Health(12);
	health.IncreaseByUnit();
	Assert.That(health.CurrentPoints, Is.EqualTo(16));
}
`

	green_fullPointsIncrease_currentPoints = `// Health.cs
public void IncreaseByUnit(int unit)
{
	FullPoints += PointsPerUnit;
	CurrentPoints = FullPoints;
}
`

	red_fullPointsIncrease_currentPoints_moreCases = `// HealthTest.cs
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

	green_fullPointsIncrease_currentPoints_moreCases = `// Health.cs
public void IncreaseByUnit()
{
	FullPoints += PointsPerUnit;
	CurrentPoints += PointsPerUnit;
}
`

}
