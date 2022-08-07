import React from "react";
import IconHome from "../../assets/home-svgrepo-com.svg";

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "20px",
        paddingBottom: "10px",
        borderBottom: "1px double",
      }}
    >
      <img src={IconHome} alt="logo" height={48} width={48} style={{margin: "0 2em"}}/>
    </div>
  );
};

export default Header;
