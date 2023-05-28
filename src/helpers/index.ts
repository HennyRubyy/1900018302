import type { DataEntry } from "../types";

export function calculateProbability(
    data: DataEntry[],
    category: string,
    subCategory: string,
    price: string,
    excess: string,
    lack: string
  ): "Yes" | "No" {
    // Calculate probabilities of each class ("Yes" and "No")
    const classProbabilities = {
      Yes: 0,
      No: 0,
    };

  
    // Count occurrences of each class
    data.filter((item) => item.subCategory == subCategory).forEach(entry => {
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
      excess: calculateFeatureProbability(data, "excess", excess),
      lack: calculateFeatureProbability(data, "lack", lack),
    };

  
    // Calculate probabilities of each class given input features using Naive Bayes formula
    const resultYesProbability =
      (classProbabilities.Yes / data.length) *
      featureProbabilities.category.Yes *
      featureProbabilities.subCategory.Yes *
      featureProbabilities.price.Yes *
      featureProbabilities.excess.Yes *
      featureProbabilities.lack.Yes;
  
    const resultNoProbability =
      (classProbabilities.No / data.length) *
      featureProbabilities.category.No *
      featureProbabilities.subCategory.No *
      featureProbabilities.price.No *
      featureProbabilities.excess.No *
      featureProbabilities.lack.No;

  
    // Return "Yes" if the probability is greater than or equal to 0.5, otherwise return "No"
    return resultYesProbability >= resultNoProbability ? "Yes" : "No";
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
    data.forEach(entry => {
      if (entry[feature] === value && entry.result === "Yes") {
        featureProbabilities.Yes++;
      } else if (entry[feature] === value && entry.result === "No") {
        featureProbabilities.No++;
      }
    });
  
    // Normalize probabilities
    const totalCount = featureProbabilities.Yes + featureProbabilities.No;
    featureProbabilities.Yes /= totalCount;
    featureProbabilities.No /= totalCount;
  
    return featureProbabilities;
  }
  

 