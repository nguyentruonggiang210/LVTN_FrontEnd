import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { RoomValidateDto } from 'src/app/models/RoomValidateDto';
import { environment } from 'src/environments/environment';
import { GroupChatDto } from 'src/app/models/hubs/GroupChatDto';
import { AuthService } from '../common/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private httpClient: HttpClient,
    private authService: AuthService) { }

  public validateCourse(id: number, userId: string) {
    return this.httpClient.post<BaseResponse<RoomValidateDto>>(environment.apiUrl + 'CourseManagement/validate/' + id + '/' + userId, null);
  }

  public getChatList(roomId: number) {
    return this.httpClient.get<BaseResponse<GroupChatDto[]>>(environment.apiUrl + 'Hub/' + roomId);
  }

  public setStream(roomId: number, streamId?: string) {
    return this.httpClient.get<BaseResponse<boolean>>(`${environment.apiUrl}Hub/${roomId}/${streamId}/${this.authService.getUserId()}`);
  }
}
