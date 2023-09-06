import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Chat } from '../models/chat';
import { User } from '../models/user';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';

import { bufferToggle } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  url = 'https://img.icons8.com/ios/100/000000/contract-job.png';
  selectedFile: File | undefined;

  onSelect(event: any) {
    const fileEvent = event;
    let fileType = event.target.files[0].type;
    console.log('Selected file:', event.target.files[0]);

    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.uploadProfilePic(fileEvent?.target?.files);
      };
    } else {
      window.alert('Please select correct image format');
    }
  }

  chatId: any = 0;
  registerForm: FormGroup;
  loginForm: FormGroup;
  successregister: boolean = false;
  registermsg = '';
  alert = '';
  loginmsg = '';
  alert2 = '';
  currentuser = '';
  successlogin: boolean = false;
  public userObj: User = new User();
  public alluser: any = [];
  secondUsername = '';
  chatObj: Chat = new Chat();
  public chatData: any = [];
  check = '';
  loggedIn: boolean = false;
  loggedOut: boolean = true;
  chatbox: boolean = true;
  sign: boolean = true;
  credentials = {
    username: '',
    password: '',
  };

  logout() {
    this.loggedIn = false;
    this.loggedOut = true;
    this.router.navigateByUrl('/#');
    sessionStorage.clear();
  }

  los() {
    console.log('Hello');
    if (this.sign == true) {
      this.sign = false;
    } else {
      this.sign = true;
    }
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private chatService: ChatService
  ) {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.required]),
    });
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  adduser() {
    if (
      this.registerForm.valid &&
      this.registerForm.value.username != null &&
      this.registerForm.value.password != null
    ) {
      if (
        this.registerForm.valid &&
        this.registerForm.value.password ==
          this.registerForm.value.confirmpassword
      ) {
        this.userObj.userName = this.registerForm.value.username;
        this.userObj.password = this.registerForm.value.password;
        console.log(this.userObj);
        this.userService.adduser(this.userObj).subscribe(
          (data: any) => {
            console.log(data);

            this.successregister = true;
            this.alert = 'success';
            this.registermsg = 'Successsfully added';
            this.registerForm.reset();
          },
          (error) => {
            console.log(error.error);
            if (error.status == 409) {
              this.successregister = true;
              this.alert = 'danger';
              this.registermsg = 'Already registered with same username';
              this.registerForm.reset();
            } else {
              this.successregister = true;
              this.alert = 'danger';
              this.registermsg = 'Error';
            }
          }
        );
      } else {
        this.successregister = true;
        this.alert = 'danger';
        this.registermsg = "Password Doesn't match";
        setTimeout(() => {
          this.registermsg = '';
          this.successregister = false;
        }, 2000);
      }
    } else {
      this.successregister = true;
      this.alert = 'danger';
      this.registermsg = 'Fields are empty';
      setTimeout(() => {
        this.registermsg = '';
        this.successregister = false;
      }, 2000);
    }
  }
  logoutUser() {
    this.userService.logout();
    this.loggedIn = false;
    this.loggedOut = true;
    localStorage.removeItem('token');
    this.successlogin = false;
    this.router.navigateByUrl('/');
    sessionStorage.clear();
  }

  onSubmit() {
    if (
      this.credentials.username != '' &&
      this.credentials.password != '' &&
      this.credentials.username != null &&
      this.credentials.password != null
    ) {
      this.userService.generateToken(this.credentials).subscribe(
        (response: any) => {
          console.log(response.token);
          this.userService.loginUser(response.token);
          localStorage.setItem('token', response.token);
          this.successlogin = true;
          this.alert2 = 'success';
          this.loginmsg = 'Successsfully LoggedIn';

          sessionStorage.setItem('username', this.loginForm.value.username);
          this.check = this.loginForm.value.username;
          this.currentuser = this.loginForm.value.username;
          this.loginForm.reset();

          this.loggedIn = true;
          this.loggedOut = false;
          // setInterval(() => {
          //   this.userService.getAll().subscribe((data) => {
          //     // console.log(data);

          //     this.alluser = data;

          //   })
          // }, 1000);

          this.getProfilePic();

          this.router.navigateByUrl('/chat');
        },
        (error) => {
          console.log(error);
          if (error.status == 401) {
            this.successlogin = true;
            this.alert2 = 'danger';
            this.loginmsg = 'Not a registerd user';
          } else {
            this.successlogin = true;
            this.alert2 = 'danger';
            this.loginmsg = 'Not a registerd user';
            setTimeout(() => {
              this.loginmsg = '';
              this.successlogin = false;
            }, 2000);
          }
        }
      );
    } else {
      this.successlogin = true;
      this.alert2 = 'danger';
      this.loginmsg = 'Fields are empty';
      setTimeout(() => {
        this.loginmsg = '';
        this.successlogin = false;
      }, 2000);
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.userService
        .getUserByUsernameandPassword(
          this.loginForm.value.username,
          this.loginForm.value.password
        )
        .subscribe(
          (data: any) => {
            console.log(data);

            this.successlogin = true;
            this.alert2 = 'success';
            this.loginmsg = 'Successsfully LoggedIn';

            sessionStorage.setItem('username', this.loginForm.value.username);
            this.check = this.loginForm.value.username;
            this.currentuser = this.loginForm.value.username;
            this.loginForm.reset();

            this.loggedIn = true;
            this.loggedOut = false;

            this.router.navigateByUrl('/chat');
          },
          (error) => {
            console.log(error.error);
            if (error.status == 404) {
              this.successlogin = true;
              this.alert2 = 'danger';
              this.loginmsg = 'Not a registerd user';
            } else {
              this.successlogin = true;
              this.alert2 = 'danger';
              this.loginmsg = 'Error';
            }
          }
        );
    }
  }

  goToChat(username: any) {
    this.chatService
      .getChatByFirstUserNameAndSecondUserName(
        username,
        sessionStorage.getItem('username')
      )
      .subscribe(
        (data) => {
          this.chatData = data;
          this.chatId = this.chatData[0].chatId;
          sessionStorage.setItem('chatId', this.chatId);
          this.router.navigateByUrl('/chat');
        },
        (error) => {
          if (error.status == 404) {
            this.chatObj.firstUserName = sessionStorage.getItem('username');
            this.chatObj.secondUserName = username;
            this.chatService.createChatRoom(this.chatObj).subscribe((data) => {
              this.chatData = data;
              sessionStorage.setItem('chatId', this.chatData[0].chatId);
              // this.router.navigateByUrl('/chat');
              console.log('2');
            });
          } else {
            // this.router.navigateByUrl('/chat');
            console.log('3');
          }
        }
      );
  }

  private uploadProfilePic(files: File[]) {
    const userId = this.currentuser;
    const image = files?.length ? files[0] : null;
    if (image && userId) {
      this.userService.uploadProfilePic(image, userId, image.type).subscribe(
        (res) => {
          window.alert('Profile pic uploaded');
          this.getProfilePic();
        },
        (err) => {},
        () => {
          console.log('Finally getting profile pic');
          this.getProfilePic();
        }
      );
    } else {
      window.alert('Unable to upload profile pic');
    }
  }

  private getProfilePic() {
    console.log('Get profile pic');
    this.userService.getProfilePic(this.currentuser).subscribe((res: any) => {
      console.log(res);
      const dataUri = `data:${res.fileType};base64,${res?.picture?.data}`;
      this.url = dataUri;
    });
  }
}
