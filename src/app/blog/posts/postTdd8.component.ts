import { Component } from '@angular/core'
import { PostComponent } from './post.component'

@Component({
	selector: 'app-post-tdd-8',
	templateUrl: './postTdd8.component.html',
	styleUrls: ['./../blog.component.css']
})

export class PostTdd8Component extends PostComponent {

	gameConfigCs = `// GameConfig.cs
using UnityEngine;

[CreateAssetMenu(fileName = "GameConfigInstance",
menuName = "Avatar Health/Create GameConfig Instance",
order = 1)]
public class GameConfig : ScriptableObject {
	public int StartingPoints = 12;
	public int PointsPerUnit = 4;
	public int MaxUnits = 30;
	public int MaxNegativePointsForInstantKillProtection = -20;
}
`

	redValidationTest = `// ValidationTest.cs
using NUnit.Framework;
using System;

[TestFixture]
public class ValidationTest
{
	public class Validate
	{
		[TestCase(12, 1, Int32.MaxValue)]
		[TestCase(1, 1, Int32.MaxValue)]
		[TestCase(4, 2, Int32.MaxValue)]
		[TestCase(2, 2, Int32.MaxValue)]
		[TestCase(-20, Int32.MinValue, -1)]
		[TestCase(-1, Int32.MinValue, -1)]
		public void Passes(int v, int lowestValidV, int highestValidV)
		{
			(bool, int, string) ret = Validation.Validate(v, lowestValidV, highestValidV);
			Assert.That(ret.Item1, Is.True);
			Assert.That(ret.Item2, Is.EqualTo(v));
			Assert.That(ret.Item3, Is.EqualTo(""));
		}

		[TestCase(0, 1, Int32.MaxValue)]
		[TestCase(1, 2, Int32.MaxValue)]
		public void Fails_WhenValueLower(int v, int lowestValidV, int highestValidV)
		{
			(bool, int, string) ret = Validation.Validate(v, lowestValidV, highestValidV);
			Assert.That(ret.Item1, Is.False);
			Assert.That(ret.Item2, Is.EqualTo(lowestValidV));
			Assert.That(ret.Item3, Does.Match("invalid").IgnoreCase);
		}

		[TestCase(0, Int32.MinValue, -1)]
		[TestCase(1, Int32.MinValue, -1)]
		public void Fails_WhenValueHigher(int v, int lowestValidV, int highestValidV)
		{
			(bool, int, string) ret = Validation.Validate(v, lowestValidV, highestValidV);
			Assert.That(ret.Item1, Is.False);
			Assert.That(ret.Item2, Is.EqualTo(highestValidV));
			Assert.That(ret.Item3, Does.Match("invalid").IgnoreCase);
		}
	}
}
`

	greenValidation = `// Validation.cs
using System;

public static class Validation
{
	public static (bool, int, string) Validate(int v, int lowestValidV = Int32.MinValue, int highestValidV = Int32.MaxValue)
	{
		string message = "";
		if (v >= lowestValidV && v <= highestValidV)
		{
			return (true, v, message);
		}

		message = $"Value {v} is invalid, it should be within the range of {lowestValidV} and {highestValidV}";
		int retV = highestValidV == Int32.MaxValue ? lowestValidV : highestValidV;
			return (false, retV, message);
	}
}
`

	hookValidationIntoConfig = `// GameConfig.cs
private void OnValidate()
{
	var validation = Validation.Validate(StartingPoints, 1);
	StartingPoints = ProcessValidation(validation, nameof(StartingPoints));

	validation = Validation.Validate(PointsPerUnit, 2);
	PointsPerUnit = ProcessValidation(validation, nameof(PointsPerUnit));

	validation = Validation.Validate(MaxNegativePointsForInstantKillProtection, Int32.MinValue, -1);
	MaxNegativePointsForInstantKillProtection = ProcessValidation(validation, nameof(MaxNegativePointsForInstantKillProtection));

	double lowestMaxUnits = Math.Ceiling((double)StartingPoints / (double)PointsPerUnit);
	validation = Validation.Validate(MaxUnits, (int)lowestMaxUnits);
	MaxUnits = ProcessValidation(validation, nameof(MaxUnits));
}

private int ProcessValidation((bool IsValid, int Value, string FailMessage) validation, string propertyName)
{
	if (!validation.IsValid)
		{
			Debug.LogWarning(validation.FailMessage + $", for '{propertyName}'. Will set value to {validation.Value}.");
		}
		return validation.Value;
}
`

	validationReturn = `/*success*/(bool IsValid = true, int Value, string failMessage = "")
/*fail*/(bool IsValid = false, int Value /*corrected to valid edge*/, string failMessage)
`

	hookingValidationInConfig = `// GameConfig.cs
private void OnValidate()
{
	var v = Validation.Validate(StartingPoints, 1);
	StartingPoints = ProcessValidation(v, nameof(StartingPoints));

	v = Validation.Validate(PointsPerUnit, 2);
	PointsPerUnit = ProcessValidation(v, nameof(PointsPerUnit));

	v = Validation.Validate(MaxNegativePointsForInstantKillProtection, Int32.MinValue, -1);
	MaxNegativePointsForInstantKillProtection = ProcessValidation(v, nameof(MaxNegativePointsForInstantKillProtection));

	double lowestMaxUnits = Math.Ceiling((double)StartingPoints / (double)PointsPerUnit);
	v = Validation.Validate(MaxUnits, (int)lowestMaxUnits);
	MaxUnits = ProcessValidation(v, nameof(MaxUnits));
}

private int ProcessValidation((bool IsValid, int Value, string FailMessage) v, string fieldName)
{
	if (!v.IsValid)
		{
			Debug.LogWarning(v.FailMessage + $", for '{fieldName}'. Will set value to {v.Value}.");
		}
		return v.Value;
}
`

	healthRefactor = `// Health.cs
private GameConfig config;

public Health(GameConfig gameConfig)
{
	config = gameConfig;
	FullPoints = CurrentPoints = config.StartingPoints;
}
`

	healthRefactor1 = `// Health.cs
public int PointsPerUnit
{
	get { return config.PointsPerUnit; }
}
public int MaxUnits
{
	get { return config.MaxUnits; }
}
	public int MaxNegativePointsForInstantKillProtection
{
	get { return config.MaxNegativePointsForInstantKillProtection; }
}
`

	healthTestRefactor = `// HealthTest.cs
public class HealthTest
{
	public static Health MakeHealth(int startingPoints)
	{
			GameConfig config = ScriptableObject.CreateInstance<GameConfig>();
			config.StartingPoints = startingPoints;
			config.PointsPerUnit = 4;
			config.MaxUnits = 30;
			var health = new Health(config);
			return health;
	}
`

	healthTestStartingPointsAtMax = `// HealthTest.cs
int startingPointsAtMax = 120; // MaxUnits * PointsPerUnit (config vars set in MakeHealth method)
`

	healthReuseValidation = `// Health.cs
private static void ValidatePoints(int points, int lowestValidValue)
{
	(bool IsValid, int Value, string FailMessage) v = Validation.Validate(points, lowestValidValue);
	if (!v.IsValid)
	{
		throw new ArgumentOutOfRangeException(nameof(points), v.FailMessage);
	}
}
`

}
