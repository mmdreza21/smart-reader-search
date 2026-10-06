import { useInstallPrompt } from "../hooks/useInstallPrompt";

export function InstallButton() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button
      type="button"
      className="install-button"
      onClick={() => void install()}
    >
      Install
    </button>
  );
}
