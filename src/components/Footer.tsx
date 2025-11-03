import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Github, Linkedin, Mail, Instagram, Twitter } from "lucide-react";

const iconMap: Record<string, any> = {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Twitter,
};

const Footer = () => {
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
  
  return (
    <footer className="bg-card border-t border-border py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            {contactInfo?.map((item) => {
              const Icon = iconMap[item.icon] || Mail;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={item.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;