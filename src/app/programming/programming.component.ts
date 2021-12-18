import { Component, OnInit } from '@angular/core'
// import {Highlight } from 'ngx-highlightjs'

@Component({
	selector: 'app-programming',
	templateUrl: './programming.component.html',
	styleUrls: [
		'./programming.component.css'
	]
})
export class ProgrammingComponent implements OnInit {

	linenumbers = true

	languages = ['csharp']

	code = `
using NUnit.Framework;

public class HealthTest
{
    public class PointsTest
    {
        [Test]
        public void ShouldHaveStartValue_WhenStarting()
        {
            Assert.AreEqual(12, 12);
        }
    }
}
`

codeTs = `
weightInCreatures(weightInKg: number) {
	let tempWeightInKg = weightInKg

	const creaturesLifted: Array<CreatureLifted> = []

	this.creatureList.forEach(creature => {

		let count = 0
		while (creature.kg <= tempWeightInKg) {
			tempWeightInKg -= creature.kg
			count++
		}

		if (count > 0) {
			creaturesLifted.push({count: count, creature: {name: creature.name, kg: creature.kg, url: creature.url}})
		}

	})

	return creaturesLifted
}

`


// constructor(private highlight: Highlight) {
// 	console.log(this.highlight.languages.length)

// }
	ngOnInit(): void {
// 		console.log(this.highlight.languages.length)
// 		// this.highlight.highlightAll()
// 		// console.log(this.highlight.listLanguages())
	}

}
