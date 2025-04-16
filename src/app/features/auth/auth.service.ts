import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../../data/user.model";
import { environment } from "../../../environments/environment";
import { Observable, throwError, tap, map, catchError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;
  private tokenUrl = `${environment.apiUrl}/auth`;
  private currentUser: User | null = null;

  async loginOrRegister(email: string): Promise<User> {
    let user = await this.getUserByEmail(email);
    if (!user) {
      user = await this.createUser(email);
    }
    this.setCurrentUser(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.http.get<User>(`${this.baseUrl}/${email}`).toPromise();
      return user ?? null;
    } catch {
      return null;
    }
  }

  async createUser(email: string): Promise<User> {
    try {
      const user = await this.http.post<User>(this.baseUrl, { email }).toPromise();
      if (!user) throw new Error("No se pudo crear el usuario");
      return user;
    } catch (err) {
      console.error("Error al crear usuario:", err);
      throw err;
    }
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem("user", JSON.stringify(user));
    if (user.token) {
      localStorage.setItem("accessToken", user.token);
    }
    if (user.refreshToken) {
      localStorage.setItem("refreshToken", user.refreshToken);
    }
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  refreshToken(): Observable<string> {
    const refresh = this.getRefreshToken();
    if (!refresh) return throwError(() => new Error("No refresh token"));

    return this.http.post<{ accessToken: string }>(`${this.tokenUrl}/refresh-token`, { refreshToken: refresh }).pipe(
      tap(res => {
        localStorage.setItem("accessToken", res.accessToken);
      }),
      map(res => res.accessToken),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  getUserId(): string | null {
    return this.getCurrentUser()?.id || null;
  }

  getUserEmail(): string | null {
    return this.getCurrentUser()?.email || null;
  }
}
