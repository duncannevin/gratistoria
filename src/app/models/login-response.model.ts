export interface LoginResponseModel {
  accessToken: string;
  idToken: string;
  user: {
    email: string;
    name: string;
    userId: string;
  };
}

