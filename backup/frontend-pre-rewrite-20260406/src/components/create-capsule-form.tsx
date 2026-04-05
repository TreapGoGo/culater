"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { addMinutes, addYears, format } from "date-fns";
import { Copy, Link2, Sparkles } from "lucide-react";
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
  const [state, setState] = useState<CreateCapsuleState>({
    status: "idle",
  });
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | null>(null);

  const defaultDateTime = useMemo(
    () =>
      preset?.openAt ?? format(addMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm"),
    [preset?.openAt],
  );
  const minDateTime = useMemo(
    () => format(addMinutes(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    [],
  );
  const maxDateTime = useMemo(
    () => format(addYears(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    [],
  );

  useEffect(() => {
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
        message: "复制没有成功。你可以先手动复制下面的链接，再发到群里。",
      }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const openAtValue = String(formData.get("openAt") ?? "");
    const openAt = new Date(openAtValue);

    if (Number.isNaN(openAt.getTime())) {
      setState({
        status: "error",
        message: "开启时间没有读出来，请重新选一次时间。",
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
        throw new Error("创建接口返回了无法识别的结果。");
      }

      setState(result);
    } catch (error) {
      console.error("CreateCapsuleForm", error);
      setState({
        status: "error",
        message: "这颗胶囊还没成功放下去。稍后再试一次就好。",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      <form
        onSubmit={handleSubmit}
        className="paper-panel rounded-[2rem] p-6 sm:p-8 lg:p-9"
      >
        <div className="section-label text-xs">Create Capsule</div>
        <h1 className="display-type mt-3 text-4xl leading-tight sm:text-5xl">
          先把这段回忆封起来，
          <br />
          再决定它什么时候回来。
        </h1>
        <p className="fine-copy body-copy mt-3 max-w-2xl text-sm sm:text-base">
          你只需要填好标题、昵称、邮箱和开启时间。创建成功后会得到一条分享链接，
          把它发给其他人就可以开始收集内容。
        </p>

        {preset?.mode === "demo" ? (
          <div className="soft-note mt-6 rounded-[1.6rem] px-5 py-5">
            <div className="section-label text-[10px]">Demo Mode</div>
            <p className="display-type mt-3 text-2xl leading-tight">
              这是一次快速试跑。
            </p>
            <p className="fine-copy body-copy mt-3 text-sm">
              标题和 2 分钟后的开启时间已经替你填好了。你只要补上昵称和邮箱，
              就能马上拿到第一条分享链接。
            </p>
          </div>
        ) : null}

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

          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">开启时间</span>
            <input
              name="openAt"
              type="datetime-local"
              min={minDateTime}
              max={maxDateTime}
              defaultValue={defaultDateTime}
              className="input-base"
              required
            />
            <p className="fine-copy form-help mt-2">
              现在支持精确到分钟。最短 1 分钟后开启，最长 1 年后开启。
            </p>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <SubmitButton pending={pending} />
          <Link href="/" className="secondary-button h-14 w-full px-6 text-sm sm:w-auto">
            先看看首页
          </Link>
        </div>

        {state.message ? (
          <div
            aria-live="polite"
            className={`mt-6 rounded-[1.5rem] border px-4 py-4 text-sm leading-7 ${
              state.status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {state.message}
          </div>
        ) : null}
      </form>

      <aside className="space-y-6 lg:space-y-8">
        <div className="paper-panel panel-moss rounded-[2rem] p-6 sm:p-8">
          <div className="section-label text-xs">What Happens Next</div>
          <ol className="mt-5 space-y-5 text-sm leading-7">
            <li>
              <strong>1.</strong> 创建后会生成一条专属链接，把它发到群聊。
            </li>
            <li>
              <strong>2.</strong> 每个人都能通过这条链接上传照片和一句话。
            </li>
            <li>
              <strong>3.</strong> 到时间后，系统会发邮件提醒大家回来打开它。
            </li>
          </ol>
          <div className="soft-note mt-6 rounded-[1.5rem] px-4 py-4">
            <p className="body-copy text-sm">
              首次上手最短路径是：自己先建一颗 1 到 2 分钟后开启的胶囊，复制链接，再用自己的邮箱上传一张照片。
            </p>
          </div>
        </div>

        <div className="paper-panel panel-amber rounded-[2rem] p-6 sm:p-8 lg:sticky lg:top-6">
          <div className="section-label text-xs">Share Link</div>
          {state.shareUrl ? (
            <>
              <div className="mt-4 flex items-start gap-3 rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
                <Link2 className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent-deep)]" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">把这条链接发给其他人就可以了</p>
                  <p className="fine-copy meta-copy mt-2 break-all">{state.shareUrl}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyLink}
                  className="secondary-button h-12 w-full px-5 text-sm sm:w-auto"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "链接已复制" : "复制链接"}
                </button>
                <Link
                  href={state.shareUrl}
                  className="secondary-button h-12 w-full px-5 text-sm sm:w-auto"
                >
                  下一步：先去上传页
                </Link>
              </div>

              <div className="soft-note mt-4 rounded-[1.5rem] px-4 py-4">
                <p className="text-sm font-medium">现在最推荐你先做这一步</p>
                <p className="fine-copy body-copy mt-2 text-sm">
                  先自己点开上传页，传 1 张照片和一句话。这样你马上就能确认整条流程已经跑通。
                </p>
              </div>
            </>
          ) : (
            <div className="mt-4 space-y-4">
              <p className="fine-copy body-copy text-sm">
                创建成功后，分享链接会出现在这里。你可以直接发到群里，也可以先自己点开一遍上传页。
              </p>
              <div className="soft-note rounded-[1.5rem] px-4 py-4">
                <p className="text-sm font-medium">第一次使用时，你只需要完成这三件事</p>
                <ol className="fine-copy body-copy mt-3 space-y-2 text-sm">
                  <li>1. 建一颗 1 到 2 分钟后开启的胶囊。</li>
                  <li>2. 用分享链接先给自己上传一张照片。</li>
                  <li>3. 等它自动揭晓，再确认邮件和开启页都正常。</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
