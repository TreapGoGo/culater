"use client";

import React from "react";
import Link from "next/link";
import { addMinutes, addMonths, addYears, format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Link2, Sparkles, X } from "lucide-react";
import type { CreateCapsuleState } from "@/actions/create-capsule";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      className="primary-button h-14 w-full px-6 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      disabled={pending}
    >
      <Sparkles className="h-4 w-4" />
      {pending ? "正在安放胶囊..." : "生成分享链接"}
    </button>
  );
}

type CreateCapsuleFormProps = {
  preset?: {
    mode: "demo";
    title: string;
    openAt: string;
  };
};

export function CreateCapsuleForm({ preset }: CreateCapsuleFormProps) {
  const [state, setState] = React.useState<CreateCapsuleState>({
    status: "idle",
  });
  const [pending, setPending] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const copiedTimeoutRef = React.useRef<number | null>(null);

  const defaultDateTime = React.useMemo(
    () =>
      preset?.openAt ?? format(addMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm"),
    [preset?.openAt],
  );
  
  const [openAtValue, setOpenAtValue] = React.useState(defaultDateTime);

  const minDateTime = React.useMemo(
    () => format(addMinutes(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    [],
  );
  const maxDateTime = React.useMemo(
    () => format(addYears(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    [],
  );

  React.useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  async function copyLink() {
    if (!state.shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(state.shareUrl);
      setCopied(true);
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
      copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("copyLink", error);
      setState((current) => ({
        ...current,
        status: "error",
        message: "复制没有成功 你可以先手动复制下面的链接 再发到群里",
      }));
    }
  }

  const setShortcutTime = (minutes?: number, months?: number, years?: number) => {
    let date = new Date();
    if (minutes) date = addMinutes(date, minutes);
    if (months) date = addMonths(date, months);
    if (years) date = addYears(date, years);
    setOpenAtValue(format(date, "yyyy-MM-dd'T'HH:mm"));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const openAtValueStr = String(formData.get("openAt") ?? "");
    const openAt = new Date(openAtValueStr);

    if (Number.isNaN(openAt.getTime())) {
      setState({
        status: "error",
        message: "开启时间没有读出来 请重新选一次时间",
      });
      return;
    }

    const payload = {
      title: String(formData.get("title") ?? ""),
      creatorName: String(formData.get("creatorName") ?? ""),
      creatorEmail: String(formData.get("creatorEmail") ?? ""),
      openAt: openAt.toISOString(),
    };

    setPending(true);
    setCopied(false);
    setState({ status: "idle" });

    try {
      const response = await fetch("/api/capsules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | CreateCapsuleState
        | null;

      if (!result) {
        throw new Error("创建接口返回了无法识别的结果");
      }

      setState(result);
      if (result.status === "success") {
        setShowModal(true);
      }
    } catch (error) {
      console.error("CreateCapsuleForm", error);
      setState({
        status: "error",
        message: "这颗胶囊还没成功放下去 稍后再试一次就好",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="paper-panel relative w-full max-w-lg overflow-hidden rounded-[2.5rem] p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="section-label text-xs">What Happens Next</div>
              <h2 className="display-type mt-4 text-3xl" style={{ whiteSpace: "nowrap" }}>
                胶囊已就绪
              </h2>

              {state.shareUrl && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 rounded-[1.5rem] border border-[color:var(--line)] bg-white/5 p-4">
                    <Link2 className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">把这条链接发给其他人就可以了</p>
                      <p className="fine-copy meta-copy mt-2 break-all">{state.shareUrl}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="primary-button h-12 w-full px-5 text-sm"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "链接已复制" : "复制分享链接"}
                  </button>
                </div>
              )}
              
              <ol className="mt-8 space-y-6 text-sm leading-7">
                <li className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-200">1</span>
                  <span><strong>甩到群聊里</strong>，让大家点击链接</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-200">2</span>
                  <span><strong>上传照片</strong>，留一句想对未来的话</span>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-200">3</span>
                  <span><strong>静候开启</strong>，到期后所有人都会收到提醒</span>
                </li>
              </ol>

              <button
                onClick={() => setShowModal(false)}
                className="secondary-button mt-8 h-14 w-full"
              >
                我知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="paper-panel rounded-[2rem] p-6 sm:p-8 lg:p-9"
      >
        <div className="section-label text-xs">Create Capsule</div>
        <h1 className="display-type mt-3 text-4xl leading-tight sm:text-5xl" style={{ whiteSpace: "nowrap", wordBreak: "keep-all" }}>
          你的胶囊 承载所有人的回忆
        </h1>
        <p className="fine-copy body-copy mt-3 max-w-2xl text-sm sm:text-base">
          你只需要填好标题、昵称、邮箱和开启时间
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <label className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="block text-sm font-medium">胶囊标题</span>
              <span className="fine-copy meta-copy">最多 30 个字</span>
            </div>
            <input
              name="title"
              maxLength={30}
              className="input-base"
              placeholder="比如：2026 清明露营"
              defaultValue={preset?.title}
              required
            />
          </label>

          <label>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="block text-sm font-medium">创建者昵称</span>
              <span className="fine-copy meta-copy">最多 10 个字</span>
            </div>
            <input
              name="creatorName"
              maxLength={10}
              className="input-base"
              placeholder="阿哲"
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium">接收通知的邮箱</span>
            <input
              name="creatorEmail"
              type="email"
              className="input-base"
              placeholder="you@example.com"
              required
            />
          </label>

          <div className="sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">开启时间</span>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                name="openAt"
                type="datetime-local"
                min={minDateTime}
                max={maxDateTime}
                value={openAtValue}
                onChange={(e) => setOpenAtValue(e.target.value)}
                className="input-base"
                required
              />
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: "1分钟", args: [1, 0, 0] },
                  { label: "1个月", args: [0, 1, 0] },
                  { label: "3个月", args: [0, 3, 0] },
                  { label: "1年", args: [0, 0, 1] },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => setShortcutTime(...(btn.args as [number, number, number]))}
                    className="secondary-button h-11 px-3 text-xs"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="fine-copy form-help mt-2">
              现在支持精确到分钟。最短 1 分钟后开启，最长 1 年后开启
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          <SubmitButton pending={pending} />
          <Link href="/" className="secondary-button h-14 w-full px-6 text-sm sm:w-auto">
            返回首页
          </Link>
        </div>

        {state.message && state.status !== "success" ? (
          <div
            aria-live="polite"
            className="mt-6 rounded-[1.5rem] border border-rose-200/20 bg-rose-500/10 px-4 py-4 text-sm leading-7 text-rose-200"
          >
            {state.message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
