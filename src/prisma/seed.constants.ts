import { hashSync } from 'bcrypt';

export const COMPANY_ADMIN_ID = 'a6a9588e-2437-44c7-998b-9646854e204d';
export const USER_ADMIN_ID_1 = '06803957-be01-4876-8ed4-7b253b958267';
export const USER_ADMIN_ID_2 = 'ec21a620-0cfb-4e71-bd02-43c5ef0ba4b6';
export const USER_ADMIN_DOCUMENT_1 = '705.297.471-55';

export const UserAdmSEED = {
  id: USER_ADMIN_ID_1,
  name: 'Prodata Administrador',
  email: 'admin@prodata.com',
  password: hashSync('Dv@_824657', 8),
  document: USER_ADMIN_DOCUMENT_1,
  accessLevel: 'DEVELOPER',
  telephone: '(62) 3236-1400',
  birthDate: new Date(1997, 4, 20),
  motherName: 'Nome de testes',
  emailConfirmed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};
