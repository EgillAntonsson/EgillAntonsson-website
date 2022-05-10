import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-7',
	templateUrl: './postTdd7.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd7Component extends PostComponent {

	test_red_fullPointsIncrease = `// HealthTest.cs
// inside nested class IncreaseByUnit
[Test]
public void FullPointsIncrease()
{
	var health = new Health(12);
	health.IncreaseByUnit(1);
	Assert.That(health.FullPoints, Is.EqualTo(16));
}
`

	impl_green_fullPointsIncrease = `// Health.cs
public void IncreaseByUnit(int unit)
{
	FullPoints += unit * 4;
}
`

}
