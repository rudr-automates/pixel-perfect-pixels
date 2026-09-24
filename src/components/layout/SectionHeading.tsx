import type { ReactNode } from "react";

export function SectionHeading({
  index,
  title,
  description,
  action,
}: {
  index?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        <div className="flex items-center gap-3">
          {index && <span className="label-xs">{index}</span>}
          <h2 className="display text-xl text-foreground md:text-2xl">{title}</h2>
        </div>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
