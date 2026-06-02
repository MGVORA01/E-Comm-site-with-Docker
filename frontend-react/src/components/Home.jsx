import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import { showToast } from "../utils/toast";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/API/Product/${product.id}/image`,
                { responseType: "blob" },
              );
              return {
                ...product,
                imageUrl: URL.createObjectURL(response.data),
              };
            } catch {
              return { ...product, imageUrl: "" };
            }
          }),
        );
        setProducts(updatedProducts);
      };
      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
      )
    : products;

  if (isError) {
    return (
      <div className="pro-loading">
        <i
          className="bi bi-wifi-off"
          style={{ fontSize: "3rem", color: "var(--text-muted)" }}
        />
        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-display)",
            fontSize: "1.2rem",
          }}
        >
          Unable to connect to server
        </p>
      </div>
    );
  }

  return (
    <main
      style={{
        marginTop: "var(--navbar-h)",
        padding: "40px 24px",
        maxWidth: "1400px",
        margin: "var(--navbar-h) auto 0",
      }}
    >
      <div className="pro-section-header">
        <div>
          <h1 className="pro-section-title">
            {selectedCategory ? selectedCategory : "All Products"}
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              marginTop: "4px",
            }}
          >
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "item" : "items"}
          </p>
        </div>
        {selectedCategory && (
          <span className="pro-filter-chip">
            <i className="bi bi-tag-fill" style={{ fontSize: "0.7rem" }} />
            {selectedCategory}
          </span>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="pro-empty">
          <div className="pro-empty__icon">📦</div>
          <p className="pro-empty__title">No products available</p>
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "8px",
              fontSize: "0.9rem",
            }}
          >
            Check back soon or browse other categories
          </p>
        </div>
      ) : (
        <div className="pro-grid">
          {filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } =
              product;
            return (
              <div
                className={`pro-card ${!productAvailable ? "pro-card--unavailable" : ""}`}
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <div className="pro-card__img-wrap">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={name}
                        className="pro-card__img"
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <i
                          className="bi bi-image"
                          style={{
                            fontSize: "2rem",
                            color: "var(--text-muted)",
                          }}
                        />
                      </div>
                    )}
                    {!productAvailable && (
                      <span className="pro-card__badge pro-card__badge--out">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="pro-card__body">
                    <span className="pro-card__brand">{brand}</span>
                    <p className="pro-card__name">{name}</p>
                    <div className="pro-card__footer">
                      <span className="pro-card__price">₹{price}</span>
                      <button
                        className="pro-card__atc"
                        onClick={(e) => {
                          e.preventDefault();
                          const result = addToCart(product);
                          showToast(result.message);
                        }}
                        disabled={!productAvailable}
                      >
                        {productAvailable ? "Add to Cart" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Home;
