import Link from "next/link";
import { ArrowRight, CalendarClock, Mail, Upload } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const steps = [
  {
    icon: CalendarClock,
    title: "先定时间",
    description:
      "聚会结束后立刻建一颗胶囊，写好标题，选好它要醒来的那一分钟。",
  },
  {
    icon: Upload,
    title: "再把链接发出去",
    description:
      "每个人都能上传照片和一句话。到开启前，谁也看不到里面的内容。",
  },
  {
    icon: Mail,
    title: "剩下的交给时间",
    description:
      "到时间后系统会自动发邮件提醒，真正的内容留到打开页面时再出现。",
  },
];

export default function Home() {
  return (
    <main className="page-wrap landing-page">
      <div aria-hidden="true" className="landing-ambient">
        <div className="landing-glow landing-glow-hero" />
        <div className="landing-glow landing-glow-note" />
        <div className="landing-glow landing-glow-cta" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4 py-4 sm:py-5">
          <BrandMark />
          <Link href="/create" className="secondary-button h-11 px-5 text-sm">
            创建胶囊
          </Link>
        </header>

        <section className="py-10 sm:py-14">
          <div className="max-w-4xl space-y-6">
            <div className="editorial-kicker">Electronic Time Capsule</div>

            <h1 className="display-type landing-hero-title">
              <span className="block">让回忆在你遗忘之后</span>
              <span className="block">重新找到你</span>
            </h1>

            <p className="fine-copy landing-lede text-base sm:text-lg">
              它不是另一个云相册，而是一种更慢的重逢方式。你们先把照片和一句话封进去，
              等几周、几个月，甚至更久，再在某个普通日子里重新收到它。
            </p>

            <p className="fine-copy body-copy max-w-xl text-sm sm:text-base">
              适合那些本来会在群聊里热闹三天，然后彻底沉下去的时刻。
            </p>

            <div className="flex flex-wrap gap-4 pt-1">
              <Link
                href="/create"
                className="primary-button h-14 w-full px-7 text-sm font-medium sm:w-auto"
              >
                创建一颗时间胶囊
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/create?mode=demo"
                className="secondary-button h-14 w-full px-6 text-sm sm:w-auto"
              >
                先用 2 分钟试跑一遍
              </Link>
            </div>

            <div className="landing-meta">
              <span>不需要账号</span>
              <span>开启前完全封存</span>
              <span>到时自动邮件提醒</span>
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="space-y-4">
            <div className="section-label text-xs">Why It Feels Different</div>
            <h2 className="display-type landing-section-title">
              <span className="block">云相册负责存</span>
              <span className="block">时间胶囊负责重逢</span>
            </h2>
            <p className="fine-copy body-copy max-w-2xl text-sm sm:text-base">
              云相册解决的是“别弄丢”。时间胶囊解决的是“别让它只活三天”。
              重点不是马上回看，而是留给未来某一天重新打开。
            </p>
          </div>

          <div className="landing-note">
            <div className="section-label text-[10px]">First Test</div>
            <p className="display-type mt-4 text-3xl leading-tight sm:text-[2.2rem]">
              <span className="block">第一次试用</span>
              <span className="block">先别建太久</span>
            </p>
            <p className="fine-copy body-copy mt-4 text-sm">
              最好的上手方式，是先建一颗 1 到 2 分钟后开启的测试胶囊。
              这样你会最快看到“创建、上传、等待、揭晓、收邮件”整条链路。
            </p>
          </div>
        </section>

        <section id="how-it-works" className="py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="section-label text-xs">How It Works</div>
            <h2 className="display-type mt-4 text-4xl leading-tight sm:text-[3.7rem]">
              三步就够了
            </h2>
            <p className="fine-copy body-copy mt-4 text-sm sm:text-base">
              首页不需要教会你全部功能。你只要知道创建、分享、等待这三件事，
              剩下的流程会自己往前走。
            </p>
          </div>

          <div className="mt-8 rounded-[2.4rem] border border-[color:var(--line)] bg-white/60 px-4 py-3 sm:px-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="landing-step grid gap-4 py-5 sm:grid-cols-[4.5rem_1fr] sm:gap-5 sm:py-6"
                >
                  <div className="landing-step-rail">
                    <span className="landing-step-count">0{index + 1}</span>
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="timeline-icon shrink-0">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="landing-step-title">{step.title}</h3>
                    </div>
                    <p className="fine-copy body-copy text-sm sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-10 lg:pb-16">
          <div className="paper-panel rounded-[2.6rem] px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <div className="section-label text-xs">Start Small</div>
                <h2 className="display-type mt-4 text-4xl leading-tight sm:text-5xl">
                  <span className="block">现在就先建一颗</span>
                  <span className="block">会在两分钟后醒来的胶囊</span>
                </h2>
                <p className="fine-copy body-copy mt-4 text-sm sm:text-base">
                  不用先拉很多人，也不用准备很多素材。先让第一颗胶囊真的醒一次，
                  你就会知道这个产品的价值到底在哪里。
                </p>
              </div>

              <Link
                href="/create?mode=demo"
                className="primary-button h-14 w-full px-7 text-sm font-medium sm:w-auto"
              >
                开始这次试跑
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
