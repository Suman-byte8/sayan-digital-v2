export const INITIAL_USER_PROFILE = {
  id: "USR-94821",
  name: "Sayan Mukherjee",
  firstName: "Sayan",
  lastName: "Mukherjee",
  email: "sayan.mukherjee@gmail.com",
  phone: "+91 98320 45678",
  businessName: "Sayan Media & Creative Studio",
  gstin: "19AAECS1234M1Z5",
  avatarInitials: "SM",
  avatarUrl: null,
  tier: "Craft Club VIP",
  tierColor: "gold",
  memberSince: "September 2024",
  loyaltyPoints: 1450,
  pointsValueRupees: 145,
  stats: {
    totalOrders: 14,
    activeOrders: 2,
    pendingProofs: 1,
    savedDesigns: 8,
  },
};

export const INITIAL_ORDERS = [
  {
    id: "SD-84920",
    date: "13 Sep 2026",
    status: "in-production",
    statusLabel: "In Printing",
    badgeVariant: "warning",
    estimatedDelivery: "15 Sep 2026",
    totalAmount: 2260,
    itemsCount: 22,
    shippingCarrier: "DTDC Priority",
    trackingNumber: "DTC-WB-9942018",
    paymentMethod: "UPI (Google Pay)",
    isPaid: true,
    items: [
      {
        id: "itm-1",
        name: "Custom Ceramic Photo Mug",
        customization: "Full Wrap Sublimation · High Gloss Finish",
        qty: 2,
        price: 180,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB_jc_iP9Dga_tQ4hK8vfyzFgjARohi1TQQIch8DE6OPUmEQVP9RnkvLEFYhvFhtb3Q_plryzUbkOualRvUAqxMc9MxiWoc-I919erZhuBCzJu3OSzZGhaCd9cGNxEomxSPV2qiMTN2ON__A7Vd_TcoBVQFoHcsGMEZvCSW4A0gPO9uUIEhSStlpHY0GQRD6jvLN2AUz5p8YbXubIcL5lksGRbvacivInditZWfSeCC-dTym03G9Xhtqw",
      },
      {
        id: "itm-2",
        name: "HD PVC Smart ID Card & Satin Lanyard",
        customization: "20mm Royal Blue Ribbon + Metal Trigger Clip",
        qty: 20,
        price: 95,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC107D_0x76B69x_Z_fD4gH3b910_kL8w5FqZ8-8j-eFqC2_dYV6n7f8e4eK-8a1_8vV8d1_b8e",
      },
    ],
  },
  {
    id: "SD-84712",
    date: "11 Sep 2026",
    status: "shipped",
    statusLabel: "Out for Delivery",
    badgeVariant: "info",
    estimatedDelivery: "Today by 6:00 PM",
    totalAmount: 449,
    itemsCount: 1,
    shippingCarrier: "Blue Dart Surface",
    trackingNumber: "BLU-902188203",
    paymentMethod: "UPI (PhonePe)",
    isPaid: true,
    items: [
      {
        id: "itm-3",
        name: "Personalized Temperature LED Bottle",
        customization: "Laser Engraved Monogram: 'Sayan M.'",
        qty: 1,
        price: 449,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCqeAbe1xWhiHyZacq-N83EBvgzrKsxMR1YuHu98IwCrNZx6RdxDK_eEUHOprPAdOqlTTWIQFv_NJo74xgUgoOC_sqfpwsXMx8tKVNQHJeHA1to_XgIP0RUnvn6VBy1W5GZNN7rpbjiaRJT8SSybVMS16TAvy3b3KsDgkox9ZGGPUXgH-3qXA-JugWsfO7KVDE_0Rf2cKbQZX0UF5NKFZPmXBvXjTCf5_KVam26KTR7Vx_EDpyw93h0_Q",
      },
    ],
  },
  {
    id: "SD-83904",
    date: "04 Sep 2026",
    status: "delivered",
    statusLabel: "Delivered",
    badgeVariant: "success",
    deliveredOn: "06 Sep 2026",
    totalAmount: 1198,
    itemsCount: 2,
    shippingCarrier: "Local Express Courier",
    trackingNumber: "MLD-LOC-4819",
    paymentMethod: "HDFC Card ending 4892",
    isPaid: true,
    items: [
      {
        id: "itm-4",
        name: "Premium Sublimation Polo T-Shirt",
        customization: "Chest Embroidery Logo · Size L · Navy",
        qty: 1,
        price: 499,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB_jc_iP9Dga_tQ4hK8vfyzFgjARohi1TQQIch8DE6OPUmEQVP9RnkvLEFYhvFhtb3Q_plryzUbkOualRvUAqxMc9MxiWoc-I919erZhuBCzJu3OSzZGhaCd9cGNxEomxSPV2qiMTN2ON__A7Vd_TcoBVQFoHcsGMEZvCSW4A0gPO9uUIEhSStlpHY0GQRD6jvLN2AUz5p8YbXubIcL5lksGRbvacivInditZWfSeCC-dTym03G9Xhtqw",
      },
      {
        id: "itm-5",
        name: "Acrylic Floating Photo Block",
        customization: "8x10 Inch Diamond Polished Edge",
        qty: 1,
        price: 699,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCqeAbe1xWhiHyZacq-N83EBvgzrKsxMR1YuHu98IwCrNZx6RdxDK_eEUHOprPAdOqlTTWIQFv_NJo74xgUgoOC_sqfpwsXMx8tKVNQHJeHA1to_XgIP0RUnvn6VBy1W5GZNN7rpbjiaRJT8SSybVMS16TAvy3b3KsDgkox9ZGGPUXgH-3qXA-JugWsfO7KVDE_0Rf2cKbQZX0UF5NKFZPmXBvXjTCf5_KVam26KTR7Vx_EDpyw93h0_Q",
      },
    ],
  },
  {
    id: "SD-82109",
    date: "18 Aug 2026",
    status: "delivered",
    statusLabel: "Delivered",
    badgeVariant: "success",
    deliveredOn: "20 Aug 2026",
    totalAmount: 850,
    itemsCount: 1,
    shippingCarrier: "DTDC Standard",
    trackingNumber: "DTC-WB-8201994",
    paymentMethod: "UPI (Paytm)",
    isPaid: true,
    items: [
      {
        id: "itm-6",
        name: "K9 Optical Crystal Memento Trophy",
        customization: "Gold Filled Rotary Engraving",
        qty: 1,
        price: 850,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB_jc_iP9Dga_tQ4hK8vfyzFgjARohi1TQQIch8DE6OPUmEQVP9RnkvLEFYhvFhtb3Q_plryzUbkOualRvUAqxMc9MxiWoc-I919erZhuBCzJu3OSzZGhaCd9cGNxEomxSPV2qiMTN2ON__A7Vd_TcoBVQFoHcsGMEZvCSW4A0gPO9uUIEhSStlpHY0GQRD6jvLN2AUz5p8YbXubIcL5lksGRbvacivInditZWfSeCC-dTym03G9Xhtqw",
      },
    ],
  },
];

