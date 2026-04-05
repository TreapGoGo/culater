"use client";

import imageCompression from "browser-image-compression";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { CountdownChip } from "@/components/countdown-chip";
import { formatBytes, formatOpenDate } from "@/lib/time";

type PreparedPhoto = {
  id: string;
  file: File;
  previewUrl: string;
  sizeLabel: string;
  signature: string;
};

type UploadContributionFormProps = {
  capsuleId: string;
  capsuleTitle: string;
  openAt: string;
};

const maxPhotoSize = 20 * 1024 * 1024;
const maxPhotoCount = 20;

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
  const [dragActive, setDragActive] = useState(false);
  const [selectionHint, setSelectionHint] = useState<string | null>(null);

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

  function getFileSignature(file: File) {
    return [file.name, file.size, file.lastModified].join(":");
  }

  async function handlePhotoPick(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    setError(null);
    setSelectionHint(null);
    const picked = Array.from(fileList);
    const existingSignatures = new Set(
      preparedPhotosRef.current.map((photo) => photo.signature),
    );
    const uniquePicked = picked.filter((file) => {
      const signature = getFileSignature(file);
      if (existingSignatures.has(signature)) {
        return false;
      }
      existingSignatures.add(signature);
      return true;
    });

    if (!uniquePicked.length) {
      setSelectionHint("这些照片已经在列表里了，所以这次没有重复加入");
      return;
    }

    if (preparedPhotosRef.current.length + uniquePicked.length > maxPhotoCount) {
      setError(`一次最多准备 ${maxPhotoCount} 张照片`);
      return;
    }

    try {
      const nextPhotos = await Promise.all(
        uniquePicked.map(async (file) => {
          if (file.size > maxPhotoSize) {
            throw new Error(`${file.name} 超过 20MB 了`);
          }

          if (!file.type.startsWith("image/")) {
            throw new Error(`${file.name} 不是可用的图片文件`);
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
            signature: getFileSignature(file),
          } satisfies PreparedPhoto;
        }),
      );

      startTransition(() => {
        setPreparedPhotos((current) => [...current, ...nextPhotos]);
      });
      if (uniquePicked.length !== picked.length) {
        setSelectionHint("重复的照片已经自动跳过了");
      }
    } catch (prepareError) {
      const message =
        prepareError instanceof Error
          ? prepareError.message
          : "照片处理失败了，请换一张再试";

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
    if (!preparedPhotos.length) {
      setError("先选至少一张照片，再把它封进胶囊");
      return;
    }

    formData.set("capsuleId", capsuleId);
    preparedPhotos.forEach((photo) => {
      formData.append("photos", photo.file, photo.file.name);
    });

    setSubmitting(true);
    setError(null);
    setSelectionHint(null);

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? "封存失败，请稍后再试");
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
          : "这次没能封存成功，请稍后再试一次";
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
        className="paper-panel panel-amber rounded-[2rem] p-6 sm:p-8 lg:p-9"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-[color:var(--accent)]" />
          <div>
            <div className="section-label text-xs">Sealed</div>
            <h2 className="display-type text-3xl" style={{ whiteSpace: "nowrap" }}>已封入胶囊</h2>
          </div>
        </div>

        <p className="fine-copy mt-4 text-sm leading-7">
          你的照片和那句话已经放进「{capsuleTitle}」 到 {formatOpenDate(openAt)}
          左右 大家会一起收到“这颗胶囊醒了”的邮件提醒
        </p>

        <div className="mt-6">
          <CountdownChip openAt={openAt} large />
        </div>

        <div className="soft-note mt-6 rounded-[1.5rem] px-4 py-4">
          <p className="text-sm font-medium">接下来会发生什么</p>
          <ol className="fine-copy body-copy mt-3 space-y-2 text-sm">
            <li>1. 你可以继续回来补新的照片和文字</li>
            <li>2. 同一条链接也可以继续发给其他人</li>
            <li>3. 到开启时间后 大家会自动收到提醒邮件</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setUploaded(false);
              setSelectionHint("可以继续补照片 and 文字，提交一次就会再封存一份内容");
            }}
            className="secondary-button h-12 w-full px-5 text-sm sm:w-auto"
          >
            继续添加内容
          </button>
          <Link href="/" className="secondary-button h-12 w-full px-5 text-sm sm:w-auto">
            再建一颗新的胶囊
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      ref={formRef}
      action={submitContribution}
      className="paper-panel rounded-[2rem] p-6 sm:p-8 lg:p-9"
    >
      <div className="section-label text-xs">Add Memory</div>
      <h2 className="display-type mt-3 text-3xl sm:text-4xl" style={{ whiteSpace: "nowrap", wordBreak: "keep-all" }}>
        上传几张照片 再留一句给未来的话
      </h2>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5">
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
          <p className="fine-copy form-help mt-2">
            到开启时 我们会把提醒邮件发到这个邮箱
          </p>
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
          rows={1}
          className="input-base resize-none"
          placeholder="比如：希望下次还在同一片草地上吹风"
          value={messageValue}
          onChange={(event) => setMessageValue(event.target.value)}
        />
        <p className="fine-copy form-help mt-2">
          可以留空 写一句就够 不需要写成长文
        </p>
      </label>

      <div className="mt-5 rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-white/5 p-4 sm:p-5">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (event.currentTarget === event.target) {
              setDragActive(false);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            void handlePhotoPick(event.dataTransfer.files);
          }}
          className={`rounded-[1.4rem] p-2 ${
            dragActive
              ? "bg-[color:var(--accent-soft)]"
              : ""
          }`}
        >
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-sm font-medium">上传照片</p>
            <p className="fine-copy form-help mt-1">
              可以拖拽或点击选择。单张上限 20MB，一次最多 20 张。
            </p>
          </div>
          <label className="secondary-button h-12 w-full cursor-pointer px-5 text-sm sm:w-auto">
            <ImagePlus className="h-4 w-4" />
            选择照片
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                void handlePhotoPick(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </label>
        </div>

        <p className="fine-copy mt-4 text-sm">{photoCountLabel}</p>
        {selectionHint ? (
          <p
            aria-live="polite"
            className="mt-2 text-sm leading-6 text-[color:var(--accent-deep)]"
          >
            {selectionHint}
          </p>
        ) : null}

        <AnimatePresence>
          {preparedPhotos.length ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4"
            >
              {preparedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="story-card overflow-hidden rounded-[1.5rem]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt={`已选照片预览：${photo.file.name}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{photo.file.name}</p>
                      <p className="fine-copy meta-copy">{photo.sizeLabel}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="secondary-button h-10 w-10 shrink-0"
                      aria-label={`移除 ${photo.file.name}`}
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
      </div>

      {!preparedPhotos.length ? (
        <div className="soft-note mt-4 rounded-[1.5rem] px-4 py-4">
          <p className="text-sm font-medium">这里会先显示你准备封进去的照片预览</p>
          <p className="fine-copy body-copy mt-2 text-sm">
            你不需要一次传很多张。先放进一张最有感觉的，整条流程就能跑起来了。
          </p>
        </div>
      ) : null}

      {error ? (
        <div
          aria-live="polite"
          className="mt-4 rounded-[1.25rem] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
        >
          {error}
        </div>
      ) : null}

      <p className="fine-copy form-help mt-4">
        在开启之前，你看不到任何人已经传了什么，包括你自己这次刚刚提交的内容
      </p>

      <button
        type="submit"
        disabled={!preparedPhotos.length || submitting}
        className="primary-button mt-6 h-14 w-full text-sm font-medium disabled:cursor-not-allowed disabled:opacity-65"
      >
        {submitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            正在封存这份内容...
          </>
        ) : (
          "封存这份内容"
        )}
      </button>
    </form>
  );
}
