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
import { GetOrdersByUserIdRequestDto, GetOrdersByUserIdResponseDto } from '../contracts';
import { GetUserByIdQuery } from '@/modules/domain/users/apps/features/v1/getUserById';
import { GetOrdersByUserIdValidationService } from './services/validations';
import { GetOrdersByUserIdDbService } from './services/db';
import { GetOrdersByUserIdMapResponseService } from './services/mapResponse';
import { OrderEntity } from '@/modules/domain/orders/shared/mock';

// #region Query
@sealed
export class GetOrdersByUserIdQuery extends RequestData<DataResponse<Array<GetOrdersByUserIdResponseDto>>>{
  private readonly _request:GetOrdersByUserIdRequestDto
  public constructor(request:GetOrdersByUserIdRequestDto){
    super();
    this._request = request;
  }
  public get request(): GetOrdersByUserIdRequestDto {
    return this._request;
  }
}
// #endregion

// #region Pipeline Steps
enum PipelineSteps {
  ValidationService = 'ValidationService',
  DbService  = 'DbService',
  MapResponse = 'MapResponse',
}
//#endregion

//#region Query Handler
@sealed
@requestHandler(GetOrdersByUserIdQuery)
export class GetOrdersByUserIdQueryHandler implements RequestHandler<GetOrdersByUserIdQuery,DataResponse<Array<GetOrdersByUserIdResponseDto>>>{

  private pipeline=new PipelineWorkflow(logger);
  private readonly _getOrdersByUserIdValidationService:GetOrdersByUserIdValidationService;
  private readonly _getOrdersByUserIdDbService:GetOrdersByUserIdDbService;
  private readonly _getOrdersByUserIdMapResponseService:GetOrdersByUserIdMapResponseService;

  public constructor(){
    this._getOrdersByUserIdValidationService=Container.get(GetOrdersByUserIdValidationService);
    this._getOrdersByUserIdDbService=Container.get(GetOrdersByUserIdDbService);
    this._getOrdersByUserIdMapResponseService=Container.get(GetOrdersByUserIdMapResponseService);
  }

  public async handle(value: GetOrdersByUserIdQuery): Promise<DataResponse<GetOrdersByUserIdResponseDto[]>> {
    try
    {
      // Guard
      if(!value)
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST,`Query is required`);

      if(!value.request)
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST,`Request is required`);

      const {request}=value;

      // Validation Service
      await this.pipeline.step(PipelineSteps.ValidationService, async ()=>{
        return await this._getOrdersByUserIdValidationService.handleAsync({
          dto:request,
          dtoClass:GetOrdersByUserIdRequestDto
        });
      });

      // Get OrdersBy Id
      await this.pipeline.step(PipelineSteps.DbService, async ()=>{
        return await this._getOrdersByUserIdDbService.handleAsync(request);
      });

      // Map Response Services
      await this.pipeline.step(PipelineSteps.MapResponse,async ()=>{
        // Get Db Result
        const ordersEntity=this.pipeline.getResult<OrderEntity[]>(PipelineSteps.DbService);

        // Return
        return await this._getOrdersByUserIdMapResponseService.handleAsync(ordersEntity);
      });

      // Return
      const response= this.pipeline.getResult<GetOrdersByUserIdResponseDto[]>(PipelineSteps.MapResponse);
      return DataResponseFactory.success(StatusCodes.OK,response);

    }
    catch(ex){
      return await DataResponseFactory.pipelineError(ex);
    }
  }

}
// #endregion
