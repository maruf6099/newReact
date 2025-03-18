<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index():Response
    {
        return Inertia::render('post',[
            'posts'=>Post::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data=$request->validate([
            'title'   => 'nullable|string|max:255',
            'description' => 'required|string',
            'banner_image' => 'nullable|image|max:2048', // Validate that picture is an image
        ]);
        // $dat= request()->user()->id;
        // dd($dat);
        $data["user_id"] = request()->user()->id;
        //$data = $request->only(['title', 'description']);
        //dd($data);
        if ($request->hasFile('banner_image')) {
            $file = $request->file('banner_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Store the file in the "public/uploads" directory
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['banner_image'] = '/storage/' . $path;
        }
    
        Post::create($data);
    
        return redirect()->route('posts.index')->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $data=$request->validate([
            'title'   => 'nullable|string|max:255',
            'description' => 'required|string',
            'banner_image' => 'nullable|image|max:2048', // Validate that picture is an image
        ]);
        // $dat= request()->user()->id;
        // dd($dat);
        $data["user_id"] = request()->user()->id;
        //$data = $request->only(['title', 'description']);
        //dd($data);
        if ($request->hasFile('banner_image')) {
            $file = $request->file('banner_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Store the file in the "public/uploads" directory
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['banner_image'] = '/storage/' . $path;
        }
    
        $post->update($data);
        
    
        return redirect()->route('posts.index')->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('posts.index')->with('success', 'Post deleted successfully.');
    }
}
