import {Injectable} from '@angular/core';
import {Ingredient} from '../model/ingredient';
import {Response} from '../model/response';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import * as io from 'socket.io-client';
import {Socket} from '../model/socket';

@Injectable()
export class IngredientService {
  private socket;

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  get(): Observable<Response<Ingredient[]>> {
    return this.http.get<Response<Ingredient[]>>(`${this.config.getApiUrl()}/ingredients`);
  }

  getById(id: string): Observable<Response<Ingredient>> {
    return this.http.get<Response<Ingredient>>(`${this.config.getApiUrl()}/ingredients/${id}`);
  }

  search(search: string): Observable<Response<Ingredient[]>> {
    return this.http.get<Response<Ingredient[]>>(`${this.config.getApiUrl()}/ingredients?name=${search}`);
  }

  add(ingredient: Ingredient): Observable<Response<Ingredient>> {
    return this.http.post<Response<Ingredient>>(`${this.config.getApiUrl()}/ingredients/add`, ingredient);
  }

  update(ingredient: Ingredient, id: string): Observable<Response<Ingredient>> {
    return this.http.put<Response<Ingredient>>(`${this.config.getApiUrl()}/ingredients/${id}`, ingredient);
  }

  remove(id: string): Observable<Response<Boolean>> {
    return this.http.delete<Response<Boolean>>(`${this.config.getApiUrl()}/ingredients/${id}`);
  }

  listen() {
    return new Observable<Socket>(observer => {
      this.socket = io(this.config.getApiUrl());
      this.socket.on('ingredient', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
