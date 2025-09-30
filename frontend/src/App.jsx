import { useState } from 'react';
import { Download } from 'lucide-react';

// هذا هو المكون الرئيسي للتطبيق
export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [media, setMedia] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter an Instagram URL');
      return;
    }

    setLoading(true);
    setError('');
    setMedia(null);

    try {
      // استخدام متغير البيئة لرابط API
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
         throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${apiUrl}/api/fetch-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch media');
      }

      setMedia(data.media);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Instagram Downloader
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Download videos, reels, and photos easily.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Instagram URL here..."
            className="flex-grow bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 rounded-md px-4 py-2 disabled:bg-pink-800 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {media && (
          <div className="mt-8 bg-gray-800 rounded-lg p-4">
            <p className="text-sm truncate mb-4">{media.title}</p>
            {media.type === 'image' ? (
              <img src={media.thumbnailUrl} alt="Instagram Media" className="rounded-md w-full" />
            ) : (
              <video controls src={media.thumbnailUrl} className="rounded-md w-full" poster={media.thumbnailUrl}></video>
            )}
            
            <div className="mt-4">
               <h3 className="font-semibold mb-2">Download Options:</h3>
               <div className="flex flex-col gap-2">
                {media.downloadUrls.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 rounded-md px-4 py-2 flex items-center justify-between text-sm"
                  >
                    <span>{item.quality} ({item.type.toUpperCase()})</span>
                    <Download size={16} />
                  </a>
                ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
