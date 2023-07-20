export interface PasswordChangesRepositoryContract<T = any> {
  getByCode(code: string): Promise<T>;
  getByUserId(userId: string): Promise<T>;
}
