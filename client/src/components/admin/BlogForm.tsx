import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BlogPost } from "@shared/schema";
import { Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const blogCategories = [
  { value: "Destinations", label: "Destinations" },
  { value: "Gastronomie", label: "Gastronomie" },
  { value: "Aventure", label: "Aventure" },
  { value: "Culture", label: "Culture" },
  { value: "Conseils", label: "Conseils" },
  { value: "Histoire", label: "Histoire" },
];

const blogFormSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  content: z.string().min(50, "Le contenu doit contenir au moins 50 caractères"),
  excerpt: z.string().min(10, "L'extrait doit contenir au moins 10 caractères"),
  imageUrl: z.string().url("URL d'image invalide"),
  category: z.string().min(1, "La catégorie est requise"),
  author: z.string().min(3, "Le nom de l'auteur est requis"),
});

interface BlogFormProps {
  post?: BlogPost;
  onSuccess: () => void;
}

const BlogForm = ({ post, onSuccess }: BlogFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      imageUrl: post?.imageUrl || "",
      category: post?.category || "Destinations",
      author: post?.author || "Admin",
    },
  });

  const onSubmit = async (values: z.infer<typeof blogFormSchema>) => {
    try {
      setIsSubmitting(true);

      if (post) {
        // Update existing post
        await apiRequest("PUT", `/api/blog/${post.id}`, values);
        toast({
          title: "Article mis à jour",
          description: "L'article a été mis à jour avec succès.",
        });
      } else {
        // Create new post
        await apiRequest("POST", "/api/blog", values);
        toast({
          title: "Article créé",
          description: "Le nouvel article a été créé avec succès.",
        });
      }

      // Invalidate blog posts query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'article.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre de l'article" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {blogCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auteur</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'auteur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'image</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemple.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  URL d'une image pour illustrer l'article.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extrait</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Résumé court de l'article..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Cet extrait sera affiché sur les cartes d'articles et dans les résultats de recherche.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contenu détaillé de l'article..."
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Enregistrement..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {post ? "Mettre à jour" : "Publier"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
