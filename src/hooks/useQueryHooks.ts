import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "./useAxios";
import { useAppDispatch } from "./useRedux";
import { logOut } from "redux/slices/auth";
import { setImageDelete } from "redux/slices/imageDelete";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface UrlContentType {
  url: string;
  contentType?: "application/json" | "multipart/form-data" | undefined;
  withToast?: boolean;
}

/**
 * @param name name of cache item
 * @param url api url
 * @param options {apiType} default is admin
 */
export function useGetQuery(name: string | any, url: string, options: any) {
  const axios = useAxios({
    contentType: "application/json",
  });

  const dispatch = useAppDispatch();
  const push = useNavigate();
  const queryOptions = { retry: 1, cacheTime: 0, ...options };
  return useQuery(name, async () => await axios.get(url), {
    onError: (error: any) => {
      if (error?.response?.status === 412) {
        void push("/unauthenticated");
      }
      if (error?.response?.status === 401) {
        dispatch(logOut());
        void push("/login");
      }
    },
    ...queryOptions,
  });
}

/**
 * @param url api url
 * @param contentType 'application/json' | 'multipart/form-data'
 * @param options {apiType} default is admin
 */
export function usePostQuery({
  url,
  contentType,
  withToast = true,
}: UrlContentType) {
  const axios = useAxios({ contentType });
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const push = useNavigate();
  return useMutation(async (values) => await axios.post(url, values), {
    onSuccess: async () => {
      const pageUrl = "?page=1";
      const astricsUrl = "?page=*";
      await queryClient.invalidateQueries(url.split("/")[0]);
      await queryClient.invalidateQueries(url + pageUrl);
      await queryClient.invalidateQueries(url + astricsUrl);
      await queryClient.invalidateQueries(url);
      if (withToast) {
        toast.success("تم الاضافة بنجاح");
      }
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        dispatch(logOut());
        void push("/login");
        toast.error("تم تسجيل الخروج بنجاح");
      } else {
        toast.error("حدث خطأ ما");
        toast.error(error.response.data.message);
      }
    },
  });
}

/**
 * @param url api url
 * @param contentType 'application/json' | 'multipart/form-data'
 * @param options {apiType} default is admin
 */
export function usePutQuery({ url, contentType }: UrlContentType) {
  // const push = useNavigate();
  // const pathname = useLocation();
  const axios = useAxios({ contentType });

  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  // const domain = pathname.split("/")[1] as any;

  return useMutation(async (values: object) => await axios.put(url, values), {
    onSuccess: async () => {
      const pageUrl = "?page=1";
      const astricsUrl = "?page=*";
      // for refetch data
      await queryClient.invalidateQueries(url.split("/")[0] + pageUrl);
      await queryClient.invalidateQueries(url.split("/")[0] + astricsUrl);
      // handel stop delete image
      dispatch(setImageDelete(false));
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        dispatch(logOut());
      }
    },
  });
}
/**
 * @param options {apiType} default is admin
 */
/**
 * صيغتان: نصٌّ كما كان حرفياً، أو `{ url, data }` حين يحتاج الحذف **جسماً**.
 *
 * أُضيفت الثانية لأن `DELETE /meal-ingredients/{id}` صار يقبل `replace_with_id`
 * و`force` — والمكوّن المستعمل يُردّ بـ422 حتى يُرسل أحدهما. وكلُّ المستدعين
 * القدامى يمرّون بالصيغة النصّية بلا سطرٍ معدَّل.
 */
type DeleteArg = string | { url: string; data?: Record<string, unknown> };

export function useDeleteQuery() {
  const axios = useAxios({
    contentType: "application/json",
  });

  const queryClient = useQueryClient();

  return useMutation(
    async (arg: DeleteArg) => {
      const url = typeof arg === "string" ? arg : arg.url;
      const body = typeof arg === "string" ? undefined : arg.data;

      // axios يرسل جسم DELETE عبر `config.data` — ولارافيل يقرؤه بـ`$request`
      // مهما كان الفعل.
      const response = await axios.delete(url, body ? { data: body } : undefined);

      const pageUrl = "?page=1";
      const astricsUrl = "?page=*";
      await queryClient.invalidateQueries(url.split("/")[0]);
      await queryClient.invalidateQueries(url.split("/")[0] + pageUrl);
      await queryClient.invalidateQueries(url.split("/")[0] + astricsUrl);

      // يُعاد الردّ ليقرأ المستدعي `replaced_in_recipes` — إضافةٌ صرفة، فمن
      // كان يتجاهل العائد يبقى كما هو.
      return response;
    },
    {
      onSuccess: () => {
        toast.success("تم الحذف بنجاح");
      },
    }
  );
}
