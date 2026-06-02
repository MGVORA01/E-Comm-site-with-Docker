import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { showToast } from "../utils/toast";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/API/Product/${id}`,
        );
        setProduct(response.data);
        if (response.data.imageName) {
          const imgRes = await axios.get(
            `http://localhost:8080/API/Product/${id}/image`,
            { responseType: "blob" },
          );
          setImageUrl(URL.createObjectURL(imgRes.data));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/API/Product/${id}`);
      removeFromCart(id);
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddToCart = () => {
    const result = addToCart(product);
    showToast(result.message);
  };

  if (!product) {
    return (
      <div className="pro-loading">
        <div className="pro-spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="pro-product-page">
      <a
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          textDecoration: "none",
          marginBottom: "28px",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--text-primary)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-muted)")
        }
      >
        <i className="bi bi-arrow-left" /> Back to products
      </a>

      <div className="pro-product-grid">
        <div className="pro-product__img-wrap">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="pro-product__img"
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
                style={{ fontSize: "4rem", color: "var(--text-muted)" }}
              />
            </div>
          )}
        </div>

        <div className="pro-product__info">
          <div>
            <span className="pro-product__category">
              <i className="bi bi-tag" /> {product.category}
            </span>
          </div>

          <h1 className="pro-product__name">{product.name}</h1>
          <p className="pro-product__brand">by {product.brand}</p>

          <div className="pro-product__divider" />

          <div>
            <p className="pro-product__desc-label">Description</p>
            <p className="pro-product__desc">{product.description}</p>
          </div>

          <div className="pro-product__meta">
            <div className="pro-product__meta-item">
              Stock
              <strong
                style={{
                  color:
                    product.stockQuantity > 0
                      ? "var(--success)"
                      : "var(--danger)",
                }}
              >
                {product.stockQuantity} units
              </strong>
            </div>
            <div className="pro-product__meta-item">
              Listed
              <strong>
                {new Date(product.releaseDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </div>
            <div className="pro-product__meta-item">
              Status
              <strong
                style={{
                  color: product.productAvailable
                    ? "var(--success)"
                    : "var(--danger)",
                }}
              >
                {product.productAvailable ? "Available" : "Out of Stock"}
              </strong>
            </div>
          </div>

          <div className="pro-product__divider" />

          <p className="pro-product__price">₹{product.price}</p>

          <div className="pro-product__actions">
            <button
              className="pro-btn pro-btn--primary"
              onClick={handleAddToCart}
              disabled={!product.productAvailable}
            >
              <i className="bi bi-bag-plus" />
              {product.productAvailable ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="pro-btn pro-btn--outline pro-btn--sm"
              onClick={() => navigate(`/Product/update/${id}`)}
            >
              <i className="bi bi-pencil" /> Edit Product
            </button>
            <button
              className="pro-btn pro-btn--danger pro-btn--sm"
              onClick={deleteProduct}
            >
              <i className="bi bi-trash" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
