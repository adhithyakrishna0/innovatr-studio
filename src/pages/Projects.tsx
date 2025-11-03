import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("visible", true)
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 glow-text">My Projects</h1>
            <div className="h-1 w-20 bg-primary rounded" />
          </motion.div>
          
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading projects...</div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No projects available yet. Check back soon!
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link to={`/project/${project.id}`}>
                    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all hover:shadow-glow h-full flex flex-col">
                      {project.thumbnail_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags?.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-muted rounded-full text-xs border border-border"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex gap-3">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Github size={20} />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;