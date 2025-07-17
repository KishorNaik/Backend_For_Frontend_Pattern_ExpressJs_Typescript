import { OrderEntity } from "@/modules/domain/orders/shared/mock";
import { IServiceHandlerAsync, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync,Enumerable } from "@kishornaik/utils";
import { GetOrdersByUserIdResponseDto } from "../../../contracts";

export interface IGetOrdersByUserIdMapResponseService extends IServiceHandlerAsync<Array<OrderEntity>, Array<GetOrdersByUserIdResponseDto>> {
}

@sealed
@Service()
export class GetOrdersByUserIdMapResponseService implements IGetOrdersByUserIdMapResponseService {
  public handleAsync(params: Array<OrderEntity>): Promise<Result<Array<GetOrdersByUserIdResponseDto>, ResultError>> {
    return tryCatchResultAsync(async ()=>{
      //Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,`OrderEntity is required`);

      if(params.length===0)
        return ResultFactory.error(StatusCodes.NOT_FOUND,`Orders not found`);

      // Map Response
      const response=Enumerable
        .from(params)
        .select<GetOrdersByUserIdResponseDto>(x=>({
          id:x.id,
          userId:x.userId,
          status:x.status,
          amount:x.amount,
          date:x.date
      })).toArray();

      // Return
      return ResultFactory.success(response);
    });
  }

}
