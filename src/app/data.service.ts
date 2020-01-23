import { Injectable } from '@angular/core';
import { retry, catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public first = '';
  public prev = '';
  public next = '';
  public last = '';
  constructor() { }
  parseLinkHeader(header) {
    if (header.length === 0) {
      return ;
    }
    const parts = header.split(',');
    const links = [];
    parts.forEach(p => {
      const section = p.split(';');
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel='(.*)'/, '$1').trim();
      links[name] = url;
    });
    this.first = links["first"];
    this.last = links['last'];
    this.prev = links['prev'];
    this.next = links['next'];
  }
}
