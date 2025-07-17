import { WorkerBullMq } from '@kishornaik/utils';
import { getUserByIdIntegrationEvent } from './apps/features/v1/getUserById';

const userModules: Function[] = [];
const userBullMqWorkerModules: WorkerBullMq[] = [getUserByIdIntegrationEvent];

export { userModules, userBullMqWorkerModules };
