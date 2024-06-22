import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // Update product using the RTK Query mutation
      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.success("Product successfully updated", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id).unwrap();
      toast.success(`"${data.name}" is deleted`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 mb-20">
      <div className="flex flex-col md:flex-row mt-10 items-center justify-center">
        <AdminMenu className="w-full md:w-1/4" />
        <div className="w-full md:w-3/4 p-3">
          <div className="h-12 text-center text-lg font-bold">Update / Delete Product</div>

          {image && (
            <div className="text-center">
              <img
                src={image}
                alt="product"
                className="block mx-auto w-full md:w-1/2 h-auto mb-4"
              />
            </div>
          )}

          <div className="mb-3 text-center">
            <label className="text-white py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold">
              {image ? image.name : "Upload image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="p-3">
            <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="w-full md:w-1/2 px-2 mb-3">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3 px-2">
              <label htmlFor="description">Description</label>
              <textarea
                className="p-2 w-full border rounded-lg bg-[#101011] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label htmlFor="countInStock">Count In Stock</label>
                <input
                  type="text"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="w-full md:w-1/2 px-2 mb-3">
                <label htmlFor="category">Category</label>
                <select
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="py-2 px-6 mr-4 rounded-lg text-lg font-bold bg-green-600 text-white"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-2 px-6 rounded-lg text-lg font-bold bg-pink-600 text-white"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
