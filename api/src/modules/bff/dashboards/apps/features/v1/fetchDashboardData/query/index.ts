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
  Result,
  ResultError,
  ResultFactory,
  tryCatchResultAsync
} from '@kishornaik/utils';
import { getTraceId, logger } from '@/shared/utils/helpers/loggers';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { IUserOrdersType } from '@/modules/bff/dashboards/shared/types';
import { DashboardDataFetchRequestDto } from '../contracts';
import { FetchDashboardDataRequestValidationService } from './services/validations';
import { FetchUserOrderService } from './services/fetch';

// #region Query
@sealed
export class FetchDashboardDataQuery extends RequestData<DataResponse<IUserOrdersType>>{

private readonly _request: DashboardDataFetchRequestDto;
	public constructor(request: DashboardDataFetchRequestDto) {
		super();
		this._request = request;
	}
	public get request(): DashboardDataFetchRequestDto {
		return this._request;
	}
}
// #endregion

// #region Pipeline Steps
enum PipelineSteps {
  ValidationService = 'ValidationService',
  FetchUserOrderService = 'FetchUserOrderService',
  MapResponse = 'MapResponse',
}
// #endregion

// #region Query Handler
@sealed
@requestHandler(FetchDashboardDataQuery)
export class FetchDashboardDataQueryHandler implements RequestHandler<FetchDashboardDataQuery, DataResponse<IUserOrdersType>>{

  private pipeline=new PipelineWorkflow(logger);
  private readonly _fetchDashboardDataRequestValidationService:FetchDashboardDataRequestValidationService;
  private readonly _fetchUserOrderService:FetchUserOrderService;

  public constructor(){
    this._fetchDashboardDataRequestValidationService=Container.get(FetchDashboardDataRequestValidationService);
    this._fetchUserOrderService=Container.get(FetchUserOrderService);
  }

  public async handle(value: FetchDashboardDataQuery): Promise<DataResponse<IUserOrdersType>> {
    try
    {
      // Guard
      if(!value)
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST,`Query is required`);

      if(!value.request)
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST,`request is required`);

      const {request}=value;

      // Validation Service
      await this.pipeline.step(PipelineSteps.ValidationService,async ()=>{
        return await this._fetchDashboardDataRequestValidationService.handleAsync({
          dto:request,
          dtoClass:DashboardDataFetchRequestDto
        })
      });

      // Fetch User Order Service
      await this.pipeline.step(PipelineSteps.FetchUserOrderService,async()=>{
        return await this._fetchUserOrderService.handleAsync({
          traceId:getTraceId() as string,
          userId:request.userId
        });
      });

      // Get User and OrderResults
      const userOrderResult:IUserOrdersType=this.pipeline.getResult<IUserOrdersType>(PipelineSteps.FetchUserOrderService);
      if(!userOrderResult)
        return DataResponseFactory.error(StatusCodes.NOT_FOUND,`User or Order data not found`);

      //Return
      return DataResponseFactory.success(StatusCodes.OK, userOrderResult)
    }
    catch(ex){
      return await DataResponseFactory.pipelineError(ex);
    }
  }
}
// #endregion
