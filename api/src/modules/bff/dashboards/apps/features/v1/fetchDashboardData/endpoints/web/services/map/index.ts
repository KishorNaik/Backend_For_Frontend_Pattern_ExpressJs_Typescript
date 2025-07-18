import { IServiceHandlerAsync, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, tryCatchResultAsync } from "@kishornaik/utils";
import { DashboardDataFetchRequestDto, Web } from "../../../../contracts";
import { mediator } from "@/shared/utils/helpers/medaitR";
import { FetchDashboardDataQuery } from "../../../../query";
import { IUserOrdersType } from "@/modules/bff/dashboards/shared/types";

export interface IDashboardDataFetchMapForWebService extends IServiceHandlerAsync<DashboardDataFetchRequestDto,Web.DashboardDataFetchResponseData>{}

@sealed
@Service()
export class DashboardDataFetchMapForWebService implements IDashboardDataFetchMapForWebService {
  public handleAsync(params: DashboardDataFetchRequestDto): Promise<Result<Web.DashboardDataFetchResponseData, ResultError>> {
    return tryCatchResultAsync(async ()=>{
      // Guard
      if(!params)
        return  ResultFactory.error(StatusCodes.BAD_REQUEST, `param is required`);

      // Query Response
      const queryResponse=await mediator.send(new FetchDashboardDataQuery(params));
      if(!queryResponse.Success)
        return ResultFactory.error(queryResponse.StatusCode,queryResponse.Message);

      if(!queryResponse.Data)
        return ResultFactory.error(StatusCodes.NOT_FOUND,`No data found`);

      // Map
      const userOrderResult:IUserOrdersType=queryResponse.Data;

      const response:Web.DashboardDataFetchResponseData=new Web.DashboardDataFetchResponseData();
      response.profile=userOrderResult.user;
      response.recentOrders=userOrderResult.orders;
      response.dashboardMeta={
        totalOrders:response.recentOrders.length,
        activeStatus:response.recentOrders.filter(o => o.status !== 'Delivered').length
      };

      // Return
      return ResultFactory.success(response);

    });
  }

}
