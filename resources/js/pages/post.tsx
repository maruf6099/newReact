import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
//import PostFromModel from "@components/PostFromModel";  {/* সঠিকভাবে import */}
import PostFormModel from "@/components/PostFormModel";  
import AppLayout from '@/layouts/app-layout';
import {Toaster,toast} from "sonner";

export default function Post() {
    const { posts } = usePage<{ posts: { id: number; title: string; description: string; banner_image?: string }[] }>().props;

    // selectPost স্টেটটি এখানে null অথবা Post অবজেক্ট হতে পারে
    const [selectPost, setSelectPost] = useState<{ id: number; title: string; description: string; banner_image?: string } | null>(null);
    const [isModelOpen, setIsModelOpen] = useState(false);

    const openModel = (post: { id: number; title: string; description: string; banner_image?: string } | null) => {
        setSelectPost(post);  // এখন এখানে `post` বা `null` পাঠানো যেতে পারে
        setIsModelOpen(true);
    };

//     const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);

//   const openModal = (post = null) => {
//     setSelectedPost(post);
//     setIsModalOpen(true);
//   };

    const handleDelete = (id: number) => {
        router.delete(`/posts/${id}`, {
            onSuccess: () => {
                toast.success("Post delete successfully");
                router.reload();
            },
            onError: () => {
                toast.success("Post failed delete");
                console.error("Failed to delete post");
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Posts" />
<Toaster position='top-right'richColors/>
            <div className="flex flex-col gap-6 p-6 bg-white text-black shadow-lg rounded-xl">
                <div className="flex justify-end">
                    <button onClick={() => openModel(null)} className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition">
                        Add Post
                    </button>
                </div>

                <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-800 border-b">
                            {["Picture", "Title", "Content", "Actions"].map((header) => (
                                <th key={header} className="border p-3 text-left">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length ? (
                            posts.map((post) => (
                                <tr key={post.id} className="border-b">
                                    <td className="p-3">
                                        {post.banner_image ? <img src={post.banner_image} alt="Post" className="w-16 h-16 object-cover rounded-full" /> : "No Picture"}
                                    </td>
                                    <td className="p-3">{post.title}</td>
                                    <td className="p-3">{post.description}</td>
                                    <td className="p-3 flex gap-2">
                                        <button onClick={() => openModel(post)} className="bg-blue-500 text-sm text-white px-3 py-1 rounded">Edit</button>
                                        <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-sm text-white px-3 py-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="text-center p-4 text-gray-600">No posts found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PostFormModel isOpen={isModelOpen} closeModal={() => setIsModelOpen(false)} post={selectPost} />
        </AppLayout>
    );
}
