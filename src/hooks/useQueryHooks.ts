import { useQuery, useMutation, useQueryClient } from "react-query";
import useAxios from "./useAxios";
import { useAppDispatch } from "./useRedux";
import { logOut } from "redux/slices/auth";
import { setImageDelete } from "redux/slices/imageDelete";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiErrorMessage } from "util/apiError";

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
        // ⛔ كان توستان لخطأ واحد: «حدث خطأ ما» ثم نصُّ لارافيل الإنجليزيّ.
        // و`apiErrorMessage` تردّ نصّاً نافعاً دائماً (ولها سقوطٌ عربيّ عند
        // فشل الشبكة) ⇒ العامُّ صار ضجيجاً يزاحم المفيد.
        toast.error(apiErrorMessage(error));
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

      // 🔴 **ولا يمرّ من هذا الخطّاف أحد — مقيسٌ لا مظنون.** `usePutQuery`
      // بـ**صفر مستدعٍ** في `src/` كلّه، و«تم الحفظ بنجاح» **غائبةٌ عن
      // الحزمة المبنيّة** بينما «تم الحذف بنجاح» (من الملفّ نفسه) حاضرة
      // ⇒ الدالّة **مقصوصةٌ بالـtree-shaking**. قياسان مستقلّان يتّفقان.
      //
      // ⚖️ فالبند الذي بُني له هذا الشطر («التعديلات تنجح أو تفشل بصمت»)
      // **باطلٌ في مقدّمته**: الحفظُ كلُّه يمرّ بـ`usePostQuery` — ٢٨ ملفاً —
      // وهي تحمل رسالتَي النجاح والفشل سلفاً. ⇒ **هذا الشطر بلا أثرٍ حيّ**،
      // وقيمتُه أن يكون الخطّاف صحيحاً يومَ يُستعمَل لا أن يُصلح عطلاً قائماً.
      //
      // 📌 وبندٌ مرقَّم: يُحذف الخطّاف أو يُستعمَل — كودٌ ميتٌ يحمل تعليقاً
      // يزعم إصلاحاً يكذب على قارئه بعد شهر (سابقة `DIALOG_LEVELS`).
      toast.success("تم الحفظ بنجاح");
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        dispatch(logOut());
        return;
      }
      toast.error(apiErrorMessage(error));
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

/**
 * `suppressErrorToast` — مخرجٌ صريح لموضعٍ **يعالج الفشل بنفسه معالجةً أغنى من
 * توست**. الحالة القائمة الوحيدة: حذفُ مكوّنٍ يردّ 422 `ingredient_in_use`
 * فيُعرض **حوارُ قرارٍ** (استبدلْ أو احذف قسراً) — وتوستُ خطإٍ فوقه يقول
 * «فشل» بينما الشاشة تعرض مخرجاً، فيتناقض السطحان.
 *
 * ⚠️ **ولا يُستعمل لإسكات فشلٍ لا يعالجه أحد** — وهي بالضبط الحالة التي بُني
 * `onError` لإنهائها.
 */
export function useDeleteQuery(options?: { suppressErrorToast?: boolean }) {
  const axios = useAxios({
    contentType: "application/json",
  });

  const dispatch = useAppDispatch();

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

      /**
       * [٢٥ أغسطس ٢٠٢٦ · خطة إصلاح لوحة المدرّب · ٣-٥]
       *
       * ⛔ **كان الخطّاف بلا `onError` إطلاقاً** — فحذفٌ يرفضه الخادم
       * **لا يُظهر شيئاً**: لا رسالةَ نجاحٍ ولا رسالةَ فشل. والحالة ليست
       * نظرية — `DELETE meal-ingredients/{id}` يردّ **422 `ingredient_in_use`**
       * بقرارٍ مبنيّ ([[catalog-ingredient-integrity]])، و`user-subscriptions`
       * المدفوع لا يُحذف بل يُنقل. ⇒ يضغط المدرّب «حذف» ويظنّه وقع.
       *
       * ⚖️ **وهو نقطةُ القرار الواحدة لنصّ الفشل** — ولذلك نُزع
       * `toast.error` من كتل `catch` في مواضع الحذف، وإلا ظهرت رسالتان
       * لفشلٍ واحد (react-query يشغّل `onError` **ومعه** يرمي لـ`mutateAsync`).
       * والكتلة `catch` تبقى: وظيفتُها منعُ `onClose()` بعد فشل، لا العرض.
       */
      onError: (error: any) => {
        if (error?.response?.status === 401) {
          dispatch(logOut());
          return;
        }

        if (options?.suppressErrorToast) return;

        toast.error(apiErrorMessage(error));
      },
    }
  );
}
