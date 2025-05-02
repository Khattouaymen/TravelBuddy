import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { BlogPost as BlogPostType } from "@shared/schema";
import BlogPost from "@/components/blog/BlogPost";

const BlogPostPage = () => {
  const [match, params] = useRoute<{ id: string }>("/blog/:id");
  const postId = parseInt(params?.id || "0");
  
  const { data: post, isLoading, isError } = useQuery<BlogPostType>({
    queryKey: [`/api/blog/${postId}`],
    enabled: !!postId,
  });
  
  if (!match) {
    return null;
  }
  
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Article non trouvé</h1>
        <p className="text-gray-600 mb-8">
          L'article que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>
          {isLoading
            ? "Chargement de l'article..."
            : post
            ? `${post.title} | Blog Maroc Voyages`
            : "Article non trouvé | Blog Maroc Voyages"}
        </title>
        <meta
          name="description"
          content={
            post?.excerpt ||
            "Découvrez cet article sur le Maroc et sa culture sur notre blog voyage."
          }
        />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <BlogPost postId={postId} />
      </div>
    </>
  );
};

export default BlogPostPage;
