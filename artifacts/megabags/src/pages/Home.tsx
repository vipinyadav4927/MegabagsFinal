import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck, Award, BadgeCheck, FileCheck, CheckCircle2, RotateCcw,
  Image as ImageIcon, Move, Maximize2, Trash2, Play, Pause,
  FlaskConical, Palette, Paintbrush, Snowflake, Mountain, HardHat,
  Wheat, PawPrint, Atom, Droplets, Users, Cog, Truck, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import heroImg from "@assets/images/hero.png";
import { PRODUCTS_360 } from "@/data/products360";

export function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <HeroSection />
      <AboutSection />
      <ManufacturingFacilitiesSection />
      <ProductViewerSection />
      <ProductRangeSection />
      <UsedInSection />
      <CertificationsSection />
      <WhyUsSection />
      <OurProfessionalsSection />
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

type DragMode = "none" | "rotate" | "move" | "resize";

function ProductViewerSection() {
  const [productIndex, setProductIndex] = useState(0);
  const product = PRODUCTS_360[productIndex];
  const FRAME_COUNT = product.frames.length;

  // Rotation is tracked in degrees (continuous). Frame index = rotation/(360/FRAME_COUNT).
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Customization
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [brandColor, setBrandColor] = useState("#1f2937");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Overlay transform — relative to the bag image bounding box (percent of width/height)
  const [overlayPos, setOverlayPos] = useState({ x: 50, y: 50 }); // percent
  const [overlaySize, setOverlaySize] = useState(45); // percent of bag width

  // Drag state
  const dragMode = useRef<DragMode>("none");
  const lastPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);
  const autoRotateRef = useRef<number | undefined>(undefined);

  const containerRef = useRef<HTMLDivElement>(null);
  const bagBoxRef = useRef<HTMLDivElement>(null);

  // Inertia decay after rotate
  const startInertia = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const decay = () => {
      velocity.current *= 0.93;
      if (Math.abs(velocity.current) > 0.05) {
        setRotation((prev) => prev + velocity.current);
        animationRef.current = requestAnimationFrame(decay);
      }
    };
    animationRef.current = requestAnimationFrame(decay);
  }, []);

  // Auto-rotate loop — continuous smooth spin like Sirv
  useEffect(() => {
    if (autoRotate) {
      const tick = () => {
        setRotation((r) => r + 0.9);
        autoRotateRef.current = requestAnimationFrame(tick);
      };
      autoRotateRef.current = requestAnimationFrame(tick);
      return () => {
        if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
      };
    }
  }, [autoRotate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  // Pointer handlers on the viewer surface (rotate)
  const onSurfaceDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-overlay]") || (e.target as HTMLElement).closest("[data-resize]")) {
      return; // overlay handles its own drag
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragMode.current = "rotate";
    lastPointer.current = { x: e.clientX, y: e.clientY };
    velocity.current = 0;
    setHasInteracted(true);
    setAutoRotate(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const onSurfaceMove = (e: React.PointerEvent) => {
    if (dragMode.current !== "rotate") return;
    const dx = e.clientX - lastPointer.current.x;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    velocity.current = dx * 0.6;
    setRotation((prev) => prev + dx * 0.6);
  };

  const onSurfaceUp = () => {
    if (dragMode.current === "rotate") startInertia();
    dragMode.current = "none";
  };

  // Overlay drag-to-move
  const onOverlayDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragMode.current = "move";
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onOverlayMove = (e: React.PointerEvent) => {
    if (dragMode.current !== "move") return;
    const box = bagBoxRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = ((e.clientX - lastPointer.current.x) / box.width) * 100;
    const dy = ((e.clientY - lastPointer.current.y) / box.height) * 100;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setOverlayPos((p) => ({
      x: Math.max(5, Math.min(95, p.x + dx)),
      y: Math.max(5, Math.min(95, p.y + dy)),
    }));
  };

  const onOverlayUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragMode.current = "none";
  };

  // Resize handle drag
  const onResizeDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragMode.current = "resize";
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onResizeMove = (e: React.PointerEvent) => {
    if (dragMode.current !== "resize") return;
    const box = bagBoxRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = ((e.clientX - lastPointer.current.x) / box.width) * 100;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setOverlaySize((s) => Math.max(15, Math.min(90, s + dx * 1.4)));
  };

  const onResizeUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragMode.current = "none";
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      const url = URL.createObjectURL(e.target.files[0]);
      setLogoUrl(url);
    }
  };

  const resetCustomization = () => {
    setCompanyName("");
    setTagline("");
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoUrl(null);
    setOverlayPos({ x: 50, y: 50 });
    setOverlaySize(45);
  };

  // Compute current frame from rotation (snap to nearest)
  const step = 360 / FRAME_COUNT;
  const normalizedRot = ((rotation % 360) + 360) % 360;
  const frameIdx = Math.round(normalizedRot / step) % FRAME_COUNT;
  const currentFrame = product.frames[frameIdx];

  // Visibility of the front face — fades when bag rotates beyond ~±60°
  const angleFromFront = Math.min(normalizedRot, 360 - normalizedRot);
  const opacity = angleFromFront < 45 ? 1 : angleFromFront < 90 ? 1 - (angleFromFront - 45) / 45 : 0;
  const showOverlay = !!(companyName || tagline || logoUrl);

  return (
    <section id="customize" className="py-24 w-full bg-slate-50 relative scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Interactive 360° Customization</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose any product, drag to rotate, then place your brand exactly where you want it.
          </p>
        </div>

        {/* Product selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {PRODUCTS_360.map((p, i) => {
            const active = i === productIndex;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setProductIndex(i);
                  setRotation(0);
                  velocity.current = 0;
                  if (animationRef.current) cancelAnimationFrame(animationRef.current);
                }}
                className={`group flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border transition-all ${
                  active
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-full overflow-hidden border ${active ? "border-white/30" : "border-slate-200"} bg-white shrink-0`}
                >
                  <img src={p.thumb} alt={p.name} className="w-full h-full object-cover" />
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">{p.shortName}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* LEFT: Viewer (3 cols) */}
          <div className="lg:col-span-3">
            <div
              ref={containerRef}
              className="relative w-full aspect-square bg-gradient-to-br from-white to-slate-100 rounded-2xl shadow-xl border overflow-hidden touch-none select-none"
              onPointerDown={onSurfaceDown}
              onPointerMove={(e) => {
                onSurfaceMove(e);
                onOverlayMove(e);
                onResizeMove(e);
              }}
              onPointerUp={(e) => {
                onSurfaceUp();
                onOverlayUp(e);
                onResizeUp(e);
              }}
              onPointerLeave={(e) => {
                onSurfaceUp();
                onOverlayUp(e);
                onResizeUp(e);
              }}
              style={{ cursor: dragMode.current === "rotate" ? "grabbing" : "grab" }}
            >
              {/* Bag frame */}
              <div ref={bagBoxRef} className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[78%] h-[88%]">
                  {/* Render all frames stacked, only the active one is visible — eliminates flicker */}
                  {product.frames.map((src, i) => (
                    <img
                      key={`${product.id}-${i}`}
                      src={src}
                      alt={product.name}
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      style={{ opacity: i === frameIdx ? 1 : 0, transition: "opacity 60ms linear" }}
                    />
                  ))}

                  {/* Customization overlay */}
                  {showOverlay && (
                    <div
                      data-overlay
                      onPointerDown={onOverlayDown}
                      className="absolute touch-none cursor-move group"
                      style={{
                        left: `${overlayPos.x}%`,
                        top: `${overlayPos.y}%`,
                        width: `${overlaySize}%`,
                        transform: "translate(-50%, -50%)",
                        opacity,
                      }}
                    >
                      <div
                        className="relative flex flex-col items-center justify-center p-2 rounded-md outline-2 outline-dashed outline-transparent group-hover:outline-primary/60 transition-all"
                        style={{ color: brandColor }}
                      >
                        {logoUrl && (
                          <img
                            src={logoUrl}
                            alt="Custom Logo"
                            draggable={false}
                            className="w-full object-contain mix-blend-multiply"
                            style={{ maxHeight: "9rem" }}
                          />
                        )}
                        {!logoUrl && companyName && (
                          <div
                            className="font-extrabold text-center tracking-tight leading-none mix-blend-multiply"
                            style={{
                              color: brandColor,
                              fontSize: `clamp(0.9rem, ${overlaySize * 0.12}vw, 3rem)`,
                            }}
                          >
                            {companyName}
                          </div>
                        )}
                        {tagline && (
                          <div
                            className="font-medium text-center mix-blend-multiply mt-1 opacity-80"
                            style={{
                              color: brandColor,
                              fontSize: `clamp(0.65rem, ${overlaySize * 0.05}vw, 1.25rem)`,
                            }}
                          >
                            {tagline}
                          </div>
                        )}

                        {/* Move pill */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1">
                          <Move size={10} /> Drag to move
                        </div>
                      </div>

                      {/* Resize handle */}
                      <button
                        data-resize
                        onPointerDown={onResizeDown}
                        className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center cursor-nwse-resize touch-none hover:scale-110 transition-transform"
                        aria-label="Resize"
                      >
                        <Maximize2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Hint */}
              {!hasInteracted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/85 text-white px-4 py-2 rounded-full text-xs md:text-sm pointer-events-none backdrop-blur-sm"
                >
                  <RotateCcw size={14} className="animate-spin-slow" />
                  Drag to rotate · Click chips above to switch product
                </motion.div>
              )}

              {/* Top-right toolbar */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => setAutoRotate((v) => !v)}
                  className="h-9 px-3 rounded-full bg-white/95 border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-white"
                  aria-label="Toggle auto rotate"
                >
                  {autoRotate ? <Pause size={13} /> : <Play size={13} />}
                  {autoRotate ? "Pause" : "Spin"}
                </button>
                <div className="h-9 px-3 rounded-full bg-white/95 border border-slate-200 shadow-sm text-xs font-mono text-slate-600 flex items-center">
                  {Math.round(normalizedRot)}°
                </div>
              </div>

            </div>

            <p className="text-center text-xs text-slate-500 mt-3">
              Showing <span className="font-semibold text-slate-700">{product.name}</span>
            </p>
          </div>

          {/* RIGHT: Controls (2 cols) */}
          <Card className="lg:col-span-2 border-0 shadow-lg rounded-2xl bg-white">
            <CardContent className="p-6 md:p-7 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Customize Your Product</h3>
                  <p className="text-slate-500 text-sm">Add branding, then drag &amp; resize it on the bag.</p>
                </div>
                {showOverlay && (
                  <Button variant="ghost" size="sm" onClick={resetCustomization} className="shrink-0 text-slate-500 hover:text-slate-900">
                    <Trash2 size={14} className="mr-1" /> Clear
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Company Name</Label>
                  <Input
                    placeholder="e.g. Alpha Chemicals"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tagline (Optional)</Label>
                  <Input
                    placeholder="e.g. Quality you can trust"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Print Color</Label>
                    <div className="flex items-center gap-2 h-11 border rounded-md px-2 bg-white">
                      <Input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-8 h-8 p-0.5 border-0 cursor-pointer rounded shrink-0"
                      />
                      <span className="text-xs font-mono text-slate-500 uppercase truncate">{brandColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Logo</Label>
                    <div className="relative h-11">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      />
                      <Button variant="outline" className="w-full h-11 flex gap-2 pointer-events-none">
                        <ImageIcon size={14} />
                        <span className="truncate">{logoUrl ? "Change" : "Upload"}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {showOverlay && (
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Size</Label>
                        <span className="text-xs font-mono text-slate-400">{Math.round(overlaySize)}%</span>
                      </div>
                      <Slider
                        value={[overlaySize]}
                        min={15}
                        max={90}
                        step={1}
                        onValueChange={(v) => setOverlaySize(v[0])}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Position X</Label>
                          <span className="text-xs font-mono text-slate-400">{Math.round(overlayPos.x)}%</span>
                        </div>
                        <Slider
                          value={[overlayPos.x]}
                          min={5}
                          max={95}
                          step={1}
                          onValueChange={(v) => setOverlayPos((p) => ({ ...p, x: v[0] }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Position Y</Label>
                          <span className="text-xs font-mono text-slate-400">{Math.round(overlayPos.y)}%</span>
                        </div>
                        <Slider
                          value={[overlayPos.y]}
                          min={5}
                          max={95}
                          step={1}
                          onValueChange={(v) => setOverlayPos((p) => ({ ...p, y: v[0] }))}
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Tip: drag the artwork directly on the bag to reposition, drag the orange handle to resize, or use the sliders for fine control.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-5 border-t border-slate-100">
                <Link href="/contact">
                  <Button className="w-full h-12 text-base">Request a Sample</Button>
                </Link>
                <p className="text-center text-xs text-slate-400 mt-3">
                  Mockup is for visualization only — final print depends on flexographic specs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white w-full">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">About Us</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-3 mb-6">A Brand Name in Industrial Paper Bags</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <p className="text-lg md:text-xl text-slate-600 leading-relaxed text-center max-w-3xl mx-auto">
          Our organization is a brand name in supplying an excellent quality of different types of Paper Bags.
          Our ability in meeting the bulk demands of our clients is due to the availability of a sophisticated
          manufacturing unit at our premises. Our products are in huge demand owing to their attractive style and
          economical price — supplied in bulk to meet the demands of our clients.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-100">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5L+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bags / Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4-Ply</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capability</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">7+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bag Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">GIDC</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ankleshwar</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManufacturingFacilitiesSection() {
  const points = [
    "Latest advanced pneumatic-process machinery",
    "In-house laminating, centre sealing, printing & cutting",
    "Production capacity up to 5,00,000 bags / month (single shift)",
    "Complete in-house testing facilities",
    "Dedicated warehouse for finished goods & raw material",
    "Quality, quantity and timely service — every order",
  ];

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative w-full">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Manufacturing Facilities</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mt-3 mb-6 leading-tight">
              Precision at <br /><span className="text-primary">Industrial Scale</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Megabags Packaging has arrived in the packaging industry with its latest advanced machinery based on
              pneumatic processes. We add a new dimension to packaging with innovative, multi-purpose products —
              setting new trends and ensuring customer satisfaction by always delivering quality bags on time.
            </p>
            <ul className="space-y-3">
              {points.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 shadow-2xl">
            <img src={heroImg} alt="Manufacturing Facility" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-1">Plot No. 248</p>
                <p className="text-xl font-bold">Ankleshwar GIDC</p>
                <p className="text-sm text-slate-300">Gujarat, India</p>
              </div>
              <div className="bg-primary/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                Pneumatic Process
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductRangeSection() {
  const productList = [
    "Valve Paper Bags",
    "Cement Paper Bags / Sacks",
    "Laminated HDPE Bags",
    "Multiwall Paper Sacks / Bags",
    "Aluminium Foil Laminated Paper Bags",
    "BOPP Laminated HDPE Bags",
    "Paper Sacks",
  ];

  return (
    <section id="range" className="py-24 bg-white w-full scroll-mt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Product Range</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-3 mb-6">A Trusted Manufacturer & Exporter</h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We are a reliable and trusted manufacturer, exporter and supplier of an optimum quality range of packaging
            bags — available in varied capacities, printing options, colours and patterns to meet the exact demands
            of our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {productList.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                {String(i + 1).padStart(2, "0")}
              </div>
              <span className="text-slate-800 font-medium">{item}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" className="rounded-full px-8">View Detailed Specifications</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function UsedInSection() {
  const industries = [
    { icon: FlaskConical, label: "Chemicals" },
    { icon: Palette, label: "Dyes" },
    { icon: Paintbrush, label: "Pigments" },
    { icon: Snowflake, label: "Powders" },
    { icon: Mountain, label: "Minerals" },
    { icon: HardHat, label: "Construction Chemicals" },
    { icon: Wheat, label: "Food Spices & Grains" },
    { icon: PawPrint, label: "Pet & Animal Feeds" },
    { icon: Atom, label: "Polymers" },
    { icon: Droplets, label: "Adhesives & More" },
  ];

  return (
    <section id="used-in" className="py-24 bg-slate-50 w-full scroll-mt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Used In</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-3 mb-4">Industries We Serve</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {industries.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white text-primary transition-colors">
                <Icon className="w-7 h-7" strokeWidth={1.6} />
              </div>
              <span className="text-sm font-semibold text-slate-800">{label}</span>
            </motion.div>
          ))}
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
    { icon: Award, name: "GST Registered" },
  ];

  return (
    <section className="py-16 bg-white border-y w-full">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm font-bold tracking-widest uppercase text-slate-400 mb-10">
          Certified Quality & Compliance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {certs.map((cert, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border hover:border-primary/50 transition-colors"
            >
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
    "Competitive prices",
    "Timely delivery",
    "High production efficiency with a highly skilled workforce",
    "Use of quality raw material procured from trusted names",
    "Free sampling policy",
    "Comprehensive testing facilities",
    "Bulk production capacity",
    "Consistent optimization of manufacturing process",
  ];

  return (
    <section className="py-24 bg-slate-50 w-full">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Why Us?</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-3 mb-4">Why Choose Mega Bags</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We leverage our sophisticated facilities, skilled workforce and wide market presence to create a rapport
            for ourselves in the global market. The factors that make us a preferred partner include:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bullets.map((bullet, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-primary/40 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-slate-700 font-medium leading-snug">{bullet}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurProfessionalsSection() {
  const roles = [
    { icon: Cog, label: "Machine Operators" },
    { icon: ShieldCheck, label: "Quality Controllers" },
    { icon: Truck, label: "Warehouse Personnel" },
    { icon: Users, label: "Sales & Marketing" },
  ];

  return (
    <section id="team" className="py-24 bg-white w-full scroll-mt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Our Professionals</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-3 mb-6 leading-tight">
              People who carry <br /><span className="text-primary">your trust</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The professionals at our team — including machine operators, quality controllers, warehouse personnel
              and sales & marketing executives — work in unison to ensure a smooth and swift work procedure. Their
              in-depth knowledge of industry standards and the products to be packed has enabled us to provide a
              customized range of packaging bags and sacks.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We also offer them regular training to keep them abreast with the changing demands of clients.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles size={14} />
              Continuous training. Consistent quality.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {roles.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/40 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7" strokeWidth={1.6} />
                </div>
                <span className="font-bold text-slate-900">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
