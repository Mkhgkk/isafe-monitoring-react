import { useTranslation } from "react-i18next";

type ConnectionInfoProps = {
  isConnected: boolean;
  systemStatus: {
    cpu: number;
    gpu: number;
  };
};

function ConnectionInfo({ isConnected, systemStatus }: ConnectionInfoProps) {
  const { t } = useTranslation();
  return (
    <>
      {isConnected && (
        <p className="text-muted-foreground text-xs flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-green-600 mr-2"></span>
          {t("connection.connected")}
        </p>
      )}
      {!isConnected && (
        <p className="text-muted-foreground text-xs flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-600 mr-2"></span>
          {t("connection.disconnected")}
        </p>
      )}
      <p className="text-sm">Less than a minute ago</p>
      <p className="text-muted-foreground text-xs mt-3">
        {t("connection.utilization")}
      </p>
      <p className="text-sm">
        {t("connection.cpu")}: {systemStatus.cpu.toFixed(1)}%
      </p>
      <p className="text-sm">
        {t("connection.gpu")}: {systemStatus.gpu.toFixed(1)}%
      </p>
    </>
  );
}

export default ConnectionInfo;
