
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {Toaster,toast} from "sonner";
 
interface Post {
  id?: number;
  title: string;
  description: string;
  banner_image?: string;
}

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  post?: Post | null;
}

export default function PostFormModal({ isOpen, closeModal, post }: Props) {
  const [formData, setFormData] = useState<Post>({ title: "", description: "", banner_image: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (post) {
      setFormData({ title: post.title, description: post.description, banner_image: post.banner_image || "" });
      setPreview(post.banner_image || "");
      setSelectedFile(null);
    } else {
      setFormData({ title: "", description: "", banner_image: "" });
      setPreview("");
      setSelectedFile(null);
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (selectedFile) {
      data.append("banner_image", selectedFile);
    }

    const successMessage=post?.id?"post updated successfully":"Post created successfully";
    const errorMessage=post?.id?"post failed to updated ":"Post failed to created";
    
    if (post?.id) {
      data.append("_method", "PUT");
      router.post(`/posts/${post.id}`, data, {
        onSuccess: () => {
            toast.success(successMessage);
          closeModal();
          router.reload();
        },
        onError: (errors) => {
            toast.success(errorMessage);
          console.error(errors.message || "Failed to submit post.");
        },
      });
    } else {
      router.post("/posts", data, {
        onSuccess: () => {
            toast.success(successMessage);
          closeModal();
          router.reload();
        },
        onError: (errors) => {
            toast.success(errorMessage);
          console.error(errors.message || "Failed to submit post.");
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4">{post ? "Edit Post" : "Add Post"}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
       
          <div className="mb-3">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Content</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium">Picture (optional)</label>
            <input
              type="file"
              name="banner_image"
              onChange={handleFileChange}
              className="w-full"
              accept="image/*"
            />
          </div>
          {preview && (
            <div className="mb-3">
              <p className="text-sm mb-1">Image Preview:</p>
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{post ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}