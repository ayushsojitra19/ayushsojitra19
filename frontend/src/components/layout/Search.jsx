import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
  const [keyword, setKeyword] = React.useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      window.location.href = `/?keyword=${keyword}`;
    }else{
        navigate("/");
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="input-group" id="margin-0 search-margin-0">
          <input
            type="text"
            id="search_field"
            aria-describedby="search_btn"
            className="form-control"
            placeholder="Search Product "
            name="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button id="search_btn" className="btn" type="submit">
            {/* <i className="fa fa-search" aria-hidden="true"></i> */}
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
