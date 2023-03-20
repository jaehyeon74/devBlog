import React, { PropsWithChildren } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <NavBar />
      <div className="relative mt-20 w-full min-h-screen">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
