// Field photos for the Our Work page (copies of the originals in public/Images, renamed and upright)
// Tags are written in display case so "eDNA" keeps its lowercase e
export type FieldPhoto = {
  slug: string;
  src: string;
  w: number;
  h: number;
  title: string;
  tag: string;
  alt: string;
};

export const fieldPhotos: FieldPhoto[] = [
  {
    slug: "water-quality-horiba",
    src: "/Images/work/water-quality-horiba.jpg",
    w: 810,
    h: 1080,
    title: "Water Quality in Real Time with the Horiba Multiparameter Meter",
    tag: "MARINE RESEARCH",
    alt: "Researcher in a life jacket on a boat, reading a multiparameter meter lowered into the water",
  },
  {
    slug: "edna-soil-akagera",
    src: "/Images/work/edna-soil-akagera.jpg",
    w: 810,
    h: 1080,
    title: "eDNA Soil Sample at Akagera National Park, Rwanda",
    tag: "eDNA · RWANDA",
    alt: "Researcher crouching in grassland to collect a soil sample",
  },
  {
    slug: "cup-plastic-pollution",
    src: "/Images/work/cup-plastic-pollution.jpg",
    w: 720,
    h: 1080,
    title: "School Engagement: Tackling Plastic Pollution with CUP",
    tag: "COMMUNITY · SCHOOLS",
    alt: "Volunteer in gloves collecting plastic waste on a beach",
  },
  {
    slug: "edna-lab-rwanda",
    src: "/Images/work/edna-lab-rwanda.jpg",
    w: 1080,
    h: 810,
    title: "eDNA Laboratory Processing at University of Rwanda",
    tag: "LABORATORY · RWANDA",
    alt: "Researcher in a protective gown and gloves processing samples in a laboratory",
  },
  {
    slug: "edna-membrane-filter",
    src: "/Images/work/edna-membrane-filter.jpg",
    w: 810,
    h: 1080,
    title: "eDNA Water Sampling Using a Membrane Filter",
    tag: "eDNA · FIELD",
    alt: "Researcher in a life jacket on a boat collecting a water sample",
  },
  {
    slug: "nutrient-concentrations",
    src: "/Images/work/nutrient-concentrations.jpg",
    w: 810,
    h: 1080,
    title: "Measuring Nutrient Concentrations in Water Samples",
    tag: "LABORATORY",
    alt: "Researcher in a lab coat working at a bench with sample bottles and a microscope",
  },
];

export const photo = (slug: string) => fieldPhotos.find((p) => p.slug === slug)!;
