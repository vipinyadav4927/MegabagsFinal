import React, { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Award, BadgeCheck, FileCheck, CheckCircle2, RotateCcw, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import heroImg from "@assets/images/hero.png";
import baseBagImg from "@assets/images/base-bag.png";

export function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection />
      <ProductViewerSection />
      <ProcessSection />
      <CertificationsSection />
      <WhyUsSection />
      <AboutSection />
    </div>
  );
}

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-slate-900">
      <motion.div style={{ y }} className="absolute inset-0 z-0 opacity-40">
        <img src={heroImg} alt="Manufacturing Facility" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
      </motion.div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl text-white"
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/20 border border-primary/50 text-primary-foreground text-sm font-medium tracking-wide">
            Industrial Strength. Precision Crafted.
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-serif">
            Mega Bags - <br/><span className="text-primary">Carries your trust.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Premier manufacturer of industrial paper bags, sacks, and multiwall packaging based in Ankleshwar, Gujarat. Engineered for strength, designed for scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-none">Explore Products</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 bg-transparent text-white border-white/30 hover:bg-white/10 rounded-none">Get a Quote</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProductViewerSection() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [brandColor, setBrandColor] = useState("#f97316");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const animationRef = useRef<number>();

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastX.current = e.clientX;
    velocity.current = 0;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - lastX.current;
    lastX.current = e.clientX;
    velocity.current = delta;
    setRotation(prev => prev + delta * 0.5);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    
    const decay = () => {
      velocity.current *= 0.92;
      if (Math.abs(velocity.current) > 0.1) {
        setRotation(prev => prev + velocity.current * 0.5);
        animationRef.current = requestAnimationFrame(decay);
      }
    };
    animationRef.current = requestAnimationFrame(decay);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setLogoUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  // Calculate visibility of the front face based on rotation
  const normalizedRot = ((rotation % 360) + 360) % 360;
  // Front face is visible between 270 and 90 degrees
  const isFrontVisible = normalizedRot < 90 || normalizedRot > 270;
  // Calculate opacity based on angle to make it fade out as it rotates away
  let opacity = 1;
  if (normalizedRot > 45 && normalizedRot < 90) {
    opacity = 1 - (normalizedRot - 45) / 45;
  } else if (normalizedRot > 270 && normalizedRot < 315) {
    opacity = (normalizedRot - 270) / 45;
  } else if (!isFrontVisible) {
    opacity = 0;
  }

  return (
    <section className="py-24 w-full bg-slate-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Interactive 360° Customization</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Visualize your brand on our premium multiwall sacks in real-time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: Viewer */}
          <div 
            ref={containerRef}
            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-white rounded-2xl shadow-xl border overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div 
              className="relative w-[60%] h-[80%] flex items-center justify-center transition-transform"
              style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
            >
              <img src={baseBagImg} alt="Base Bag" className="w-full h-full object-contain pointer-events-none" />
              
              {/* Overlay content */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none"
                style={{ 
                  opacity,
                  transform: 'translateZ(1px)', // Slight offset to prevent z-fighting
                  color: brandColor
                }}
              >
                {logoUrl && (
                  <img src={logoUrl} alt="Custom Logo" className="w-32 h-32 object-contain mb-6 mix-blend-multiply" />
                )}
                {!logoUrl && companyName && (
                  <div className="text-4xl font-bold text-center tracking-tight mb-4 mix-blend-multiply" style={{ color: brandColor }}>
                    {companyName}
                  </div>
                )}
                {tagline && (
                  <div className="text-xl font-medium text-center mix-blend-multiply opacity-80" style={{ color: brandColor }}>
                    {tagline}
                  </div>
                )}
              </div>
            </div>

            {rotation === 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 text-white px-4 py-2 rounded-full text-sm pointer-events-none animate-pulse">
                <RotateCcw size={16} />
                Drag to rotate
              </div>
            )}
          </div>

          {/* RIGHT: Controls */}
          <Card className="border-0 shadow-lg rounded-2xl p-2 bg-white">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Customize Your Product</h3>
                <p className="text-slate-500 text-sm">Add your branding details to see how it looks on our premium sacks.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input 
                    placeholder="e.g. Alpha Chemicals" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tagline (Optional)</Label>
                  <Input 
                    placeholder="e.g. Quality you can trust" 
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Brand Color</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-12 h-12 p-1 cursor-pointer rounded-md"
                      />
                      <span className="text-sm font-mono text-slate-500 uppercase">{brandColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Logo</Label>
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      />
                      <Button variant="outline" className="w-full h-12 flex gap-2">
                        <ImageIcon size={16} />
                        {logoUrl ? 'Change Logo' : 'Select Image'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link href="/contact">
                  <Button className="w-full h-14 text-lg">Request a Sample</Button>
                </Link>
                <p className="text-center text-xs text-slate-400 mt-4">Mockup is for visualization purposes only.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">Precision at <br/><span className="text-primary">Industrial Scale</span></h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Inside our Ankleshwar manufacturing facility — precision pneumatic processes, in-house lamination, centre sealing, printing, cutting, and full testing.
            </p>
            <ul className="space-y-4">
              {["State-of-the-art pneumatic machinery", "In-house multi-color flexographic printing", "Rigorous quality control lab", "Sustainable production practices"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 shadow-2xl">
            {/* Fallback to poster if video not available */}
            <img src={heroImg} alt="Process Video Poster" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 backdrop-blur cursor-pointer hover:scale-105 transition-transform">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificationsSection() {
  const certs = [
    { icon: ShieldCheck, name: "ISO 9001:2015" },
    { icon: BadgeCheck, name: "BIS Certified" },
    { icon: FileCheck, name: "FSSAI Approved" },
    { icon: Award, name: "GST Registered" }
  ];

  return (
    <section className="py-16 bg-white border-b">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm font-bold tracking-widest uppercase text-slate-400 mb-10">Certified Quality & Compliance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {certs.map((cert, i) => (
            <div key={i} className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border hover:border-primary/50 transition-colors">
              <cert.icon className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
              <span className="font-bold text-slate-800 text-center">{cert.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const bullets = [
    "Flawless finish of products",
    "Competitive prices & Timely delivery",
    "High production efficient with highly skilled workforce",
    "Free sampling policy & Comprehensive testing facilities",
    "Bulk production capacity (5,00,000 bags per month on single shift)"
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Why Choose Mega Bags?</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <p className="text-slate-700 font-medium leading-relaxed">{bullet}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-10">About Us</h2>
        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-serif italic mb-16">
          "Our organization is a brand name in supplying an excellent quality of different types of Paper Bags. Our manufacturing unit is installed with all the requisite machines and facilities like laminating, centre sealing, printing, and cutting based on pneumatic processes."
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-slate-100">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">5L+</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bags / Month</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">4-Ply</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Capability</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">ISO</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">9001:2015</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">GIDC</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ankleshwar</div>
          </div>
        </div>
      </div>
    </section>
  );
}
