/**
 * خيارُ تمرينٍ بصورته **ولقطة فيديوه** في قوائم الاختيار (`formatOptionLabel`
 * في react-select). الصورتان تُقرآن من الخيار نفسه — فلا نداءٌ ثانٍ ولا افتراق
 * عمّا تعرضه قائمة التمارين.
 */
export const toExerciseOption = (item: any) => ({
  label: item?.name,
  value: item?.id,
  image: item?.muscle_image || item?.image || "",
  videoThumb: item?.video_thumb || "",
});

export function exerciseOptionLabel(option: any) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={option?.image || "/images/img_rectangle347.png"}
        alt=""
        loading="lazy"
        className="w-9 h-9 rounded-lg object-cover shrink-0"
      />
      {option?.videoThumb && (
        <img
          src={option.videoThumb}
          alt=""
          loading="lazy"
          className="h-9 aspect-video rounded-lg object-cover shrink-0"
        />
      )}
      <span>{option?.label}</span>
    </div>
  );
}
