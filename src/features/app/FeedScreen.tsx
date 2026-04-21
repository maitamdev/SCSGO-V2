import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Post {
  id: string;
  content: string;
  image_urls: string[];
  created_at: string;
  likes_count: number;
  comments_count: number;
  profiles: { display_name: string; avatar_url: string | null } | null;
}

export default function FeedScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles!posts_user_id_profiles_fkey(display_name, avatar_url)')
        .order('created_at', { ascending: false })
        .range(0, 9);
      setPosts((data as Post[]) || []);
    } catch (e) {
      console.error('Load posts error:', e);
    }
    setLoading(false);
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    try {
      const { data: existing } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      }
      loadPosts();
    } catch (e) {
      console.error('Toggle like error:', e);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    const days = Math.floor(hrs / 24);
    return `${days} ngày trước`;
  };

  return (
    <div className="app-screen">
      <div className="app-header">
        <div className="app-header-row">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Bảng tin</h2>
          <button className="app-icon-btn" style={{ marginLeft: 'auto' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>

      <div className="app-place-list" style={{ padding: '0 16px 16px' }}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="app-place-card shimmer">
              <div className="shimmer-icon" style={{ borderRadius: '50%' }} />
              <div className="shimmer-lines"><div className="shimmer-line w60" /><div className="shimmer-line w80" /></div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="app-empty">
            <span style={{ fontSize: 48 }}>📝</span>
            <h3>Chưa có bài viết nào</h3>
            <p>Hãy là người đầu tiên chia sẻ trải nghiệm sạc xe!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="feed-post-card">
              <div className="feed-post-header">
                <div className="feed-avatar">
                  {post.profiles?.avatar_url
                    ? <img src={post.profiles.avatar_url} alt="" />
                    : <span>{(post.profiles?.display_name || 'U')[0].toUpperCase()}</span>
                  }
                </div>
                <div>
                  <strong>{post.profiles?.display_name || 'Ẩn danh'}</strong>
                  <span className="feed-time">{timeAgo(post.created_at)}</span>
                </div>
              </div>
              <p className="feed-post-content">{post.content}</p>
              {post.image_urls?.length > 0 && (
                <div className="feed-post-images">
                  {post.image_urls.slice(0, 3).map((url, i) => (
                    <img key={i} src={url} alt="" className="feed-post-img" />
                  ))}
                </div>
              )}
              <div className="feed-post-actions">
                <button onClick={() => toggleLike(post.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span>{post.likes_count || 0}</span>
                </button>
                <button>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>{post.comments_count || 0}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
