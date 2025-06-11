import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/forum/SearchBar';
import CreatePost from '../../components/forum/CreatePost';
import PostList from '../../components/forum/PostList';
import PostForm from '../../components/forum/PostForm';
import AdvancedFilter from '../../components/forum/AdvancedFilter';

export default function PostPage({ basePath = "/forum/post" }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://api-phu-6.onrender.com/api/post/public", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      console.log('fetchPosts data:', data);
      setPosts(data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchPosts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleCreatePost = async (formData) => {
    try {
      const tags = formData.hashtags ? formData.hashtags.trim().split(/\s+/) : [];
      const payload = { ...formData, tags };

      const res = await fetch("https://api-phu-6.onrender.com/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('Create post response:', result);

      if (res.ok) {
        await fetchPosts();
        setShowCreateForm(false);
      } else {
        alert('Tạo bài viết thất bại: ' + (result.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Lỗi tạo bài viết:', error);
      alert('Tạo bài viết thất bại do lỗi mạng');
    }
  };

  const handleFilter = async (filterValues = {}) => {
    try {
      const query = new URLSearchParams();

      if (filterValues?.search) query.append('q', filterValues.search);

      if (filterValues?.tags?.length) {
        query.append('tags', filterValues.tags.join(','));
      }

      if (filterValues?.user_name) query.append('user_name', filterValues.user_name);
      if (filterValues?.from_date) query.append('from_date', filterValues.from_date);
      if (filterValues?.to_date) query.append('to_date', filterValues.to_date);
      if (filterValues?.sort) query.append('sort', filterValues.sort);

      const res = await fetch(`https://api-phu-6.onrender.com/api/post/filter?${query.toString()}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      });

      const data = await res.json();
      console.log('handleFilter data:', data);
      setPosts(data.data || []);
    } catch (err) {
      console.error('Lỗi lọc bài viết:', err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim() === '') {
        fetchPosts();
      } else {
        handleFilter({ search: search.trim() });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <div className="sticky top-[-35px] bg-gray-100 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="sm:col-span-2">
            <SearchBar
              search={search}
              setSearch={setSearch}
            />
          </div>
          <div className="sm:col-span-1 flex justify-end gap-3">
            <AdvancedFilter onFilter={handleFilter} />
            <CreatePost onCreate={() => setShowCreateForm(true)} />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 pb-2">
          <div className="flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500 font-semibold whitespace-nowrap">
              Danh sách bài viết
            </span>
            <hr className="flex-grow border-gray-300" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-6 mt-4 transition-all duration-200">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 font-semibold">
            Không tìm thấy bài viết
          </div>
        ) : (
          <PostList posts={posts} setPosts={setPosts} basePath={basePath} />
        )}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <PostForm
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreatePost}
          />
        </div>
      )}
    </div>
  );
}