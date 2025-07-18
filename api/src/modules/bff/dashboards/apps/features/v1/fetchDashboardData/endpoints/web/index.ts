import { Response } from 'express';
import {
	Body,
	Get,
	HttpCode,
	JsonController,
	OnUndefined,
	Param,
	Post,
	Res,
	UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import {
	RequestData,
	sealed,
	StatusCodes,
	DataResponse as ApiDataResponse,
	requestHandler,
	RequestHandler,
	DataResponseFactory,
	PipelineWorkflowException,
	PipelineWorkflow,
	Container,
} from '@kishornaik/utils';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { logger } from '@/shared/utils/helpers/loggers';
import { DashboardDataFetchRequestDto, Web } from '../../contracts';
import { DashboardDataFetchMapForWebService } from './services/map';

// #Region Endpoint
@JsonController(`/api/web/v1/dashboard`)
@OpenAPI({ tags: [`web-dashboard`] })
export class DashboardDataFetchEndpoint{
  @Get(`/:userId`)
  @OpenAPI({
		summary: `Fetch Dashboard data for Web platform`,
		tags: [`web-dashboard`],
		description: `Fetch Dashboard data for Web platform`,
	})
  public async getAsync(@Param('userId') userId: string, @Res() res: Response){
    const request:DashboardDataFetchRequestDto=new DashboardDataFetchRequestDto();
    request.userId=userId;

    const response=await mediator.send(new DashboardDataFetchForWebQuery(request));
    return res.status(response.StatusCode).json(response);
  }
}

// #endregion

// #region Query
@sealed
class DashboardDataFetchForWebQuery extends RequestData<ApiDataResponse<Web.DashboardDataFetchResponseData>>{
  private readonly _request:DashboardDataFetchRequestDto;

  public constructor(request:DashboardDataFetchRequestDto){
    super();
    this._request=request;
  }

  public get request():DashboardDataFetchRequestDto{
    return this._request;
  }
}

// #endregion

// #region Query Handler
@sealed
@requestHandler(DashboardDataFetchForWebQuery)
class DashboardDataFetchForWebQueryHandler implements RequestHandler<DashboardDataFetchForWebQuery, ApiDataResponse<Web.DashboardDataFetchResponseData>>{

  private pipeline=new PipelineWorkflow(logger);
  private readonly _dashboardDataFetchMapForWebService:DashboardDataFetchMapForWebService;

  public constructor(){
    this._dashboardDataFetchMapForWebService=Container.get(DashboardDataFetchMapForWebService);
  }

  public async handle(value: DashboardDataFetchForWebQuery): Promise<ApiDataResponse<Web.DashboardDataFetchResponseData>> {
    try
    {
      // Guard
      if(!value)
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `value is required`);

      if(!value.request)
        return DataResponseFactory.error(StatusCodes.BAD_REQUEST,`request is required`);

      const {request}=value;

      // Map Service
      await this.pipeline.step(`map-service`, async ()=>{
        return this._dashboardDataFetchMapForWebService.handleAsync(request);
      });

      //Response
      const response=this.pipeline.getResult<Web.DashboardDataFetchResponseData>(`map-service`);

      return DataResponseFactory.success(StatusCodes.OK, response)
    }
    catch(ex){
      return await DataResponseFactory.pipelineError(ex);
    }
  }

}

// #endregion
