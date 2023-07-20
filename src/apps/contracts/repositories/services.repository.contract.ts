export interface ServicesRepositoryContract<T = any> {
  getByPathUrl(pathUrl: string): Promise<T>;
  getServices(appId: string): Promise<T>;
  getServiceForAppId(companyId: string): Promise<T>;
}
