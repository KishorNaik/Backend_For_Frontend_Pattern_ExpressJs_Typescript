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
import { IUserOrdersType } from '@/modules/bff/dashboards/shared/types';
import { DashboardDataFetchRequestDto } from '../contracts';

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

// #region Query Handler

// #endregion
