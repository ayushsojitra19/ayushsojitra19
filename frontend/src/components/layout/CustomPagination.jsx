import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../../App.css";

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {
  const [currentPage, setCurrentPage] = useState(1);
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);

    if (searchParams.has("page")) {
      searchParams.set("page", pageNumber);
    } else {
      searchParams.append("page", pageNumber);
    }

    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  const totalPages = Math.ceil(filteredProductsCount / resPerPage);

  if (totalPages <= 1) return null;

  const filteredProductsCount1 = Number(filteredProductsCount);
  const resPerPage1 = Number(resPerPage);

  return (
    <div className="d-flex justify-content-center my-5">
      <ReactPaginate
        forcePage={currentPage - 1} // react-paginate is 0-indexed
        onPageChange={(data) => setCurrentPageNo(data.selected + 1)}
        pageRangeDisplayed={3}
        pageCount={Math.ceil(filteredProductsCount1 / resPerPage1)}
        previousLabel={"Prev"}
        nextLabel={"Next"}
        first
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default CustomPagination;
