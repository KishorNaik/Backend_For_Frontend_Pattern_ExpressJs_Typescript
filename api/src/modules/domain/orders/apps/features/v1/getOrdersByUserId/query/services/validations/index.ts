import { DtoValidation, sealed, Service } from "@kishornaik/utils";
import { GetOrdersByUserIdRequestDto } from "../../../contracts";

@sealed
@Service()
export class GetOrdersByUserIdValidationService extends DtoValidation<GetOrdersByUserIdRequestDto>{
  public constructor(){
    super();
  }
}
