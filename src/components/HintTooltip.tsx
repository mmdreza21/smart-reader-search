import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactElement } from "react";

interface HintTooltipProps {
  label: string;
  shortcut?: string;
  children: ReactElement;
}

export function HintTooltip({ label, shortcut, children }: HintTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="hint-tooltip" sideOffset={6}>
          {label}
          {shortcut && (
            <kbd className="hint-tooltip__key" dir="ltr">
              {shortcut}
            </kbd>
          )}
          <Tooltip.Arrow className="hint-tooltip__arrow" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
