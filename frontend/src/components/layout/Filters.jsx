import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../../helpers/helpers";
import { PRODUCT_CATEGORIES } from "../../constants/constants";

const Filters = () => {
  const [min, setMin] = React.useState(0);
  const [max, setMax] = React.useState(0);

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams.has("min") && setMin(searchParams.get("min"));
    searchParams.has("max") && setMax(searchParams.get("max"));
  }, [searchParams]);

  // Handle category filter change & ratings
  const handleClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);
    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      //Delete the filter from the search params
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name);
        const path = `${window.location.pathname}?${searchParams.toString()}`;
        navigate(path);
      }
    } else {
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value);
      } else {
        searchParams.append(checkbox.name, checkbox.value);
      }
      const path = `${window.location.pathname}?${searchParams.toString()}`;
      navigate(path);
    }
  };

  // Handle price filter form submission
  const handleButtonClick = (e) => {
    e.preventDefault();
    searchParams = getPriceQueryParams(searchParams, "min", min);
    searchParams = getPriceQueryParams(searchParams, "max", max);
    const path = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(path);
  };

  const defaultCheckedHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType);
    if (checkboxValue === value) return true;
    return false;
  };

  return (
    <>
      <div className="border p-3 filter">
        <h3>Filters</h3>
        <hr />
        <h5 className="filter-heading mb-3">Price</h5>
        <form id="filter_form" className="px-2" onSubmit={handleButtonClick}>
          <div className="row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Min ($)"
                name="min"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Max ($)"
                name="max"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>
            <div className="col">
              <button type="submit" className="btn btn-primary">
                GO
              </button>
            </div>
          </div>
        </form>
        <hr />
        <h5 className="mb-3">Category</h5>
        {PRODUCT_CATEGORIES.map((category) => (
          <div className="form-check" key={category}>
            <input
              className="form-check-input"
              type="checkbox"
              name="category"
              id={`check-${category.replace(/\s+/g, "-").toLowerCase()}`}
              value={category}
              defaultChecked={defaultCheckedHandler("category", category)}
              onClick={(e) => handleClick(e.target)}
            />
            <label
              className="form-check-label"
              for={`check-${category.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {category}
            </label>
          </div>
        ))}

        <hr />
        <h5 className="mb-3">Ratings</h5>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="ratings"
              id={`check-${rating}`}

              value={rating}
              defaultChecked={defaultCheckedHandler("ratings", rating.toString())}
              onClick={(e) => handleClick(e.target)}
            />
            <label className="form-check-label" for={`check-${rating}`}>
              <span className="star-rating">★ {rating}</span>
            </label>
          </div>
        ))}

        
      </div>
    </>
  );
};

export default Filters;
