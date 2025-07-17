export interface OrderEntity {
	id: string;
	status: string;
	amount: number;
	userId: string;
	date: Date;
}

export const orderMockData: Array<OrderEntity> = [
	{
		id: 'O501',
		status: 'pending',
		amount: 100,
		userId: 'U501',
		date: new Date(),
	},
	{
		id: 'O502',
		status: 'completed',
		amount: 200,
		userId: 'U502',
		date: new Date(),
	},
	{
		id: 'O503',
		status: 'pending',
		amount: 300,
		userId: 'U501',
		date: new Date(),
	},
	{
		id: 'O504',
		status: 'completed',
		amount: 400,
		userId: 'U502',
		date: new Date(),
	},
	{
		id: 'O505',
		status: 'pending',
		amount: 500,
		userId: 'U501',
		date: new Date(),
	},
	{
		id: 'O506',
		status: 'completed',
		amount: 600,
		userId: 'U502',
		date: new Date(),
	},
];
