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
    title: "封",
    description: "聚会结束 创建一颗胶囊 选个未来的日期",
    icon: CalendarDays,
  },
  {
    number: "02",
    title: "投",
    description: "把链接甩到群里 每个人上传照片和一句话",
    icon: Upload,
  },
  {
    number: "03",
    title: "等",
    description: "然后忘掉它 几个月后邮箱会收到一封信",
    icon: Mail,
  },
];

const trustPoints = [
  {
    title: "到期前打不开",
    description: "包括创建者自己",
    icon: LockKeyhole,
  },
  {
    title: "不用注册",
    description: "填个昵称和邮箱就行",
    icon: UserRound,
  },
  {
    title: "完全免费",
    description: "没有付费墙，没有水印",
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
              <span>TIME CAPSULE FOR FRIENDS</span>
            </div>

            <h1 className="syl-hero__title" style={{ whiteSpace: "nowrap", wordBreak: "keep-all" }}>
              <span className="inline-block">一起封存此刻</span> <span className="inline-block">寄往未来</span>
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
            <p className="syl-hero__trust">不用注册 · 完全免费 · 到期前谁都打不开</p>
            <a href="#how-it-works" className="syl-scroll-indicator">
              <span>往下看看它怎么运作的</span>
            </a>
          </div>
        </section>

        <section className="syl-section syl-story landing-reveal" style={{ animationDelay: "220ms" }}>
          <div className="syl-story__copy">
            <div className="syl-kicker syl-kicker--muted">YOU&apos;VE BEEN THERE</div>
            <h2 className="syl-section__title">
              <span className="block">上周末的照片</span>
              <span className="block">你翻过几次</span>
            </h2>
            <div className="syl-section__body">
              <p><span style={{ whiteSpace: "nowrap" }}>群里甩了 200 张原图</span></p>
              <p><span style={{ whiteSpace: "nowrap" }}>三天后文件过期</span></p>
              <p><span style={{ whiteSpace: "nowrap" }}>一个月后没人记得那晚谁讲了什么</span></p>
              <p className="syl-section__spacer" />
              <p><span style={{ whiteSpace: "nowrap" }}>照片还在相册里</span></p>
              <p><span style={{ whiteSpace: "nowrap" }}>但已经被外卖截图和工作文件埋了</span></p>
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
            <span className="block" style={{ whiteSpace: "nowrap" }}>云相册负责存</span>
            <span className="block" style={{ whiteSpace: "nowrap" }}>时间胶囊负责重逢</span>
          </h2>
          <p className="syl-concept__caption">
            重点不是马上回看 是留给未来某一天重新打开
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
        </section>

        <section className="syl-closing landing-reveal" style={{ animationDelay: "420ms" }}>
          <div className="syl-closing__inner">
            <h2 className="syl-closing__title">
              <span className="block">最好的回忆</span>
              <span className="block">是你以为已经忘了的那些</span>
            </h2>
            <p className="syl-closing__lede">下次聚完会 别只在群里甩图了</p>
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
