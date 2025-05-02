import { useQuery } from "@tanstack/react-query";
import { BlogPost as BlogPostType } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, User } from "lucide-react";
import BlogCard from "./BlogCard";

interface BlogPostProps {
  postId: number;
}

const BlogPost = ({ postId }: BlogPostProps) => {
  const { data: post, isLoading } = useQuery<BlogPostType>({
    queryKey: [`/api/blog/${postId}`],
  });
  
  const { data: relatedPosts, isLoading: isLoadingRelated } = useQuery<BlogPostType[]>({
    queryKey: ["/api/blog"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-80 w-full rounded-xl mb-6" />
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-2/3 mb-4" />
          <div className="flex space-x-4 mb-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-full mb-4" />
          <Skeleton className="h-5 w-full mb-4" />
          <Skeleton className="h-5 w-full mb-4" />
          <Skeleton className="h-5 w-full mb-4" />
          <Skeleton className="h-5 w-3/4 mb-4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-heading font-semibold mb-4">Article non trouvé</h2>
        <p className="text-gray-600 mb-4">
          L'article que vous recherchez n'existe pas ou a été supprimé.
        </p>
      </div>
    );
  }

  // Find related posts (same category, excluding current post)
  const filteredRelatedPosts = relatedPosts
    ?.filter(
      (p) => p.category === post.category && p.id !== post.id
    )
    .slice(0, 3);

  const formattedDate = format(new Date(post.publishDate), "dd MMMM yyyy", {
    locale: fr,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured image */}
      <div className="relative rounded-xl overflow-hidden h-80 mb-8">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Article content */}
          <article className="max-w-3xl">
            <div className="mb-6">
              <span className="inline-block bg-primary bg-opacity-10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-gray-500 gap-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line mb-4">
                {post.content}
              </p>
              {/* We would parse and render markdown/html content here if needed */}
            </div>
            
            <Separator className="my-8" />
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">Catégorie:</span>
                <span className="ml-2 text-primary font-medium">{post.category}</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-blue-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21.593 7.203c-.23-.951-.957-1.702-1.871-1.934-1.654-.419-8.292-.419-8.292-.419s-6.638 0-8.293.419c-.913.232-1.641.983-1.871 1.934-.416 1.721-.416 5.313-.416 5.313s0 3.591.416 5.312c.23.951.957 1.701 1.871 1.934 1.655.418 8.293.418 8.293.418s6.638 0 8.292-.418c.914-.233 1.642-.983 1.871-1.934.416-1.721.416-5.312.416-5.312s0-3.591-.416-5.313zm-12.386 8.622v-6.617l5.553 3.308-5.553 3.309z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-8">
            <div>
              <h3 className="text-xl font-heading font-semibold mb-4">Articles connexes</h3>
              {isLoadingRelated ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-3">
                      <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredRelatedPosts && filteredRelatedPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredRelatedPosts.map((relatedPost) => (
                    <BlogCard
                      key={relatedPost.id}
                      post={relatedPost}
                      variant="small"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Aucun article connexe trouvé
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-heading font-semibold mb-4">Catégories</h3>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="/blog?category=Destinations" 
                  className="bg-gray-100 hover:bg-primary hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                >
                  Destinations
                </a>
                <a 
                  href="/blog?category=Gastronomie" 
                  className="bg-gray-100 hover:bg-primary hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                >
                  Gastronomie
                </a>
                <a 
                  href="/blog?category=Aventure" 
                  className="bg-gray-100 hover:bg-primary hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                >
                  Aventure
                </a>
                <a 
                  href="/blog?category=Culture" 
                  className="bg-gray-100 hover:bg-primary hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                >
                  Culture
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
