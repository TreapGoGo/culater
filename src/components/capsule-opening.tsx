"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Capsule, ContributionGroup } from "@/lib/types";
import { daysSince, formatOpenDate } from "@/lib/time";

type CapsuleOpeningProps = {
  capsule: Capsule;
  groups: ContributionGroup[];
  photoUrls: Record<string, string>;
};

export function CapsuleOpening({
  capsule,
  groups,
  photoUrls,
}: CapsuleOpeningProps) {
  const [opened, setOpened] = useState(false);
  const elapsedDays = daysSince(capsule.createdAt);

  return (
    <div className="space-y-8">
      {!opened ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="paper-panel grain-overlay overflow-hidden rounded-[2.4rem] px-6 py-10 text-center sm:px-10 sm:py-16"
        >
          <div className="mx-auto h-24 w-24 rounded-full bg-[color:var(--foreground)]/95 shadow-2xl" />
          <p className="section-label mt-8 text-xs">Wake Up Call</p>
          <h1 className="display-type mt-4 text-4xl leading-tight sm:text-6xl">
            「{capsule.title}」
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            这颗胶囊来自 {elapsedDays} 天前，将在你按下按钮之后缓缓打开。里面的每一张照片，
            都在等一个“终于又见面了”的时刻。
          </p>
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="primary-button mt-8 h-14 px-8 text-sm font-medium"
          >
            轻轻打开
          </button>
          <p className="fine-copy mt-4 text-xs">
            开启时间：{formatOpenDate(capsule.openAt)}
          </p>
        </motion.section>
      ) : null}

      {opened ? (
        <>
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="paper-panel rounded-[2.2rem] px-6 py-8 sm:px-10"
          >
            <div className="section-label text-xs">Opened Capsule</div>
            <h1 className="display-type mt-3 text-4xl leading-tight sm:text-6xl">
              这颗胶囊来自 {elapsedDays} 天前。
            </h1>
            <p className="fine-copy mt-4 max-w-3xl text-sm leading-7 sm:text-base">
              你们曾经把一段普通但舍不得丢掉的时刻放在这里。现在它醒了，按上传者整理好，
              一点点重新回到面前。
            </p>
          </motion.section>

          {groups.length ? (
            groups.map((group, groupIndex) => (
              <motion.section
                key={group.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                  delay: groupIndex * 0.08,
                }}
                className="paper-panel rounded-[2rem] p-5 sm:p-8"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="section-label text-xs">Contributor</div>
                    <h2 className="display-type mt-2 text-3xl">{group.nickname}</h2>
                    <p className="fine-copy mt-2 text-sm">
                      {group.contributions.reduce(
                        (sum, item) => sum + item.photos.length,
                        0,
                      )}{" "}
                      张照片，留给未来的几句话
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {group.contributions.map((contribution) => (
                    <article
                      key={contribution.id}
                      className="story-card rounded-[1.75rem] p-4 sm:p-5"
                    >
                      {contribution.message ? (
                        <blockquote className="display-type text-2xl leading-relaxed text-[color:var(--accent-deep)]">
                          “{contribution.message}”
                        </blockquote>
                      ) : (
                        <p className="fine-copy text-sm">这次没留文字，只留下了画面。</p>
                      )}

                      <div className="photo-columns mt-5">
                        {contribution.photos.map((photoPath) => {
                          const src = photoUrls[photoPath];

                          return (
                            <div
                              key={photoPath}
                              className="photo-card mb-4 overflow-hidden rounded-[1.4rem] bg-white"
                            >
                              {/* Public Supabase asset URLs are rendered directly here to avoid broken remote optimization on Zeabur builds. */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={`${group.nickname} 上传的照片`}
                                loading="lazy"
                                decoding="async"
                                className="h-auto w-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </motion.section>
            ))
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="paper-panel rounded-[2rem] p-8 text-center"
            >
              <h2 className="display-type text-3xl">这颗胶囊里还没有内容</h2>
              <p className="fine-copy mt-3 text-sm leading-7">
                Demo 模式下也没关系，你已经有完整的创建、上传、定时唤醒链路了。
              </p>
            </motion.section>
          )}
        </>
      ) : null}
    </div>
  );
}
