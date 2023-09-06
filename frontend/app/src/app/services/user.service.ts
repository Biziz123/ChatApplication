import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  generateToken(credentials: any) {
    return this.httpClient.post(`${this.baseUrl}/token`, credentials);
  }

  loginUser(token: string) {
    localStorage.setItem('token', token);
    return true;
  }
  isLoggedIn() {
    let token = localStorage.getItem('token');
    if (token == undefined || token == '' || token == null) {
      return false;
    } else {
      return true;
    }
  }
  logout() {
    localStorage.removeItem('token');
    return true;
  }
  gettoken() {
    return localStorage.getItem('token');
  }

  getAll() {
    return this.httpClient.get<User[]>(this.baseUrl + '/user/getall');
  }

  adduser(user: User): Observable<Object> {
    return this.httpClient.post(this.baseUrl + '/user/add', user);
  }

  getUserByUsername(username: any) {
    return this.httpClient.get<User>(
      this.baseUrl + '/user/getbyusername/' + username
    );
  }
  getUserByUsernameandPassword(username: any, password: any) {
    return this.httpClient.get<User>(
      this.baseUrl +
        '/user/getbyusernameandPassword/' +
        username +
        '/' +
        password
    );
  }

  uploadProfilePic(image: any, userId: string, fileType: string) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', userId);
    formData.append('fileType', fileType);
    return this.httpClient.post(
      this.baseUrl + '/user/profilePic/upload',
      formData
    );
  }

  getProfilePic(userId: string) {
    return this.httpClient.get(this.baseUrl + '/user/profilePic/' + userId);
  }
}
