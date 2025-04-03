import { Component } from '@angular/core'
import { PostTdd3Component } from './postTdd3.component'

@Component({
	selector: 'app-post-tdd-3-cpp',
	templateUrl: './postTdd3Cpp.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class PostTdd3CppComponent extends PostTdd3Component {

	override codeTestRedDoesNotCompileStartingValue() {
		return `// HealthTest.cpp
#include "pch.h"
#include "../AvatarHealth/Health.h"

TEST(Constructor, PointsHasStartingValue)
{
	Health health;
	EXPECT_EQ(health.points, 12);
}
`
	}

	override redAfterDoesNotCompileStartingValue() {
		return `<p>I name the first param in the <a href=http://google.github.io/googletest/reference/testing.html#TEST">TEST</a> macro after the <i>entry point</i> of the test (<i>entry point</i> is defined in <i>What is a good Unit Test section</i> in <a href="./blog/tdd-health/part1">Part 1</a>), thus is named <code>Constructor</code> in this case. The rest of the test case naming goes into the second param (Google Test docs states that it should not contain underscores). You can see how this lays out in the Test Explorer in the screenshots below.</p>`
	}

	override redStartingValueImgUrl() {
		let base = super.redStartingValueImgUrl();
		return base.substring(0, base.length-3) + 'jpg'
	}

	override codeTestRedStartingValue() {
		return `// Health.h
#pragma once

class Health
{
public:
	int points;
};
`
	}

override codeImplGreenStartingValue() {
	return `// Health.h
class Health
{
public:
	int points = 12;
};
`
}

	override codeTestRefactorStartingValue() {
	return `// HealthTest.cpp
TEST(Constructor, CurrentPointsHasStartingValue)
{
	auto startingPoints = 12;
	Health health = Health(startingPoints);
	EXPECT_EQ(health.GetCurrentPoints(), startingPoints);
}
`
}

codeImplRefactorHeaderStartingValue() {
	return `// Health.h
#pragma once

class Health
{
public:
	Health(int startingPoints);
	int GetCurrentPoints();

private:
	int currentPoints;
};
`
}

override codeImplRefactorStartingValue() {
	return `// Health.cpp
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
}

 override codeTestRedInvalidStartingPoints() {
	return `// HealthTest.cpp
TEST(Constructor, ThrowsExWhenStartingPointsIsInvalid)
{
	EXPECT_THROW(
		{
			Health health = Health(0);
		}, std::out_of_range);
}
`
 }

 	override codeImplGreenInvalidStartingPoints() {
		return `//Health.cpp
Health::Health(int startingPoints)
{
	if (startingPoints < 1)
	{
		throw std::out_of_range(std::string("Invalid value"));
	}

	Health::currentPoints = startingPoints;
}
`
 	}

	override codeImplRefactorInvalidStartingPoints() {
		return `//Health.cpp
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
	 }

	 override parameterizedRefactor2() {
		return `<p>To achieve this in a maintainable way I use the <a href=http://google.github.io/googletest/reference/testing.html#TEST">TEST_P</a> macro and define the needed structure for it:</p>`
	 }

	 override codeTestRefactorParameterized() {
		return `// HealthTest.cpp
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

	 override parameterizedRefactor3() {
		return `<p>I try to map the naming to follow my naming convention and to display according in the test runner that now runs 4 tests in total:</p>`
	 }

	override parameterizedRefactorImgUrl() {
		let base = super.parameterizedRefactorImgUrl();
		return base.substring(0, base.length-3) + 'jpg'
	}
}
