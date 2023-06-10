import type { DataEntry } from "../types";

//get total data yes dan no global
function getAllTotal(data: any) {
  return {
    Yes: data.filter((item:any) => item.result === "Yes").length,
    No: data.filter((item:any) => item.result === "No").length,
  };
}
//menghitung probabilitas setiap properti
export function calculateProbability(
  data: DataEntry[],//parameter untuk data training
  category: string,
  subCategory: string,
  price: string,
  classifications: string,
  conditions: string
): any {
  // Hitung probabilitas masing-masing kelas ("Ya" dan "Tidak")
  const classProbabilities = {
    Yes: 0,
    No: 0,
  };

  // Hitung kemunculan setiap kelas
  data.forEach((entry) => {
    if (entry.result === "Yes") {
      classProbabilities.Yes++;
    } else if (entry.result === "No") {
      classProbabilities.No++;
    }
  });

  // Hitung probabilitas fitur input yang diberikan setiap kelas dari user
  const featureProbabilities = { 
    category: calculateFeatureProbability(data, "category", category),
    subCategory: calculateFeatureProbability(data, "sub_category", subCategory),
    price: calculateFeatureProbability(data, "price", price),
    classifications: calculateFeatureProbability(data, "classification", classifications),
    conditions: calculateFeatureProbability(data, "condition", conditions),
  };

  // hitung per sub kategori
  const d = { 
    category: {
      Yes: featureProbabilities.category.Yes / getAllTotal(data).Yes,
      No: featureProbabilities.category.No / getAllTotal(data).No,
    },
    subCategory: {
      Yes: featureProbabilities.subCategory.Yes / getAllTotal(data).Yes,
      No: featureProbabilities.subCategory.No / getAllTotal(data).No,
    },
    price: {
      Yes: featureProbabilities.price.Yes / getAllTotal(data).Yes,
      No: featureProbabilities.price.No / getAllTotal(data).No,
    },
    classifications: {
      Yes: featureProbabilities.classifications.Yes / getAllTotal(data).Yes,
      No: featureProbabilities.classifications.No / getAllTotal(data).No,
    },
    conditions: {
      Yes: featureProbabilities.conditions.Yes / getAllTotal(data).Yes,
      No: featureProbabilities.conditions.No / getAllTotal(data).No,
    },
  };

  const result = { // get hasil hitung sub kategori
    category: {
      yes: +d.category.Yes.toFixed(2),
      no: +d.category.No.toFixed(2),
    },
    subCategory: {
      yes: +d.subCategory.Yes.toFixed(2),
      no: +d.subCategory.No.toFixed(2),
    },
    price: {
      yes: +d.price.Yes.toFixed(2),
      no: +d.price.No.toFixed(2),
    },
    classifications: {
      yes: +d.classifications.Yes.toFixed(2),
      no: +d.classifications.No.toFixed(2),
    },
    conditions: {
      yes: +d.conditions.Yes.toFixed(2),
      no: +d.conditions.No.toFixed(2),
    },
  };

  //mengalikan hasil dari semua data Yes dan No untuk mendapatkan keputusan akhir
  const expected = Object.values(result).reduce((a, b) => {
    return {
      yes: a.yes * b.yes,
      no: a.no * b.no,
    };
  });

  // Kembalikan "Ya" jika probabilitasnya lebih besar dari atau sama dengan 0,5, jika tidak, kembalikan "Tidak"
  return {
    expected: expected.yes > expected.no ? "Yes" : "No",
    result,
    totalResult: expected,
    classProbabilities,
  };
}

//get funtion hitung Yes atau NO
function calculateFeatureProbability(
  data: DataEntry[],
  feature: keyof DataEntry,
  value: string
): { Yes: number; No: number } {
  const featureProbabilities = {
    Yes: 0,
    No: 0,
  };

  // Hitung kemunculan nilai fitur untuk setiap kelas
  data.forEach((entry) => {
    if (entry[feature] === value && entry.result === "Yes") {
      featureProbabilities.Yes++;
    } else if (entry[feature] === value && entry.result === "No") {
      featureProbabilities.No++;
    }
  });

  console.log(featureProbabilities, feature)

  return featureProbabilities;
}
