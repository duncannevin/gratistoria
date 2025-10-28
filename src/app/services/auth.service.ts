import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { LoginResponseModel } from '@models/login-response.model';
import { SignupResponseModel } from '@models/signup-response.model';
import { ForgotPasswordResponseModel } from '@models/forgot-password-response.model';
import { VerifyTokenResponseModel } from '@models/verify-token-response.model';
import { ResetPasswordResponseModel } from '@models/reset-password-response.model';
import { ChangePasswordResponseModel } from '@models/change-password-response.model';
import { SignupFormModel } from '@models/signup-form.model';
import { ChangePasswordFormModel } from '@models/change-password-form.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  login(email: string, password: string): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        this.localStorageService.setItem('token', res.accessToken);
        this.localStorageService.setItem('idToken', res.idToken);
      }),
    );
  }

  logout(): Observable<SignupResponseModel> {
    return this.http.get<SignupResponseModel>(`${this.apiUrl}/logout`).pipe(
      tap(() => {
        this.localStorageService.removeItem('token');
        this.localStorageService.removeItem('idToken');
      }),
    );
  }

  signup({ email, password, name }: SignupFormModel): Observable<SignupResponseModel> {
    return this.http.post<SignupResponseModel>(`${this.apiUrl}/signup`, { email, password, name });
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponseModel> {
    return this.http.post<ForgotPasswordResponseModel>(`${this.apiUrl}/forgot-password`, { email });
  }

  verifyToken(email: string, code: string): Observable<VerifyTokenResponseModel> {
    return this.http.post<VerifyTokenResponseModel>(`${this.apiUrl}/verify-email`, { email, code });
  }

  resetPassword(email: string): Observable<ResetPasswordResponseModel> {
    return this.http.post<ResetPasswordResponseModel>(`${this.apiUrl}/reset-password`, { email });
  }

  resendToken(email: string): Observable<VerifyTokenResponseModel> {
    return this.http.post<VerifyTokenResponseModel>(`${this.apiUrl}/resend-token`, { email });
  }

  changePassword({ email, password, code }: ChangePasswordFormModel): Observable<ChangePasswordResponseModel> {
    return this.http.post<ChangePasswordResponseModel>(`${this.apiUrl}/confirm-reset-password`, { email, newPassword: password, code });
  }

  refreshToken(): Observable<LoginResponseModel> {
    const refreshToken = this.localStorageService.getItem<string>('idToken');
    return this.http.post<LoginResponseModel>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap((res) => {
        this.localStorageService.setItem('token', res.accessToken);
        this.localStorageService.setItem('idToken', res.idToken);
      })
    );
  }
}
