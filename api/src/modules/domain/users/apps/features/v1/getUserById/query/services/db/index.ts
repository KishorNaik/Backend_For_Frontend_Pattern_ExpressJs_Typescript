import { IServiceHandlerAsync, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync,Enumerable } from "@kishornaik/utils";
import { GetUserByIdRequestDto } from "../../../contracts";
import { UserEntity, userMockData } from "@/modules/domain/users/shared/mock";


export interface IGetUserByIdDbService extends IServiceHandlerAsync<GetUserByIdRequestDto, UserEntity>{
}

@sealed
@Service()
export class GetUserByIdDbService implements IGetUserByIdDbService  {
  public handleAsync(params: GetUserByIdRequestDto): Promise<Result<UserEntity, ResultError>> {
    return tryCatchResultAsync(async ()=>{

      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST, 'Params is required');

      const {id}=params;

      // Get User By Id Service
      const result=Enumerable.from(userMockData).firstOrDefault(x=>x.id===id);

      if(!result)
        return ResultFactory.error(StatusCodes.NOT_FOUND, 'User not found');

      // Return
      return ResultFactory.success(result);
    });
  }

}
