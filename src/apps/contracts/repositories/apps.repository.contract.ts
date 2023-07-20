export interface AppsRepositoryContract<T = any> {
  getByCompanyId(companyId: string): Promise<T[]>;
  addService(appId: string, serviceId: string): Promise<void>;
  removeService(appId: string, serviceId: string): Promise<void>;
}
