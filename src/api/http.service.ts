import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HandleResponseError } from './http.error'
import { env } from 'configs'
import { get } from 'lodash'

class HttpRestService {
  constructor(private axiosInstance: AxiosInstance) {}

  async get<R>(route: string, configs?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance
      .get(route, configs)
      .then(data => get(data, 'data'))
      .catch(HandleResponseError)
  }

  async post<P, R>(
    route: string,
    payload: P,
    configs?: AxiosRequestConfig
  ): Promise<R> {
    return this.axiosInstance
      .post(route, payload, configs)
      .then(data => get(data, 'data'))
      .catch(HandleResponseError)
  }

  async patch<P, R>(
    route: string,
    payload: P,
    configs?: AxiosRequestConfig
  ): Promise<R> {
    return this.axiosInstance
      .patch(route, payload, configs)
      .then(data => get(data, 'data'))
      .catch(HandleResponseError)
  }

  async put<P, R>(
    route: string,
    payload: P,
    configs?: AxiosRequestConfig
  ): Promise<R> {
    return this.axiosInstance
      .put(route, payload, configs)
      .then(data => get(data, 'data'))
      .catch(HandleResponseError)
  }

  async delete<R>(route: string, configs?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance
      .delete(route, configs)
      .then(data => get(data, 'data'))
      .catch(HandleResponseError)
  }
}

export const InstanceAxios: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const httpRestService = new HttpRestService(InstanceAxios)
