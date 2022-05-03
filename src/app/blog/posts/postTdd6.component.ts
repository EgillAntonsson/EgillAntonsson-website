import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-6',
	templateUrl: './postTdd6.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd6Component extends PostComponent {

	test_invalid_value_red = `// HealthTest.cs
// inside nested Replenish class.
[TestCase(0)]
[TestCase(-1)]
public void ThrowsError_WhenReplenishPointsIsInvalid(int replenishPoints)
{
	var health = new Health(12);
	Exception ex = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
	delegate
	{
		health.Replenish(replenishPoints);
	});
	Assert.That(ex.Message, Does.Match("invalid").IgnoreCase);
}
`

	test_1_red = `// HealthTest.cs
// inside nested Replenish class.
[Test]
public void CurrentPointsSame_WhenFull()
{
	var health = new Health(12);
	health.Replenish(1);
	Assert.That(health.CurrentPoints, Is.EqualTo(12));
}
`

	impl_1_green = `// Health.cs
public void Replenish(int points) { }
`

	test_2_red = `// HealthTest.cs
// inside nested Replenish class.
[Test]
public void CurrentPointsReplenish_WhenNotFull()
{
	var health = new Health(12);
	health.TakeDamage(1);
	health.Replenish(1);
	Assert.That(health.CurrentPoints, Is.EqualTo(12));
}
`

	test_refactor_red = `// HealthTest.cs
// replacing previous two tests
[TestCase(4, 4, 0, 1)]
[TestCase(4, 4, 3, 4)]
[TestCase(4, 4, 3, 3)]
[TestCase(3, 4, 3, 2)]
[TestCase(2, 4, 3, 1)]
public void CurrentPoints_WhenStartingPoints_ThenDamagePoints_ThenReplenishPoints(
	int currentPoints,
	int startingPoints,
	int damagePoints,
	int replenishPoints)
{
	var health = new Health(startingPoints);
	health.TakeDamage(damagePoints);
	health.Replenish(replenishPoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(currentPoints));
}
`

}
