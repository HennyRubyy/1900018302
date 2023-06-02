import type { DataEntry } from "../types";

function getAllTotal(data: any) {
  return {
    Yes: data.filter((item:any) => item.result == "Yes").length,
    No: data.filter((item:any) => item.result == "No").length,
  };
}

export function calculateProbability(
  data: DataEntry[],
  category: string,
  subCategory: string,
  price: string,
  classifications: string,
  conditions: string
): any{
  // Calculate probabilities of each class ("Yes" and "No")
  const classProbabilities = {
    Yes: 0,
    No: 0,
  };


  // Count occurrences of each class
  data
    .forEach((entry) => {
      if (entry.result === "Yes") {
        classProbabilities.Yes++;
      } else if (entry.result === "No") {
        classProbabilities.No++;
      }
    });

  // Calculate probabilities of input features given each class
  const featureProbabilities = {
    category: calculateFeatureProbability(data, "category", category),
    subCategory: calculateFeatureProbability(data, "subCategory", subCategory),
    price: calculateFeatureProbability(data, "price", price),
    classifications: calculateFeatureProbability(data, "classifications", classifications),
    conditions: calculateFeatureProbability(data, "conditions", conditions),
  };

  const d = {
    category: {
      Yes: featureProbabilities["category"].Yes / getAllTotal(data).Yes,
      No: featureProbabilities["category"].No / getAllTotal(data).No,
    },
    subCategory: {
      Yes: featureProbabilities["subCategory"].Yes / getAllTotal(data).Yes,
      No: featureProbabilities["subCategory"].No / getAllTotal(data).No,
    },
    price: {
      Yes: featureProbabilities["price"].Yes / getAllTotal(data).Yes,
      No: featureProbabilities["price"].No / getAllTotal(data).No,
    },
    classifications: {
      Yes: featureProbabilities["classifications"].Yes / getAllTotal(data).Yes,
      No: featureProbabilities["classifications"].No / getAllTotal(data).No,
    },
    conditions: {
      Yes: featureProbabilities["conditions"].Yes / getAllTotal(data).Yes,
      No: featureProbabilities["conditions"].No / getAllTotal(data).No,
    },
  }


  const result = {
    category: {
      yes: d.category.Yes * getAllTotal(data).Yes,
      no: d.category.No * getAllTotal(data).No,
    },
    subCategory: {
      yes: d.subCategory.Yes * getAllTotal(data).Yes,
      no: d.subCategory.No * getAllTotal(data).No,
    },
    price: {
      yes: d.price.Yes * getAllTotal(data).Yes,
      no: d.price.No * getAllTotal(data).No,
    },
    classifications: {
      yes: d.classifications.Yes * getAllTotal(data).Yes,
      no: d.classifications.No * getAllTotal(data).No,
    },
    conditions: {
      yes: d.conditions.Yes * getAllTotal(data).Yes,
      no: d.conditions.No * getAllTotal(data).No,
    },
  }

  const expected = Object.values(result).reduce((a, b) => {
    return {
      yes: a.yes + b.yes,
      no: a.no + b.no,
    }
  }) 

  // Return "Yes" if the probability is greater than or equal to 0.5, otherwise return "No"
  return {
    expected: expected.yes > expected.no ? 'Yes' : 'No',
    result,
    totalResult: expected,
    classProbabilities

  }
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

  return featureProbabilities;
}
