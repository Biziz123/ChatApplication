import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Chat } from '../models/chat';
import { Message } from '../models/message';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  updateMediaChat(
    chatId: any,
    image: any,
    fileType: string,
    userId: string
  ): Observable<Object> {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('image', image);
    formData.append('fileType', fileType);
    formData.append('userId', userId);

    return this.httpClient.post(
      this.baseUrl + '/chats/media/message',
      formData
    );
  }

  updateChat(message: Message, chatId: any): Observable<Object> {
    return this.httpClient.put(
      this.baseUrl + '/chats/message/' + `${chatId}`,
      message
    );
  }

  getChatById(chatId: any) {
    return this.httpClient.get<Chat>(this.baseUrl + '/chats/' + chatId);
  }

  createChatRoom(chat: Chat): Observable<Object> {
    return this.httpClient.post(this.baseUrl + '/chats/add', chat);
  }

  getChatByFirstUserNameAndSecondUserName(
    firstUserName: String,
    secondUserName: String
  ) {
    return this.httpClient.get<Chat>(
      this.baseUrl +
        '/chats/getChatByFirstUserNameAndSecondUserName' +
        '?firstUserName=' +
        firstUserName +
        '&secondUserName=' +
        secondUserName
    );
  }

  getChatByFirstUserNameOrSecondUserName(username: any) {
    return this.httpClient.get<Chat>(
      this.baseUrl + '/chats/getChatByFirstUserNameOrSecondUserName/' + username
    );
  }
  deleteChats(chatId: number) {
    const url = `${this.baseUrl}/chats/deleteChats/${chatId}`;
    console.log(url);

    return this.httpClient.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error deleting chat:', error);
        throw error; // Rethrow the error to let the caller handle it
      })
    );
  }
}
