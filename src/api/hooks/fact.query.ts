import { REST_URL } from 'configs'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { getFact } from 'api/funcs'

export const useGetFact = (
  options?: Omit<UseQueryOptions, 'queryFn' | 'queryKey'>
) => {
  return useQuery({
    queryKey: [REST_URL.FACTS],
    queryFn: getFact,
    ...options,
  })
}