export const INITIAL_PROOFS = [
  {
    id: "PRF-2026-089",
    title: "Annual Sports Meet 2026 Acrylic Trophy",
    product: "Custom Laser Cut Acrylic Memento (Pack of 15)",
    orderRef: "SD-84920",
    submittedDate: "13 Sep 2026",
    designer: "Subhajit Roy (Lead Designer, Sayan Digital)",
    status: "pending",
    notes:
      "Please verify spelling of winners' names, font choice, and school emblem positioning before we proceed to physical laser cutting.",
    dimensions: "8.5 x 6.0 inches",
    colorProfile: "CMYK + Spot Gold",
    previewUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqeAbe1xWhiHyZacq-N83EBvgzrKsxMR1YuHu98IwCrNZx6RdxDK_eEUHOprPAdOqlTTWIQFv_NJo74xgUgoOC_sqfpwsXMx8tKVNQHJeHA1to_XgIP0RUnvn6VBy1W5GZNN7rpbjiaRJT8SSybVMS16TAvy3b3KsDgkox9ZGGPUXgH-3qXA-JugWsfO7KVDE_0Rf2cKbQZX0UF5NKFZPmXBvXjTCf5_KVam26KTR7Vx_EDpyw93h0_Q",
  },
  {
    id: "PRF-2026-074",
    title: "Corporate Coffee Mug with Gold Foil Logo",
    product: "Black Matte Ceramic Mug (Pack of 30)",
    orderRef: "SD-83904",
    submittedDate: "03 Sep 2026",
    designer: "Priya Sen (Studio Pre-press)",
    status: "approved",
    approvedDate: "04 Sep 2026 · 11:20 AM",
    notes: "Approved for full sublimation production run.",
    dimensions: "11oz Standard Mug · 8.2 x 3.8 inches wrap",
    colorProfile: "Spot Metallic Gold",
    previewUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_jc_iP9Dga_tQ4hK8vfyzFgjARohi1TQQIch8DE6OPUmEQVP9RnkvLEFYhvFhtb3Q_plryzUbkOualRvUAqxMc9MxiWoc-I919erZhuBCzJu3OSzZGhaCd9cGNxEomxSPV2qiMTN2ON__A7Vd_TcoBVQFoHcsGMEZvCSW4A0gPO9uUIEhSStlpHY0GQRD6jvLN2AUz5p8YbXubIcL5lksGRbvacivInditZWfSeCC-dTym03G9Xhtqw",
  },
];

