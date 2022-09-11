import { useEffect, useState } from "react";

type EventCode = string;

function fromEventCode(code: EventCode): string {
  const prefixRegex = /Key|Digit/gi;
  return code.replace(prefixRegex, "");
}

function equal(watchedKey: string, eventCode: EventCode): boolean {
  return fromEventCode(eventCode).toUpperCase() === watchedKey.toUpperCase();
}

export function usePressObserver(watchKey: string): [boolean, (value: boolean) => void] {
  const [isPressed, setPressed] = useState<boolean>(false);

  useEffect(() => {
    function handlePressed({ code }: KeyboardEvent): void {
      if (!equal(watchKey, code)) {
        return;
      }
      setPressed(true);
    }

    document.addEventListener("keyup", handlePressed);

    return () => {
      document.removeEventListener("keyup", handlePressed);
    };
  }, [watchKey, isPressed, setPressed]);

  return [isPressed, setPressed];
}
