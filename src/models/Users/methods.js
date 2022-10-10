// eslint-disable-next-line import/prefer-default-export
export async function createUser() {
  const newUser = await this.save();
  return newUser;
}
