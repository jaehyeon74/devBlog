import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-20 p-4 flex justify-between items-center z-10">
      <div className="flex-1">
        <Link href={"/"}>재현의 개발블로그</Link>
      </div>
      <div className="flex-none">
        <ul className="px-1 flex justify-center items-center">
          <li>
            <Link href={"/about"}>About</Link>
          </li>
          <li>DarkmodeToggle</li>
          <li>SearchBar</li>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
