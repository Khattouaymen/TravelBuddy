import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "small";
}

const BlogCard = ({ post, variant = "default" }: BlogCardProps) => {
  const date = new Date(post.publishDate);
  const formattedDate = formatDistanceToNow(date, {
    addSuffix: true,
    locale: fr,
  });

  if (variant === "small") {
    return (
      <Link href={`/blog/${post.id}`}>
        <a className="flex items-start space-x-3 group">
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-heading font-medium group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </a>
      </Link>
    );
  }

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
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Par {post.author}</span>
          <Link href={`/blog/${post.id}`}>
            <a className="text-primary font-medium hover:underline flex items-center">
              Lire l'article
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
