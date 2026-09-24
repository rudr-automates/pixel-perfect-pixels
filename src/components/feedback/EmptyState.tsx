import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel px-8 py-14 text-center">
      <h3 className="display text-xl text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
