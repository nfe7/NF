import React from 'react';
import { Star } from 'lucide-react';
import { GitHubRepo } from '../types';

interface RepoCardProps {
  repo: GitHubRepo;
  onClick: (repo: GitHubRepo) => void;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, onClick }) => {
  return (
    <div className="group">
       <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          
          {/* Left Column: Badges */}
          <div className="md:col-span-2 flex flex-row md:flex-col gap-3 md:items-start justify-start">
             {repo.language && (
               <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-[#777] rounded-sm tracking-wide">
                 {repo.language}
               </span>
             )}
             {repo.stargazers_count > 0 && (
               <span className="inline-block px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 rounded-sm tracking-wide flex items-center gap-1">
                 <Star size={10} fill="currentColor" /> {repo.stargazers_count}
               </span>
             )}
          </div>

          {/* Right Column: Content */}
          <div className="md:col-span-10">
             <div className="mb-2">
                <h3 
                  onClick={() => onClick(repo)}
                  className="text-lg font-bold text-gray-900 font-sans cursor-pointer hover:text-primary transition-colors inline-block"
                >
                  {repo.name}
                </h3>
             </div>

             <div className="text-base text-gray-700 font-sans leading-relaxed mb-3">
               {repo.description || "No description provided."}
             </div>

             <div className="flex flex-wrap gap-4 text-sm font-sans italic text-gray-500">
               {/* Mimic the "Conference, Year" style */}
               <span>Updated {new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</span>
             </div>

             <div className="mt-3 flex gap-4">
                <button 
                  onClick={() => onClick(repo)}
                  className="text-[#8c1515] text-sm font-bold uppercase tracking-wide hover:text-[#600] border-b border-dotted border-[#8c1515] transition-colors"
                >
                  View Details
                </button>
                {repo.html_url && (
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#8c1515] text-sm font-bold uppercase tracking-wide hover:text-[#600] border-b border-dotted border-[#8c1515] transition-colors"
                  >
                    GitHub Source
                  </a>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default RepoCard;