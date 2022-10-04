// eslint-disable-next-line import/prefer-default-export
export async function createCronSetting() {
  const newContractSetting = await this.save();
  return newContractSetting;
}
