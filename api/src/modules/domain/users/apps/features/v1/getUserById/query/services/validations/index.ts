import { DtoValidation, sealed, Service } from "@kishornaik/utils";
import { GetUserByIdRequestDto } from "../../../contracts";

@sealed
@Service()
export class GetUserByIdValidationService extends DtoValidation<GetUserByIdRequestDto>{
  public constructor(){
    super();
  }
}
