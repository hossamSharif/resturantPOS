import { Pipe} from '@angular/core';
@Pipe({ name: 'filterByAlias', pure: true })
export class FilterPipe2{ 
  transform(items: any[], args: any): any {
    let filter = args.toString();
    if(filter !== undefined && filter.length !== null){
        if(filter.length === 0 || items.length ===0){
            return items;
        }else{
            return filter ? items.filter(item => item.aliasEn.toLocaleLowerCase().indexOf(filter) != -1  ) : items;
        }
    }
  }
}