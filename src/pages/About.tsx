import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const { data: aboutContent } = useQuery({
    queryKey: ["about-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*");
      
      if (error) throw error;
      
      const content: Record<string, string> = {};
      data.forEach((item) => {
        content[item.section] = item.content;
      });
      return content;
    },
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl font-bold mb-4 glow-text">About Me</h1>
              <div className="h-1 w-20 bg-primary rounded" />
            </motion.div>
            
            {aboutContent?.bio && (
              <motion.div
                variants={itemVariants}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors"
              >
                <h2 className="text-2xl font-bold mb-4 text-primary">Biography</h2>
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {aboutContent.bio}
                </p>
              </motion.div>
            )}
            
            {aboutContent?.education && (
              <motion.div
                variants={itemVariants}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors"
              >
                <h2 className="text-2xl font-bold mb-4 text-primary">Education</h2>
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {aboutContent.education}
                </p>
              </motion.div>
            )}
            
            {aboutContent?.expertise && (
              <motion.div
                variants={itemVariants}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-colors"
              >
                <h2 className="text-2xl font-bold mb-4 text-primary">Expertise</h2>
                <div className="flex flex-wrap gap-3">
                  {aboutContent.expertise.split(',').map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-muted rounded-full text-sm border border-border hover:border-primary transition-colors"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;