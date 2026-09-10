import React from "react";
import { Link } from "react-router-dom";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  غلافُ شاشتَي الدخول والاستعادة
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 🔴 **كانت الشاشتان بالإنجليزية و`dir="ltr"`** في لوحةٍ عربيةٍ من أوّلها
 *    إلى آخرها: «Sign In» · «Enter your email and password to sign in!» ·
 *    «Keep me logged in». وهي **أوّلُ ما يراه المدرّب** — فالانطباعُ الأول
 *    أن اللوحة منتجٌ آخر بلغةٍ أخرى.
 *
 * 🔴 **وفيها خطأٌ إملائيّ معروض**: «تطبيق المرب الشخصي» — بلا دال.
 *
 * 🔴 **وعرضُ النموذج كان `w-1/2` داخل `w-1/2`** = **ربعَ الشاشة**، وزرُّ
 *    الدخول داخله بعرضٍ مكوَّد `w-[410px]` ⇒ الزرُّ **أعرضُ من العمود الذي
 *    يحويه** على أيّ شاشةٍ دون 1640px: يفيض على جاره. وعلى الجوّال يصير
 *    العمودان فوق بعضٍ بلا حدود.
 *
 * ⛔ **وخلفيتُها كانت صورةً نقطيةً بنفسجيةً زرقاء** (`Background5.4.png` ·
 *    ٢٨٣ ك.ب) — تدرّجٌ جاهزٌ من القالب لا صلة له بالتطبيق. واللوحةُ الآن
 *    مبنيّةٌ بالأنماط: صفرُ بايتٍ يُحمَّل، وحادّةٌ على أيّ كثافةِ شاشة،
 *    وبلونِ الهوية.
 */

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-surface-base text-content flex md:flex-col"
    >
      {/* ── عمودُ النموذج ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-4">
        <div className="w-full max-w-[420px] animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-3 mb-10">
            <img
              src="/icon-192.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl"
            />
            <span className="text-sm font-bold text-content leading-tight">
              لوحة المدرب
              <span className="block text-[11px] font-normal text-content-faint">
                المدرّب الشخصي
              </span>
            </span>
          </Link>

          <h1 className="text-3xl sm:text-2xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-content-muted mb-8 leading-relaxed">
            {subtitle}
          </p>

          {children}

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>

      {/* ── لوحةُ الهوية — تُطوى على الشاشات الضيّقة ──────────────────── */}
      <div className="flex-1 relative overflow-hidden md:hidden bg-ink-950 border-s border-line">
        <div className="absolute inset-0 bg-brand-veil" />

        {/* شبكةٌ خفيفةٌ تعطي عمقاً بلا صورة */}
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* هالةُ الهوية */}
        <div className="absolute -top-24 -end-24 h-[420px] w-[420px] rounded-full bg-brand-400/15 blur-3xl" />
        <div className="absolute bottom-0 start-0 h-[320px] w-[320px] rounded-full bg-brand-400/[0.07] blur-3xl" />

        <div className="relative h-full flex flex-col items-center justify-center p-10 text-center">
          <img
            src="/icon-512.png"
            alt="المدرّب الشخصي"
            width={132}
            height={132}
            className="h-32 w-32 rounded-[28px] shadow-pop"
          />

          <p className="mt-8 text-2xl font-bold">المدرّب الشخصي</p>
          <p className="mt-3 text-sm text-content-muted max-w-xs leading-relaxed">
            خططُ التدريب والتغذية ومتابعةُ المشتركين — في لوحةٍ واحدة.
          </p>
        </div>
      </div>
    </div>
  );
}
