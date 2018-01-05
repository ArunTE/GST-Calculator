import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductListService {

  constructor(private http: Http) { }

  get () {
    return this.http.get(`https://raw.githubusercontent.com/Shanmugapriya03/GST_Calculator/master/components/data.json`)
      .map((res: Response) => res.json());
  }

}
