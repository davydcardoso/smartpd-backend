export type CreateCompanyRequestProps = {
  name: string;
  email: string;
  document: string;
  sigUrl?: string;
  responsibleEntity?: string;
};

export type CreateCompanyHeaderRequestProps = {
  userId: string;
  userid: string;
};

export type UpdateCompanyDataHeaderRequestProps = {
  userId: string;
};

export type UpdateCompanyDataRequestProps = {
  name: string;
  email: string;
  document: string;
};

export type GetCompanyDataHeaderRequestProps = {
  userId: string;
};

export type GetAllCompanyRegisteredHeaderRequestProps = {
  userId: string;
};

export type UpdateCompanyStatusHeadersRequestProps = {
  userId: string;
};

export type UpdateCompanyStatusBodyRequestProps = {
  status: string;
  customerId: string;
};

export type DeleteCompanyAccountHeadersRequestProps = {
  userId: string;
};

export type DeleteCompanyAccountBodyRequestProps = {
  companyId: string;
};
