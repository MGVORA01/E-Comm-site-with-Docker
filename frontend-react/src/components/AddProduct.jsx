import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "", brand: "", description: "", price: "",
    category: "", stockQuantity: "", releaseDate: "", productAvailable: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append("Product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    try {
      await axios.post("http://localhost:8080/API/Product", formData, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro-form-page">
      <div className="pro-form-header">
        <a href="/" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'var(--text-muted)',fontSize:'0.85rem',textDecoration:'none',marginBottom:'12px',transition:'color 0.2s'}}
          onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>
          <i className="bi bi-arrow-left" /> Back
        </a>
        <h1 className="pro-form-title">Add New Product</h1>
        <p className="pro-form-subtitle">Fill in the details to list a new product</p>
      </div>

      <div className="pro-form-card">
        <form onSubmit={submitHandler}>
          <div className="pro-form-grid">
            <div className="pro-form-group">
              <label className="pro-form-label">Product Name</label>
              <input className="pro-form-input" type="text" name="name" placeholder="e.g. MacBook Pro 14"
                value={product.name} onChange={handleInputChange} required />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Brand</label>
              <input className="pro-form-input" type="text" name="brand" placeholder="e.g. Apple"
                value={product.brand} onChange={handleInputChange} required />
            </div>
            <div className="pro-form-group pro-form-full">
              <label className="pro-form-label">Description</label>
              <textarea className="pro-form-textarea" name="description" placeholder="Describe the product..."
                value={product.description} onChange={handleInputChange} rows={3} />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Price (₹)</label>
              <input className="pro-form-input" type="number" name="price" placeholder="0"
                value={product.price} onChange={handleInputChange} required />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Category</label>
              <select className="pro-form-select" name="category" value={product.category} onChange={handleInputChange} required>
                <option value="">Select category</option>
                {["Laptop","Headphone","Mobile","Electronics","Toys","Fashion"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Stock Quantity</label>
              <input className="pro-form-input" type="number" name="stockQuantity" placeholder="0"
                value={product.stockQuantity} onChange={handleInputChange} required />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Release Date</label>
              <input className="pro-form-input" type="date" name="releaseDate"
                value={product.releaseDate} onChange={handleInputChange} />
            </div>
            <div className="pro-form-group pro-form-full">
              <label className="pro-form-label">Product Image</label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="pro-form-img-preview" />}
              <div className="pro-form-file">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <i className="bi bi-cloud-arrow-up" style={{fontSize:'1.5rem', color:'var(--text-muted)', marginBottom:'6px', display:'block'}} />
                <p className="pro-form-file-text">
                  {image ? image.name : 'Click to upload or drag and drop'}
                </p>
              </div>
            </div>
            <div className="pro-form-group pro-form-full">
              <label className="pro-form-check">
                <input type="checkbox" name="productAvailable"
                  checked={product.productAvailable}
                  onChange={(e) => setProduct({ ...product, productAvailable: e.target.checked })} />
                <span>Product is available for purchase</span>
              </label>
            </div>
          </div>
          <div className="pro-form-actions">
            <a href="/" className="pro-btn pro-btn--outline">Cancel</a>
            <button type="submit" className="pro-btn pro-btn--primary" disabled={loading} style={{flex:1}}>
              {loading ? <><div className="pro-spinner" style={{width:'18px',height:'18px',borderWidth:'2px'}} /> Adding...</> : <><i className="bi bi-plus-circle" /> Add Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
