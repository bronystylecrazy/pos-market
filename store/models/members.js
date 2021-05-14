export const members = [{
  id: 1,
  image: "https://fakeimage.cc/sirawit",
  firstName: "Sirawit",
  lastName: "Pratoomsuwan",
  phone: "098-378-2018",
  memberID: "63130500227",
  iat: Date.now(),
  uat: Date.now(),
  role: "Administrator",
  email: "s36256@bj.ac.th",
  // fake auth
  username: "admin",
  password: "123456789"
}];

export const schema = {
  image: "",
  firstName: "",
  lastName: "",
  phone: "",
  memberID: "",
  iat: "",
  uat: "",
  role: "",
  email: "",
  // fake auth
  username: "",
  get displayName() {
    return `${this.firstName} ${this.lastName}`;
  },
};

export function fillSchema(data) {
  const copyData = {
    ...data,
    get displayName() {
      return `${this.firstName} ${this.lastName}`;
    },
  };

  return copyData;
}
