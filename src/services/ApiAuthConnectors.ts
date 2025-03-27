import axios from "axios";
import { LoginData, AxiosLoginResponse } from "../types/types";
import { handleApiError } from "./errorHandlers";

const ApiLoginConnector: (
  data: LoginData,
) => Promise<AxiosLoginResponse | undefined> = async (data) => {
  const apiURL: string = `${import.meta.env.VITE_APP_API_BASE_URL}/login`;
  try {
    const response: AxiosLoginResponse = await axios.post(apiURL, data, {
      withCredentials: true,
    });
    if (response) {
      return response;
    } else {
      throw new Error("No response from server");
    }
  } catch (error: any) {
    handleApiError(error);
  }
};

const ApiLogoutConnector: () => Promise<void> = async () => {
  const apiURL: string = `${import.meta.env.VITE_APP_API_BASE_URL}/logout`;

  try {
    await axios.post(apiURL, null, {
      withCredentials: true,
    });
  } catch (error: any) {
    handleApiError(error);
  }
};

const ApiRefreshConnector: () => Promise<
  AxiosLoginResponse | undefined
> = async () => {
  const apiURL = `${import.meta.env.VITE_APP_API_BASE_URL}/refresh`;

  try {
    const response: AxiosLoginResponse = await axios.post(apiURL, null, {
      withCredentials: true,
    });
    if (response) {
      return response;
    } else {
      throw new Error("No response from server");
    }
  } catch (error: any) {
    // Comment to avoid toast on login Page
    // handleApiError(error);
  }
};

export { ApiLoginConnector, ApiRefreshConnector, ApiLogoutConnector };
