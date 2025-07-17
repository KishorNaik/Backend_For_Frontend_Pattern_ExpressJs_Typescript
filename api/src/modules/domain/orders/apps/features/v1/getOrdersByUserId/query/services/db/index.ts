import { IServiceHandlerAsync, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync,Enumerable } from "@kishornaik/utils";
import { GetOrdersByUserIdRequestDto } from "../../../contracts";
import { OrderEntity, orderMockData } from "@/modules/domain/orders/shared/mock";

export interface IGetOrderByUserIdDbService extends IServiceHandlerAsync<GetOrdersByUserIdRequestDto,OrderEntity[]>{
}

@sealed
@Service()
export class GetOrdersByUserIdDbService implements IGetOrderByUserIdDbService {

  public handleAsync(params: GetOrdersByUserIdRequestDto): Promise<Result<OrderEntity[], ResultError>> {
    return tryCatchResultAsync(async ()=>{

      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST, 'Params is required');

      const {userId}=params;

      // Filter
      const orders=Enumerable.from(orderMockData).where(x=>x.userId===userId).toArray();
      if(orders.length===0)
        return ResultFactory.error(StatusCodes.NOT_FOUND, 'Orders not found');

      // Return
      return ResultFactory.success(orders);
    })
  }

}
