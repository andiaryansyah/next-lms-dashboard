const LoadingComponent = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="relative w-14 h-14">
            <div
              className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#0ff] border-b-[#0ff] animate-spin"
              style={{ animationDuration: "3s" }}
            />

            <div
              className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#0ff] animate-spin"
              style={{
                animationDuration: "2s",
                animationDirection: "reverse",
              }}
            />
          </div>

          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 blur-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
