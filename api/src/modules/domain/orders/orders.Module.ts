import { WorkerBullMq } from '@kishornaik/utils';
import { getOrdersByUserIdIntegrationEvent } from './apps/features/v1/getOrdersByUserId';

const orderModules: Function[] = [];
const orderBullMqWorkerModules: WorkerBullMq[] = [getOrdersByUserIdIntegrationEvent];

export { orderModules, orderBullMqWorkerModules };
