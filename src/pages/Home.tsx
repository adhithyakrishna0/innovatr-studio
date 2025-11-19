import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NixieClock from "@/components/NixieClock";
import AnimatedText from "@/components/AnimatedText";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 100]);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: homeContent } = useQuery({
    queryKey: ["home-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_content")
        .select("*")
        .eq("section", "parallax_sections")
        .maybeSingle();
      
      if (error) throw error;
      return data?.content || {
        featured_work_title: "Featured Work",
        featured_work_description: "Explore innovative solutions crafted with precision and creativity.",
        philosophy_title: "Philosophy",
        philosophy_description: "Merging technical excellence with creative innovation to build experiences that matter.",
      };
    },
  });

  const { data: featuredProjects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("visible", true)
        .eq("featured", true)
        .order("display_order")
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });
  
  const { data: heroStats } = useQuery({
    queryKey: ["hero-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_stats")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });
  
  const { data: resume } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });
  
  const titles = profile?.title ? profile.title.split("|").map(t => t.trim()) : ["Innovator", "Problem Solver"];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Nixie Clock - Fixed Left Side */}
          <div className="fixed left-8 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
            <NixieClock />
          </div>
          
          <div className="container-luxe xl:pl-[420px]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-16"
            >
              {/* Profile Image */}
              {profile?.profile_image_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="flex justify-center xl:justify-start"
                >
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name || "Profile"}
                    className="w-40 h-40 rounded-full border-2 border-border object-cover"
                  />
                </motion.div>
              )}
              
              {/* Main Content */}
              <div className="space-y-12 max-w-4xl">
                <div className="space-y-8">
                  <motion.h1 
                    className="text-6xl md:text-8xl font-bold text-foreground leading-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    {profile?.full_name || "Your Name"}
                  </motion.h1>
                  
                  <motion.div 
                    className="text-2xl md:text-3xl text-muted-foreground font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    {titles[0]}
                  </motion.div>
                </div>
                
                
                {/* Stats Grid */}
                {heroStats && heroStats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border mt-16"
                  >
                    {heroStats.map((stat, index) => (
                      <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                        className="bg-background p-8 hover:bg-card transition-colors duration-300"
                      >
                        <div className="text-4xl font-bold text-foreground mb-2 tracking-tighter">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 pt-8"
                >
                  <Link to="/projects">
                    <Button 
                      size="lg" 
                      className="bg-foreground text-background hover:bg-foreground/90 rounded-none h-14 px-8 font-medium transition-all duration-300"
                    >
                      View Work
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-border text-foreground hover:bg-foreground hover:text-background rounded-none h-14 px-8 font-medium transition-all duration-300"
                    >
                      Contact
                    </Button>
                  </Link>
                  {resume && (
                    <a href={resume.file_url} download target="_blank" rel="noopener noreferrer">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-border text-muted-foreground hover:text-foreground hover:border-foreground rounded-none h-14 px-8 font-medium transition-all duration-300"
                      >
                        Resume
                      </Button>
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Parallax Scrolling Content Sections */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="section-spacing space-y-48"
        >
          <div className="container-luxe space-y-48">
            {/* Featured Work Section */}
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-5xl md:text-6xl font-bold text-foreground">
                    {(homeContent as any)?.featured_work_title || "Featured Work"}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {(homeContent as any)?.featured_work_description || "Explore innovative solutions crafted with precision and creativity."}
                  </p>
                  <Link to="/projects">
                    <Button 
                      variant="outline" 
                      className="border-foreground text-foreground hover:bg-foreground hover:text-background"
                    >
                      VIEW PROJECTS
                    </Button>
                  </Link>
                </div>
                
                {(homeContent as any)?.featured_work_image_url ? (
                  <div className="aspect-video overflow-hidden border border-border">
                    <img 
                      src={(homeContent as any).featured_work_image_url} 
                      alt="Featured Work"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : featuredProjects && featuredProjects.length > 0 && (
                  <Link to={`/project/${featuredProjects[0].id}`} className="group">
                    <div className="aspect-video overflow-hidden border border-border">
                      <img 
                        src={featuredProjects[0].thumbnail_url || ""} 
                        alt={featuredProjects[0].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-xl font-bold mt-4 group-hover:text-primary transition-colors">
                      {featuredProjects[0].title}
                    </h3>
                  </Link>
                )}
              </div>
              
              {/* Additional Featured Projects */}
              {featuredProjects && featuredProjects.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredProjects.slice(1).map((project: any) => (
                    <Link key={project.id} to={`/project/${project.id}`} className="group">
                      <div className="aspect-video overflow-hidden border border-border">
                        <img 
                          src={project.thumbnail_url || ""} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="text-lg font-bold mt-4 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Philosophy Section */}
            <motion.div
              style={{ y: y2 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {(homeContent as any)?.philosophy_image_url && (
                <div className="aspect-square border border-border overflow-hidden">
                  <img 
                    src={(homeContent as any).philosophy_image_url} 
                    alt="Philosophy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-bold text-foreground">
                  {(homeContent as any)?.philosophy_title || "Philosophy"}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {(homeContent as any)?.philosophy_description || "Merging technical excellence with creative innovation to build experiences that matter."}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
