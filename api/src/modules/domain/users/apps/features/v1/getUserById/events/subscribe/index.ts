import { logConstruct, logger } from "@/shared/utils/helpers/loggers";
import { mediator } from "@/shared/utils/helpers/medaitR";
import { bullMqRedisConnection, JsonString, ReplyMessageBullMq, RequestReplyConsumerBullMq, StatusCodes, WorkerBullMq } from "@kishornaik/utils";
import { GetUserByIdRequestDto } from "../../contracts";
import { GetUserByIdQuery } from "../../query";

const requestQueue = 'get_user_by_id_queue';
const consumer = new RequestReplyConsumerBullMq(bullMqRedisConnection);

export const getUserByIdIntegrationEvent:WorkerBullMq=async()=>{
  const worker=await consumer.startConsumingAsync<string,JsonString>(requestQueue,
    async (reply)=>{

      // Get Id
      const id:string=reply.data.data;
      if(!id){
        return {
          success:false,
          message:'Id not found',
          statusCode:StatusCodes.BAD_REQUEST,
          error:`Id not found`,
          correlationId:reply.data.correlationId,
          traceId:reply.data.traceId,
          timestamp:new Date().toISOString()
        }
      }

      // Dto Map
      const dto:GetUserByIdRequestDto=new GetUserByIdRequestDto();
      dto.id=id;

      // Query
      const query:GetUserByIdQuery=new GetUserByIdQuery(dto);
      const response=await mediator.send(query);

      if(!response.Success)
      {
        return {
          success:false,
          message:response.Message,
          statusCode:response.StatusCode,
          error:response.Message,
          correlationId:reply.data.correlationId,
          traceId:reply.data.traceId,
          timestamp:new Date().toISOString()
        }
      }

      // Map Response
      const dataJson:JsonString=JSON.stringify(response.Data) as JsonString;

      const message: ReplyMessageBullMq<JsonString> = {
				correlationId: reply.data.correlationId,
				success: true,
				data: dataJson,
				message: `Processed request with data: ${JSON.stringify(reply.data.data)}`,
        statusCode: StatusCodes.OK,
        traceId: reply.data.traceId,
        timestamp: new Date().toISOString(),
			};

      // return
      return message;
    }
  );

 worker.on('completed', (job) => {
    const jobData=job.data;
		logger.info(logConstruct(`getUserByIdIntegrationEvent`,`completed`,`${requestQueue} Integration Event Completed`,jobData.traceId));
	});

	worker.on('failed', (job, err) => {
		const jobData=job.data;
		logger.info(logConstruct(`getUserByIdIntegrationEvent`,`failed`,`${requestQueue} Integration Event Failed`,jobData.traceId));
	});
}
