import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import AdminLayout from "@/components/layout/AdminLayout";
import BlogForm from "@/components/admin/BlogForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash, Eye, Filter, FileText } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const AdminBlog = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  // Récupérer la liste des articles de blog
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleView = (post: BlogPost) => {
    setSelectedPost(post);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPost) {
      try {
        await apiRequest("DELETE", `/api/blog/${selectedPost.id}`, {});
        
        // Invalider à la fois les requêtes d'articles de blog et les statistiques du dashboard
        queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
        
        // Forcer un rafraîchissement des données
        queryClient.refetchQueries({ queryKey: ["/api/blog"], type: 'active' });
        
        toast({
          title: "Article supprimé",
          description: "L'article a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression de l'article.",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedPost(null);
      }
    }
  };

  const onFormSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedPost(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      
      return format(date, "d MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return "Date invalide";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Filtrage des articles de blog
  const filteredPosts = posts
    ? posts.filter((post) => {
        const matchesSearch = 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
      })
    : [];

  // Extraction des catégories uniques pour le filtre
  const categories = posts
    ? ["all", ...new Set(posts.map((post) => post.category))]
    : ["all"];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Gestion du blog</h1>
            <p className="text-gray-500 mt-1">
              {posts ? posts.length : 0} articles au total
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un article
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Eye className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="w-full sm:w-60">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.filter(cat => cat !== "all").map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Articles publiés</CardTitle>
            <CardDescription>
              {filteredPosts.length} article(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.id}</TableCell>
                      <TableCell>
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{truncateText(post.title, 40)}</TableCell>
                      <TableCell>{formatDate(post.publishedAt)}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {post.featured && (
                          <Badge className="bg-primary">En vedette</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(post)}
                            title="Voir l'article"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(post)}
                            title="Modifier l'article"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(post)}
                            title="Supprimer l'article"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">
                  {searchQuery || categoryFilter !== "all"
                    ? "Aucun article ne correspond à vos critères de recherche."
                    : "Aucun article trouvé."}
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
                <Button
                  variant="default"
                  className="mt-2 ml-2"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Ajouter un article
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal d'aperçu d'article */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Aperçu de l'article</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-6">
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold">{selectedPost.title}</h2>
                  <div className="flex items-center mt-2 mb-6 text-sm text-gray-500">
                    <span>Par {selectedPost.author}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(selectedPost.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="ml-2">{selectedPost.category}</Badge>
                    {selectedPost.featured && (
                      <Badge className="bg-primary ml-2">En vedette</Badge>
                    )}
                  </div>
                  
                  <p className="text-lg italic mb-6 text-gray-600">
                    {selectedPost.excerpt}
                  </p>
                  
                  <div className="prose max-w-none">
                    {selectedPost.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Fermer
                  </Button>
                  <Button onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(selectedPost);
                  }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier cet article
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal d'ajout d'article */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel article</DialogTitle>
            </DialogHeader>
            <BlogForm onSuccess={onFormSuccess} />
          </DialogContent>
        </Dialog>

        {/* Modal d'édition d'article */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l'article</DialogTitle>
            </DialogHeader>
            {selectedPost && <BlogForm post={selectedPost} onSuccess={onFormSuccess} />}
          </DialogContent>
        </Dialog>

        {/* Confirmation de suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. L'article sera définitivement supprimé de la base de données.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;