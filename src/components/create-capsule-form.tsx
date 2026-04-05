"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addMinutes, addYears, format } from "date-fns";
import { Copy, Link2, Sparkles } from "lucide-react";
import type { CreateCapsuleState } from "@/actions/create-capsule";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      className="primary-button h-14 px-6 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      <Sparkles className="h-4 w-4" />
      {pending ? "正在安放胶囊..." : "生成分享链接"}
    </button>
  );
}

export function CreateCapsuleForm() {
  const [state, setState] = useState<CreateCapsuleState>({
    status: "idle",
  });
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultDateTime = useMemo(
    () => format(addMinutes(new Date(), 30), "yyyy-MM-dd'T'HH:mm"),
    [],
  );
  const minDateTime = useMemo(
    () => format(addMinutes(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    [],
  );
  const maxDateTime = useMemo(
    () => format(addYears(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    [],
  );

  async function copyLink() {
    if (!state.shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(state.shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      creatorName: String(formData.get("creatorName") ?? ""),
      creatorEmail: String(formData.get("creatorEmail") ?? ""),
      openAt: new Date(String(formData.get("openAt") ?? "")).toISOString(),
    };

    setPending(true);
    setCopied(false);

    try {
      const response = await fetch("/api/capsules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as CreateCapsuleState;
      setState(result);
    } catch (error) {
      console.error("CreateCapsuleForm", error);
      setState({
        status: "error",
        message: "创建时出了点问题，稍后再试一次。",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <form
        onSubmit={handleSubmit}
        className="paper-panel rounded-[2rem] p-6 sm:p-8"
      >
        <div className="section-label text-xs">Create Capsule</div>
        <h1 className="display-type mt-3 text-4xl leading-tight sm:text-5xl">
          先把这段回忆轻轻封起来。
        </h1>
        <p className="fine-copy mt-3 max-w-2xl text-sm leading-7 sm:text-base">
          这颗胶囊会在你设定的那个分钟重新回来。现在为了方便测试，最短只需要等 1
          分钟，你可以直接验证“揭晓”的那一刻。
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="block text-sm font-medium">胶囊标题</span>
              <span className="fine-copy text-xs">最多 30 个字</span>
            </div>
            <input
              name="title"
              maxLength={30}
              className="input-base"
              placeholder="比如：2026 清明露营"
              required
            />
          </label>

          <label>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="block text-sm font-medium">创建者昵称</span>
              <span className="fine-copy text-xs">最多 10 个字</span>
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
            <p className="fine-copy mt-2 text-xs leading-6">
              现在支持精确到分钟，最短 1 分钟后开启，适合现场测试揭晓流程。
            </p>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <SubmitButton pending={pending} />
          <Link href="/" className="secondary-button h-14 px-6 text-sm">
            先看看首页
          </Link>
        </div>

        {state.message ? (
          <div
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

      <aside className="space-y-6">
        <div className="paper-panel rounded-[2rem] p-6 sm:p-8">
          <div className="section-label text-xs">What Happens Next</div>
          <ol className="mt-5 space-y-5 text-sm leading-7">
            <li>
              <strong>1.</strong> 生成唯一链接，丢进群聊。
            </li>
            <li>
              <strong>2.</strong> 每个人上传照片和一句给未来的话。
            </li>
            <li>
              <strong>3.</strong> 到点统一发邮件，把这段回忆重新送回来。
            </li>
          </ol>
          <div className="soft-note mt-6 rounded-[1.5rem] px-4 py-4">
            <p className="text-sm leading-7">
              如果你只是想快速演示，最省事的做法是把开启时间设在 1 到 2 分钟后，自己先上传一轮内容。
            </p>
          </div>
        </div>

        <div className="paper-panel rounded-[2rem] p-6 sm:p-8">
          <div className="section-label text-xs">Share Link</div>
          {state.shareUrl ? (
            <>
              <div className="mt-4 flex items-start gap-3 rounded-[1.5rem] border border-[color:var(--line)] bg-white/75 p-4">
                <Link2 className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent-deep)]" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">这就是你要发出去的链接</p>
                  <p className="fine-copy mt-2 break-all text-xs">{state.shareUrl}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyLink}
                  className="secondary-button h-12 px-5 text-sm"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "已复制" : "复制链接"}
                </button>
                <Link
                  href={state.shareUrl}
                  className="secondary-button h-12 px-5 text-sm"
                >
                  打开上传页
                </Link>
              </div>
            </>
          ) : (
            <p className="fine-copy mt-4 text-sm leading-7">
              链接会在创建成功后出现在这里。你可以直接发到微信群，也可以先自己打开一遍，确认上传页和倒计时显示都正常。
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
