import axios from "axios";
import { useAppSelector } from "./useRedux";
import { selectCurrentToken } from "redux/slices/auth";

interface Props {
  contentType?: "application/json" | "multipart/form-data";
}

/**
 * @param apiType default is admin
 * @param contentType default is 'application/json'
 * @returns axios
 */
const useAxios = ({ contentType = "application/json" }: Props) => {
  const access_token: string | null | undefined =
    useAppSelector(selectCurrentToken);

  return axios.create({
    baseURL: "https://thirsty-franklin.85-215-43-232.plesk.page/api/admin",
    headers: {
      "Content-Type": contentType as string,
      accept: "application/json",
      authorization: `Bearer ${access_token as string}`
    },
  });
};

export default useAxios;
