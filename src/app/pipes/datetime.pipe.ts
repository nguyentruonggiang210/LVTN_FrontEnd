import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'datetime' })
export class DateTimePipe implements PipeTransform {
    transform(value: Date, format: string, ...args: any[]): string {
        let calculateDate = new Date(value);
        let seperateChars = ['-', '/', ':', '_'];
        const hours = ':';
        for (const e of seperateChars) {

            if (!format.includes(e)) {
                continue;
            }
            let array = format.split(e);

            let result = '';

            var blankSpace = false;
            array.forEach(element => {

                if (element.toLocaleLowerCase().includes('y')) {
                    result += calculateDate.getFullYear().toString() + e;
                }
                else if (element.toLocaleLowerCase().includes('mm')) {
                    result += this.addZero((calculateDate.getMonth() + 1).toString()) + e;
                }
                else if (element.toLocaleLowerCase().includes('h')) {
                    if (blankSpace == false) {
                        result = result.slice(0, -1);
                        result += ' ';
                        blankSpace = true;
                    }
                    result += this.addZero(calculateDate.getHours().toString()) + hours
                }
                else if (element.toLocaleLowerCase().includes('mi')) {
                    if (blankSpace == false) {
                        result = result.slice(0, -1);
                        result += ' ';
                        blankSpace = true;
                    }
                    result += this.addZero(calculateDate.getMinutes().toString()) + hours
                }
                else if (element.toLocaleLowerCase().includes('s')) {
                    if (blankSpace == false) {
                        result = result.slice(0, -1);
                        result += ' ';
                        blankSpace = true;
                    }
                    result += this.addZero(calculateDate.getSeconds().toString()) + hours
                }
                else {
                    result += this.addZero(calculateDate.getDate().toString()) + e;
                }
            });

            result = result.trim();

            if (result[result.length - 1] == e || result[result.length - 1] == hours) {
                result = result.slice(0, -1);
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