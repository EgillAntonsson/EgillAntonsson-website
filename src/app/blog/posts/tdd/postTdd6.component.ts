import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'app-post-tdd-6',
	templateUrl: './postTdd6.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class PostTdd6Component extends PostComponent {

	test_1_red = `// HealthTest.cs
// inside nested class Replenish
[Test]
public void CurrentPoints_WhenFullHealth()
{
	var health = new Health(12);
	health.Replenish(1);
	Assert.That(health.CurrentPoints, Is.EqualTo(12));
}
`

	impl_1_green = `// Health.cs
public void Replenish(int replenishPoints) { }
`

	test_2_red = `// HealthTest.cs
// inside nested class Replenish
[Test]
public void CurrentPoints_WhenNotFullHealth()
{
	var health = new Health(12);
	health.TakeDamage(2);
	health.Replenish(1);
	Assert.That(health.CurrentPoints, Is.EqualTo(11));
}
`

	test_2_green = `// Health.cs
public void Replenish(int replenishPoints)
{
	CurrentPoints = Math.Min(replenishPoints + CurrentPoints, FullPoints);
}
`

	test_invalid_input_red = `// HealthTest.cs
// inside nested class Replenish
[TestCase(0)]
[TestCase(-1)]
public void ThrowsError_WhenReplenishPointsIsInvalid(int replenishPoints)
{
	var health = new Health(12);
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
		delegate
		{
			health.Replenish(replenishPoints);
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`

	test_invalid_input_green = `// Health.cs
public void Replenish(int replenishPoints)
{
	ValidatePoints(replenishPoints, 1); // method not shown
	CurrentPoints = Math.Min(replenishPoints + CurrentPoints, FullPoints);
}
`

}
