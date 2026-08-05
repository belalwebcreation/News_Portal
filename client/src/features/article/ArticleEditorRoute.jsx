import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleManagement from './ArticleManagement';
import { newsService } from '../news/services/newsService';

// backend-এর News document-কে ArticleManagement যে shape আশা করে
// (getInitialArticle()-এর empty-state দেখুন) সেই shape-এ map করা
function mapNewsToArticle(news) {
  return {
    id: news._id,
    title: news.title || '',
    slug: news.slug || '',
    category: news.category || '',
    excerpt: news.summary || '',
    body: news.content || '<p></p>',
    status: news.status || 'draft',
    tags: news.tags || [],
    coverImage: news.thumbnail?.media
      ? {
          mediaId: news.thumbnail.media._id,
          url: news.thumbnail.media.url,
          alt: news.thumbnail.media.alt || news.thumbnail.media.caption || '',
        }
      : null,
    updatedAt: news.updatedAt || null,
  };
}

// props (currentUserId, uploadImage, onSave, onPublish) — সবকিছু
// ArticleManagement-এর জন্যই, এখান থেকে সরাসরি pass-through হয়
export function ArticleEditorRoute(props) {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('id');

  const [initialArticle, setInitialArticle] = useState(null);
  const [status, setStatus] = useState(articleId ? 'loading' : 'ready');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!articleId) {
      setStatus('ready');
      return undefined;
    }

    let cancelled = false;
    setStatus('loading');
    setError(null);

    newsService
      .getSingleNews(articleId)
      .then((news) => {
        if (cancelled) return;
        setInitialArticle(mapNewsToArticle(news));
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'আর্টিকেলটি লোড করা যায়নি।');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  if (status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Loading article…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-slate-700">{error}</p>
      </div>
    );
  }

  // articleId না থাকলে initialArticle null-ই থাকে — ArticleManagement তখন
  // normal "নতুন article" flow-তে যায় (আগের মতোই)
  return <ArticleManagement {...props} initialArticle={initialArticle} />;
}

export default ArticleEditorRoute;
