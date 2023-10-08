import { Component } from '@angular/core'
import { PostComponent } from '../post.component'

@Component({
	selector: 'app-post-chess-1',
	templateUrl: './postChess1.component.html',
	styleUrls: ['./../../blog.component.css']
})

export class PostChess1Component extends PostComponent {

	hasPositionRedDoesNotCompileText() {
		return `<p>I create the test file and write the first (very basic) test and see it fail as the code does not compile.
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
	hasPositionGreenText() {
		return `<p>It is effortless to make the test pass as my IDE (<a href="https://www.jetbrains.com/rider/" target="_blank">Jetbrains Rider</a>) and AI tool (<a href="https://github.com/features/copilot/" target="_blank">Github Copilot</a>) help me out as I start to type.`
	}

	hasPositionGreenText1() {
		return `<p>Since this was straightforward I jumped over explicitly doing step 'Red (test fails)' though it has the value of verifying that the test was actually failing before it was made to pass. Going forward I will I do both RED steps (unless straightforward) but will combine them in this presentation and simply call it step RED.</p>`
	}

	hasPositionGreenCode() {
		return `// King.cs
public class King
{
	public int Row { get; }
	public int Column { get; }

	public King(int row, int column)
	{
		Row = row;
		Column = column;
	}
}
`
	}

	hasPositionRefactorText() {
		return `<p>Defining a <i>Position</i> that has the <i>Row</i> and <i>Column</i> and the King having the <i>position</i> should improve the design. Thus I create 2 new files <i>PositionTest</i> and <i>Position</i>.</p>`
	}

	PositionRefactorCodeTest() {
		return `// PositionTest.cs
using NUnit.Framework;

public class PositionTest
{
	public class Constructor
	{
		[Test]
		public void Position_IsSet()
		{
			var position = new Position(2, 3);
			Assert.That(position.Row, Is.EqualTo(2));
			Assert.That(position.Column, Is.EqualTo(3));
		}
	}
}
`
	}

	PositionRefactorCodeProd() {
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

	hasPositionRefactorText1() {
		return `<p>I think it fits well to have <i>Position</i> as <a href="https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/structs#161-general" target="_blank">Struct</a>. Then I refactor the <i>King</i> to have the <i>Position</i>.</p>`
	}

	KingRefactorCodeTest() {
		return `// KingTest.cs
using NUnit.Framework;

public class KingTest
{
	public class Constructor
	{
		[Test]
		public void Position_IsSet()
		{
			var position = new Position(2, 3);
			var king = new King(position);
			Assert.That(king.Position, Is.EqualTo(position));
		}
	}
}
`
	}

	KingRefactorCodeProd() {
		return `// King.cs
public class King
{
	public Position Position { get; }

	public King(Position position)
	{
		Position = position;
	}
}
`
	}

	hasPositionRefactorText2() {
		return `<p>The tests passes thus all is good. But I want to improve <i>Position</i> in ways that I know will provide value going forward, so I'll cycle that.</p>`
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
