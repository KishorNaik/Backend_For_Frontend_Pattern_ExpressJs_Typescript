import {
	IServiceHandlerAsync,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
	StatusCodes,
	tryCatchResultAsync,
	Enumerable,
} from '@kishornaik/utils';
import { DashboardDataFetchRequestDto, Mobile, Web } from '../../../../contracts';
import { mediator } from '@/shared/utils/helpers/medaitR';
import { FetchDashboardDataQuery } from '../../../../query';
import {
	IOrdersTypeForMobile,
	IUserOrdersType,
	IUserProfileTypeForMobile,
} from '@/modules/bff/dashboards/shared/types';

export interface IDashboardDataFetchMapForMobileService
	extends IServiceHandlerAsync<
		DashboardDataFetchRequestDto,
		Mobile.DashboardDataFetchResponseData
	> {}

@sealed
@Service()
export class DashboardDataFetchMapForMobileService
	implements IDashboardDataFetchMapForMobileService
{
	public handleAsync(
		params: DashboardDataFetchRequestDto
	): Promise<Result<Mobile.DashboardDataFetchResponseData, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params) return ResultFactory.error(StatusCodes.BAD_REQUEST, `param is required`);

			// Query Response
			const queryResponse = await mediator.send(new FetchDashboardDataQuery(params));
			if (!queryResponse.Success)
				return ResultFactory.error(queryResponse.StatusCode, queryResponse.Message);

			if (!queryResponse.Data)
				return ResultFactory.error(StatusCodes.NOT_FOUND, `No data found`);

			// Map
			const userOrderResult: IUserOrdersType = queryResponse.Data;

			const userProfileMap: IUserProfileTypeForMobile = {
				id: userOrderResult.user.id,
				name: userOrderResult.user.name,
				plan: userOrderResult.user.plan,
			};

			const orderMap: Array<IOrdersTypeForMobile> = Enumerable.from(userOrderResult.orders)
				.select<IOrdersTypeForMobile>((x) => ({
					id: x.id,
					amount: x.amount,
					status: x.status,
				}))
				.toArray();

			const response: Mobile.DashboardDataFetchResponseData =
				new Web.DashboardDataFetchResponseData();
			response.profile = userProfileMap;
			response.recentOrders = orderMap;

			// Return
			return ResultFactory.success(response);
		});
	}
}
