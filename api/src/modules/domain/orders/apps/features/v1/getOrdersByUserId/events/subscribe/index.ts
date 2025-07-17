import { logConstruct, logger } from '@/shared/utils/helpers/loggers';
import {
	bullMqRedisConnection,
	JsonString,
	ReplyMessageBullMq,
	RequestReplyConsumerBullMq,
	StatusCodes,
	WorkerBullMq,
} from '@kishornaik/utils';
import { GetOrdersByUserIdRequestDto } from '../../contracts';
import { GetOrdersByUserIdQuery } from '../../query';
import { mediator } from '@/shared/utils/helpers/medaitR';

const requestQueue = 'get_orders_by_user_id_queue';
const consumer = new RequestReplyConsumerBullMq(bullMqRedisConnection);

export const getOrdersByUserIdIntegrationEvent: WorkerBullMq = async () => {
	const worker = await consumer.startConsumingAsync<string, JsonString>(
		requestQueue,
		async (reply) => {
			const id: string = reply.data.data;
			if (!id) {
				return {
					success: false,
					message: 'Id not found',
					statusCode: StatusCodes.BAD_REQUEST,
					error: `Id not found`,
					correlationId: reply.data.correlationId,
					traceId: reply.data.traceId,
					timestamp: new Date().toISOString(),
				};
			}

			// Dto Map
			const dto: GetOrdersByUserIdRequestDto = new GetOrdersByUserIdRequestDto();
			dto.userId = id;

			// Query
			const query: GetOrdersByUserIdQuery = new GetOrdersByUserIdQuery(dto);
			const response = await mediator.send(query);

			if (!response.Success) {
				return {
					success: false,
					message: response.Message,
					statusCode: response.StatusCode,
					error: response.Message,
					correlationId: reply.data.correlationId,
					traceId: reply.data.traceId,
					timestamp: new Date().toISOString(),
				};
			}

			// Map Response
			const dataJson: JsonString = JSON.stringify(response.Data) as JsonString;

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
		const jobData = job.data;
		logger.info(
			logConstruct(
				`getOrderByIdIntegrationEvent`,
				`completed`,
				`${requestQueue} Integration Event Completed`,
				jobData.traceId
			)
		);
	});

	worker.on('failed', (job, err) => {
		const jobData = job.data;
		logger.info(
			logConstruct(
				`getOrderByIdIntegrationEvent`,
				`failed`,
				`${requestQueue} Integration Event Failed`,
				jobData.traceId
			)
		);
	});
};
