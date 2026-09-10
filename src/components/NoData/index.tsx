import React from "react";

/*
 * حالةُ الفراغ.
 *
 * ⛔ **كان نصّاً عارياً فيه خطأٌ إملائيّ** («لا يوجد بينات») ومعه صورةٌ
 *    معلَّقةٌ في تعليق تشير إلى `/images/empty.png` **وهو ملفٌّ غير موجود**
 *    في `public` أصلاً — أي أن إحياء التعليق كان يعطي صورةً مكسورة.
 *    صارت أيقونةً مرسومةً بالمتّجهات: لا ملفَّ تعتمد عليه ولا وزنَ تحميل.
 *
 * ➕ **ورسالةٌ قابلةٌ للتخصيص** — «لا مستخدمين» أنفعُ من «لا بيانات»، وكان
 *    النصُّ مكوَّداً واحداً لكل الشاشات.
 */
interface Props {
  className?: string;
  title?: string;
  hint?: string;
  action?: React.ReactNode;
}

const NoDataFounded = ({
  className = "",
  title = "لا توجد بيانات لعرضها",
  hint,
  action,
}: Props) => {
  return (
    <div
      className={`grid place-items-center w-full text-center gap-4 ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-16 w-16 grid place-items-center rounded-2xl bg-ink-900 border border-line">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-content-faint"
            aria-hidden="true"
          >
            <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
            <path d="M3 7.5 12 12l9-4.5M12 12v9" opacity="0.5" />
          </svg>
        </div>

        <p className="text-base font-semibold text-content">{title}</p>

        {hint && <p className="text-sm text-content-muted max-w-sm">{hint}</p>}

        {action}
      </div>
    </div>
  );
};
export default NoDataFounded;
