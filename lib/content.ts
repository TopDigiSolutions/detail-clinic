export const business = {
  name: "Detail Clinic",
  email: "detaillclinic@gmail.com",
  emailHref: "mailto:detaillclinic@gmail.com",
  phone: "(608) 797-5137",
  phoneHref: "tel:+16087975137",
  address: "1201 La Crosse St",
  city: "La Crosse, WI 54601",
  booking: "https://app.urable.com/virtual-shop/CKt6z7uwDTRGKiB6ztCk",
  contact:
    "https://app.urable.com/form/CKt6z7uwDTRGKiB6ztCk/T7a6T5nMNZQJvgThuTWw",
  reviews: "https://maps.google.com/?cid=9961475259738620270",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=Detail+Clinic+1201+La+Crosse+St+La+Crosse+WI+54601",
};
export const nav = [
  ["Home", "#home"],
  ["Services", "#services"],
  ["Detailing", "#detailing"],
  ["Tint", "#tint"],
  ["Gallery", "#gallery"],
  ["About", "/about-us"],
  ["Contact", "#contact"],
];
export const photos = {
  interior: "/images/gallery2-1-b61af160-7bf8-49fc-8ca3-806d59c01b88.webp",
  exterior: "/images/gallery1-2-afcde4f0-b480-478b-978a-f6806dba7c07.webp",
  detail: "/images/studio.webp",
  suv: "/images/suv-hyundai.webp",
  jeep: "/images/suv-jeep.webp",
  before: "/images/gallery4-1-before-4b909ebe-72bd-450c-b251-49c0048dbbff.webp",
  after: "/images/gallery4-1-after-c50fb29c-a568-4b69-aac1-f2c70a97c99b.webp",
};
export const services = [
  {
    name: "Interior detailing",
    tag: "A fresh perspective.",
    description:
      "Give the space you spend your time in the attention it deserves. Explore interior packages for your vehicle.",
    price: "FROM $150",
    image: photos.interior,
  },
  {
    name: "Full service detailing",
    tag: "Inside. Outside. All yours.",
    description:
      "Bring interior and exterior care together. Find your full-service package in our online shop.",
    price: "FROM $200",
    image: photos.suv,
  },
  {
    name: "Exterior detailing",
    tag: "Make an entrance.",
    description:
      "A little more attention to the outside. Add exterior service to an interior package for $50.",
    price: "+$50 WITH INTERIOR",
    image: photos.jeep,
  },
  {
    name: "Paint correction",
    tag: "Let the finish speak.",
    description:
      "Talk with us about your paint, its condition, and the right approach for your vehicle.",
    price: "ASK FOR A QUOTE",
    image: photos.exterior,
  },
  {
    name: "Ceramic coating",
    tag: "Care that goes further.",
    description:
      "Explore ceramic coating options with our team and choose the right care for your finish.",
    price: "ASK FOR A QUOTE",
    image: photos.detail,
  },
  {
    name: "Specialty & add-ons",
    tag: "Your vehicle. Your priorities.",
    description:
      "Explore current add-ons and specialty services in our online shop, or tell us what your vehicle needs.",
    price: "EXPLORE OPTIONS",
    image: photos.interior,
  },
];
