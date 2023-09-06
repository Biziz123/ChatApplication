import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Chat } from '../models/chat';
import { Message } from '../models/message';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { Media } from 'app/models/media';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  title = 'mdb-angular-ui-kit-free';

  chatForm: FormGroup;
  chatObj: Chat = new Chat();
  messageObj: Message = new Message();

  // chatId: number = 22;
  public messageList: any = [];
  public chatList: any = [];
  replymessage: String = 'checking';
  public chatData: any;
  msg = 'Good work';
  chatId: any = sessionStorage.getItem('chatId');
  color = '';
  secondUserName = '';
  public alluser: any = [];
  check = sessionStorage.getItem('username');
  timesRun = 0;
  timesRun2 = 0;

  firstUserName = sessionStorage.getItem('username');
  senderEmail = sessionStorage.getItem('username');
  senderCheck = sessionStorage.getItem('username');

  constructor(
    private chatService: ChatService,
    private router: Router,
    private userService: UserService
  ) {
    this.chatForm = new FormGroup({
      replymessage: new FormControl(),
    });
  }

  ngOnInit(): void {
    if (this.firstUserName) {
      this.userService
        .getProfilePic(this.firstUserName)
        .subscribe((res: any) => {
          if (res) {
            const dataUri = `data:${res.fileType};base64,${res?.picture?.data}`;
          }
        });
    }

    setInterval(() => {
      this.chatService
        .getChatById(sessionStorage.getItem('chatId'))
        .subscribe((data: any) => {
          this.chatData = data;
          this.messageList = this.chatData.messageList;
          this.secondUserName = this.chatData.secondUserName;
          this.firstUserName = this.chatData.firstUserName;
          // this.messageList.time = this.messageList.time.replace(",","");

          // // Replace the last part of the string ")/" with an empty string
          // this.messageList.time = this.messageList.time.replace(")/", " ")

          // Create a new Date object by parsing the number of milliseconds from the JSON string
          // let strDate = new Date(parseInt(this.messageList.time));
          // console.log(strDate)
        });
    }, 1000);

    let getByname = setInterval(() => {
      // For getting all the chat list whose ever is logged in.
      this.chatService
        .getChatByFirstUserNameOrSecondUserName(
          sessionStorage.getItem('username')
        )
        .subscribe((data) => {
          // console.log(data);
          this.chatData = data;
          this.chatList = this.chatData;
        });

      this.timesRun2 += 1;
      if (this.timesRun2 === 2) {
        clearInterval(getByname);
      }
    }, 1000);

    let all = setInterval(() => {
      this.userService.getAll().subscribe((data) => {
        // console.log(data);

        this.alluser = data;
      });

      this.timesRun += 1;
      if (this.timesRun === 2) {
        clearInterval(all);
      }
    }, 1000);
  }

  loadChatByEmail(event: string, event1: string) {
    // For removing the previous chatId
    sessionStorage.removeItem('chatId');

    // For checking the chat room by both the emails , if there is present then it will give the chat Id in sessionStorage
    this.chatService
      .getChatByFirstUserNameAndSecondUserName(event, event1)
      .subscribe((data) => {
        // console.log(data);
        this.chatData = data;
        this.chatId = this.chatData[0].chatId;
        //console.log(this.chatId);
        sessionStorage.setItem('chatId', this.chatId);

        setInterval(() => {
          this.chatService.getChatById(this.chatId).subscribe((data: any) => {
            this.chatData = data;
            this.messageList = this.chatData.messageList;
            this.secondUserName = this.chatData.secondUserName;
            this.firstUserName = this.chatData.firstUserName;
          });
        }, 1000);
      });
  }

  deleteChats(chat: { chatId: number }) {
    this.chatService.deleteChats(chat.chatId);
  }

  sendMessage() {
    //console.log(this.chatForm.value);

    // This will call the update chat method when ever user send the message
    this.messageObj.replymessage = this.chatForm.value.replymessage;
    this.messageObj.senderEmail = this.senderEmail;
    if (this.messageObj.replymessage.length > 1) {
      this.chatService
        .updateChat(this.messageObj, this.chatId)
        .subscribe((data) => {
          //console.log(data);
          this.chatForm.reset();

          // for displaying the messageList by the chatId
          this.chatService.getChatById(this.chatId).subscribe((data: any) => {
            //console.log(data);
            this.chatData = data;
            // console.log(this.chatData.messageList);console.log(JSON.stringify(this.chatData.messageList));
            this.messageList = this.chatData.messageList;
            this.secondUserName = this.chatData.secondUserName;
            this.firstUserName = this.chatData.firstUserName;
          });
        });
    }
  }

  sendMedia(event: any) {
    if (event?.target?.files?.length)
      this.chatService
        .updateMediaChat(
          this.chatId,
          event.target.files[0],
          event.target.files[0]?.type,
          this.senderEmail
        )
        .subscribe((data) => {
          // for displaying the messageList by the chatId
          this.chatService.getChatById(this.chatId).subscribe((data: any) => {
            //console.log(data);
            this.chatData = data;
            // console.log(this.chatData.messageList);console.log(JSON.stringify(this.chatData.messageList));
            this.messageList = this.chatData.messageList;
            this.secondUserName = this.chatData.secondUserName;
            this.firstUserName = this.chatData.firstUserName;
          });
        });
  }

  routeX() {
    // this.router.navigateByUrl('/navbar/recommendation-service');
    sessionStorage.clear();
    // window.location.reload();
    this.router.navigateByUrl('');
  }

  routeHome() {
    this.router.navigateByUrl('');
  }

  goToChat(username: any) {
    this.chatService
      .getChatByFirstUserNameAndSecondUserName(
        username,
        sessionStorage.getItem('username')
      )
      .subscribe(
        (data) => {
          this.chatId = data.chatId;
          sessionStorage.setItem('chatId', this.chatId);
        },
        (error) => {
          if (error.status == 404) {
            this.chatObj.firstUserName = sessionStorage.getItem('username');
            this.chatObj.secondUserName = username;
            this.chatService.createChatRoom(this.chatObj).subscribe((data) => {
              this.chatData = data;
              this.chatId = this.chatData.chatId;
              sessionStorage.setItem('chatId', this.chatData.chatId);
              this.chatService
                .getChatByFirstUserNameOrSecondUserName(
                  sessionStorage.getItem('username')
                )
                .subscribe((data) => {
                  // console.log(data);
                  this.chatData = data;
                  this.chatList = this.chatData;
                });
            });
          } else {
          }
        }
      );
  }

  getMediaUri(replyMediaContent: Media) {
    if (replyMediaContent) {
      const dataUri = `data:${replyMediaContent.fileType};base64,${replyMediaContent?.picture?.data}`;
      return dataUri;
    }
    return null;
  }

  hasChatRoom(otherUser: any) {
    console.log(otherUser, this.chatList);
    if (otherUser?.userName && this.chatList?.length) {
      return !!this.chatList.find(
        (chat: any) =>
          chat.secondUserName === otherUser.userName ||
          chat.firstUserName === otherUser.userName
      );
    }
    return false;
  }
}
