import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();
  const isPortalRoute = location.pathname.startsWith("/portal");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isPortalRoute && <Footer />}
    </div>
  );
}

export default Layout;
