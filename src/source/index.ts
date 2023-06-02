interface InitialData {
    type?: string;
    subType?: string;
    price?: string;
    classification?: string;
    condition?: string;
  }
  

export const priorityOrder: Record<string, number> = {
    low: 0,
    medium: 1,
    high: 2,
  };

export const sources = [
    {
      type: "Tanah",
      subCategory: [
        {
          name: "Tanah Pertanian",
          priority: "Low",
        },
  
        {
          name: "Tanah Perkampungan",
          priority: "Medium",
        },
        {
          name: "Tanah Kuburan",
          priority: "High",
        },
        {
          name: "Tanah Bangunan",
          priority: "Low",
        },
        {
          name: "Tanah Pekarangan",
          priority: "Low",
        },
      ],
    },
    {
      type: "Gedung dan Bangunan",
      subCategory: [
        {
          name: "Gedung PKK",
          priority: "Low",
        },
        {
          name: "Gedung TK",
          priority: "High",
        },
        {
          name: "Gedung BPD",
          priority: "Low",
        },
        {
          name: "Gedung PKD",
          priority: "Low",
        },
        {
          name: "Gedung Balai Desa",
          priority: "High",
        },
        {
          name: "Gedung Kantor Desa",
          priority: "High",
        },
        {
          name: "Gudang",
          priority: "High",
        },
      ],
    },
    {
      type: "Peralatan dan Mesin",
      subCategory: [
        {
          name: "Almari",
          priority: "High",
        },
        {
          name: "Meja",
          priority: "High",
        },
        {
          name: "Mesin Ketik",
          priority: "High",
        },
        {
          name: "Jam Dinding",
          priority: "Medium",
        },
        {
          name: "Kursi",
          priority: "High",
        },
        {
          name: "Papan Monografi",
          priority: "Medium",
        },
        {
          name: "Mobil Ambulance",
          priority: "High",
        },
        {
          name: "Sepeda Motor",
          priority: "Medium",
        },
        {
          name: "lapangan tenis meja",
          priority: "Low",
        },
        {
          name: "Komputer",
          priority: "High",
        },
        {
          name: "Tralis Kantor",
          priority: "High",
        },
        {
          name: "Printer",
          priority: "High",
        },
        {
          name: "Laptop",
          priority: "High",
        },
        {
          name: "Laptop",
          priority: "Low",
        },
        {
          name: "Meja tamu",
          priority: "High",
        },
      ],
    },
    {
      type: "Inventaris Ruangan",
      subCategory: [
        {
          name: "Jam Dinding",
          priority: "Medium",
        },
        {
          name: "Meja Tulis",
          priority: "High",
        },
        {
          name: "Almari Arsip",
          priority: "High",
        },
        {
          name: "Tralis Kantor",
          priority: "High",
        },
        {
          name: "Pinter",
          priority: "High",
        },
        {
          name: "Laptop",
          priority: "High",
        },
        {
          name: "Kursi",
          priority: "High",
        },
        {
          name: "Printer",
          priority: "High",
        },
        {
          name: "Dispencer",
          priority: "Medium",
        },
      ],
    },
    {
      type: "Jalan, Irigasi, dan Jaringan",
      subCategory: [
        {
          name: "Tnh Pengairan",
          priority: "Medium",
        },
        {
          name: "Jembatan",
          priority: "High",
        },
        {
          name: "Jalan",
          priority: "High",
        },
      ],
    },
    {
      type: "Asset Tetap Lainnya",
      subCategory: [
        {
          name: "Perpustakaan",
          priority: "Low",
        },
        {
          name: "Buku",
          priority: "Low",
        },
      ],
    },
  ];
  
  export const prices = [
    "Rp 100.000 - Rp 500.000",
    "Rp 500.000,00 - Rp 1.000.000,00",
    "Rp 1.000.000,00 - Rp 10.000.000,00",
    "Rp 10.000.000,00 - Rp 100.000.000,00",
    "Rp 100.000.000,00 - Rp 500.000.000,00",
    "Rp 500.000.000,00 - Rp 1.000.000.000,00",
  ];
  
 export const classifications = ["Primer", "Sekunder", "Tersier"];
  
 export const conditions = ["Baik", "Kurang Baik"];
  
  //const count = ref();
 export const types = sources.map((item) => {
    return {
      label: item.type,
      value: item.type,
    };
  });
  

  
 export  const priceSelect = prices.map((item) => ({ label: item, value: item }));
 export const classificationSelect = classifications.map((item) => ({
    label: item,
    value: item,
  }));
  export const conditionSelect = conditions.map((item) => ({
    label: item,
    value: item,
  }));
  
 export function initialData(): InitialData {
    return {
      type: undefined,
      subType: undefined,
      price: undefined,
      classification: undefined,
      condition: undefined,
    };
  }
  