export const INITIAL_ADDRESSES = [
  {
    id: "addr-1",
    label: "Home (Primary)",
    recipientName: "Sayan Mukherjee",
    phone: "+91 98320 45678",
    addressLine1: "Flat 4B, Greenfield Heights, Rathbari More",
    addressLine2: "Near Netaji Statue, English Bazar",
    city: "Malda",
    state: "West Bengal",
    pincode: "732101",
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  {
    id: "addr-2",
    label: "Creative Studio / Office",
    recipientName: "Sayan Mukherjee (Attn: Dispatch Desk)",
    phone: "+91 98320 45678",
    addressLine1: "2nd Floor, Netaji Commercial Arcade",
    addressLine2: "Station Road, Opp. Head Post Office",
    city: "Malda",
    state: "West Bengal",
    pincode: "732101",
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
  {
    id: "addr-3",
    label: "Kolkata Branch Office",
    recipientName: "Sayan Media Works",
    phone: "+91 94340 12345",
    addressLine1: "Block C, Salt Lake Sector V",
    addressLine2: "Near Webel More",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700091",
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
];

export const INITIAL_WISHLIST = [
  {
    id: "wsh-1",
    name: "Sublimation Magic Photo Mug",
    category: "Drinkware",
    price: 249,
    originalPrice: 350,
    inStock: true,
    description: "Colour changing matte black mug reveals photo when hot liquid is poured.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_jc_iP9Dga_tQ4hK8vfyzFgjARohi1TQQIch8DE6OPUmEQVP9RnkvLEFYhvFhtb3Q_plryzUbkOualRvUAqxMc9MxiWoc-I919erZhuBCzJu3OSzZGhaCd9cGNxEomxSPV2qiMTN2ON__A7Vd_TcoBVQFoHcsGMEZvCSW4A0gPO9uUIEhSStlpHY0GQRD6jvLN2AUz5p8YbXubIcL5lksGRbvacivInditZWfSeCC-dTym03G9Xhtqw",
  },
  {
    id: "wsh-2",
    name: "Wooden Engraved Desk Organizer & Pen Stand",
    category: "Corporate Supplies",
    price: 380,
    originalPrice: 499,
    inStock: true,
    description: "Solid steam beech wood with customized nameplate and mobile dock.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqeAbe1xWhiHyZacq-N83EBvgzrKsxMR1YuHu98IwCrNZx6RdxDK_eEUHOprPAdOqlTTWIQFv_NJo74xgUgoOC_sqfpwsXMx8tKVNQHJeHA1to_XgIP0RUnvn6VBy1W5GZNN7rpbjiaRJT8SSybVMS16TAvy3b3KsDgkox9ZGGPUXgH-3qXA-JugWsfO7KVDE_0Rf2cKbQZX0UF5NKFZPmXBvXjTCf5_KVam26KTR7Vx_EDpyw93h0_Q",
  },
  {
    id: "wsh-3",
    name: "Heavy Canvas Sublimation Tote Bag",
    category: "Custom Apparel",
    price: 220,
    originalPrice: 299,
    inStock: true,
    description: "Eco-friendly 320 GSM organic cotton canvas with high definition digital prints.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_jc_iP9Dga_tQ4hK8vfyzFgjARohi1TQQIch8DE6OPUmEQVP9RnkvLEFYhvFhtb3Q_plryzUbkOualRvUAqxMc9MxiWoc-I919erZhuBCzJu3OSzZGhaCd9cGNxEomxSPV2qiMTN2ON__A7Vd_TcoBVQFoHcsGMEZvCSW4A0gPO9uUIEhSStlpHY0GQRD6jvLN2AUz5p8YbXubIcL5lksGRbvacivInditZWfSeCC-dTym03G9Xhtqw",
  },
];

export const INITIAL_PAYMENT_METHODS = [
  {
    id: "pay-1",
    type: "upi",
    title: "Google Pay UPI",
    detail: "sayan.mukherjee@oksbi",
    isPrimary: true,
    badge: "Verified VPA",
  },
  {
    id: "pay-2",
    type: "card",
    title: "HDFC Bank Visa Platinum",
    detail: "•••• •••• •••• 4892 · Exp 08/29",
    isPrimary: false,
    badge: "Credit Card",
  },
  {
    id: "pay-3",
    type: "gst",
    title: "Registered Business GSTIN",
    detail: "19AAECS1234M1Z5 (West Bengal)",
    isPrimary: false,
    badge: "Input Tax Credit Ready",
  },
];

export const INITIAL_NOTIFICATIONS = {
  orderUpdatesWhatsapp: true,
  deliverySms: true,
  designProofAlerts: true,
  promotionalEmail: false,
  festiveDiscountAlerts: true,
};
