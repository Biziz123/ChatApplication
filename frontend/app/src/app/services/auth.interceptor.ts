import { HttpEvent,HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from 'rxjs';
import { UserService } from "./user.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
      
    constructor(private UserService:UserService){}
    
    intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{

        let newReq=req;
        let token=this.UserService.gettoken();
        console.log("INTERCEPTOR", token);

        if(token!=null){
            newReq=newReq.clone({setHeaders:{Authorization:`Bearer ${token}`}})
        }
        return next.handle(newReq)
    }
}