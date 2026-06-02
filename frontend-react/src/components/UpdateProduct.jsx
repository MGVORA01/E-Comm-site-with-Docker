import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [updateProduct, setUpdateProduct] = useState({
    id: null, name: "", description: "", brand: "", price: "",
    category: "", releaseDate: "", productAvailable: false, stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/API/Product/${id}`);
        setProduct(response.data);
        setUpdateProduct(response.data);
        const imgRes = await axios.get(`http://localhost:8080/API/Product/${id}/image`, { responseType: "blob" });
        setImage(new File([imgRes.data], response.data.imageName, { type: imgRes.data.type }));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append("Product", new Blob([JSON.stringify(updateProduct)], { type: "application/json" }));
    try {
      await axios.put(`http://localhost:8080/API/Product/update/${id}`, updatedProduct, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <div className="pro-form-page">
      <div className="pro-form-header">
        <a href="/" style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'var(--text-muted)',fontSize:'0.85rem',textDecoration:'none',marginBottom:'12px',transition:'color 0.2s'}}
          onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}>
          <i className="bi bi-arrow-left" /> Back
        </a>
        <h1 className="pro-form-title">Update Product</h1>
        <p className="pro-form-subtitle">Edit the details below to update this listing</p>
      </div>

      <div className="pro-form-card">
        <form onSubmit={handleSubmit}>
          <div className="pro-form-grid">
            <div className="pro-form-group">
              <label className="pro-form-label">Product Name</label>
              <input className="pro-form-input" type="text" name="name" placeholder={product.name}
                value={updateProduct.name} onChange={handleChange} />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Brand</label>
              <input className="pro-form-input" type="text" name="brand" placeholder={product.brand}
                value={updateProduct.brand} onChange={handleChange} />
            </div>
            <div className="pro-form-group pro-form-full">
              <label className="pro-form-label">Description</label>
              <textarea className="pro-form-textarea" name="description" placeholder={product.description}
                value={updateProduct.description} onChange={handleChange} rows={3} />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Price (₹)</label>
              <input className="pro-form-input" type="number" name="price" placeholder={product.price}
                value={updateProduct.price} onChange={handleChange} />
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Category</label>
              <select className="pro-form-select" name="category" value={updateProduct.category} onChange={handleChange}>
                <option value="">Select category</option>
                {["Laptop","Headphone","Mobile","Electronics","Toys","Fashion"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="pro-form-group">
              <label className="pro-form-label">Stock Quantity</label>
              <input className="pro-form-input" type="number" name="stockQuantity"
                value={updateProduct.stockQuantity} onChange={handleChange} />
            </div>
            <div className="pro-form-group pro-form-full">
              <label className="pro-form-label">Product Image</label>
              {image && (
                <img src={URL.createObjectURL(image)} alt="Preview" className="pro-form-img-preview" />
              )}
              <div className="pro-form-file">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <i className="bi bi-arrow-repeat" style={{fontSize:'1.4rem', color:'var(--text-muted)', marginBottom:'4px', display:'block'}} />
                <p className="pro-form-file-text">Click to replace image</p>
              </div>
            </div>
            <div className="pro-form-group pro-form-full">
              <label className="pro-form-check">
                <input type="checkbox" name="productAvailable"
                  checked={updateProduct.productAvailable}
                  onChange={(e) => setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })} />
                <span>Product is available for purchase</span>
              </label>
            </div>
          </div>
          <div className="pro-form-actions">
            <a href="/" className="pro-btn pro-btn--outline">Cancel</a>
            <button type="submit" className="pro-btn pro-btn--primary" disabled={loading} style={{flex:1}}>
              {loading ? <><div className="pro-spinner" style={{width:'18px',height:'18px',borderWidth:'2px'}} /> Saving...</> : <><i className="bi bi-check-circle" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
