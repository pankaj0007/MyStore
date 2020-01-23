import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, retry, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private SERVER_URL = 'http://localhost:3000/product';
  public first = '';
  public prev = '';
  public next = '';
  public last = '';
  constructor(private httpClient: HttpClient) { }
  parseLinkHeader(header) {
    if (header.length === 0) {
      return ;
    }
    const parts = header.split(',');
    const links = [];
    parts.forEach(p => {
      const section = p.split(';');
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      console.log('url : ', url);
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
      console.log(links);
    });
    this.first = links["first"];
    this.last = links['last'];
    this.prev = links['prev'];
    this.next = links['next'];
    console.log('first', this.first);
    console.log('Last', this.last);
  }
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error!';
    if (error.error instanceof ErrorEvent) {
      // client side error
      errorMessage = `Error code: ${error.error.message}`;
    } else {
      // server side error
      errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  public sendGetRequest() {
    return this.httpClient.get(this.SERVER_URL, { params : new HttpParams({fromString: '_page=1&_limit=5'}), observe: 'response'})
      .pipe(retry(3)).pipe(catchError(this.handleError), tap(res => {
        console.log(res.headers.get('Link'));
        this.parseLinkHeader(res.headers.get('Link'));
      }));
  }

  public sendGetRequestToUrl(url: string) {
    return this.httpClient.get(url, {observe: 'response'})
      .pipe(retry(3)).pipe(catchError(this.handleError), tap(res => {
        console.log(res.headers.get('Link'));
        this.parseLinkHeader(res.headers.get('Link'));
      }));
  }
}
