import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface ResultAnnouncerProps {
  message: string;
}

export function ResultAnnouncer({ message }: ResultAnnouncerProps) {
  return (
    <VisuallyHidden.Root role="status" aria-live="polite" aria-atomic="true">
      {message}
    </VisuallyHidden.Root>
  );
}
