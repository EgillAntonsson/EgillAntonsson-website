import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'app-post-chess-1',
	templateUrl: './postChess1.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class PostChess1Component extends PostComponent {

get posColRowRedCompileText() {
	return `<p>I create the test file and write the first test and see it fail, as the code does not compile.</p>`
}

get posColRowRedCompileCode() {
		return `// PositionTest.cs
using NUnit.Framework;

namespace PositionTest
{
	public class Constructor
	{
		[Test]
		public void ColumnAndRow_AreInitialized()
		{
			var position = new Position(0, 1);
			Assert.That(position.Column, Is.EqualTo(0));
			Assert.That(position.Row, Is.EqualTo(1));
		}
	}
}
`
}

get posColRowRedTestFailsText() {
	return `<p>I write the minimal production code to compile successfully and intentionally make the test fail to verify that the test is not passing when it should not.</p>`
}

get posColRowRedTestFailsCode() {
	return `// Position.cs
public struct Position
{
	public int Column;
	public int Row;

	public Position(int column, int row)
	{
		Column = -1;
		Row = -1;
	}
}
`
}

get posColRowGreenText() {
	return `<p>It make the test pass by providing the obvious solution that holds for all cases.</p>`
}

get posColRowGreenCode() {
		return `// Position.cs
public struct Position
{
	public int Row;
	public int Column;

	public Position(int column, int row)
	{
		Column = column;
		Row = row;
	}
}
`
}

get posColRowRefactorText() {
	return `<p>I encapsulate the properties with getters and declare the structure as immutable with the  <a href="https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/struct#readonly-struct" target="_blank">readonly</a> keyword.</p>`
}

get posColRowRefactorCode() {
	return `// Position.cs
public readonly struct Position
{
	public int Column { get; }
	public int Row { get; }

	public Position(int column, int row)
	{
		Column = column;
		Row = row;
	}
}
`
}

get posEqualsIntroText() {
	return `<p>I'm certain that the domain logic will be comparing positions thus I write the tests for it.</p>`
}

get posEqualsTestCode() {
	return `// PositionTest.cs
public class Equals
{
	[Test]
	public void AreEqual_WhenWithSameRowAndSameColumn()
	{
		var pos1 = new Position(0, 0);
		var pos2 = new Position(0, 0);
		Assert.That(pos1.Equals(pos2), Is.True);
	}

	[Test]
	public void AreNotEqual_WhenNotWithSameRowAndSameColumn()
	{
		var pos1 = new Position(1, 0);
		var pos2 = new Position(0, 0);
		Assert.That(pos1.Equals(pos2), Is.False);
	}
}
`
}

get posEqualsGreenText() {
	return `<p>I ran this test and expected it to fail as I had not implemented anything, but it passes. Then I remember that <i>struct</i> has a default implementation of<i>Equals</i> that makes these tests pass, paraphrasing from the <a href="https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/statements-expressions-operators/how-to-define-value-equality-for-a-type" target="_blank">Microsoft doc</a>: "Any struct has a default implementation of value equality that it inherits from the <i>System.ValueType</i>. This implementation uses reflection which is relatively slow compared to a custom implementation that you write specifically for the type."</p>
<p>Before I go any further I will add tests for the equals operator.</p>	`
}

get posEqualsOpRedCode() {
	return `// PositionTest.cs
[Test]
public void AreEqual_WhenWithSameRowAndSameColumn_UsingOperator()
{
	var pos1 = new Position(0, 0);
	var pos2 = new Position(0, 0);
	Assert.That(pos1 == pos2, Is.True);
}

[Test]
public void AreNotEqual_WhenNotWithSameRowAndSameColumn_UsingOperator()
{
	var pos1 = new Position(1, 0);
	var pos2 = new Position(0, 0);
	Assert.That(pos1 != pos2, Is.True);
}
`
}

get posEqualsOpRedText() {
 return `<p>These tests produce the compile errors: Cannot apply operator '==' / '!=' to operands of type 'Position' and 'Position'</p>`
}

get posEqualsRefactorText() {
	return  `<p>Although my default approach is to use the profiler to identify performance bottlenecks and verify improvements, I will this time take the Microsoft doc words as gospel truth and thus do a custom equality implementation. I use the IDEA (Rider) to do it in an automatic manner and thus also deem it safe to jump over Red (tests fail) step</p>`
}

get posEqualsRefactorCode() {
	return `// Position.cs
public readonly struct Position : IEquatable<Position>
{
	// ...
	public bool Equals(Position other)
	{
		return Column == other.Column && Row == other.Row;
	}

	public override bool Equals(object obj)
	{
		return obj is Position other && Equals(other);
	}

	public override int GetHashCode()
	{
		return HashCode.Combine(Column, Row);
	}

	public static bool operator ==(Position left, Position right)
	{
		return left.Equals(right);
	}

	public static bool operator !=(Position left, Position right)
	{
		return !left.Equals(right);
	}
}
`
}

get posEqualsRefactorText1() {
	return  `<p>I make <i>Position</i> inherit <i>IEquatable</i> and execute the action <i>generate equality members</i> which makes the tests pass and provides the clear refactored solution.</p>`
}

