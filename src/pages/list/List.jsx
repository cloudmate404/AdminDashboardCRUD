import React from "react";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { Navbar } from "../../components/navbar/Navbar";
import "./list.scss";
import { Datatable } from "../../components/datatable/Datatable";
export const List = ({ lists, title, type }) => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />

        <Datatable lists={lists} title={title} type={type} />
      </div>
    </div>
  );
};
