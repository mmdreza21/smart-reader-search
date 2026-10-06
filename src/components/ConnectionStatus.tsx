import { useOnlineStatus } from "../hooks/useOnlineStatus";

export function ConnectionStatus() {
  const isOnline = useOnlineStatus();

  return (
    <span role="status">
      {!isOnline && <span className="connection-status">Offline</span>}
    </span>
  );
}
