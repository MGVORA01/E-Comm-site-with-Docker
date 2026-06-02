import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateCartQuantity } =
    useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ items: [], total: 0 });

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/API/Products");
        const backendProductIds = response.data.map((p) => p.id);
        const updatedCartItems = cart.filter((item) =>
          backendProductIds.includes(item.id),
        );
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const res = await axios.get(
                `http://localhost:8080/API/Product/${item.id}/image`,
                { responseType: "blob" },
              );
              const imageFile = new File([res.data], res.data.imageName, {
                type: res.data.type,
              });
              return {
                ...item,
                imageFile,
                imageUrl: URL.createObjectURL(res.data),
              };
            } catch {
              return { ...item, imageUrl: "" };
            }
          }),
        );
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    if (cart.length) fetchImagesAndUpdateCart();
    else setCartItems([]);
  }, [cart]);

  useEffect(() => {
    setTotalPrice(
      cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    );
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id !== itemId) return item;
      if (item.quantity >= item.stockQuantity) {
        alert("Cannot add more than available stock");
        return item;
      }
      const newQuantity = item.quantity + 1;
      updateCartQuantity(itemId, newQuantity);
      return { ...item, quantity: newQuantity };
    });
    setCartItems(updatedItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id !== itemId) return item;
      const newQuantity = Math.max(item.quantity - 1, 1);
      updateCartQuantity(itemId, newQuantity);
      return { ...item, quantity: newQuantity };
    });
    setCartItems(updatedItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const {
          imageUrl,
          imageFile,
          imageName,
          imageData,
          imageType,
          quantity,
          ...rest
        } = item;
        const updatedStock = Math.max(item.stockQuantity - item.quantity, 0);
        const updatedProductData = {
          ...rest,
          stockQuantity: updatedStock,
          productAvailable: updatedStock > 0,
        };
        const cartProduct = new FormData();
        if (imageFile) {
          cartProduct.append("imageFile", imageFile);
        }
        cartProduct.append(
          "Product",
          new Blob([JSON.stringify(updatedProductData)], {
            type: "application/json",
          }),
        );
        await axios.put(
          `http://localhost:8080/API/Product/update/${item.id}`,
          cartProduct,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      }
      setOrderDetails({ items: cartItems, total: totalPrice });
      clearCart();
      setCartItems([]);
      setShowModal(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div
      style={{
        marginTop: "var(--navbar-h)",
        padding: "40px 24px",
        maxWidth: "1100px",
        margin: "var(--navbar-h) auto 0",
      }}
    >
      <div className="pro-cart-header">
        <h1 className="pro-cart-title">Shopping Bag</h1>
        <span className="pro-cart-count">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div
            style={{ fontSize: "4rem", marginBottom: "16px", opacity: "0.2" }}
          >
            🛍️
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              color: "var(--text-secondary)",
              marginBottom: "8px",
            }}
          >
            Your bag is empty
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              marginBottom: "24px",
            }}
          >
            Discover our products and start shopping
          </p>
          <a
            href="/"
            className="pro-btn pro-btn--primary"
            style={{ display: "inline-flex" }}
          >
            <i className="bi bi-arrow-left" /> Continue Shopping
          </a>
        </div>
      ) : (
        <div className="pro-cart-layout">
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="pro-cart-item">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="pro-cart-item__img"
                  />
                ) : (
                  <div
                    className="pro-cart-item__img"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--surface2)",
                    }}
                  >
                    <i
                      className="bi bi-image"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                )}
                <div className="pro-cart-item__info">
                  <p className="pro-cart-item__brand">{item.brand}</p>
                  <p className="pro-cart-item__name">{item.name}</p>
                </div>
                <div className="pro-cart-item__controls">
                  <button
                    className="pro-cart-item__qty-btn"
                    onClick={() => handleDecreaseQuantity(item.id)}
                  >
                    −
                  </button>
                  <input
                    className="pro-cart-item__qty"
                    type="button"
                    value={item.quantity}
                    readOnly
                  />
                  <button
                    className="pro-cart-item__qty-btn"
                    onClick={() => handleIncreaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
                <span className="pro-cart-item__price">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
                <button
                  className="pro-cart-item__remove"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            ))}
          </div>

          <div className="pro-cart-summary">
            <h3 className="pro-cart-summary__title">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="pro-cart-summary__row">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="pro-cart-summary__total">
              <span>Total</span>
              <span className="pro-cart-summary__total-price">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              className="pro-btn pro-btn--primary"
              style={{ width: "100%" }}
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-lock" /> Proceed to Checkout
            </button>
            <a
              href="/"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "12px",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              ← Continue Shopping
            </a>
          </div>
        </div>
      )}

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />

      {showSuccess && (
        <div
          className="pro-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowSuccess(false)}
        >
          <div className="pro-modal">
            <div className="pro-modal__header">
              <h2 className="pro-modal__title">Congratulations!</h2>
              <button
                className="pro-modal__close"
                onClick={() => setShowSuccess(false)}
              >
                <i className="bi bi-x" />
              </button>
            </div>
            <div className="pro-modal__body" style={{ textAlign: "center" }}>
              <div
                style={{
                  marginBottom: "18px",
                  color: "var(--success)",
                  fontSize: "2rem",
                }}
              >
                <i className="bi bi-check-circle-fill" />
              </div>
              <p
                style={{
                  marginBottom: "16px",
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                }}
              >
                Congratulations! Your purchase is confirmed and the item has
                been removed from your shopping bag.
              </p>
              <div
                style={{
                  padding: "16px",
                  borderRadius: "18px",
                  background: "var(--surface2)",
                }}
              >
                <p style={{ marginBottom: "10px", fontWeight: 600 }}>
                  Order Summary
                </p>
                <p style={{ margin: 0 }}>
                  {orderDetails.items.length} item
                  {orderDetails.items.length === 1 ? "" : "s"}
                </p>
                <p style={{ margin: 0 }}>
                  Total: ₹{orderDetails.total.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="pro-modal__footer">
              <button
                className="pro-btn pro-btn--primary"
                style={{ width: "100%" }}
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
