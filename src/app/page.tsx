import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Mail,
  Sparkles,
  Upload,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const steps = [
  {
    icon: CalendarClock,
    title: "设定醒来的那一天",
    description:
      "聚会结束的时候创建胶囊，选一个七天后到一年内的日期，把“以后再看”真的变成一件会发生的事。",
  },
  {
    icon: Upload,
    title: "把照片和一句话封进去",
    description:
      "每个人通过同一条链接上传照片和短短一句话，内容在到期前完全不展示，不给提前偷看留下机会。",
  },
  {
    icon: Mail,
    title: "在遗忘之后，重新收到它",
    description:
      "到点后系统给所有参与者发邮件。照片不出现在邮件里，悬念会被完整保留到点开那一刻。",
  },
];

export default function Home() {
  return (
    <main className="page-wrap">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4 py-4">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Link href="/create" className="secondary-button h-11 px-5 text-sm">
              创建胶囊
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
          <div className="max-w-3xl">
            <div className="section-label text-xs">Electronic Time Capsule</div>
            <h1 className="display-type mt-5 text-5xl leading-[1.08] sm:text-7xl">
              让回忆在你遗忘之后，
              <br />
              重新找到你。
            </h1>
            <p className="fine-copy mt-6 max-w-2xl text-base leading-8 sm:text-lg">
              See You Later 不是另一个云相册。它把一场聚会、一趟露营、一次毕业旅行封存起来，
              等到你们已经很久没再提它的时候，再把那一刻递回来。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/create" className="primary-button h-14 px-6 text-sm font-medium">
                创建一颗时间胶囊
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="secondary-button h-14 px-6 text-sm">
                先看它怎么工作
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="story-card rounded-[1.6rem] p-4">
                <div className="section-label text-[10px]">MVP</div>
                <p className="mt-3 text-sm leading-7">
                  无账号体系。用邮箱识别参与者，用分享链接召集大家。
                </p>
              </div>
              <div className="story-card rounded-[1.6rem] p-4">
                <div className="section-label text-[10px]">Sealed</div>
                <p className="mt-3 text-sm leading-7">
                  到期前不展示任何已上传内容，连创建者也看不到。
                </p>
              </div>
              <div className="story-card rounded-[1.6rem] p-4">
                <div className="section-label text-[10px]">Wake Up</div>
                <p className="mt-3 text-sm leading-7">
                  到点邮件提醒，再以“拆开”而不是“刷到”的方式重遇它。
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <div className="capsule-ring absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full" />
            <div className="paper-panel grain-overlay absolute left-0 top-6 w-[78%] rounded-[2rem] p-6">
              <div className="section-label text-[10px]">Capsule</div>
              <h2 className="display-type mt-3 text-3xl">2026 清明露营</h2>
              <p className="fine-copy mt-4 text-sm leading-7">
                大家从群里点开链接，上传原图和一句话，然后安静等待。
              </p>
            </div>
            <div className="paper-panel absolute bottom-4 right-0 w-[82%] rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent-soft)]">
                  <Sparkles className="h-5 w-5 text-[color:var(--accent-deep)]" />
                </span>
                <div>
                  <div className="section-label text-[10px]">Reunion</div>
                  <p className="display-type text-2xl">这颗胶囊来自 84 天前。</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="aspect-[4/5] rounded-[1.2rem] bg-[linear-gradient(180deg,rgba(119,175,126,0.18),rgba(84,102,65,0.08))] shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-10 lg:py-16">
          <div className="section-label text-xs">How It Works</div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="display-type max-w-3xl text-4xl leading-tight sm:text-5xl">
              三步把“群里一阵热闹”变成“几个月后重新撞上的回忆”。
            </h2>
            <p className="fine-copy max-w-xl text-sm leading-7 sm:text-base">
              这不是高频工具。它的价值恰恰在于你会忘记它一阵子，然后被它重新敲一下心口。
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article key={step.title} className="paper-panel rounded-[1.9rem] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent-soft)]">
                    <Icon className="h-5 w-5 text-[color:var(--accent-deep)]" />
                  </div>
                  <h3 className="display-type mt-5 text-3xl">{step.title}</h3>
                  <p className="fine-copy mt-4 text-sm leading-7">{step.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="py-10 lg:pb-16">
          <div className="paper-panel rounded-[2.4rem] px-6 py-8 sm:px-10 sm:py-12">
            <div className="section-label text-xs">Build The MVP</div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-3xl">
                <h2 className="display-type text-4xl leading-tight sm:text-5xl">
                  这版已经按 Next.js + Supabase + Resend 的 MVP 结构搭好了。
                </h2>
                <p className="fine-copy mt-4 text-sm leading-7 sm:text-base">
                  创建胶囊、上传照片、封存等待页、开启仪式、定时邮件和 Vercel Cron
                  都有代码骨架，接上环境变量就能进入联调。
                </p>
              </div>

              <Link href="/create" className="primary-button h-14 px-6 text-sm font-medium">
                直接开始
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
