import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NixieClock from "@/components/NixieClock";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
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
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
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
          {/* Nixie Clock - Fixed Right Side */}
          <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
            <NixieClock />
          </div>
          
          <div className="container-luxe xl:pr-[420px]">
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
                    className="w-32 h-32 rounded-full border border-border object-cover grayscale"
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
                
                {/* Mobile Clock */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex justify-center xl:hidden py-12"
                >
                  <NixieClock />
                </motion.div>
                
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
