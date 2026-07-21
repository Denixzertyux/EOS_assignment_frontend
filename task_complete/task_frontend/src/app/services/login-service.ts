import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) {}

    login(credentials:any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, credentials, { responseType: 'text' });
    }

    register(user:any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login/register`, user);
    }
}