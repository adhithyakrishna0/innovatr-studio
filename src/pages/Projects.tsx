import { motion, useAnimation } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";

const Projects = () => {
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

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

  useEffect(() => {
    initParticlesEngine(particlesInit);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "hsl(var(--primary))",
            },
            links: {
              color: "hsl(var(--primary))",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 30,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />
      
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 glow-text">Featured Projects</h1>
            <div className="h-1 w-20 bg-primary rounded mx-auto mb-6" />
            <p className="text-xl text-muted-foreground">
              Explore my latest work and innovations
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading projects...</div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No projects available yet. Check back soon!
            </div>
          ) : (
            <div className="space-y-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.2 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [controls]);
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      }
    },
  };
  
  const imageVariants = {
    hidden: { 
      opacity: 0,
      scale: 1.2,
      filter: "blur(10px)",
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      }
    },
  };
  
  const contentVariants = {
    hidden: { 
      opacity: 0,
      x: index % 2 === 0 ? 50 : -50,
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut" as const,
      }
    },
  };
  
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="group"
    >
      <Link to={`/project/${project.id}`}>
        <div className={`grid md:grid-cols-2 gap-6 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all hover:shadow-glow ${isEven ? '' : 'md:grid-flow-dense'}`}>
          {/* Image */}
          <motion.div 
            variants={imageVariants}
            className={`relative aspect-video md:aspect-square overflow-hidden ${isEven ? '' : 'md:col-start-2'}`}
          >
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No image</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          
          {/* Content */}
          <motion.div 
            variants={contentVariants}
            className={`p-8 flex flex-col justify-center ${isEven ? '' : 'md:col-start-1 md:row-start-1'}`}
          >
            <motion.h3 
              className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors"
              whileHover={{ x: 5 }}
            >
              {project.title}
            </motion.h3>
            
            <p className="text-muted-foreground mb-6 line-clamp-4 text-lg">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags?.map((tag: string, tagIndex: number) => (
                <motion.span
                  key={tagIndex}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + tagIndex * 0.1 }}
                  className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            
            <div className="flex gap-4">
              {project.github_url && (
                <motion.a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github size={20} />
                  <span className="text-sm">View Code</span>
                </motion.a>
              )}
              {project.live_url && (
                <motion.a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink size={20} />
                  <span className="text-sm">Live Demo</span>
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Projects;
