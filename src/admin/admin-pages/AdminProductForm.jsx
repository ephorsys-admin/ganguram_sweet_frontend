import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { getAdminProductById, createProduct, updateProduct, deleteProductImage, addProductImage } from "../../redux/features/product/productThunk";
import { getCategories } from "../../redux/features/category/categoryThunk";
import { useToast } from "../../context/ToastContext";
import ProductFormHeader from "../admin-components/Product/ProductFormHeader";
import ProductFormInputs from "../admin-components/Product/ProductFormInputs";

const AdminProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const isEdit = !!productId;

  // Redux state
  const { categories = [] } = useSelector((state) => state.category);
  const { currentProduct, isLoading: productLoading } = useSelector((state) => state.product);

  // Local Form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mrp, setMrp] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState("Kg");
  const [status, setStatus] = useState(true);
  const [imagesList, setImagesList] = useState([]);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [homeDelivery, setHomeDelivery] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0]._id);
    }
  }, [categories, categoryId]);

  // Fetch product detail if edit mode
  useEffect(() => {
    if (isEdit) {
      dispatch(getAdminProductById(productId));
    }
  }, [dispatch, productId, isEdit]);

  // Sync state with fetched product details
  useEffect(() => {
    if (isEdit && currentProduct && currentProduct._id === productId) {
      setName(currentProduct.name || "");
      setCategoryId(currentProduct.category?._id || currentProduct.category || "");
      setMrp(currentProduct.mrp || 0);
      setSellingPrice(currentProduct.sellingPrice || 0);
      setStock(currentProduct.stock || 0);
      setUnit(currentProduct.unit || "Kg");
      setStatus(currentProduct.status ?? true);
      
      // Sync images array from database
      if (currentProduct.images && currentProduct.images.length > 0) {
        setImagesList(
          currentProduct.images.map((img) => ({
            id: img.publicId || Math.random().toString(),
            file: null,
            url: img.url,
            publicId: img.publicId,
          }))
        );
      } else {
        setImagesList([]);
      }

      setShortDescription(currentProduct.shortDescription || "");
      setDescription(currentProduct.description || "");
      setHomeDelivery(currentProduct.homeDelivery ?? true);
      setIsFeatured(currentProduct.isFeatured || false);
      setIsBestSeller(currentProduct.isBestSeller || false);
      setIsTrending(currentProduct.isTrending || false);
      setIsNewArrival(currentProduct.isNewArrival || false);
    }
  }, [currentProduct, isEdit, productId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remainingCount = 5 - imagesList.length;
    if (remainingCount <= 0) {
      showToast("Maximum 5 images are allowed.", "error");
      return;
    }

    const filesToAdd = files.slice(0, remainingCount);
    if (files.length > remainingCount) {
      showToast(`Only added first ${remainingCount} images. Limit is 5.`, "warning");
    }

    const newItems = filesToAdd.map((file) => ({
      id: Math.random().toString(),
      file: file,
      url: URL.createObjectURL(file),
      publicId: null,
    }));

    setImagesList((prev) => [...prev, ...newItems]);
  };

  const handleRemoveImage = (id) => {
    setImagesList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveImage = (index, direction) => {
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= imagesList.length) return;

    setImagesList((prev) => {
      const list = [...prev];
      const temp = list[index];
      list[index] = list[newIndex];
      list[newIndex] = temp;
      return list;
    });
  };

  const handleMakePrimary = (index) => {
    if (index === 0) return;
    setImagesList((prev) => {
      const list = [...prev];
      const selected = list[index];
      list.splice(index, 1);
      list.unshift(selected);
      return list;
    });
  };

  const draggedIndexRef = useRef(null);

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
    draggedIndexRef.current = index;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = draggedIndexRef.current !== null 
      ? draggedIndexRef.current 
      : parseInt(e.dataTransfer.getData("text/plain"));
      
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    setImagesList((prev) => {
      const list = [...prev];
      const [draggedItem] = list.splice(sourceIndex, 1);
      list.splice(targetIndex, 0, draggedItem);
      return list;
    });
    draggedIndexRef.current = null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    if (!categoryId) {
      showToast("Product category is required", "error");
      return;
    }
    if (Number(sellingPrice) > Number(mrp)) {
      showToast("Selling price cannot be greater than MRP.", "error");
      return;
    }

    setIsSaving(true);
    try {
      if (!isEdit) {
        // Create Mode
        if (imagesList.length === 0) {
          showToast("At least one product image is required.", "error");
          setIsSaving(false);
          return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("category", categoryId);
        formData.append("mrp", mrp);
        formData.append("sellingPrice", sellingPrice);
        formData.append("stock", stock);
        formData.append("unit", unit);
        formData.append("shortDescription", shortDescription.trim());
        formData.append("description", description.trim());
        formData.append("status", status);
        formData.append("homeDelivery", homeDelivery);
        formData.append("isFeatured", isFeatured);
        formData.append("isBestSeller", isBestSeller);
        formData.append("isTrending", isTrending);
        formData.append("isNewArrival", isNewArrival);
        
        // Append all images in their sorted order
        imagesList.forEach((item) => {
          if (item.file) {
            formData.append("images", item.file);
          }
        });

        await dispatch(createProduct(formData)).unwrap();
        showToast("Product created successfully!", "success");
      } else {
        // Edit Mode
        // 1. Identify deleted images
        const existingImages = currentProduct.images || [];
        const deletedImages = existingImages.filter(
          (exImg) => !imagesList.some((item) => item.publicId === exImg.publicId)
        );

        // Delete deleted images from backend
        for (const img of deletedImages) {
          try {
            await dispatch(deleteProductImage({ productId, publicId: img.publicId })).unwrap();
          } catch (e) {
            console.error("Failed to delete image: ", img.publicId, e);
          }
        }

        // 2. Identify new local files
        const newLocalImages = imagesList.filter((item) => item.file !== null);
        let finalImages = imagesList.filter((item) => item.file === null);

        // Upload new files if any
        if (newLocalImages.length > 0) {
          const imgFormData = new FormData();
          newLocalImages.forEach((item) => {
            imgFormData.append("images", item.file);
          });

          // Upload and get updated product from server
          const result = await dispatch(addProductImage({ productId, formData: imgFormData })).unwrap();
          const updatedProduct = result.data || result;
          const serverImages = updatedProduct.images || [];

          // Find the newly uploaded images from response
          const newUploadedImagesFromServer = serverImages.filter(
            (svImg) => !finalImages.some((fImg) => fImg.publicId === svImg.publicId)
          );

          // Reconstruct ordering including the new uploads
          let uploadIndex = 0;
          finalImages = imagesList.map((item) => {
            if (item.file === null) {
              return { url: item.url, publicId: item.publicId };
            } else {
              const uploaded = newUploadedImagesFromServer[uploadIndex++];
              return uploaded ? { url: uploaded.url, publicId: uploaded.publicId } : null;
            }
          }).filter(Boolean);
        } else {
          finalImages = finalImages.map((item) => ({
            url: item.url,
            publicId: item.publicId,
          }));
        }

        // 3. Call updateProduct with final text details and the sorted images array
        const body = {
          name: name.trim(),
          category: categoryId,
          mrp: Number(mrp),
          sellingPrice: Number(sellingPrice),
          stock: Number(stock),
          unit,
          status,
          shortDescription: shortDescription.trim(),
          description: description.trim(),
          homeDelivery,
          isFeatured,
          isBestSeller,
          isTrending,
          isNewArrival,
          images: finalImages, // Send ordered images list
        };

        await dispatch(updateProduct({ productId, body })).unwrap();
        showToast("Product updated successfully!", "success");
      }
      
      // Redirect back to products listing
      navigate("/admin/products");
    } catch (err) {
      console.error("Save product error details:", err);
      showToast(err?.message || err?.data?.message || "Failed to save product.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && productLoading && !name) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
        <span className="text-xs text-[#6E5A4F] font-semibold">Loading Sweet Product Details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header & Back Action */}
      <ProductFormHeader isEdit={isEdit} onBackClick={() => navigate("/admin/products")} />

      {/* Product Form Inputs */}
      <ProductFormInputs
        name={name}
        setName={setName}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        mrp={mrp}
        setMrp={setMrp}
        sellingPrice={sellingPrice}
        setSellingPrice={setSellingPrice}
        stock={stock}
        setStock={setStock}
        unit={unit}
        setUnit={setUnit}
        status={status}
        setStatus={setStatus}
        shortDescription={shortDescription}
        setShortDescription={setShortDescription}
        description={description}
        setDescription={setDescription}
        homeDelivery={homeDelivery}
        setHomeDelivery={setHomeDelivery}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        isBestSeller={isBestSeller}
        setIsBestSeller={setIsBestSeller}
        isTrending={isTrending}
        setIsTrending={setIsTrending}
        isNewArrival={isNewArrival}
        setIsNewArrival={setIsNewArrival}
        imagesList={imagesList}
        handleImageChange={handleImageChange}
        handleRemoveImage={handleRemoveImage}
        handleMoveImage={handleMoveImage}
        handleMakePrimary={handleMakePrimary}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        categories={categories}
        isEdit={isEdit}
        isSaving={isSaving}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate("/admin/products")}
      />
    </div>
  );
};

export default AdminProductForm;
