import React from 'react';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  if (!show) return null;
  return (
    <div className="pro-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="pro-modal">
        <div className="pro-modal__header">
          <h2 className="pro-modal__title">Review Your Order</h2>
          <button className="pro-modal__close" onClick={handleClose}>
            <i className="bi bi-x" />
          </button>
        </div>
        <div className="pro-modal__body">
          {cartItems.map((item) => (
            <div key={item.id} className="pro-modal__item">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="pro-modal__item-img" />
              ) : (
                <div className="pro-modal__item-img" style={{background:'var(--surface2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <i className="bi bi-image" style={{color:'var(--text-muted)'}} />
                </div>
              )}
              <div className="pro-modal__item-info">
                <p className="pro-modal__item-name">{item.name}</p>
                <p className="pro-modal__item-qty">Qty: {item.quantity} · {item.brand}</p>
              </div>
              <span className="pro-modal__item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="pro-modal__total">
            <span className="pro-modal__total-label">Total Amount</span>
            <span className="pro-modal__total-price">₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>
        <div className="pro-modal__footer">
          <button className="pro-btn pro-btn--outline" style={{flex:1}} onClick={handleClose}>
            Cancel
          </button>
          <button className="pro-btn pro-btn--primary" style={{flex:2}} onClick={handleCheckout}>
            <i className="bi bi-check-circle" /> Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
