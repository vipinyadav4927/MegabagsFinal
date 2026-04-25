// Product catalog for the 360° customizer.
// Products with `frames` use a real multi-angle photo set.
// Products without `frames` use a single image with CSS-based rotation as fallback.

import pomFrame00 from "@assets/images/360/pom/frame-00.png";
import pomFrame01 from "@assets/images/360/pom/frame-01.png";
import pomFrame02 from "@assets/images/360/pom/frame-02.png";
import pomFrame03 from "@assets/images/360/pom/frame-03.png";
import pomFrame04 from "@assets/images/360/pom/frame-04.png";
import pomFrame05 from "@assets/images/360/pom/frame-05.png";
import pomFrame06 from "@assets/images/360/pom/frame-06.png";
import pomFrame07 from "@assets/images/360/pom/frame-07.png";

import multiwallFrame00 from "@assets/images/360/multiwall/frame-00.png";
import multiwallFrame01 from "@assets/images/360/multiwall/frame-01.png";

import baseBag from "@assets/images/base-bag.png";
import p1 from "@assets/images/product-1.png";
import p2 from "@assets/images/product-2.png";
import p3 from "@assets/images/product-3.png";
import p4 from "@assets/images/product-4.png";
import p5 from "@assets/images/product-5.png";

export type Product360 = {
  id: string;
  name: string;
  shortName: string;
  thumb: string;
  frames: string[];
};

const buildFrames = (single: string) => Array(8).fill(single);

export const PRODUCTS_360: Product360[] = [
  {
    id: "pom",
    name: "Pasted Open Mouth Paper Sacks",
    shortName: "Open Mouth",
    thumb: pomFrame00,
    frames: [
      pomFrame00,
      pomFrame01,
      pomFrame02,
      pomFrame03,
      pomFrame04,
      pomFrame05,
      pomFrame06,
      pomFrame07,
    ],
  },
  {
    id: "multiwall",
    name: "Multiwall Paper Sack",
    shortName: "Multiwall",
    thumb: multiwallFrame00,
    frames: [
      multiwallFrame00,
      multiwallFrame01,
      p2,
      multiwallFrame01,
      multiwallFrame00,
      multiwallFrame01,
      p2,
      multiwallFrame01,
    ],
  },
  {
    id: "valve",
    name: "Multiwall Paper Pasted Valve-Type",
    shortName: "Valve-Type",
    thumb: p3,
    frames: buildFrames(p3),
  },
  {
    id: "hdpe",
    name: "HDPE Laminated Paper Bags",
    shortName: "HDPE Laminated",
    thumb: p4,
    frames: buildFrames(p4),
  },
  {
    id: "lstitched",
    name: "L-Stitched Paper Bag",
    shortName: "L-Stitched",
    thumb: p5,
    frames: buildFrames(p5),
  },
];

export const DEFAULT_BAG = baseBag;
export const FALLBACK_PRODUCTS = [p1, p2, p3, p4, p5];
