import { IsSafeString } from "@kishornaik/utils";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

// #region Request Dto
export class GetUserByIdRequestDto {
  @IsNotEmpty()
	@IsString()
	@IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
	@IsUUID()
	@Type(() => String)
  id:string;
}

//#endregion

// #region Response Dto
export class GetUserByIdResponseDto {
  id:string;
  name:string;
  email:string;
  plan:string;
  avatarUrl:string;
  preferences:{
    theme:string
    language:string
  }
}

// #endregion Response Dto
