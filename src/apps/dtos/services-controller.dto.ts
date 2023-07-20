export type CreateServicesHeadersRequestProps = {
  userId: string;
};

export type CreateServicesBodyRequestProps = {
  name: string;
  type: string;
  status: string;
  pathUrl: string;
  ambient: string;
  mobileModule?: string;
  buttonIcon?: string;
  description?: string;
};

export type GetAllServicesAppHeadersRequest = {
  userId: string;
};

export type UpdateStatusServiceAppHeadersRequest = {
  userId: string;
};

export type UpdateStatusServiceAppBodyRequest = {
  status: string;
  serviceId: string;
};

export type DeleteServiceAppHeaderRequest = {
  userId: string;
  serviceid: string;
};

export type AddIconToServiceAppHeadersRequest = {
  userId: string;
  authorization: string;
};

export type AddIconToServiceAppBodyRequest = {
  serviceId: string;
};
