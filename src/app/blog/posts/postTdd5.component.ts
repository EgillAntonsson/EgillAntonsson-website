import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-5',
	templateUrl: './postTdd5.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd5Component extends PostComponent {

	test_1_red = `// HealthTest.cs
// inside nested class Constructor
[Test]
public void IsDead_IsFalse()
{
	var health = new Health(12);
	Assert.That(health.IsDead, Is.False);
}
`

	impl_1_green = `// Health.cs
public bool IsDead => false;
`

	test_2_red = `// HealthTest.cs
// inside nested class TakeDamage
[Test]
public void IsDead_AfterTwoInvocations()
{
	var health = new Health(12);
	health.TakeDamage(11);
	Assert.That(health.IsDead, Is.False);

	health.TakeDamage(1);
	Assert.That(health.IsDead, Is.True);
}
`

	impl_2_green = `// Health.cs
public bool IsDead => CurrentPoints < 1;
`

test_3_red = `// HealthTest.cs
// inside nested class Constructor
[TestCase(12)]
[TestCase(1)]
public void FullPoints_HasStartingValue(int startingPoints)
{
	var health = new Health(startingPoints);
	Assert.That(health.FullPoints, Is.EqualTo(startingPoints));
}
`

	impl_3_green = `// Health.cs
public class Health
{
	public int CurrentPoints { get; private set; }
	public int FullPoints { get; private set; }

	public Health(int startingPoints)
	{
		ValidatePoints(startingPoints, 1); // method not shown
		FullPoints = CurrentPoints = startingPoints;
	}
}
`

	test_4_red =  `// HealthTest.cs
// inside nested class TakeDamage
[TestCase(1, 4, 4)]
[TestCase(1, 4, 5)]
[TestCase(1, 4, 24)]
[TestCase(-21, 4, 25)]
public void CurrentPoints_WhenStartingPoints_ThenDamagePoints(
	int currentPoints,
	int startingPoints,
	int damagePoints)
{
	var health = new Health(startingPoints);
	health.TakeDamage(damagePoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(currentPoints));
}
`

	impl_4_green = `// Health.cs
public void TakeDamage(int damagePoints)
{
	ValidatePoints(damagePoints, 1); //method not shown

	if (CurrentPoints < FullPoints
		|| CurrentPoints > damagePoints
		|| damagePoints > CurrentPoints + 20)
	{
		CurrentPoints -= damagePoints;
	}
	else
	{
		CurrentPoints = 1;
	}
}
`

	impl_4_refactor = `// Health.cs
public void TakeDamage(int damagePoints)
{
	ValidatePoints(damagePoints, 1); //method not shown

	if (CurrentPoints == FullPoints
		&& damagePoints >= FullPoints
		&& damagePoints <= FullPoints + 20)
	{
		CurrentPoints = 1;
		return;
	}

	CurrentPoints -= damagePoints;
}
`

	impl_4_refactor_2 = `// Health.cs
public const int MaxNegativePointsForInstantKillProtection = -20;

public void TakeDamage(int damagePoints)
{
	ValidatePoints(damagePoints, 1); //method not shown

	if (CurrentPoints == FullPoints
		&& damagePoints >= FullPoints
		&& damagePoints <= FullPoints - MaxNegativePointsForInstantKillProtection)
	{
		CurrentPoints = 1;
		return;
	}

	CurrentPoints -= damagePoints;
}
`

}
