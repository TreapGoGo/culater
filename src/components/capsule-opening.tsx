"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { ContributionGroup } from "@/lib/types";
import { ShareLinkButton } from "./share-link-button";

type CapsuleOpeningProps = {
  capsuleTitle: string;
  elapsedDays: number;
  formattedOpenAt: string;
  groups: ContributionGroup[];
  photoUrls: Record<string, string>;
};

export function CapsuleOpening({
  capsuleTitle,
  elapsedDays,
  formattedOpenAt,
  groups,
  photoUrls,
}: CapsuleOpeningProps) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="space-y-8 lg:space-y-10">
      {!opened ? (
        <motion.section
          initial={false}
          animate={{ opacity: 1 }}
          className="paper-panel panel-amber grain-overlay overflow-hidden rounded-[2.8rem] px-6 py-10 text-center sm:px-10 sm:py-16"
        >
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--foreground)]/95 shadow-2xl">
            <span className="syl-brand__capsule syl-brand__capsule--large" aria-hidden="true">
              <span className="syl-brand__capsule-half syl-brand__capsule-half--light" />
              <span className="syl-brand__capsule-half syl-brand__capsule-half--dark" />
              <span className="syl-brand__capsule-shine" />
            </span>
          </div>
          <p className="section-label mt-8 text-xs">Wake Up Call</p>
          <h1 className="display-type mt-4 break-words text-5xl leading-[0.96] sm:text-7xl">
            {capsuleTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl break-words text-sm leading-7 sm:text-base">
            这颗胶囊来自 {elapsedDays} 天前 按下按钮后 你就会看到大家当时封进去的照片和那句话
          </p>
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="primary-button mt-8 h-14 w-full px-8 text-sm font-medium sm:w-auto"
            aria-expanded={opened}
          >
            打开这颗胶囊
          </button>
          <p className="fine-copy meta-copy mt-4">
            开启时间：{formattedOpenAt}
          </p>
        </motion.section>
      ) : null}

      {opened ? (
        <>
          <motion.section
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="paper-panel panel-amber rounded-[2.6rem] px-6 py-8 sm:px-10"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="section-label text-xs">Opened Capsule</div>
              <ShareLinkButton />
            </div>
            <h1 className="display-type mt-4 break-words text-5xl leading-[0.96] sm:text-7xl">
              这颗胶囊来自 {elapsedDays} 天前
            </h1>
            <p className="fine-copy body-copy mt-4 max-w-3xl break-words text-sm sm:text-base">
              你们当时把一段舍不得丢掉的时刻放在这里。现在它醒了，内容已经按上传者整理好，可以慢慢往下看。
            </p>
          </motion.section>

          {groups.length ? (
            groups.map((group, groupIndex) => (
              <motion.section
                key={group.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                  delay: groupIndex * 0.08,
                }}
                className="paper-panel rounded-[2.3rem] p-5 sm:p-8 panel-amber"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="section-label text-xs">Contributor</div>
                    <h2 className="display-type mt-3 break-words text-4xl leading-none">
                      {group.nickname}
                    </h2>
                    <p className="fine-copy mt-2 text-sm">
                      {group.contributions.reduce(
                        (sum, item) => sum + item.photos.length,
                        0,
                      )}{" "}
                      张照片，和留给未来的话
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5 sm:space-y-6">
                  {group.contributions.map((contribution) => (
                    <article
                      key={contribution.id}
                      className="story-card rounded-[2rem] p-4 sm:p-6"
                    >
                      {contribution.message ? (
                        <blockquote className="display-type tone-rose break-words text-2xl leading-relaxed">
                          “{contribution.message}”
                        </blockquote>
                      ) : (
                        <p className="fine-copy body-copy text-sm">这次没有留下文字，只把照片封了进来。</p>
                      )}

                      <div className="photo-columns mt-5">
                        {contribution.photos.map((photoPath) => {
                          const src = photoUrls[photoPath];

                          return (
                            <div
                              key={photoPath}
                              className="photo-card mb-4 overflow-hidden rounded-[1.4rem] bg-white"
                            >
                              {src ? (
                                <>
                                  {/* Public Supabase asset URLs are rendered directly here to avoid broken remote optimization on Zeabur builds. */}
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={src}
                                    alt={`${group.nickname} 上传的照片`}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-auto w-full object-cover"
                                  />
                                </>
                              ) : (
                                <div className="fine-copy body-copy flex min-h-48 items-center justify-center px-6 py-10 text-center text-sm">
                                  这张照片暂时没能显示出来，但它已经保存成功了。稍后刷新页面再试一次。
                                </div>
                              )}
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
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="paper-panel rounded-[2rem] p-8 text-center"
            >
              <h2 className="display-type text-3xl">这颗胶囊里还没有内容</h2>
              <p className="fine-copy body-copy mt-3 text-sm">
                还没有人往里面上传内容。不过创建、等待和自动开启这条流程已经是完整的。
              </p>
            </motion.section>
          )}
        </>
      ) : null}
    </div>
  );
}
