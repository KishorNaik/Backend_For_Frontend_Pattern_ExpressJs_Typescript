export interface UserEntity {
	id: string;
	name: string;
	email: string;
	plan: string;
	avatarUrl: string;
	preferences: {
		theme: string;
		language: string;
	};
}

export const userMockData: Array<UserEntity> = [
	{
		id: 'U501',
		name: 'Kishor Dev',
		email: 'kishor@example.com',
		plan: 'Free',
		avatarUrl: 'https://example.com/avatar/kishor.png',
		preferences: {
			theme: 'dark',
			language: 'en-IN',
		},
	},
	{
		id: 'U502',
		name: 'Eshaan Dev',
		email: 'eshaan@example.com',
		plan: 'Pro',
		avatarUrl: 'https://example.com/avatar/eshaan.png',
		preferences: {
			theme: 'light',
			language: 'en-IN',
		},
	},
];
