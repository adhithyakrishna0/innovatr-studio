import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Github, Linkedin, Mail, Instagram, Twitter, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const iconMap: Record<string, any> = {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Twitter,
  Phone,
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const whatsappContact = contactInfo?.find(c => c.platform.toLowerCase() === 'whatsapp');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    if (whatsappContact?.phone) {
      const message = `Hi, I'm ${encodeURIComponent(formData.name)}.%0A%0AEmail: ${encodeURIComponent(formData.email)}%0A%0AMessage: ${encodeURIComponent(formData.message)}`;
      const whatsappUrl = `https://wa.me/${whatsappContact.phone.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Opening WhatsApp",
        description: "You'll be redirected to WhatsApp to send your message.",
      });
      
      setFormData({ name: "", email: "", message: "" });
    } else {
      toast({
        title: "Error",
        description: "WhatsApp contact not configured",
        variant: "destructive",
      });
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      }
    },
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 glow-text">Let's Connect</h1>
            <div className="h-1 w-20 bg-primary rounded mx-auto mb-6" />
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Links */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl font-bold mb-8"
              >
                Get in Touch
              </motion.h2>
              
              <div className="grid gap-4">
                {contactInfo?.map((item) => {
                  const Icon = iconMap[item.icon] || Mail;
                  const isEmail = item.platform.toLowerCase() === 'email';
                  const isPhone = item.platform.toLowerCase() === 'phone' || item.platform.toLowerCase() === 'whatsapp';
                  
                  return (
                    <motion.a
                      key={item.id}
                      href={item.url}
                      target={isEmail || isPhone ? undefined : "_blank"}
                      rel={isEmail || isPhone ? undefined : "noopener noreferrer"}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, x: 10 }}
                      className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all hover:shadow-glow group flex items-center gap-4"
                    >
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{item.label}</h3>
                        <p className="text-muted-foreground text-sm">
                          {isEmail ? item.url.replace('mailto:', '') : 
                           isPhone && item.phone ? item.phone :
                           `@${item.platform}`}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-glow"
            >
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">Send a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Your Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message *
                  </label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full group"
                  disabled={!whatsappContact?.phone}
                >
                  <MessageCircle className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
                  Send via WhatsApp
                </Button>
                
                {!whatsappContact?.phone && (
                  <p className="text-sm text-muted-foreground text-center">
                    WhatsApp contact not configured
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
