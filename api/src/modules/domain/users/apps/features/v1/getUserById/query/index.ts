import {
	RequestData,
	sealed,
	StatusCodes,
	DataResponse,
	requestHandler,
	RequestHandler,
	DataResponseFactory,
	PipelineWorkflowException,
	PipelineWorkflow,
	Container,
} from '@kishornaik/utils';
import { logger } from '@/shared/utils/helpers/loggers';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { GetUserByIdRequestDto, GetUserByIdResponseDto } from '../contracts';
import { GetUserByIdValidationService } from './services/validations';
import { GetUserByIdDbService } from './services/db';
import { GetUserByIdMapResponseService } from './services/mapResponse';
import { UserEntity } from '@/modules/domain/users/shared/mock';

// #region Query
@sealed
export class GetUserByIdQuery extends RequestData<DataResponse<GetUserByIdResponseDto>> {
	private readonly _request: GetUserByIdRequestDto;
	constructor(request: GetUserByIdRequestDto) {
		super();
		this._request = request;
	}

	public get request(): GetUserByIdRequestDto {
		return this._request;
	}
}
// #endregion

//# region Pipeline Steps
enum PipelineSteps {
	ValidationService = 'ValidationService',
	DbService = 'DbService',
	MapResponse = 'MapResponse',
}
//#endregion

// #region Query Handler
@sealed
@requestHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
	implements RequestHandler<GetUserByIdQuery, DataResponse<GetUserByIdResponseDto>>
{
	private pipeline = new PipelineWorkflow(logger);
	private readonly _getUserByIdValidationService: GetUserByIdValidationService;
	private readonly _getUserByIdDbService: GetUserByIdDbService;
	private readonly _getUserByIdMapResponseService: GetUserByIdMapResponseService;

	public constructor() {
		this._getUserByIdValidationService = Container.get(GetUserByIdValidationService);
		this._getUserByIdDbService = Container.get(GetUserByIdDbService);
		this._getUserByIdMapResponseService = Container.get(GetUserByIdMapResponseService);
	}

	public async handle(value: GetUserByIdQuery): Promise<DataResponse<GetUserByIdResponseDto>> {
		try {
			// Guard
			if (!value)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `Query is required`);

			if (!value.request)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `Request is required`);

			const { request } = value;

			// Validation Service
			await this.pipeline.step(PipelineSteps.ValidationService, async () => {
				return await this._getUserByIdValidationService.handleAsync({
					dto: request,
					dtoClass: GetUserByIdRequestDto,
				});
			});

			// Get User By Id Service
			await this.pipeline.step(PipelineSteps.DbService, async () => {
				return await this._getUserByIdDbService.handleAsync(request);
			});

			// Map Response Services
			await this.pipeline.step(PipelineSteps.MapResponse, async () => {
				// Get Db Result
				const userEntity = this.pipeline.getResult<UserEntity>(PipelineSteps.DbService);

				return this._getUserByIdMapResponseService.handleAsync(userEntity);
			});

			// Return
			const response = this.pipeline.getResult<GetUserByIdResponseDto>(
				PipelineSteps.MapResponse
			);
			return DataResponseFactory.success(StatusCodes.OK, response);
		} catch (ex) {
			return await DataResponseFactory.pipelineError(ex);
		}
	}
}
// #endregion
