import axios from "axios";
import { useAppSelector } from "./useRedux";
import { selectCurrentToken } from "redux/slices/auth";

interface Props {
  contentType?: "application/json" | "multipart/form-data";
}

/**
 * جذر واجهة اللوحة — مُصدَّرٌ كي يستعمله من لا يستطيع استعمال axios نفسه:
 * نداء `fetch(keepalive)` عند إغلاق التبويب (انظر useTrainerPresence).
 */
export const ADMIN_BASE_URL = "https://personaltrainerkmm.com/api/admin";

/**
 * @param apiType default is admin
 * @param contentType default is 'application/json'
 * @returns axios
 */
const useAxios = ({ contentType = "application/json" }: Props) => {
  const access_token: string | null | undefined =
    useAppSelector(selectCurrentToken);

  return axios.create({
    baseURL: ADMIN_BASE_URL,
    headers: {
      "Content-Type": contentType as string,
      accept: "application/json",
      authorization: `Bearer ${access_token as string}`
    },
  });
};

export default useAxios;
