import { REST_URL } from 'configs'
import { httpRestService } from 'api/http.service'

export const getFact = async () => httpRestService.get(REST_URL.FACTS)
