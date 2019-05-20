import request, {
  FullResponse,
  RequestPromiseAPI,
  RequestPromiseOptions,
  RequestPromise
} from 'request-promise-native'

import urlJoin from 'url-join'

import {
  BaseUrl,
  IBaseClientConfig,
  IClientReqParams
} from './interfaces/IBaseClient'
import { StatusCodeError } from 'request-promise-native/errors'

export abstract class BaseClient {
  protected config: IBaseClientConfig
  protected baseUrl: BaseUrl
  private readonly httpClient: RequestPromiseAPI

  /**
   * @param baseUrl The URL to the Vault API including the version path
   * @param config
   */
  protected constructor (baseUrl: BaseUrl, config: IBaseClientConfig = {}) {
    this.baseUrl = baseUrl
    this.config = config
    this.httpClient = request
  }

  /**
   * Constructs a Vault URL
   * @param path
   */
  protected getAPIUrl (path: string) {
    if (this.config.mount) {
      return urlJoin(this.baseUrl, this.config.mount, path)
    }

    return urlJoin(this.baseUrl, path)
  }

  /**
   * @throws StatusCodeError
   * @throws RequestError
   */
  protected async request (
    uri: string,
    reqOpts: RequestPromiseOptions = {},
    reqParams: IClientReqParams = {}
  ): Promise<RequestPromise<FullResponse>> {
    let opts = {
      json: true,
      resolveWithFullResponse: true,
      ...reqOpts
    }

    if (!opts.headers) {
      opts.headers = {}
    }

    if (reqParams.authRequired && this.config.authTokenFn) {
      opts.headers['X-Vault-Token'] = await this.config.authTokenFn()
    }

    if (this.config.namespace) {
      opts.headers['X-Vault-Namespace'] = this.config.namespace
    }

    if (this.config.reqOpts) {
      opts = {
        ...this.config.reqOpts,
        ...opts
      }
    }

    return this.httpClient(uri, opts)
  }
}
