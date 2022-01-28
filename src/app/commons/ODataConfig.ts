import { ODataConfiguration } from "angular-odata-es5";
import { environment } from '../../environments/environment';

export class ODataConfig extends ODataConfiguration{
    baseUrl = environment.apiUrl;
}