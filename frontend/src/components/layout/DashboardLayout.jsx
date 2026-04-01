import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../styles/layout.css";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar collapsed={collapsed} />
      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <Navbar toggle={() => setCollapsed(!collapsed)} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;