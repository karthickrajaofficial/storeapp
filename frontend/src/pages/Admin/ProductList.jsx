import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.imageUrl); // Assuming the response has an imageUrl field
      setImageUrl(res.imageUrl); // Assuming the response has an imageUrl field
      console.log("Uploaded image URL:", res.imageUrl); 
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-20 mt-10 mb-10">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-2xl font-bold mb-6">Create Product</div>

          {imageUrl && (
            <div className="text-center mb-4">
              <img
                src={imageUrl}
                alt="Product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="border text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-3">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full lg:w-1/2 px-2">
                <label htmlFor="name" className="block mb-1">Name</label>
                <input
                  type="text"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full lg:w-1/2 px-2 mt-4 lg:mt-0">
                <label htmlFor="price" className="block mb-1">Price</label>
                <input
                  type="number"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full lg:w-1/2 px-2">
                <label htmlFor="quantity" className="block mb-1">Quantity</label>
                <input
                  type="number"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="w-full lg:w-1/2 px-2 mt-4 lg:mt-0">
                <label htmlFor="brand" className="block mb-1">Brand</label>
                <input
                  type="text"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="block mb-1">Description</label>
              <textarea
                type="text"
                className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-wrap -mx-2 mt-4">
              <div className="w-full lg:w-1/2 px-2">
                <label htmlFor="countInStock" className="block mb-1">Count In Stock</label>
                <input
                  type="number"
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="w-full lg:w-1/2 px-2 mt-4 lg:mt-0">
                <label htmlFor="category" className="block mb-1">Category</label>
                <select
                  className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="py-4 px-10 mt-6 rounded-lg text-lg font-bold bg-pink-600 w-full lg:w-auto"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
