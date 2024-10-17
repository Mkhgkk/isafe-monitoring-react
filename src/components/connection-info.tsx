type ConnectionInfoProps = {
  isConnected: boolean;
  systemStatus: {
    cpu: number;
    gpu: number;
  };
};

function ConnectionInfo({ isConnected, systemStatus }: ConnectionInfoProps) {
  return (
    <>
      {isConnected && (
        <p className="text-muted-foreground text-xs flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-green-600 mr-2"></span>
          Server Connected
        </p>
      )}
      {!isConnected && (
        <p className="text-muted-foreground text-xs flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-600 mr-2"></span>
          Server Disconnected
        </p>
      )}
      <p className="text-sm">Less than a minute ago</p>
      <p className="text-muted-foreground text-xs mt-3">System Utilization</p>
      <p className="text-sm">CPU: {systemStatus.cpu.toFixed(1)}%</p>
      <p className="text-sm">GPU: {systemStatus.gpu.toFixed(1)}%</p>
    </>
  );
}

export default ConnectionInfo;
