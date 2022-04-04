import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'datetime' })
export class DateTimePipe implements PipeTransform {
    transform(value: Date, format: string, ...args: any[]): string {
        let calculateDate = new Date(value);
        let seperateChars = ['-', '/', ':', '_'];
        for (const e of seperateChars) {

            if (!format.includes(e)) {
                continue;
            }
            let array = format.split(e);

            let result = '';

            array.forEach(element => {

                if (element.toLocaleLowerCase().includes('y')) {
                    result += calculateDate.getFullYear().toString() + e;
                }
                else if (element.toLocaleLowerCase().includes('m')) {
                    result += this.addZero((calculateDate.getMonth() + 1).toString()) + e;
                }
                else {
                    result += this.addZero(calculateDate.getDate().toString()) + e;
                }
            });

            result = result.trim();

            if (result[result.length - 1] == e) {
                result = result.substring(0, result.length - 1);
            }

            return result;
        }

        return '';
    }

    private addZero(value: string): string {
        if (value.length == 1) {
            return '0' + value;
        }
        return value;
    }
}