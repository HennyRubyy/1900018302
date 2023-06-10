import type { DataEntry } from "../types";

function getAllTotal(data: any) {
  return {
    Yes: data.filter((item:any) => item.result === "Yes").length,
    No: data.filter((item:any) => item.result === "No").length,
  };
}

export function calculateProbability(
  data: DataEntry[],
  category: string,
  subCategory: string,
  price: string,
  classifications: string,
  conditions: string
): any {
  // Calculate probabilities of each class ("Yes" and "No")
  const classProbabilities = {
    Yes: 0,
    No: 0,
  };

  // Count occurrences of each class
  data.forEach((entry) => {
    if (entry.result === "Yes") {
      classProbabilities.Yes++;
    } else if (entry.result === "No") {
      classProbabilities.No++;
    }
  });

  // Calculate probabilities of input features given each class
  const featureProbabilities = {
    category: calculateFeatureProbability(data, "category", category),
    subCategory: calculateFeatureProbability(data, "sub_category", subCategory),
    price: calculateFeatureProbability(data, "price", price),
    classifications: calculateFeatureProbability(data, "classification", classifications),
    conditions: calculateFeatureProbability(data, "condition", conditions),
  };

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

  const result = {
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

  const expected = Object.values(result).reduce((a, b) => {
    return {
      yes: a.yes * b.yes,
      no: a.no * b.no,
    };
  });

  // Return "Yes" if the probability is greater than or equal to 0.5, otherwise return "No"
  return {
    expected: expected.yes > expected.no ? "Yes" : "No",
    result,
    totalResult: expected,
    classProbabilities,
  };
}

function calculateFeatureProbability(
  data: DataEntry[],
  feature: keyof DataEntry,
  value: string
): { Yes: number; No: number } {
  const featureProbabilities = {
    Yes: 0,
    No: 0,
  };

  // Count occurrences of the feature value for each class
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
