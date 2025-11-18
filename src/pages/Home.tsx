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
          <div className="fixed right-32 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
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
                    className="w-64 h-64 border border-border object-cover"
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

        {/* Parallax Scrolling Content Sections */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="section-spacing space-y-48"
        >
          <div className="container-luxe">
            {/* Section 1 - Featured Work */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-5xl md:text-7xl font-bold mb-6">Featured Work</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                    Explore innovative solutions crafted with precision and creativity.
                  </p>
                  <Link to="/projects">
                    <button className="mt-8 px-8 py-4 border border-border hover:bg-card transition-colors duration-300">
                      <span className="text-sm uppercase tracking-widest">View Projects</span>
                    </button>
                  </Link>
                </div>
                <motion.div
                  className="h-96 bg-card border border-border"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>

            {/* Section 2 - Philosophy */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  className="h-96 bg-card border border-border order-2 lg:order-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="order-1 lg:order-2">
                  <h2 className="text-5xl md:text-7xl font-bold mb-6">Philosophy</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                    Merging technical excellence with creative innovation to build experiences that matter.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 3 - Approach */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2 }}
            >
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-6xl md:text-8xl font-bold mb-8">Approach</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  {["Research", "Design", "Execute"].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2, duration: 0.8 }}
                      className="border border-border p-8 hover:bg-card transition-colors duration-300"
                    >
                      <div className="text-7xl font-bold text-muted-foreground mb-4">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-2xl font-bold">{item}</h3>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Nixie Clock Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center xl:hidden pt-32"
            >
              <NixieClock />
            </motion.div>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
