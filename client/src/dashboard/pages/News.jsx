import React from 'react';
import { Link} from 'react-router-dom';
import NewsContent from "./NewsContent";

const News = () => {

    const userInfo={
        role:"Admin"
    }
  return (
    <div className="bg-white rounded-md">
        <div className="flex justify-between p-4">
            <h2 className="text-xl font-medium">
                News
            </h2>
             {userInfo.role !=="Admin" && (
                <Link className="px-3 py-1.5 bg-amber-950 rounded-sm text-white hover:bg-amber-700" to="/dashboard/news/create">Create News</Link>
            )}
        </div>
        <NewsContent />
        
    </div>
  );
};

export default News;