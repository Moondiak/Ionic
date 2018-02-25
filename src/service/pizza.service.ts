import {Injectable} from '@angular/core';
import {Pizza} from '../model/pizza';
import {Response} from '../model/response';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import * as io from 'socket.io-client';
import {Socket} from '../model/socket';

@Injectable()
export class PizzaService {
  private socket;

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  get(): Observable<Response<Pizza[]>> {
    return this.http.get<Response<Pizza[]>>(`${this.config.getApiUrl()}/pizzas`);
  }

  getById(id: string): Observable<Response<Pizza>> {
    return this.http.get<Response<Pizza>>(`${this.config.getApiUrl()}/pizzas/${id}`);
  }

  search(search: string): Observable<Response<Pizza[]>> {
    return this.http.get<Response<Pizza[]>>(`${this.config.getApiUrl()}/pizzas?name=${search}`);
  }

  add(pizza: Pizza): Observable<Response<Pizza>> {
    return this.http.post<Response<Pizza>>(`${this.config.getApiUrl()}/pizzas/add`, pizza);
  }

  update(pizza: Pizza, id: string): Observable<Response<Pizza>> {
    return this.http.put<Response<Pizza>>(`${this.config.getApiUrl()}/pizzas/${id}`, pizza);
  }

  remove(id: string): Observable<Response<Boolean>> {
    return this.http.delete<Response<Boolean>>(`${this.config.getApiUrl()}/pizzas/${id}`);
  }

  listen() {
    return new Observable<Socket>(observer => {
      this.socket = io(this.config.getApiUrl());
      this.socket.on('pizza', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
