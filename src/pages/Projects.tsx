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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 section-spacing pt-32">
        <div className="container-luxe max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-24"
          >
            {/* Header */}
            <div>
              <motion.h1 
                className="text-7xl md:text-9xl font-bold text-foreground leading-none mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Projects
              </motion.h1>
              <div className="luxe-divider" />
            </div>
            
            {/* Projects List */}
            {isLoading ? (
              <div className="text-center text-muted-foreground text-sm uppercase tracking-wider">
                Loading
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm uppercase tracking-wider">
                No projects available yet
              </div>
            ) : (
              <div className="space-y-px bg-border">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="bg-background hover:bg-card transition-colors duration-300 group"
    >
      <Link to={`/project/${project.id}`} className="block">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-12">
          {/* Left - Number & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-sm uppercase tracking-widest text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </div>
            
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
            
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs uppercase tracking-wider text-muted-foreground border border-border px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Links */}
            <div className="flex items-center gap-6 pt-4">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
                >
                  <Github size={18} strokeWidth={1.5} />
                  <span className="text-sm uppercase tracking-wider">Code</span>
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
                >
                  <ExternalLink size={18} strokeWidth={1.5} />
                  <span className="text-sm uppercase tracking-wider">Live</span>
                </a>
              )}
            </div>
          </div>
          
          {/* Right - Image */}
          <div className="lg:col-span-7">
            {project.thumbnail_url && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Projects;
