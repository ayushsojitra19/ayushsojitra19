import react, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate, useParams } from "react-router";
import {
  useDeleteProductImagesMutation,
  useGetProductDetailsQuery,
  useUploadProductImagesMutation,
} from "../../redux/api/productsApi";

const UploadImages = () => {
  const fileInputRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const { data, isLoading: isDetailsLoading } = useGetProductDetailsQuery(params.id);

  const [uploadProductImages, { isLoading, isSuccess, error }] =
    useUploadProductImagesMutation();

  const [
    deleteProductImages,
    { isLoading: isDeleteLoading, error: deleteError },
  ] = useDeleteProductImagesMutation();

  useEffect(() => {
    if (data?.product) {
      setUploadedImages(data.product.images);
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to upload images");
      console.log(error);
    }
    if (deleteError) {
      toast.error(deleteError?.data?.message || "Failed to delete image");
      console.log(deleteError);
    }
    if (isSuccess) {
      setImagePreviews([]);
      setImages([]);
      toast.success("Images uploaded successfully");
      navigate("/admin/products");
    }
  }, [data, error, isSuccess, deleteError, navigate]);

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreviews((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleResetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImagePreviewDelete = (indexToDelete) => {
    const filteredPreviews = imagePreviews.filter((_, index) => index !== indexToDelete);
    const filteredImages = images.filter((_, index) => index !== indexToDelete);
    setImagePreviews(filteredPreviews);
    setImages(filteredImages);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      return toast.error("Please select at least one image to upload.");
    }
    uploadProductImages({ id: params.id, body: { images } });
  };

  const deleteImage = (imgId) => {
    deleteProductImages({ id: params.id, body: { imgId } });
  };

  if (isDetailsLoading) return <Loader />;

  return (
    <>
      <AdminLayout>
        <div className="row wrapper">
          <div className="col-10 col-lg-8 mt-5 mt-lg-0">
            <form
              className="shadow rounded bg-body"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <h2 className="mb-4">Upload Product Images</h2>

              <div className="mb-3">
                <label htmlFor="customFile" className="form-label">
                  Choose Images
                </label>

                <div className="custom-file">
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="product_images"
                    className="form-control"
                    id="customFile"
                    multiple
                    onChange={onChange}
                    onClick={handleResetFileInput}
                    disabled={isLoading || isDeleteLoading}
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="new-images my-4">
                    <p className="text-warning">New Images:</p>
                    <div className="row mt-4">
                      {imagePreviews.map((img, index) => (
                        <div className="col-md-3 mt-2" key={`preview-${index}`}>
                          <div className="card">
                            <img
                              src={img}
                              alt="New Preview"
                              className="card-img-top p-2"
                              style={{ width: "100%", height: "80px" }}
                            />
                            <button
                              style={{
                                backgroundColor: "#dc3545",
                                borderColor: "#dc3545",
                              }}
                              type="button"
                              className="btn btn-block btn-danger cross-button mt-1 py-0"
                              onClick={() => handleImagePreviewDelete(index)}
                              disabled={isLoading || isDeleteLoading}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadedImages && uploadedImages.length > 0 && (
                  <div className="uploaded-images my-4">
                    <p className="text-success">Product Uploaded Images:</p>
                    <div className="row mt-1">
                      {uploadedImages.map((img) => (
                        <div className="col-md-3 mt-2" key={img.public_id}>
                          <div className="card">
                            <img
                              src={img.url}
                              alt="Uploaded Product"
                              className="card-img-top p-2"
                              style={{ width: "100%", height: "80px" }}
                            />
                            <button
                              style={{
                                backgroundColor: "#dc3545",
                                borderColor: "#dc3545",
                              }}
                              className="btn btn-block btn-danger cross-button mt-1 py-0"
                              type="button"
                              onClick={() => deleteImage(img?.public_id)}
                              disabled={isLoading || isDeleteLoading}
                            >
                              {isDeleteLoading ? "..." : "Remove"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                id="register_button"
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading || isDeleteLoading || images.length === 0}
              >
                {isLoading ? "Uploading..." : "Upload Images"}
              </button>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UploadImages;
