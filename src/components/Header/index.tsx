import React from "react";

import { Img, Text } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";

type HeaderProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Partial<any>;

const Header: React.FC<HeaderProps> = (props) => {
  // get chat notifications ================>

  const url = "/chat-notification";

  /**
   * [٢٥ أغسطس ٢٠٢٦ · خطة إصلاح لوحة المدرّب · ٢-٢ · شقُّ اللوحة]
   *
   * ⛔ **الشارة كانت تعرض `notifications.length`** — أي **طولَ القائمة
   * المُرسَلة** لا عددَ غير المقروء. وهو صادقٌ ما دام الخادم يرسل **كلَّ**
   * رسالةٍ غير مقروءة بلا حدّ، **ويكذب لحظة يُقصّ**.
   *
   * والخادم يُقصّ فعلاً في البند نفسه (كان يجلبها كلَّها ثم يقرأ المرسِل
   * لكلِّ صفٍّ ⇒ N+1 يُعاد عند كل تنقّلٍ بين الصفحات) ⇒ **بلا هذا الشطر
   * تهبط الشارة من ٨٠ إلى ٣٠** على الإنتاج (مقيسٌ: ٨٠ غير مقروءة الآن)
   * — نقصٌ ٦٢٪ في عدّادٍ يقرؤه المدرّب ليقرّر أيَّ محادثةٍ يفتح، **وبلا
   * رمز خطإٍ ولا سطرِ سجلّ**.
   *
   * ⚖️ **والسقوطُ على الطول متعمَّد لا احتياط** — يجعل هذا الشطر صالحاً
   * **قبل** نشر الخادم وبعده: إن غاب `total` (خادمٌ قديم) فالسلوك هو
   * السابق حرفياً. وهي قاعدةُ ترتيب النشر في هذا المستودع مقلوبةً على
   * سطحٍ نملك طرفيه: الأمانُ في الاتجاهين لا في اتجاهٍ واحد.
   */
  const { data: chatNotice }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: any[]; total?: number } }) => ({
      items: data.data ?? [],
      total: data.total ?? (data.data ?? []).length,
    }),
  });

  const notifications: any[] = chatNotice?.items ?? [];

  const unreadTotal: number = chatNotice?.total ?? 0;

  /** كم بقي خارج القائمة المقصوصة — يُقال صراحةً ولا يُترك للتخمين. */
  const hiddenCount = Math.max(0, unreadTotal - notifications.length);

  return (
    <header className={props.className}>
      <div className="flex flex-col items-center justify-start w-[62%] md:w-full"></div>

      <div className="flex flex-row items-center mx-10 gap-10">
        <div className="dropdown">
          <label tabIndex={0} className="btn m-1 relative ">
            <Img
              className="h-10 object-cover "
              src="/images/img_group.png"
              alt="group"
            />
            <span className="absolute -top-2 -right-2 indicator-item badge-sm h-6 rounded-full badge badge-warning">
              {unreadTotal}
            </span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {notifications?.length > 0 ? (
              notifications?.map((item: any, index: any) => (
                <li key={index}>
                  <a className="line-clamp-1">{item?.message}</a>
                  <span>{item?.created_at}</span>
                </li>
              ))
            ) : (
              <Text
                as="h5"
                className="font-bold !text-center w-full !text-[12px]"
              >
                {"لا يوجد رسائل فائتة"}
              </Text>
            )}

            {/* القائمة مقصوصة والعدّاد كامل ⇒ يُقال الفرق بدل أن يبدو الباقي
                غيرَ موجود. */}
            {hiddenCount > 0 && (
              <li className="pointer-events-none">
                <span className="!text-[11px] opacity-70">
                  {`و${hiddenCount} رسالة أخرى — افتح المحادثات`}
                </span>
              </li>
            )}
          </ul>
        </div>
        {/* <Img className="h-[71px]" src="/images/img_folder.svg" alt="folder" /> */}
        <Img
          className="h-[30px] md:h-auto mb-1 ml-1.5 object-cover "
          src="/images/img_image.png"
          alt="image_One"
        />
        خالد المالكي
      </div>
    </header>
  );
};

Header.defaultProps = {};

export default Header;
