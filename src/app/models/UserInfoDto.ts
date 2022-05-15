import { BillDto } from "./admin/BillDto";
import { MeetingRoomScheduleDto } from "./MeetingRoomScheduleDto";

export interface UserInfoDto {
    userId: string,
    userName: string,
    name: string,
    avatar?: string,
    email: string,
    age: number,
    address: string,
    description: string,
    gender: number,
    isExternalAccount?: boolean,
    roles?: string[],
    meetingRoomSchedules?: MeetingRoomScheduleDto[],
    bills?: BillDto[],
}