import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Heart, Image, MapPin, MessageCircle, Send, Users, Zap } from 'lucide-react';
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

const SAMPLE_POSTS: Post[] = [
  {
    id: 'sample-1',
    content: 'Cuối tuần mình thử trạm sạc SCSGO Sala Eco Hub. Khu vực nghỉ thoáng, cổng CCS2 ổn định và không phải xếp hàng.',
    image_urls: ['/stations/station-4.png'],
    created_at: '2026-07-30T09:00:00+07:00',
    likes_count: 84,
    comments_count: 12,
    profiles: { display_name: 'Minh Khoa EV', avatar_url: 'https://i.pravatar.cc/150?img=12' },
  },
  {
    id: 'sample-2',
    content: 'Có ai thường sạc ở khu Bình Thạnh không? Mình đang tìm trạm có mái che và quán cà phê gần đó để làm việc trong lúc chờ.',
    image_urls: [],
    created_at: '2026-07-29T16:20:00+07:00',
    likes_count: 31,
    comments_count: 19,
    profiles: { display_name: 'Hoàng Nam', avatar_url: 'https://i.pravatar.cc/150?img=11' },
  },
];

export default function FeedScreen() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [feedError, setFeedError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const demoDataEnabled = import.meta.env.VITE_ENABLE_DEMO_DATA !== 'false';
  const profileRecord = profile as Record<string, string> | null;
  const displayName = profileRecord?.display_name || user?.user_metadata?.full_name || 'Bạn';
  const avatarUrl = profileRecord?.avatar_url || user?.user_metadata?.avatar_url;

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles!posts_user_id_profiles_fkey(display_name, avatar_url)')
        .order('created_at', { ascending: false })
        .range(0, 14);
      if (error) throw error;
      setPosts(data?.length ? data as Post[] : demoDataEnabled ? SAMPLE_POSTS : []);
      if (user && data?.length) {
        const ids = data.map(post => post.id);
        const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', ids);
        setLikedIds(new Set((likes || []).map(item => item.post_id)));
      }
    } catch {
      setPosts(demoDataEnabled ? SAMPLE_POSTS : []);
      setFeedError('Chưa thể tải cộng đồng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [demoDataEnabled, user]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const createPost = async () => {
    const trimmed = content.trim();
    if (!trimmed || !user) return;
    setIsPosting(true);
    setFeedError('');
    const imageUrls: string[] = [];
    for (const file of selectedImages.slice(0, 4)) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${user.id}_${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('post-images').upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) {
        setFeedError('Chưa thể tải ảnh lên. Vui lòng chọn ảnh khác.');
        setIsPosting(false);
        return;
      }
      imageUrls.push(supabase.storage.from('post-images').getPublicUrl(path).data.publicUrl);
    }
    const optimistic: Post = {
      id: `local-${crypto.randomUUID()}`,
      content: trimmed,
      image_urls: imageUrls,
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      profiles: { display_name: displayName, avatar_url: avatarUrl || null },
    };
    setPosts(current => [optimistic, ...current]);
    setContent('');
    const { data: created, error } = await supabase.from('posts')
      .insert({ user_id: user.id, content: trimmed, image_urls: imageUrls }).select('*, profiles!posts_user_id_profiles_fkey(display_name, avatar_url)').single();
    if (error) {
      setPosts(current => current.filter(post => post.id !== optimistic.id));
      setFeedError('Chưa thể đăng bài. Nội dung của bạn chưa được lưu.');
    } else if (created) {
      setPosts(current => current.map(post => post.id === optimistic.id ? created as Post : post));
      setSelectedImages([]);
    }
    setIsPosting(false);
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const isLiked = likedIds.has(postId);
    setLikedIds(current => {
      const next = new Set(current);
      if (isLiked) next.delete(postId); else next.add(postId);
      return next;
    });
    setPosts(current => current.map(post => post.id === postId ? { ...post, likes_count: Math.max(0, post.likes_count + (isLiked ? -1 : 1)) } : post));
    if (!postId.startsWith('sample-') && !postId.startsWith('local-')) {
      if (isLiked) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      }
    }
  };

  return (
    <div className="app-page">
      <header className="page-heading">
        <div><h1>Cộng đồng SCSGO</h1><p>Chia sẻ hành trình và kinh nghiệm sử dụng xe điện.</p></div>
      </header>
      <div className="feed-layout">
        <main className="feed-main">
          <section className="surface-panel post-composer">
            {feedError && <div className="auth-alert error" role="alert">{feedError}</div>}
            <div className="composer-row">
              <span className="composer-avatar">{avatarUrl ? <img src={avatarUrl} alt="" /> : displayName.slice(0, 1).toUpperCase()}</span>
              <textarea className="composer-input" value={content} onChange={event => setContent(event.target.value)} placeholder="Bạn muốn chia sẻ điều gì với cộng đồng?" rows={2} />
            </div>
            <div className="composer-actions">
              <div className="composer-tools">
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={event => setSelectedImages(Array.from(event.target.files || []).slice(0, 4))} />
                <button type="button" onClick={() => fileInputRef.current?.click()}><Image size={15} /> {selectedImages.length ? `${selectedImages.length} ảnh` : 'Ảnh'}</button>
                <button type="button" onClick={() => setFeedError('Bạn có thể gắn địa điểm sau khi chọn một trạm trong bản đồ.')}><MapPin size={15} /> Địa điểm</button>
              </div>
              <button className="primary-button" type="button" disabled={!content.trim() || isPosting} onClick={() => void createPost()}><Send size={14} /> Đăng bài</button>
            </div>
          </section>

          {loading ? [1, 2].map(item => <div key={item} className="surface-panel skeleton" style={{ minHeight: 260 }} />) : posts.map(post => {
            const liked = likedIds.has(post.id);
            return (
              <article key={post.id} className="surface-panel feed-post-card">
                <div className="feed-post-header">
                  <span className="feed-avatar">{post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} alt="" /> : (post.profiles?.display_name || 'U').slice(0, 1).toUpperCase()}</span>
                  <div><strong>{post.profiles?.display_name || 'Thành viên SCSGO'}</strong><time className="feed-time">{new Date(post.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</time></div>
                </div>
                <p className="feed-post-content">{post.content}</p>
                {post.image_urls?.length > 0 && <div className="feed-post-images">{post.image_urls.slice(0, 2).map((url, index) => <img key={url + index} src={url} alt="Ảnh chia sẻ trong cộng đồng" className="feed-post-img" />)}</div>}
                <div className="feed-post-actions">
                  <button className={liked ? 'liked' : ''} type="button" onClick={() => void toggleLike(post.id)}><Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {post.likes_count || 0}</button>
                  <button type="button"><MessageCircle size={16} /> {post.comments_count || 0} bình luận</button>
                </div>
              </article>
            );
          })}
        </main>

        <aside className="feed-sidebar">
          <section className="surface-panel community-panel">
            <h3>Chủ đề nổi bật</h3>
            <div className="community-topic"><span className="topic-icon"><Zap size={17} /></span><div><strong>Kinh nghiệm sạc nhanh</strong><span>128 bài viết</span></div></div>
            <div className="community-topic"><span className="topic-icon"><Camera size={17} /></span><div><strong>Hành trình xanh</strong><span>86 bài viết</span></div></div>
            <div className="community-topic"><span className="topic-icon"><Users size={17} /></span><div><strong>Hội chủ xe TP.HCM</strong><span>2.341 thành viên</span></div></div>
          </section>
          <section className="surface-panel community-panel">
            <h3>Quy tắc cộng đồng</h3>
            <p style={{ margin: 0, color: 'var(--app-text-soft)', fontSize: 11, lineHeight: 1.65 }}>Chia sẻ thông tin hữu ích, tôn trọng thành viên khác và không đăng nội dung quảng cáo không liên quan.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
