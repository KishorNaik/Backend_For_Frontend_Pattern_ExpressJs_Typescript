import {
	DashboardDataFetchForMobileEndpoint,
	DashboardDataFetchForWebEndpoint,
} from './apps/features/v1/fetchDashboardData';

const dashboardModules: Function[] = [
	DashboardDataFetchForWebEndpoint,
	DashboardDataFetchForMobileEndpoint,
];

export { dashboardModules };
