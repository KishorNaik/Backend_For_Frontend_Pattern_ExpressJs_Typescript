export interface IUserProfileType{
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

export type IUserProfileTypeForMobile=Pick<IUserProfileType,"id"|"name"|"plan">;

export interface IOrdersType{
  id: string;
	status: string;
	amount: number;
	userId: string;
	date: Date;
}

export type IOrdersTypeForMobile=Pick<IOrdersType,"id"|"amount"|"status">;

export interface IDashboardMetaType{
  totalOrders:number;
  activeStatus:number;
}


export interface IUserOrdersType{
  user:IUserProfileType;
  orders:Array<IOrdersType>
}
