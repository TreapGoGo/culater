import Link from "next/link";
import {
  CalendarDays,
  Coins,
  LockKeyhole,
  Mail,
  Upload,
  UserRound,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "创建",
    description: "聚会结束，创建一颗胶囊，选个未来的日期",
    icon: CalendarDays,
  },
  {
    number: "02",
    title: "上传",
    description: "把链接甩到群里，每个人上传照片和一句话",
    icon: Upload,
  },
  {
    number: "03",
    title: "等待",
    description: "然后忘掉它，几个月后邮箱/手机会收到解封",
    icon: Mail,
  },
];

const trustPoints = [
  {
    title: "到期前不可浏览",
    description: "包括创建者自己",
    icon: LockKeyhole,
  },
  {
    title: "不用注册",
    description: "填个昵称和邮箱就行",
    icon: UserRound,
  },
  {
    title: "免费使用",
    description: "仅创建胶囊的用户需交纳一次性存储费用",
    icon: Coins,
  },
];

const albumTiles = [
  "syl-album-tile syl-album-tile--muted syl-album-tile--tall",
  "syl-album-tile syl-album-tile--muted",
  "syl-album-tile syl-album-tile--glow",
  "syl-album-tile syl-album-tile--muted syl-album-tile--wide",
  "syl-album-tile syl-album-tile--muted",
  "syl-album-tile syl-album-tile--muted",
];

