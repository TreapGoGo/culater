"use client";

import imageCompression from "browser-image-compression";
import { AnimatePresence, motion } from "framer-motion";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { CountdownChip } from "@/components/countdown-chip";
import { formatBytes, formatOpenDate } from "@/lib/time";

type PreparedPhoto = {
  id: string;
  file: File;
  previewUrl: string;
  sizeLabel: string;
};

type UploadContributionFormProps = {
  capsuleId: string;
  capsuleTitle: string;
  openAt: string;
};

const maxPhotoSize = 20 * 1024 * 1024;

export function UploadContributionForm({
  capsuleId,
  capsuleTitle,
  openAt,
}: UploadContributionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const preparedPhotosRef = useRef<PreparedPhoto[]>([]);
  const [preparedPhotos, setPreparedPhotos] = useState<PreparedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [messageValue, setMessageValue] = useState("");

  useEffect(() => {
    preparedPhotosRef.current = preparedPhotos;
  }, [preparedPhotos]);

  useEffect(() => {
    return () => {
      preparedPhotosRef.current.forEach((photo) =>
        URL.revokeObjectURL(photo.previewUrl),
      );
    };
  }, []);

  const photoCountLabel = useMemo(() => {
    if (!preparedPhotos.length) {
      return "还没挑照片";
    }

    return `已准备 ${preparedPhotos.length} 张照片`;
  }, [preparedPhotos.length]);

  async function handlePhotoPick(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setError(null);
    const picked = Array.from(fileList);

    try {
      const nextPhotos = await Promise.all(
        picked.map(async (file) => {
          if (file.size > maxPhotoSize) {
            throw new Error(`${file.name} 超过 20MB 了。`);
          }

          const compressed = await imageCompression(file, {
            maxSizeMB: 2.2,
            maxWidthOrHeight: 2560,
            useWebWorker: true,
            initialQuality: 0.84,
          });

          return {
            id: crypto.randomUUID(),
            file: new File([compressed], file.name, {
              type: compressed.type || file.type,
            }),
            previewUrl: URL.createObjectURL(compressed),
            sizeLabel: formatBytes(compressed.size),
          } satisfies PreparedPhoto;
        }),
      );

      startTransition(() => {
        setPreparedPhotos((current) => [...current, ...nextPhotos]);
      });
    } catch (prepareError) {
      const message =
        prepareError instanceof Error
          ? prepareError.message
          : "照片处理失败了，请换一张再试。";

      setError(message);
    }
  }

  function removePhoto(photoId: string) {
    setPreparedPhotos((current) => {
      const target = current.find((item) => item.id === photoId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((item) => item.id !== photoId);
    });
  }

  async function submitContribution(formData: FormData) {
    formData.set("capsuleId", capsuleId);
    preparedPhotos.forEach((photo) => {
      formData.append("photos", photo.file, photo.file.name);
    });

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "封存失败，请稍后再试。");
      }

      preparedPhotos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      setPreparedPhotos([]);
      setMessageValue("");
      formRef.current?.reset();
      setUploaded(true);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "上传失败，请稍后再试。";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (uploaded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="paper-panel rounded-[2rem] p-6 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-[color:var(--accent-deep)]" />
          <div>
            <div className="section-label text-xs">Sealed</div>
            <h2 className="display-type text-3xl">已封入胶囊</h2>
          </div>
        </div>

        <p className="fine-copy mt-4 text-sm leading-7">
          你的照片和那句话已经安稳地躺进「{capsuleTitle}」。到
          {formatOpenDate(openAt)}，大家会一起收到这颗胶囊醒来的提醒。
        </p>

        <div className="mt-6">
          <CountdownChip openAt={openAt} large />
        </div>

        <button
          type="button"
          onClick={() => setUploaded(false)}
          className="secondary-button mt-6 h-12 px-5 text-sm"
        >
          再封一份内容
        </button>
      </motion.div>
    );
  }

  return (
    <form
      ref={formRef}
      action={submitContribution}
      className="paper-panel rounded-[2rem] p-6 sm:p-8"
    >
      <div className="section-label text-xs">Add Memory</div>
      <h2 className="display-type mt-3 text-3xl sm:text-4xl">
        甩几张照片，再留一句给未来的话。
      </h2>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium">昵称</span>
          <input
            name="nickname"
            maxLength={10}
            className="input-base"
            placeholder="比如：小林"
            required
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">邮箱</span>
          <input
            name="email"
            type="email"
            className="input-base"
            placeholder="mail@example.com"
            required
          />
        </label>
      </div>

      <label className="mt-4 block">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="block text-sm font-medium">给未来的一句话</span>
          <span className="fine-copy text-xs">{messageValue.length}/200</span>
        </div>
        <textarea
          name="message"
          maxLength={200}
          rows={4}
          className="input-base resize-none"
          placeholder="比如：希望下次还在同一片草地上吹风。"
          value={messageValue}
          onChange={(event) => setMessageValue(event.target.value)}
        />
        <p className="fine-copy mt-2 text-xs leading-6">
          可以留空。写一句就够，不必像发朋友圈那样完整。
        </p>
      </label>

      <div className="mt-4 rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-white/65 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">上传照片</p>
            <p className="fine-copy mt-1 text-xs">
              可拖拽或点击挑选，多张可传，单张上限 20MB。
            </p>
          </div>
          <label className="secondary-button h-12 cursor-pointer px-5 text-sm">
            <ImagePlus className="h-4 w-4" />
            选择照片
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => handlePhotoPick(event.target.files)}
            />
          </label>
        </div>

        <p className="fine-copy mt-4 text-sm">{photoCountLabel}</p>

        <AnimatePresence>
          {preparedPhotos.length ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 grid gap-3 sm:grid-cols-2"
            >
              {preparedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="story-card overflow-hidden rounded-[1.5rem]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt={photo.file.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{photo.file.name}</p>
                      <p className="fine-copy text-xs">{photo.sizeLabel}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="secondary-button h-10 w-10 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {error ? (
        <div className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </div>
      ) : null}

      <p className="fine-copy mt-4 text-xs leading-6">
        你现在看不到其他人已经传了什么。所有内容都会一直封存到开启时刻。
      </p>

      <button
        type="submit"
        disabled={!preparedPhotos.length || submitting}
        className="primary-button mt-6 h-14 w-full text-sm font-medium disabled:cursor-not-allowed disabled:opacity-65"
      >
        {submitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            正在封存...
          </>
        ) : (
          "封进时间胶囊"
        )}
      </button>
    </form>
  );
}
