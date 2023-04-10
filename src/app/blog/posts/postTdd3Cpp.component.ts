import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-3-cpp',
	templateUrl: './postTdd3Cpp.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd3CppComponent extends PostComponent {

	test1Red = `// HealthTest.h
#include "pch.h"
#include "../AvatarHealth/Health.h"

TEST(Constructor, HasStartingValue) {
	Health health;
	EXPECT_EQ(health.points, 12);
}
`

test1Red2 = `// Health.h
#pragma once

class Health
{
public:
	int points;
};
`

	impl1Green = `// Health.cpp
class Health
{
public:
	int points = 12;
};
`

	test_1_refactor = `// HealthTest.cs
// inside nested Constructor class.
[Test]
public void CurrentPoints_HasStartingValue()
{
	int startingPoints = 12;
	var health = new Health(startingPoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
}
`
	impl_1_refactor = `// Health.cs
public int CurrentPoints { get; private set; }

public Health(int startingPoints)
{
	CurrentPoints = startingPoints;
}
`

	test_2_Red = `// HealthTest.cs
// inside nested Constructor class.
[Test]
public void ThrowsError_WhenStartingPointsIsInvalid()
{
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
		delegate
		{
			new Health(0);
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`

	impl_2_Green = `//Health.cs
public int CurrentPoints { get;  private set; }

public Health(int startingPoints)
{
	if (startingPoints < 1)
	{
		throw new ArgumentOutOfRangeException(nameof(startingPoints), "Invalid value");
	}

	CurrentPoints = startingPoints;
}
`

impl_2_Refactor = `//Health.cs
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
`

	test_3_Green = `// HealthTest.cs
// inside nested class Constructor
[TestCase(12)]
[TestCase(1)]
public void CurrentPoints_HasStartingValue(int startingPoints)
{
	var health = new Health(startingPoints);
	Assert.That(health.CurrentPoints, Is.EqualTo(startingPoints));
}

[TestCase(0)]
[TestCase(-1)]
public void ThrowsError_WhenStartingPointsIsInvalid(int startingPoints)
{
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(),
		delegate
		{
			new Health(startingPoints);
		});
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`

}
