import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Weight, Droplet, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import p1Img from "@assets/images/product-1.png";
import p2Img from "@assets/images/product-2.png";
import p3Img from "@assets/images/product-3.png";
import p4Img from "@assets/images/product-4.png";
import p5Img from "@assets/images/product-5.png";

const PRODUCTS = [
  {
    id: 1,
    name: "Pasted Open Mouth Paper Sacks",
    image: p1Img,
    description: "Bottom-pasted open-mouth paper bags closed on one side through folding and gluing for enhanced durability.",
    specs: ["Up to 4 Ply", "Glue Adhesive (Starch)", "Flexographic Printing up to 4 Colors"],
    applications: "Minerals, Chemical Powders, Powder-form products. MOQ 1000 bags.",
    industries: ["Minerals", "Chemicals"],
  },
  {
    id: 2,
    name: "Multiwall Paper Sack",
    image: p2Img,
    description: "Multi-layer paper bag built from imported extensible/semi-extensible sack kraft for strength and moisture resistance.",
    specs: ["Up to 4 Ply", "Capacity up to 25 Kg", "LD/HM Liner", "Imported bleached/natural sack kraft"],
    applications: "Cement, Animal Feed, Chemicals, Building Materials. MOQ 1000 bags.",
    industries: ["Cement", "Animal feeds", "Chemicals"],
  },
  {
    id: 3,
    name: "Multiwall Paper Pasted Valve-Type",
    image: p3Img,
    description: "Pasted Valve Stepped End (PVSE) sack with built-in valve for high-speed automatic packing machines.",
    specs: ["Up to 4 Ply", "Water Based Starch Adhesive", "5–7 Inch Valve/Spout", "Capacity up to 25 Kg"],
    applications: "Cement, Carbon Black, Drilling Fluids, Lime, Mortar, Ore. MOQ 1000 bags.",
    industries: ["Cement", "Minerals", "Chemicals"],
  },
  {
    id: 4,
    name: "HDPE Laminated Paper Bags",
    image: p4Img,
    description: "Paper sack laminated with HDPE/PP fabric on natural or bleached kraft, available in custom sizes, colors and designs.",
    specs: ["Hot Melt / Plastic Granules Adhesive", "LD or HM Liner", "Capacity up to 25 Kg"],
    applications: "Guar Gum Powder, Chemical Powder, Milk Powder. MOQ 1000 bags.",
    industries: ["Chemicals", "Food spices & Grains"],
  },
  {
    id: 5,
    name: "L-Stitched Paper Bag",
    image: p5Img,
    description: "Created by folding HDPE laminated paper into an \"L\" shape with stitched ends — fits any required dimensions.",
    specs: ["Folded HDPE Laminated Paper", "Stitched L-Shape Construction", "Custom dimensions"],
    applications: "Heavy-duty packaging, custom sizing requirements. MOQ 1000 bags.",
    industries: ["Chemicals", "Minerals", "Cement"], // Broad applicability
  }
];

const INDUSTRIES = ["Chemicals", "Minerals", "Cement", "Food spices & Grains", "Animal feeds"];

export function Products() {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries(prev => 
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  };

  const filteredProducts = PRODUCTS.filter(p => {
    if (selectedIndustries.length === 0) return true;
    return selectedIndustries.some(ind => p.industries.includes(ind));
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20 px-4 mb-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Industrial Packaging Solutions</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
            Engineered for strength. Built for scale. Discover our range of multi-ply kraft paper sacks and bags designed for your industry.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Filters */}
        <div className="mb-12 bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Filter size={18} />
            <span>Filter by Industry:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedIndustries([])}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedIndustries.length === 0 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {INDUSTRIES.map(ind => (
              <button
                key={ind}
                onClick={() => toggleIndustry(ind)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedIndustries.includes(ind)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow border-slate-200 group">
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative p-8">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="flex-1 flex flex-col p-6">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {product.industries.map(ind => (
                        <Badge key={ind} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-normal text-xs">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 font-serif">{product.name}</h3>
                    <p className="text-slate-600 text-sm mb-6 flex-1">{product.description}</p>
                    
                    <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg">
                      {product.specs.map((spec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Applications</p>
                      <p className="text-sm text-slate-800">{product.applications}</p>
                    </div>

                    <Link href="/contact" className="mt-8 block">
                      <Button className="w-full group/btn" variant="outline">
                        Request Quote
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-xl font-medium text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your industry filters.</p>
            <Button variant="link" onClick={() => setSelectedIndustries([])} className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
