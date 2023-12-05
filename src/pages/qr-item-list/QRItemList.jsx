import React, { useEffect, useState } from "react";
import styles from "./qr.module.css";
// import QRItem from "../../components/qr-item/QRItem";
import { Button, Chip, CircularProgress, TextField } from "@mui/material";
import { methods } from "../../constants/methods";
import { Search } from "@mui/icons-material";
import { in_props } from "../../constants/in_props";
import { search_btn } from "../../constants/search_btn";


function QRItemList() {
  // Search params
  const page_size = 20;
  const [page,setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchDesc, setSearchDesc] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [itemList, setItemList] = useState([]);

  // Pagination loader
  const [loading, setLoading] = useState(true);

  // Called only once
  useEffect(() => {
    // fetch all categories on load
    loadAllCategories();
    // add scroll listener for pagination
    window.addEventListener("scroll", handleScroll);
    // clean listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Called on category select or pagination
  useEffect(() => {
    console.log("CAT CHANGED!!!!!!!!");
    loadItemsPerPage();
  }, [page,selectedCategory]);

  // Handle scroll events for pagination
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1
      >= document.documentElement.scrollHeight) {
        setLoading(true);
        setPage((prev) => prev+1);
    }
  }

  // Load all categories
  const loadAllCategories = async () => {
    const url = new URL(import.meta.env.VITE_API_BASE_URL
      +import.meta.env.VITE_API_ALL_CATEGORIES);
    url.searchParams.append("page",1);
    url.searchParams.append("page_size",100);
    console.log(String(url));
    await fetch(url,{
      method: methods.GET,
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json())
    .then((obj) => {
      setCategoryList(obj.data);
    });
  }

  // load more products given params
  const loadItemsPerPage = async () => {
    console.log("SELECTED CAT -> "+selectedCategory);
    console.log("SEARCH DESC -> "+searchDesc);
    console.log("PAGE -> "+page);
    const url = new URL(import.meta.env.VITE_API_BASE_URL
      +"allItems");
    url.searchParams.append("page",page);
    url.searchParams.append("page_size",page_size);
    url.searchParams.append("strItemDesc",searchDesc);
    if(selectedCategory!==0) 
    url.searchParams.append("nCategoryCode",selectedCategory);
    console.log(String(url));
    await fetch(url,{
      method: methods.GET,
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json())
    .then((obj) => {
      setItemList((prev) => {return [...prev,...obj.data]});
      setLoading(false);
    });
  }

  // On new category select
  const handleCategorySelect = (categoryId) => {
    console.log("Category -> "+categoryId);
    setItemList([]);
    setLoading(true);setPage(1);
    setSelectedCategory(categoryId);
  };

  // On search button pressed
  const handleSearch = () => {
    setItemList([]);
    setLoading(true);setPage(1);
    loadItemsPerPage();
  }

  return (
    <>
      <div className={styles.pageTitle}>QR Items</div>
      <div className={styles.catContainer}>
        {categoryList.map((category) =>
          selectedCategory === category.nCategoryID ? (
            <Chip
              key={category.nCategoryID}
              label={category.strCategoryDesc}
              onClick={() => handleCategorySelect(category.nCategoryID)}
              disabled
            />
          ) : (
            <Chip
              key={category.nCategoryID}
              label={category.strCategoryDesc}
              onClick={() => handleCategorySelect(category.nCategoryID)}
              variant="outlined"
            />
        ))}
      </div>
      <div className={styles.searchContainer}>
        <TextField
          fullWidth
          value={searchDesc}
          onChange={(e) => setSearchDesc(e.target.value)}
          InputProps={in_props}
          placeholder="Heineken"
        />
        <Button
          onClick={handleSearch}
          startIcon={<Search />}
          sx={search_btn}
        ></Button>
      </div>
      <div className={styles.boxContainer}>
        {/* {itemList.map(
            (item,idx) => (
                <QRItem
                  key={idx}
                  item={item}
                />
              )
          )}
          {loading && <CircularProgress sx={{ color: 'grey.500' }} />} */}
      </div>
    </>
  );
}

export default QRItemList;