export default function Home() {
  return (
    <main className="page-wrap syl-landing">
      <div aria-hidden="true" className="syl-landing__ambient">
        <div className="syl-landing__spot syl-landing__spot--top" />
        <div className="syl-landing__spot syl-landing__spot--mid" />
        <div className="syl-landing__spot syl-landing__spot--bottom" />
      </div>

      <div className="syl-shell">
        <section className="syl-hero">
          <header className="syl-nav landing-reveal" style={{ animationDelay: "40ms" }}>
            <Link href="/" className="syl-brand">
              <span className="syl-brand__mark">💊</span>
              <span className="syl-brand__text">
                <span className="syl-brand__name">See You Later</span>
              </span>
            </Link>

            <Link href="/create" className="syl-button syl-button--ghost">
              创建胶囊
            </Link>
          </header>

          <div className="syl-hero__body landing-reveal" style={{ animationDelay: "120ms" }}>
            <div className="syl-kicker">
              <span className="syl-kicker__dot" />
              <span>See You Later</span>
            </div>

            <h1 className="syl-hero__title" style={{ whiteSpace: "nowrap", wordBreak: "keep-all" }}>
              <span className="inline-block">而是帮你</span>
              <span className="inline-block text-[color:var(--landing-accent)]">回忆</span>
              <span className="inline-block">世界的美好</span>
            </h1>

            <p className="syl-hero__lede">
              <span className="block" style={{ whiteSpace: "nowrap" }}>不是云相册 不是共享文件夹</span>
              <span className="block" style={{ whiteSpace: "nowrap" }}>是一颗会在未来某天自己找到你的时间胶囊</span>
            </p>

            <div className="syl-hero__actions">
              <Link href="/create" className="syl-button syl-button--primary">
                封一颗胶囊
              </Link>
            </div>
          </div>

          <div className="syl-hero__foot landing-reveal" style={{ animationDelay: "180ms" }}>
            <p className="syl-hero__trust">无需注册 · 集体记录 · 到期解锁</p>
            <a href="#how-it-works" className="syl-scroll-indicator">
              <span>下滑查看更多信息</span>
            </a>
          </div>
        </section>

        <section className="syl-section syl-story landing-reveal" style={{ animationDelay: "220ms" }}>
          <div className="syl-story__copy">
            <div className="syl-kicker syl-kicker--muted">YOU&apos;VE BEEN THERE</div>
            <h2 className="syl-section__title">
              <span className="block">一切都在加速</span>
              <span className="block">但有些东西值得慢下来</span>
            </h2>
            <div className="syl-section__body">
              <p><span style={{ whiteSpace: "nowrap" }}>群里甩了 200 张原图</span></p>
              <p><span style={{ whiteSpace: "nowrap" }}>三天后文件过期</span></p>
              <p><span style={{ whiteSpace: "nowrap" }}>一个月后没人记得那晚谁讲了什么</span></p>
              <p className="syl-section__spacer" />
              <p><span style={{ whiteSpace: "nowrap" }}>AI 能帮你做很多事</span></p>
              <p><span style={{ whiteSpace: "nowrap" }}>但无法让你你重新感动一次</span></p>
            </div>
          </div>

          <div className="syl-story__visual" aria-hidden="true">
            <div className="syl-phone">
              <div className="syl-phone__topbar">
                <span>最近项目</span>
                <div className="syl-phone__signal">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="syl-phone__grid">
                {albumTiles.map((className, index) => (
                  <div key={index} className={className} />
                ))}
              </div>

              <div className="syl-phone__note">
                <span className="syl-phone__note-line" />
                <span className="syl-phone__note-line syl-phone__note-line--short" />
              </div>
            </div>
          </div>
        </section>

        <section className="syl-section syl-concept landing-reveal" style={{ animationDelay: "260ms" }}>

          <h2 className="syl-concept__title">
            <span className="block" style={{ whiteSpace: "nowrap" }}>我们不吹嘘改变世界</span>
            <span className="block" style={{ whiteSpace: "nowrap" }}>而是帮你回忆世界的美好</span>
          </h2>
          <p className="syl-concept__caption">
            一颗胶囊 · 一群朋友 · 一段被封存的时光
          </p>
        </section>

        <section
          id="how-it-works"
          className="syl-section landing-reveal"
          style={{ animationDelay: "320ms" }}
        >
          <div className="syl-section__heading">
            <div className="syl-kicker syl-kicker--muted">HOW IT WORKS</div>
            <h2 className="syl-section__title">
              <span style={{ whiteSpace: "nowrap" }}>三步 不能再多了</span>
            </h2>
          </div>

          <div className="syl-steps">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article key={step.number} className="syl-step-card">
                  <div className="syl-step-card__number">{step.number}</div>
                  <div className="syl-step-card__icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="syl-step-card__title">{step.title}</h3>
                  <p className="syl-step-card__text">{step.description}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-10 text-center text-sm text-[color:var(--landing-muted)] opacity-80">
            <span style={{ whiteSpace: "nowrap" }}>好的产品未必需要壁垒</span>
          </p>
        </section>

        <section className="syl-section landing-reveal" style={{ animationDelay: "360ms" }}>
          <div className="syl-section__heading">
            <div className="syl-kicker syl-kicker--muted">NO STRINGS ATTACHED</div>
          </div>

          <div className="syl-trust">
            {trustPoints.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="syl-trust-card">
                  <div className="syl-trust-card__icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="syl-trust-card__title">{item.title}</h3>
                  <p className="syl-trust-card__text">{item.description}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-10 text-center text-sm text-[color:var(--landing-muted)] opacity-80">
            <span style={{ whiteSpace: "nowrap" }}>不追求颠覆什么 保持小而美 简单纯粹</span>
          </p>
        </section>

        <section className="syl-section landing-reveal" style={{ animationDelay: "400ms" }}>
          <div className="syl-section__heading">
            <div className="syl-kicker syl-kicker--muted">FUTURE & ROADMAP</div>
            <h2 className="syl-section__title">
              <span style={{ whiteSpace: "nowrap" }}>让回忆更轻盈</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <article className="syl-step-card" style={{ minHeight: "auto" }}>
              <div className="section-label text-[10px]">Business Model</div>
              <h3 className="syl-step-card__title">商业模式</h3>
              <p className="syl-step-card__text leading-7">
                胶囊的创建者只需要在创建时支付一次性费用
              </p>
              <p className="syl-step-card__text leading-7">
                覆盖短信+云存储+带宽费用，100 人胶囊预估定价 19￥
              </p>
            </article>
            <article className="syl-step-card" style={{ minHeight: "auto" }}>
              <div className="section-label text-[10px]">Evolution</div>
              <h3 className="syl-step-card__title">形态进化</h3>
              <p className="syl-step-card__text leading-7">
                上架微信小程序 + 微信环境友好的链接
              </p>
              <p className="syl-step-card__text leading-7">
                延长产业链，搭售淘宝店铺实体相册冲印
              </p>
            </article>
          </div>
        </section>

        <section className="syl-closing landing-reveal" style={{ animationDelay: "420ms" }}>
          <div className="syl-closing__inner">
            <h2 className="syl-closing__title">
              <span className="block">最好的回忆</span>
              <span className="block">是你以为已经忘了的那些</span>
            </h2>
            <p className="syl-closing__lede">在这个人人都在造工具的时代</p>
            <p className="syl-closing__lede">我们造了一颗会自己找到你的胶囊</p>
            <Link href="/create" className="syl-button syl-button--primary syl-button--large">
              封一颗胶囊 →
            </Link>
            <p className="syl-closing__meta">30 秒创建 不用下载任何东西</p>
          </div>
        </section>

        <footer className="syl-footer landing-reveal" style={{ animationDelay: "460ms" }}>
          <span>© 2026 See You Later</span>
          <a
            href="https://github.com/TreapGoGo/culater"
            target="_blank"
            rel="noreferrer"
            className="syl-footer__link"
          >
            Made with memories
          </a>
        </footer>
      </div>
    </main>
  );
}
