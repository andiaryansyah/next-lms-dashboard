import ToggleTheme from "@/components/ToggleTheme";

const SettingsPage = async () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-md flex-1 m-4 mt-0">
      <div className="text-lg font-semibold">Settings</div>

      <div className="p-6">
        <h1 className="font-semibold hidden md:block">Dark Mode</h1>
        <div className="flex items-center gap-8 py-2">
          <p>Click the toggle for change to Dark Mode </p>
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
