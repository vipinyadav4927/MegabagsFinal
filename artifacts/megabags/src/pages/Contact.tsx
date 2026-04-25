import React, { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submit
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Request Submitted",
        description: "Thank you for reaching out. Our team will contact you shortly.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20 px-4 mb-12">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Let's Talk Packaging.</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Ready to upgrade your industrial packaging? Get a quote, request a sample, or consult with our experts.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* LEFT: Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-2 w-full bg-primary" />
              <CardContent className="p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-8">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" required className="h-12 bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input id="company" required className="h-12 bg-slate-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" required className="h-12 bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" className="h-12 bg-slate-50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select>
                      <SelectTrigger className="h-12 bg-slate-50">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chemicals">Chemicals</SelectItem>
                        <SelectItem value="minerals">Minerals</SelectItem>
                        <SelectItem value="cement">Cement</SelectItem>
                        <SelectItem value="food">Food spices & Grains</SelectItem>
                        <SelectItem value="animal">Animal feeds</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message / Requirements</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about the bags you need (dimensions, plies, quantity)..."
                      className="min-h-[150px] bg-slate-50 resize-y"
                    />
                  </div>

                  <div className="flex items-center space-x-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <Checkbox id="sample" className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <Label htmlFor="sample" className="font-medium cursor-pointer">I would like to request a free physical sample.</Label>
                  </div>

                  <Button type="submit" size="lg" className="w-full h-14 text-lg mt-4" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Submit Request"}
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Contact Info & Map */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-lg bg-slate-900 text-white">
              <CardContent className="p-8 space-y-8">
                <h3 className="text-xl font-bold font-serif border-b border-white/10 pb-4">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-full shrink-0">
                      <MapPin className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-300 mb-1">Factory & Office</h4>
                      <p className="leading-relaxed">Plot No. 248,<br/>Ankleshwar GIDC,<br/>Ankleshwar, Gujarat, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-full shrink-0">
                      <Mail className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-300 mb-1">Email Us</h4>
                      <div className="space-y-1">
                        <a href="mailto:mega@megabags.in" className="block hover:text-primary transition-colors">mega@megabags.in</a>
                        <a href="mailto:vipinyadav4926@gmail.com" className="block hover:text-primary transition-colors">vipinyadav4926@gmail.com</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-full shrink-0">
                      <Phone className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-300 mb-1">Call Us</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-slate-400">Hemal Limbachiya</p>
                          <a href="tel:+919904077044" className="font-medium hover:text-primary transition-colors">+91 99040 77044</a>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Krunal Shah</p>
                          <a href="tel:+919723770445" className="font-medium hover:text-primary transition-colors">+91 97237 70445</a>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Vipin</p>
                          <a href="tel:+919161722416" className="font-medium hover:text-primary transition-colors">+91 9161722416</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden h-[300px]">
              <iframe 
                src="https://www.google.com/maps?q=Ankleshwar+GIDC+Plot+248&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
