import { IsSafeString } from '@kishornaik/utils';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

// #region Request Dto
export class GetOrdersByUserIdRequestDto {
	@IsNotEmpty()
	@IsString()
	@IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
	@IsUUID()
	@Type(() => String)
	userId: string;
}
// #endregion

// #region Response Dto
export class GetOrdersByUserIdResponseDto {
	id: string;
	status: string;
	amount: number;
	userId: string;
	date: Date;
}
// #endregion
