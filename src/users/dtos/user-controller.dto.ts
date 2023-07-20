export type CreateUserRequestProps = {
  name: string;
  email: string;
  password: string;
  document: string;
  birthDate: string;
  telephone: string;
  motherName: string;
  accessLevel: string;
};

export type CreateUserRrequestHeaderProps = {
  companyid: string;
};

export type GetUserAccountRequestHeaders = {
  userId: string;
  companyId: string;
};

export type UpdateAccountRequestBody = {
  name: string;
  email: string;
  document: string;
  password: string;
  birthDate: string;
  telephone: string;
  motherName: string;
  newPassword: string;
  confirmPassword: string;
};

export type UpdateAccountRequestHeader = {
  userId: string;
};

export type DeleteUserAccountRequestHeader = {
  userId: string;
};

export type UpdatePasswordAccoutRequestHeader = {
  userId: string;
};

export type AlterPasswordAccountRequestBody = {
  code: string;
  email: string;
  newPassword: string;
};
