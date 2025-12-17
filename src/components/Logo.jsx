import React from "react";
import logoImg from "/clubsphere-logo.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link className="inline-block" to="/">
      <div className="flex items-center">
        <img src={logoImg} alt="" className="w-10" />
        <h3 className="text-3xl font-bold text-primary -ml-1">lubSphere</h3>
      </div>
    </Link>
  );
};

export default Logo;
