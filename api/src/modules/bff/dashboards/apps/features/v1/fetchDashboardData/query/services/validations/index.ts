import { DtoValidation, sealed, Service } from "@kishornaik/utils";
import { DashboardDataFetchRequestDto } from "../../../contracts";

@sealed
@Service()
export class FetchDashboardDataRequestValidationService extends DtoValidation<DashboardDataFetchRequestDto>{
  public constructor(){
    super();
  }
}
