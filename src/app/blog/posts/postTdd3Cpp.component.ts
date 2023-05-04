import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-3-cpp',
	templateUrl: './postTdd3Cpp.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd3CppComponent extends PostComponent {

	test1Red = `// HealthTest.cpp
#include "pch.h"
#include "../AvatarHealth/Health.h"

TEST(Constructor, Points_HasStartingValue)
{
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

	impl1Green = `// Health.h
class Health
{
public:
	int points = 12;
};
`

	test1Refactor = `// HealthTest.cpp
TEST(Constructor, CurrentPoints_HasStartingValue)
{
	auto startingPoints = 12;
	Health health = Health(startingPoints);
	EXPECT_EQ(health.GetCurrentPoints(), startingPoints);
}
`

	impl1Refactor = `// Health.cpp
#include "Health.h"

Health::Health(int startingPoints)
{
	Health::currentPoints = startingPoints;
}

int Health::GetCurrentPoints()
{
	return currentPoints;
}
`

	test2Red = `// HealthTest.cpp
TEST(Constructor, ThrowsExWhenStartingPointsIsInvalid)
{
	EXPECT_THROW(
		{
			Health health = Health(0);
		}, std::out_of_range);
}
`

	impl2Green = `//Health.cpp
Health::Health(int startingPoints)
{
	if (startingPoints < 1)
	{
		throw std::out_of_range(std::string("Invalid value"));
	}

	Health::currentPoints = startingPoints;
}
`

impl2Refactor = `//Health.cpp
#include <format>

using namespace std;

Health::Health(int startingPoints)
{
	auto lowestValidValue = 1;
	if (startingPoints < lowestValidValue)
	{
		auto msg = format("Value {} is invalid, it should be equal or higher than {}", startingPoints, lowestValidValue);
		throw out_of_range(msg);
	}

	Health::currentPoints = startingPoints;
}
`

	test3Green = `// HealthTest.cpp
using namespace std;
using ::testing::TestWithParam;
using ::testing::Values;

class CurrentPointsHasStartingValues : public TestWithParam<int> { };
INSTANTIATE_TEST_CASE_P(Constructor, CurrentPointsHasStartingValues,
	Values(1, 12)
);
TEST_P(CurrentPointsHasStartingValues, Value)
{
	auto param = GetParam();
	Health health = Health(param);
	EXPECT_EQ(health.GetCurrentPoints(), param);
}

class ThrowsExWhenStartingPoints : public TestWithParam<int> { };
INSTANTIATE_TEST_CASE_P(Constructor, ThrowsExWhenStartingPoints,
	Values(0, -1)
);
TEST_P(ThrowsExWhenStartingPoints, Value)
{
	EXPECT_THROW(
		{
			Health health = Health(GetParam());
		}, out_of_range);
}
`

}
