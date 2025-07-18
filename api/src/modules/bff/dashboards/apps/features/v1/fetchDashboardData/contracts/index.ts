import { IDashboardMetaType, IOrdersType, IOrdersTypeForMobile, IUserProfileType, IUserProfileTypeForMobile } from "@/modules/bff/dashboards/shared/types";
import { IsSafeString } from "@kishornaik/utils";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

// #region Request Dto
export class DashboardDataFetchRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
  @IsUUID()
  @Type(() => String)
  userId: string;
}
// #endregion

export namespace Mobile{

  export class DashboardDataFetchResponseData{
    public profile:IUserProfileType;
    public recentOrders:Array<IOrdersType>;
    public dashboardMeta:IDashboardMetaType;
  }

}

export namespace Web{
  export class DashboardDataFetchResponseData{
    public profile:IUserProfileTypeForMobile;
    public recentOrders:Array<IOrdersTypeForMobile>;
  }
}