// PositionRowInvalidRedText() {
// 	return `<p>I add the test for invalid row parameter value and see it fail.</p>`
// }

// PositionRowInvalidRedCode() {
// 	return `// PositionTest.cs
// [Test]
// public void Error_WhenRowParamIsInvalid()
// {
// 	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(), delegate
// 	{
// 		new Position(-1, 0);
// 	});
// 	Assert.That((exception as ArgumentException)?.ParamName, Does.Match("row").IgnoreCase);
// 	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
// }
// `
// }

// PositionRowInvalidGreenText() {
// 	return `<p>It make the test pass by providing the obvious solution that holds for all cases, and provide the bare minimum exception message to satisfy the test.</p>`
// }

// PositionRowInvalidGreenCode() {
// 	return `// Position.cs
// public Position(int row, int column)
// {
// 	if (row < 0)
// 	{
// 		throw new ArgumentOutOfRangeException(nameof(row), "Invalid");
// 	}
// 	Row = row;
// 	Column = column;
// }
// `
// }

// PositionRowInvalidRefactorText() {
// 	return `<p>I define <i>lowestValidValue</i> and use it both in the condition and the message. This makes the message informative and makes sure the conditional and message will always be in sync. I verify the message displays as expected (with debug breakpoint): Value -1 is invalid, it should be equal or higher than 0. Parameter name: row.</p>`
// }

// PositionRowInvalidRefactorCode() {
// 	return `// Position.cs
// public Position(int row, int column)
// {
// 	const int lowestValidValue = 0;
// 	if (row < lowestValidValue)
// 	{
// 		throw new ArgumentOutOfRangeException(nameof(row), $"Value {row} is invalid, it should be equal or higher than {lowestValidValue}");
// 	}
// 	Row = row;
// 	Column = column;
// }
// `
// }

// PositionColInvalidRedText() {
// 	return `<p>I add the test for invalid column parameter value and see it fail.</p>`
// }

// PositionColInvalidRedCode() {
// 	return `// PositionTest.cs
// [Test]
// public void Error_WhenColumnParamIsInvalid()
// {
// 	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(), delegate
// 	{
// 		new Position(0, -1);
// 	});
// 	Assert.That((exception as ArgumentException)?.ParamName, Does.Match("column").IgnoreCase);
// 	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
// }
// `
// }

// PositionColInvalidGreenText() {
// 	return `<p>As the Green step is all about a quick implementation that makes the test(s) pass, I temporarily commit the code sin of duplication, as I will refactor it clean in the next step.</p>`
// }

// PositionColInvalidGreenCode() {
// 	return `// Position.cs
// public Position(int row, int column)
// {
// 	const int lowestValidValue = 0;
// 	if (row < lowestValidValue)
// 	{
// 		throw new ArgumentOutOfRangeException(nameof(row), $"Value {row} is invalid, it should be equal or higher than {lowestValidValue}");
// 	}
// 	if (column < lowestValidValue)
// 	{
// 		throw new ArgumentOutOfRangeException(nameof(column), $"Value {column} is invalid, it should be equal or higher than {lowestValidValue}");
// 	}
// 	Row = row;
// 	Column = column;
// }

// `
// }

// PositionColInvalidRefactorCode() {
// 	return `// Position.cs
// public readonly struct Position
// {
// 	public int Row { get; }
// 	public int Column { get; }

// 	public Position(int row, int column)
// 	{
// 		Row = row;
// 		Column = column;
// 		Validate();
// 	}

// 	private void Validate()
// 	{
// 		ValidateCoord(Row);
// 		ValidateCoord(Column);
// 	}

// 	private static void ValidateCoord(int coord)
// 	{
// 		const int lowestValidValue = 0;
// 		if (coord < lowestValidValue)
// 		{
// 			throw new ArgumentOutOfRangeException(nameof(coord), $"Value {coord} is invalid, it should be equal or higher than {lowestValidValue}");
// 		}
// 	}
// }
// `
// }

// PositionColInvalidRefactorText() {
// 	return `<p>I refactor out the duplication and improve the code, by taking small steps and running all the tests after each step.</p>`
// }

// PositionColInvalidRefactorText1() {
// 	return `<p>The refactor steps were in broad strokes the below:</p><ul class="list inline">
// <li>I highlight the row condition case and <a href="https://refactoring.guru/extract-method" target="_blank">Extract Method</a> (with my IDE) and name it <i>ValidateCoord</i> and change the <i>row</i> to <i>coord</i></li>
// <li>I create method <i>Validate</i> and make the constructor call it after setting the properties, this method calls <i>ValidateCoord</i> with param <i>Row</i> and then again with param <i>Column</i></li>
// <li>My IDE suggests to make the struct as <i>readonly</i> and that sounds proper so I apply it</li>
// <li>When the exception is thrown you get the stack trace in the console and therefore it is sufficient that the param name will simply be <i>coord</i> as you can follow the trace to see which line called <i>ValidateCoord</i></li>
// <li>For <i>PositionTest</i> I update that the <i>ParamName</i> should match "coord" (instead of "row" or "column")</li></ul>`
// }

}
