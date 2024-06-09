import { Pipe} from '@angular/core';
@Pipe({ name: 'filterByLogdetails', pure: true })
export class FilterPipe{
  transform(record: any[], args: any): any {
    let filter = args.toString();
    if(filter !== undefined && filter.length !== null){
        if(filter.length === 0 || record.length === 0){
            return record;
        }else{
            return filter ? record.filter(item => item.full_name.toLocaleLowerCase().indexOf(filter) != -1 ) : record;
        }
    }
  } 
}