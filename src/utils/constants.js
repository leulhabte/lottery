export const modelNames = {
  user: 'Users',
};

export const strongPasswordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
);

export const userTypes = {
  ADMMINSTRATOR: 'adminstrator',
  CUSTOMER: 'customer',
  FIELD_OFFICER: 'fieldOfficer',
  FARMER: 'farmer',
};
