import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RequestHandlerService {
  options :any = {
    duration: 2000,
    verticalPosition: 'bottom',
    horizontalPosition : 'right',
    panelClass: []
 };

responseStatus : any = {
  SUCCESS : "notification-success",
  ERROR : "notification-error",
}


 ErrorResponseHandler(errorCode : string,errorMsg : string){
  let message : any;
  switch(errorCode){
    case "TRPCClientError":
      message = this.TRPCClientError(errorMsg);
      break;
      case "UNAUTHORIZED":
        message = this.TRPCClientError(errorMsg);
        break;
      case "BAD_REQUEST":
        message = this.TRPCClientError(errorMsg);
        break;
    default:
      message = 'Error';
      break;
  }
  return {message : message , options : {...this.options,panelClass:['notification-error']}};
 }


 TRPCClientError(message : string){
   return this.titleCase(message);
}


SuccessResponseHandler(message : string, status : string){
  return {message : this.titleCase(message) , options : {...this.options,panelClass:[this.responseStatus[status]]}};
 }

titleCase(str:string) {
  return str.toLowerCase().replace(/\b\w/g, (s:string) => s.toUpperCase());
}

}
