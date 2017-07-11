import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductListService {

  constructor(private http: Http) { }

  get () {
    return this.http.get(`https://sheetsu.com/apis/v1.0/9258c5dc86bf`)
      .map((res: Response) => res.json());
  }

}
