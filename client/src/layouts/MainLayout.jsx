import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div
      className="
        min-h-screen
        bg-slate-950
        text-white
        overflow-x-hidden
      "
    >
      {/* Application Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main
        className="
          max-w-7xl
          mx-auto
          px-6
          py-10
          pt-24
        "
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;