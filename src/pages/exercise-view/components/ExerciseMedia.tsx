import ExerciseThumb from "./ExerciseThumb";

interface Props {
  exercise: any;
  /** رابطُ الفيديو — يُمرَّر لأن مفتاحه يختلف بين التمرين (`external_video`/`internal_video`) والبديل (`video`). */
  video?: string | null;
}

/**
 * صورةُ التمرين **ولقطةُ فيديوه معاً** (قرار خالد): الأولى تعرّف المجموعة
 * العضلية والثانية التمرينَ نفسه. ومن لا لقطة له (فيديو محلّيّ أو رابطٌ ليس من
 * Vimeo) تبقى صورةُ العضلة وحدها — وعليها معاينةُ الفيديو عند المرور.
 *
 * موضعٌ واحد يتقاسمه جدولُ التمارين وبطاقةُ البدائل، فلا يفترق عرضُهما.
 */
function ExerciseMedia({ exercise, video }: Props) {
  const muscle = exercise?.muscle_image || exercise?.image;

  return exercise?.video_thumb ? (
    <div className="flex items-center gap-3 shrink-0">
      <img
        src={muscle || "/images/img_rectangle347.png"}
        alt=""
        loading="lazy"
        className="w-16 h-16 rounded-xl object-cover shrink-0"
      />
      <ExerciseThumb
        thumb={exercise.video_thumb}
        video={video}
        alt={exercise?.name}
      />
    </div>
  ) : (
    <ExerciseThumb thumb={muscle} video={video} alt={exercise?.name} />
  );
}

export default ExerciseMedia;
