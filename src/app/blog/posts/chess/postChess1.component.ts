import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'app-post-chess-1',
	templateUrl: './postChess1.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class PostChess1Component extends PostComponent {

	hasPositionRedDoesNotCompileText() {
		return `<p>I create the test file and write the first test and see it fail as the code does not compile.
</p>`
	}

	hasPositionRedDoesNotCompileCode() {
		return `// KingTest.cs
using NUnit.Framework;

public class KingTest
{
	public class Constructor
	{
		[Test]
		public void Position_IsSet()
		{
			var row = 2;
			var column = 3;
			var king = new King(row, column);
			Assert.That(king.Row, Is.EqualTo(row));
			Assert.That(king.Column, Is.EqualTo(column));
		}
	}
}
`
	}
	PositionRowColGreenText() {
		return `<p>It is effortless to make the test pass, and jump over step <i>Red (test fails)</i>, as my IDE (<a href="https://www.jetbrains.com/rider/" target="_blank">Jetbrains Rider</a>) and AI tool (<a href="https://github.com/features/copilot/" target="_blank">Github Copilot</a>) assist me as I start to type.</p>`
	}

	PositionRowColRedText() {
		return `<p><p>I create the test file and write the first (very basic) test and see it fail as the code does not compile.</p>`
	}

	PositionRowColRedCode() {
		return `// PositionTest.cs
using NUnit.Framework;

public class PositionTest
{
	public class Constructor
	{
		[Test]
		public void RowAndColumn_Initialized()
		{
			var position = new Position(0, 1);
			Assert.That(position.Row, Is.EqualTo(0));
			Assert.That(position.Column, Is.EqualTo(1));
		}
	}
}
`
	}

	PositionRowColGreenCode() {
		return `// Position.cs
public struct Position
{
	public int Row { get; }
	public int Column { get; }

	public Position(int row, int column)
	{
		Row = row;
		Column = column;
	}
}
`
	}

	PositionRowColGreenText1() {
		return `<p>I think it fits well to have <i>Position</i> as <a href="https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/structs#161-general" target="_blank">Struct</a>, and I encapsulate the properties with getters (if later it turns out that the domain design needs setters then they'll be TDD cycled in).</p>`
	}

PositionRowInvalidRedCode() {
	return `// PositionTest.cs
[Test]
public void Error_WhenRowParamIsInvalid()
{
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(), delegate
	{
		new Position(-1, 0);
	});
	Assert.That((exception as ArgumentException)?.ParamName, Does.Match("row").IgnoreCase);
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`
}

PositionRowInvalidGreenCode() {
	return `// Position.cs
using System;

public Position(int row, int column)
{
	if (row < 0)
	{
		throw new ArgumentOutOfRangeException(nameof(row), "Invalid");
	}
	Row = row;
	Column = column;
}
`
}

PositionRowInvalidRefactorCode() {
	return `// Position.cs
public Position(int row, int column)
{
	const int lowestValidValue = 0;
	if (row < lowestValidValue)
	{
		throw new ArgumentOutOfRangeException(nameof(row), $"Value {row} is invalid, it should be equal or higher than {lowestValidValue}");
	}
	Row = row;
	Column = column;
}
`
}

PositionColInvalidRedCode() {
	return `// PositionTest.cs
[Test]
public void Error_WhenColumnParamIsInvalid()
{
	var exception = Assert.Throws(Is.TypeOf<ArgumentOutOfRangeException>(), delegate
	{
		new Position(0, -1);
	});
	Assert.That((exception as ArgumentException)?.ParamName, Does.Match("column").IgnoreCase);
	Assert.That(exception.Message, Does.Match("invalid").IgnoreCase);
}
`
}

PositionColInvalidGreenCode() {
	return `// Position.cs
public Position(int row, int column)
{
	const int lowestValidValue = 0;
	if (row < lowestValidValue)
	{
		throw new ArgumentOutOfRangeException(nameof(row), $"Value {row} is invalid, it should be equal or higher than {lowestValidValue}");
	}
	if (column < lowestValidValue)
	{
		throw new ArgumentOutOfRangeException(nameof(column), $"Value {column} is invalid, it should be equal or higher than {lowestValidValue}");
	}
	Row = row;
	Column = column;
}

`
}

PositionColInvalidRefactorCode() {
	return `// Position.cs
public readonly struct Position
{
	public int Row { get; }
	public int Column { get; }

	public Position(int row, int column)
	{
		Row = row;
		Column = column;
		Validate();
	}

	private void Validate()
	{
		ValidateCoord(Row);
		ValidateCoord(Column);
	}

	private static void ValidateCoord(int coord)
	{
		const int lowestValidValue = 0;
		if (coord < lowestValidValue)
		{
			throw new ArgumentOutOfRangeException(nameof(coord), $"Value {coord} is invalid, it should be equal or higher than {lowestValidValue}");
		}
	}
}
`
}

	positionEqualityRefactorText() {
		return `<p>The equality test assertions on the position work because any struct has a default implementation of value equality. I'll paraphrase from the <a href="https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/statements-expressions-operators/how-to-define-value-equality-for-a-type" target="_blank">Microsoft doc</a>: "Any struct has a default implementation of value equality that it inherits from the <i>System.ValueType</i>. This implementation uses reflection which is relatively slow compared to a custom implementation that you write specifically for the type."</p>`
	}

	positionEqualityRefactorText1() {
		return `<p>Although my default approach is to use the profiler to identify and verify optimization changes, I'll take the doc words for this and do a custom equality implementation. It also makes intent of the code more explicit. I add the line to the existing test case.</p>`
	}

	positionEqualityRefactorCode() {
		return `// PositionTest.cs
Assert.That(position, Is.EqualTo(new Position(2, 3)));
`
	}

	positionEqualityRefactorText2() {
		return `<p>Although my default approach is to use the profiler to identify and verify optimization changes, I'll take the doc words for this and do a custom equality implementation. It also makes intent of the code more explicit. I add the line to the existing test case.</p>`
	}

	positionEqualityRefactorCode2() {
		return `// PositionTest.cs
Assert.That(position, Is.EqualTo(new Position(2, 3)));
`
	}

	GetMoveDefinitionsRedText() {
		return `<p>The King is capable of moving one square in whatever direction (if nothing prevents the move). Thus the King class will have <i>GetMoveDefinition</i> method that returns a collection of <i>Positions</i> that are relative</p>`
	}

	GetMoveDefinitionsRedCode() {
		return `// KingTest.cs
public class GetMoveDefinitions
{
	[Test]
	public void Moves_AreReturned()
	{
		var position = new Position(2, 3);
		var king = new King(position);
		var moves = king.GetMoveDefinitions();
		Assert.That(moves, Is.EquivalentTo(new[]
		{
			new Position(1, 0),
			new Position(-1, 0),
			new Position(0, 1),
			new Position(0, -1),
			new Position(1, 1),
			new Position(-1, 1),
			new Position(1, -1),
			new Position(-1, -1)
		}));
	}
}
`
	}

	getMoveDefinitionsGreenText() {
		return `Green (test passes)`
	}

	getMoveDefinitionsGreenCode() {
		return `// King.cs
public Position[] GetMoveDefinitions()
{
	return new[] { new Position(1, 0), };
}`
	}
}
