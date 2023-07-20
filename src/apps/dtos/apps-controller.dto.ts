export type CreateAppHeaderRequestProps = {
  userId: string;
  companyId: string;
};

export type CreateAppBodyRequestPops = {
  companyId: string;
  name: string;
  status: string;
  version: string;
  currentPlan: string;
  publicationDate: Date;
  availableVersions: string;
};

export type GetAllAppsHeaderRequest = {
  userId: string;
  companyId: string;
};

export type AddServiceInAppCompanyHeaderRequestProps = {
  userId: string;
  companyId: string;
};

export type AddServiceInAppCompanyRequestProps = {
  appId: string;
  serviceId: string;
};

export type GetServicesForAppsHeaderProps = {
  appsid: string;
  userId: string;
  companyId: string;
};

export type GetServicesForAppsRequestProps = {
  appsId: string;
};

export type GetServicesByAppIdRequestProps = {
  appId: string;
};

export type GetServicesByAppIdHeaderRequest = {
  appid: string;
};
