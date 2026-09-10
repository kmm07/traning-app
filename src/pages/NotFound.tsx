import { Link } from "react-router-dom";

/*
 * صفحةُ ٤٠٤.
 *
 * 🔴 **كانت `<h1>Opps! We ran out of code</h1>`** — نصٌّ إنجليزيٌّ فيه خطأٌ
 *    إملائيّ («Opps») ورسالتُه عن **الكود** لا عن الصفحة، على أرضيةٍ بيضاء
 *    بلا صنفٍ واحد. ومن يبلغها لا يجد سبيلاً للعودة إلى اللوحة إطلاقاً:
 *    لا رابطَ ولا زرّ.
 */
const NotFound = () => {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-surface-base text-content grid place-items-center p-6"
    >
      <div className="text-center max-w-md animate-fade-in">
        <img
          src="/icon-192.png"
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 rounded-2xl mx-auto mb-8 opacity-90"
        />

        <p className="text-6xl font-bold text-brand-400 leading-none">٤٠٤</p>

        <h1 className="mt-5 text-xl font-bold">هذه الصفحة غير موجودة</h1>

        <p className="mt-3 text-sm text-content-muted leading-relaxed">
          الرابطُ الذي فتحته لا يقابل صفحةً في اللوحة — قد يكون قديماً أو
          فيه خطأٌ في الكتابة.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center mt-8 rounded-field px-6 py-3 text-sm font-bold bg-brand-400 text-ink-950 hover:bg-brand-300 transition-colors"
        >
          العودة إلى اللوحة
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
