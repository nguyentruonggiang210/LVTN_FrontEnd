import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common/common.service';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {

    constructor(private commonSerivce: CommonService) {
    }

    transform(value: number, ...args: any[]): string {
        let lan = this.commonSerivce.getLocalStorage(environment.lang);
        if (lan == 'vi') {
            value = value * this.commonSerivce.getLocalStorage(environment.vndCurrency);
        }

        if (value == null) {
            return '-';
        }
        let val = value.toString();
        val = val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        val = lan == 'vi' ? val + " VND" : "$ " + val;
        return val;
    }
}