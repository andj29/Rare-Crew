import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(collection: any[], property: string): any[] {
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    let grouped = Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
    let transformed = [];

    grouped.forEach(g => {
      let totalTime = 0;
      g.value.forEach(e => {
        const startTimeDate = new Date(e?.StarTimeUtc).getTime();
        const endTimeDate = new Date(e?.EndTimeUtc).getTime();
        const differenceTimeInHours = (endTimeDate - startTimeDate) / (3600 * 1000);

        totalTime += Math.floor(differenceTimeInHours);
      });
      transformed.push({ key: g.key, value: totalTime })
    });

    return transformed.sort((a: any, b: any) => b.value - a.value);
  }

}
