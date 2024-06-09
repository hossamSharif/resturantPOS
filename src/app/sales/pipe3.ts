import { Pipe} from '@angular/core';
@Pipe({ name: 'filterByEnName', pure: true })
export class FilterPipe3{
  transform(items: any[], args: any): any {
    let filter = args.toString();
    if(filter !== undefined && filter.length !== null){
        if(filter.length === 0 || items.length ===0){
            return items;
        }else{
            return filter ? items.filter(item=> item.item_desc.toLocaleLowerCase().indexOf(filter) != -1 ) : items;
        }
    }
  } 
}