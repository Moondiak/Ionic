import {Injectable} from '@angular/core';

@Injectable()
export class ConfigService {
  private apiUrl = 'http://kim.jcatania.io:3000/pizza';

  constructor() {
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

}
