export enum VerifiedStatus{
  VERIFIED = 0,
  UNVERIFIED = 1,
  REJECTED = 2
}

export enum UserType {
  ADMINISTARTOR = 0,
  CUSTOMER = 1,
  DELIVERY = 2
}

export class User{
  public id:number=0;
  public username:string="";
  public email:string="";
  public password:string="";
  public firstname:string="";
  public lastname:string="";
  public birthDate:string="";
  public address:string="";
  public userType:UserType = UserType.ADMINISTARTOR;
  public photoUrl: string="";
  public isVerified:VerifiedStatus = VerifiedStatus.UNVERIFIED;
  public photo: object=new Object();
} 