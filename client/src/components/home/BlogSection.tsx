import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const date = new Date(post.publishDate);
  const formattedDate = formatDistanceToNow(date, {
    addSuffix: true,
    locale: fr,
  });

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md">
      <div className="h-48 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="bg-primary bg-opacity-10 text-primary text-xs font-medium px-2 py-1 rounded">
            {post.category}
          </span>
          <span className="text-gray-500 text-sm ml-3">{formattedDate}</span>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
        <Link href={`/blog/${post.id}`}>
          <a className="text-primary font-medium hover:underline flex items-center">
            Lire l'article
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Link>
      </div>
    </article>
  );
};

const BlogSkeleton = () => (
  <article className="bg-white rounded-xl overflow-hidden shadow-md">
    <Skeleton className="h-48 w-full" />
    <div className="p-5">
      <div className="flex items-center mb-3">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-4 w-24 ml-3" />
      </div>
      <Skeleton className="h-6 w-4/5 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-32" />
    </div>
  </article>
);

const BlogSection = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  // Filtrer pour n'obtenir que les articles en vedette
  useEffect(() => {
    if (posts) {
      // Filtrer strictement les articles où featured est exactement true
      const filtered = posts.filter(post => post.featured === true);
      console.log('Articles filtrés par featured===true:', filtered.length);
      
      // Si aucun article n'est en vedette, utiliser les 3 plus récents
      if (filtered.length === 0) {
        console.log('Aucun article en vedette, affichage des 3 plus récents');
        setFeaturedPosts(posts.slice(0, 3));
      } else {
        // Limiter à 3 articles en vedette
        setFeaturedPosts(filtered.slice(0, 3));
      }
    }
  }, [posts]);

  // Ajouter un log de débogage pour voir quels articles sont réellement en vedette
  useEffect(() => {
    if (posts) {
      console.log('Tous les articles:', posts.map(p => ({id: p.id, title: p.title, featured: p.featured})));
    }
  }, [posts]);

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-3xl font-heading font-bold text-center mb-4">
        Notre blog voyage
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Découvrez nos articles, conseils et astuces pour préparer votre voyage au Maroc.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, index) => <BlogSkeleton key={index} />)
          : featuredPosts?.length > 0 
              ? featuredPosts.map((post) => <BlogCard key={post.id} post={post} />)
              : <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">Aucun article en vedette disponible pour le moment.</p>
                </div>
        }
      </div>
      
      <div className="text-center mt-8">
        <Link href="/blog">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Explorer le blog
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
