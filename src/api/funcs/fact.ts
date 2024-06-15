import { REST_URL } from 'configs'
import { TFactDto } from 'types/api'
import { httpRestService } from 'api/http.service'

export const getFact = async () =>
  httpRestService.get<TFactDto[]>(REST_URL.FACTS)
