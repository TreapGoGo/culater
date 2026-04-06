type JourneyStepKey = "create" | "share" | "collect" | "open";

const journeySteps: Array<{
  key: JourneyStepKey;
  label: string;
  hint: string;
}> = [
  { key: "create", label: "创建", hint: "设定标题和开启时间" },
  { key: "share", label: "分享", hint: "把链接发给其他人" },
  { key: "collect", label: "收集", hint: "上传照片和一句话" },
  { key: "open", label: "揭晓", hint: "到时间后重新打开" },
];

type JourneyStepsProps = {
  current: JourneyStepKey;
  className?: string;
  layout?: "grid" | "stack";
};

export function JourneySteps({
  current,
  className = "",
  layout = "grid",
}: JourneyStepsProps) {
  const currentIndex = journeySteps.findIndex((step) => step.key === current);
  const stepsClassName =
    layout === "stack" ? "mt-4 grid gap-3" : "mt-4 grid gap-3 sm:grid-cols-4";

  return (
    <div className={`journey-shell ${className}`.trim()}>
      <div className="section-label text-[10px]">Capsule Journey</div>
      <div className={stepsClassName}>
        {journeySteps.map((step, index) => {
          const state =
            index < currentIndex
              ? "complete"
              : index === currentIndex
                ? "current"
                : "upcoming";

          return (
            <div
              key={step.key}
              data-state={state}
              className="journey-step rounded-[1.5rem] px-4 py-4"
              aria-current={state === "current" ? "step" : undefined}
            >
              <div className="flex items-center gap-3">
                <span className="journey-dot flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="fine-copy meta-copy mt-1">{step.hint}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
