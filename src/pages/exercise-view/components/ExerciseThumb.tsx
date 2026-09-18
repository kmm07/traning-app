import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  /** لقطةُ الفيديو — تُفضَّل، وغيابُها حالةٌ مشروعة. */
  thumb?: string | null;
  /** مخطّطُ العضلة — يُعرض حين لا لقطة. */
  fallback?: string | null;
  /** رابطُ الفيديو — يُشغَّل في المعاينة بعد مهلة القصد. */
  video?: string | null;
  alt?: string;
}

/** أبعادُ المعاينة العائمة وهامشُها عن حافّة النافذة. */
const PREVIEW_W = 380;
const PREVIEW_H = 214; // نسبةُ مصغّرة Vimeo 295×166
const GAP = 12;

/**
 * **مهلةُ القصد قبل التشغيل — وهي ما يجعل الميزة تُحتمَل.**
 *
 * مقيسٌ على الإنتاج: ملفّاتُ التمارين **٧–١٦ م.ب** ومعدّلُها **١–٥ م.بت/ث**
 * ⇒ **ثانيتا تشغيلٍ تكلّفان ٤٣٠ ك.ب – ١٫٣ م.ب** لكل مرور، مقابل **٨ ك.ب**
 * للقطة الساكنة (**×١٠٠**). فمرورُ المسح على عشرة صفوف كان **ينزّل حتى ١٣
 * ميغا بلا أن يطلبها أحد**. والمهلةُ تجعل الكلفة **مقصودةً لا عرضية**:
 * لا يبدأ التنزيل إلا لمن وقف عند الصفّ فعلاً.
 */
const PLAY_DELAY_MS = 500;

/**
 * مصغّرةُ التمرين في القائمة — تتكبّر عند المرور **وتشتغل** بعد نصف ثانية.
 *
 * 🔴 **والمعاينةُ `fixed` لا `scale` داخل الخليّة — وهو كلُّ الفرق بين أن
 * تُرى وألّا تُرى.** غلافُ الجدول `overflow-x-auto`، و`overflow` غيرُ
 * `visible` يجعل المحورَ الآخر قاصّاً بالمواصفة ⇒ أيُّ تكبيرٍ في مجرى
 * التخطيط **يُقصّ عند حافّة الخليّة**. والموضعُ `fixed` يخرج من سياق القصّ
 * كلِّه، ويُحسب من `getBoundingClientRect` لحظةَ المرور.
 *
 * ⚖️ **والجهةُ تُختار بالقياس لا بالافتراض**: الواجهةُ عربية والعمودُ يمينَ
 * الجدول، فالمعاينةُ تُفتح **يساراً** ما لم تضق المسافة فتنقلب يميناً.
 *
 * ⛔ **و`muted` شرطُ عملٍ لا تفضيلُ ذوق** — المتصفّحاتُ ترفض التشغيل
 * التلقائيّ بصوتٍ أصلاً، فبلاها لا يبدأ الفيديو إطلاقاً.
 *
 * و`pointer-events-none` شرطٌ لا زينة: المعاينةُ تقع تحت المؤشّر، فلو
 * التقطت الأحداث لأطلقت `mouseleave` على الخليّة فتومض بلا انقطاع.
 */
function ExerciseThumb({ thumb, fallback, video, alt = "" }: Props) {
  const src = thumb || fallback || "/images/img_rectangle347.png";

  const anchorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const [preview, setPreview] = useState<{ top: number; left: number } | null>(
    null
  );
  const [playing, setPlaying] = useState(false);

  /**
   * **يوقف التنزيل الجاري لا يوقف الصورة فحسب.**
   *
   * ⛔ ونزعُ `src` ثم `load()` شرطٌ: مجرّدُ `pause()` **يُبقي المتصفّح يسحب
   * بقيّة الملفّ** — فمن ترك الصفّ يظلّ ينزّل ميغاتٍ لا يراها أحد.
   */
  const stopPlayback = useCallback(() => {
    const el = videoRef.current;

    if (!el) return;

    try {
      el.pause();
      el.removeAttribute("src");
      el.load();
    } catch {
      // متصفّحٌ يرفض `load()` بعد النزع — الإخفاءُ وحده يكفي حينها.
    }
  }, []);

  const show = useCallback(() => {
    const box = anchorRef.current?.getBoundingClientRect();

    if (!box) return;

    const openLeft = box.left > PREVIEW_W + GAP;

    const left = openLeft
      ? box.left - PREVIEW_W - GAP
      : Math.min(box.right + GAP, window.innerWidth - PREVIEW_W - GAP);

    // يُثبَّت داخل النافذة رأسياً — وإلّا خرجت معاينةُ أوّل صفٍّ وآخره.
    const top = Math.max(
      GAP,
      Math.min(
        box.top + box.height / 2 - PREVIEW_H / 2,
        window.innerHeight - PREVIEW_H - GAP
      )
    );

    setPreview({ top, left: Math.max(GAP, left) });

    if (video) {
      timerRef.current = setTimeout(() => setPlaying(true), PLAY_DELAY_MS);
    }
  }, [video]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    stopPlayback();
    setPlaying(false);
    setPreview(null);
  }, [stopPlayback]);

  // ومغادرةُ الصفحة أو إعادةُ بناء الجدول تُوقفان التنزيل كذلك.
  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      stopPlayback();
    },
    [stopPlayback]
  );

  return (
    <div
      ref={anchorRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      className="relative w-28 h-16 shrink-0 overflow-hidden rounded-lg bg-black/30 cursor-zoom-in ring-0 hover:ring-2 hover:ring-primary transition-shadow"
    >
      <img
        className="w-full h-full object-cover"
        loading="lazy"
        alt={alt}
        src={src}
      />

      {thumb && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/55">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      )}

      {preview && (
        <div
          style={{
            top: preview.top,
            left: preview.left,
            width: PREVIEW_W,
            height: PREVIEW_H,
          }}
          className="fixed z-[999] pointer-events-none overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl"
        >
          {/* اللقطةُ تبقى تحته حتى يبدأ التشغيل — فلا يومض الإطارُ أسودَ. */}
          <img
            className="absolute inset-0 w-full h-full object-contain"
            alt=""
            src={src}
          />

          {playing && video && (
            <video
              ref={videoRef}
              src={video}
              poster={thumb || undefined}
              muted
              autoPlay
              loop
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ExerciseThumb;
