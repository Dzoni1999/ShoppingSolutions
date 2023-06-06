import { VerifiedStatus } from "./user.model";

export class VerifyDeliverer
{
    public id:number = 0;
    public isVerified:VerifiedStatus = VerifiedStatus.UNVERIFIED;
}