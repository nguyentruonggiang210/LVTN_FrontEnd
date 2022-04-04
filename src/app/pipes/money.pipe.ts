import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
    transform(value: number, ...args: any[]): string {
        if(value == null){
            return '-';
        }
        let val = value.toString();
        return val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
}