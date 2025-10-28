import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserModel } from '@models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  // Return the user profile from the API
  getUser(): Observable<UserModel> {
    return this.http.get<UserModel>(this.userUrl);
  }
}
