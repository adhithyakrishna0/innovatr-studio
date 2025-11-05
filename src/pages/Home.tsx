import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedText from "@/components/AnimatedText";
import NixieClock from "@/components/NixieClock";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

const Home = () => {
  const [isClockOn, setIsClockOn] = useState(true);
  
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };
  
  useEffect(() => {
    initParticlesEngine(particlesInit);
  }, []);
  
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
  
  const titles = profile?.title ? profile.title.split("|").map(t => t.trim()) : ["Innovator", "Cybersecurity Engineer"];
  
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-700 ${!isClockOn ? 'brightness-[0.3]' : ''}`}>
      <Particles
        id="tsparticles-home"
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
              opacity: 0.15,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 50,
            },
            opacity: {
              value: 0.2,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 2 },
            },
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
              onClick: {
                enable: true,
                mode: "push",
              },
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4,
              },
              push: {
                quantity: 4,
              },
            },
          },
        }}
        className="absolute inset-0 -z-10"
      />
      <Navigation />
      
      <main className="flex-1 pt-20">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-dark opacity-50" />
          
          {/* Nixie Clock - Right Side */}
          <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
            <NixieClock isOn={isClockOn} onToggle={() => setIsClockOn(!isClockOn)} />
          </div>
          
          <div className="container mx-auto px-4 z-10 lg:pr-[400px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              {profile?.profile_image_url && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center"
                >
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name || "Profile"}
                    className="w-48 h-48 rounded-full border-4 border-primary glow-border object-cover shadow-2xl"
                  />
                </motion.div>
              )}
              
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Hi, I'm <span className="text-primary glow-text">{profile?.full_name || "Developer"}</span>
                  </h1>
                  
                  <AnimatedText texts={titles} />
                </div>
                
                {/* Mobile Clock - Center */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex justify-center lg:hidden"
                >
                  <NixieClock isOn={isClockOn} onToggle={() => setIsClockOn(!isClockOn)} />
                </motion.div>
              </div>
              
              {/* Hero Stats */}
              {heroStats && heroStats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12"
                >
                  {heroStats.map((stat, index) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                      }}
                      whileHover={{ 
                        y: -10,
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-all hover:shadow-glow cursor-pointer"
                    >
                      <motion.div 
                        className="text-3xl font-bold text-primary mb-2"
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          delay: index * 0.3,
                        }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              >
                <Link to="/projects">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                    View My Work
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Get In Touch
                  </Button>
                </Link>
                {resume && (
                  <a href={resume.file_url} download target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="secondary">
                      Download Resume
                    </Button>
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;