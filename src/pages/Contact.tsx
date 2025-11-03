import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Github, Linkedin, Mail, Instagram, Twitter } from "lucide-react";

const iconMap: Record<string, any> = {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Twitter,
};

const Contact = () => {
  const { data: contactInfo } = useQuery({
    queryKey: ["contact-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_info")
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 glow-text">Get In Touch</h1>
            <div className="h-1 w-20 bg-primary rounded" />
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2"
          >
            {contactInfo?.map((item) => {
              const Icon = iconMap[item.icon] || Mail;
              const isEmail = item.platform === 'email';
              
              return (
                <motion.a
                  key={item.id}
                  href={item.url}
                  target={isEmail ? undefined : "_blank"}
                  rel={isEmail ? undefined : "noopener noreferrer"}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-card border border-border rounded-xl p-8 hover:border-primary transition-all hover:shadow-glow group"
                >
                  <Icon className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-2">{item.label}</h3>
                  <p className="text-muted-foreground">
                    {isEmail ? item.url.replace('mailto:', '') : `@${item.platform}`}
                  </p>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;