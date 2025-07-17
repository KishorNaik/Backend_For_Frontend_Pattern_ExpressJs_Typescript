import { UserEntity } from '@/modules/domain/users/shared/mock';
import {
	IServiceHandlerAsync,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
	StatusCodes,
	tryCatchResultAsync,
} from '@kishornaik/utils';
import { GetUserByIdResponseDto } from '../../../contracts';

export interface IGetUserByIdMapResponseService
	extends IServiceHandlerAsync<UserEntity, GetUserByIdResponseDto> {}

@sealed
@Service()
export class GetUserByIdMapResponseService implements IGetUserByIdMapResponseService {
	public handleAsync(params: UserEntity): Promise<Result<GetUserByIdResponseDto, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultFactory.error(StatusCodes.BAD_REQUEST, `UserEntity is required`);

			// Map Response
			const getUserByIdMapResponse: GetUserByIdResponseDto = new GetUserByIdResponseDto();
			getUserByIdMapResponse.id = params.id;
			getUserByIdMapResponse.email = params.email;
			getUserByIdMapResponse.name = params.name;
			getUserByIdMapResponse.plan = params.plan;
			getUserByIdMapResponse.preferences = {
				theme: params.preferences.theme,
				language: params.preferences.language,
			};

			//Return
			return ResultFactory.success(getUserByIdMapResponse);
		});
	}
}
