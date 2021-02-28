import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Description} from '../models/description.models';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  constructor(private http:HttpClient) { }

  public getDescription(file: File):Observable<Description> {
    return this.http.post<Description>('https://testdnd.azurewebsites.net/api/TestHttp',file,{headers:{'Content-Type':file.type}});
  }

}
