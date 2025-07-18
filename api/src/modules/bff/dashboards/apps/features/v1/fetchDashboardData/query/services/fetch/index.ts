import { IOrdersType, IUserOrdersType, IUserProfileType } from "@/modules/bff/dashboards/shared/types";
import { bullMqRedisConnection, IServiceHandlerAsync, JsonString, ReplyMessageBullMq, RequestReplyMessageBullMq, RequestReplyProducerBullMq, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync } from "@kishornaik/utils";
import { randomUUID } from "crypto";

const requestUserQueue = 'get_user_by_id_queue';
const requestOrderQueue = 'get_orders_by_user_id_queue';

const producerUser = new RequestReplyProducerBullMq(bullMqRedisConnection);
producerUser.setQueues(requestUserQueue).setQueueEvents();

const producerOrder = new RequestReplyProducerBullMq(bullMqRedisConnection);
producerOrder.setQueues(requestOrderQueue).setQueueEvents();

export interface IFetchUserOrderServiceParameters{
  userId:string;
  traceId:string;
}

export interface IFetchUserOrderService extends IServiceHandlerAsync<IFetchUserOrderServiceParameters,IUserOrdersType>{}

@sealed
@Service()
export class FetchUserOrderService implements IFetchUserOrderService{

  public handleAsync(params: IFetchUserOrderServiceParameters): Promise<Result<IUserOrdersType, ResultError>> {
    return tryCatchResultAsync(async ()=>{

      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,`parameter is required`);

      if(!params.userId)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,`user id is required`);

      if(!params.traceId)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,`traceId is required`);

      const {traceId, userId}=params

      // Fetch User
      const messageUser: RequestReplyMessageBullMq<string> = {
				correlationId: randomUUID().toString(),
        timestamp: new Date().toISOString(),
        traceId:traceId,
				data: userId
			};
      const userPromise:Promise<ReplyMessageBullMq<JsonString>>=producerUser.sendAsync<string,JsonString>(`JOB:${requestUserQueue}`,messageUser);

      // Fetch Orders
      const messageOrders:RequestReplyMessageBullMq<string>={
        correlationId: randomUUID().toString(),
        timestamp: new Date().toISOString(),
        traceId:traceId,
				data: userId
      }
      const orderPromise:Promise<ReplyMessageBullMq<JsonString>>=producerOrder.sendAsync<string,JsonString>(`JOB:${requestOrderQueue}`,messageOrders);

      // Await All
      const [userMessageResult,orderMessageResult]=await Promise.all([userPromise,orderPromise]);

      // Parse & Bind Result
      if(!userMessageResult.success || !orderMessageResult.success){
        return ResultFactory.error(StatusCodes.INTERNAL_SERVER_ERROR,`Error in fetching user or orders`);
      }

      const userResult:IUserProfileType=JSON.parse(userMessageResult.data);
      const orderResult:Array<IOrdersType>=JSON.parse(orderMessageResult.data);

      const userOrderResult:IUserOrdersType={
        user:userResult,
        orders:orderResult
      };

      // Return
      return ResultFactory.success(userOrderResult);
    });
  }

}
