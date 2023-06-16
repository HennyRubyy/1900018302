<script setup lang="ts">
import { calculateProbability } from "../helpers";
import { initialData } from "../source";
import { useTraining } from "../composable/training";
import { useCategory } from "../composable/category";
import { useSubCategory } from "../composable/sub-category";
import { useClassification } from "../composable/classification";
import { usePrice } from "../composable/price";
import { useCondition } from "../composable/condition";
import { Chart, registerables, type ChartData, ChartOptions } from "chart.js";
import {
  DoughnutChart,
  useDoughnutChart,
  BarChart,
  useBarChart,
} from "vue-chart-3";

Chart.register(...registerables);

const router = useRouter();

const dataValues = ref([30, 40, 60, 70, 5]);
const chartDataProps = ref([
  { yes: 0.37, no: 0.34 },
  { yes: 0.06, no: 0.05 },
  { yes: 0.06, no: 0.02 },
  { yes: 0.2, no: 0.52 },
  { yes: 0.29, no: 0.5 },
]);
const dataLabels = ref(["Yes", "No"]);

const chartDataValue = computed<ChartData<"doughnut">>(() => ({
  labels: dataLabels.value,
  datasets: [
    {
      data: dataValues.value,
      backgroundColor: ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"],
    },
  ],
}));

const options = computed<ChartOptions<"doughnut">>(() => ({}));

const { doughnutChartProps } = useDoughnutChart({
  chartData: chartDataValue,
  options,
});

const { barChartProps } = useBarChart({
  chartData: {
    labels: [
      "Category",
      "Sub Category",
      "Price",
      "Classification",
      "Condition",
    ],
    datasets: [
      {
        data: computed(() => chartDataProps.value.map((item) => item.yes))
          .value,
        label: "Yes",
      },
      {
        data: computed(() => chartDataProps.value.map((item) => item.no)).value,
        label: "No",
      },
    ],
  },
});

const formData = ref(initialData());
const expected = ref<string>("Yes");
const result = ref();
const totalResult = ref();
const classProbabilities = ref();
const isHasResult = ref(false);
const divideTotal = ref({
  Yes: 0,
  No: 0,
});

const { getAll, trainings } = useTraining();
const {
  all: { data: categories },
} = useCategory();
const {
  all: { data: subCategories },
} = useSubCategory();
const {
  all: { data: prices },
} = usePrice();
const {
  all: { data: conditions },
} = useCondition();
const {
  all: { data: classifications },
} = useClassification();

onMounted(() => {
  getAll();
});

function calculateData() {
  const {
    expected: e,
    result: r,
    totalResult: t,
    classProbabilities: c,
    divideTotal: d,
  } = calculateProbability(
    trainings.value.map((item: any) => {
      return {
        category: item.category.name,
        sub_category: item.sub_category.name,
        price: item.price.name,
        classification: item.classification.name,
        condition: item.condition.name,
        result: item.result,
      };
    }),
    formData.value.type as string,
    formData.value.subType as string,
    formData.value.price as string,
    formData.value.classification as string,
    formData.value.condition as string
  );
  divideTotal.value = d;
  isHasResult.value = true;
  result.value = r;
  expected.value = e as string;
  totalResult.value = t;

  const yesPercentage = t.yes;
  const noPercentage = t.no;

  dataValues.value = [yesPercentage, noPercentage];
  chartDataProps.value = Object.values(result.value);

  classProbabilities.value = c;
}

const categorySelect = computed(() => {
  return categories.value?.data?.map((item) => ({
    label: item.name,
    value: item.name,
  }));
});

const classificationSelect = computed(() => {
  return classifications.value?.data?.map((item) => ({
    label: item.name,
    value: item.name,
  }));
});

const priceSelect = computed(() => {
  return prices.value?.data?.map((item) => ({
    label: item.name,
    value: item.name,
  }));
});

const conditionSelect = computed(() => {
  return conditions.value?.data?.map((item) => ({
    label: item.name,
    value: item.name,
  }));
});

const subCategorySelect = computed(() => {
  return subCategories.value?.data
    ?.filter((value) => value.category.name === formData.value.type)
    ?.map((item) => ({ label: item.name, value: item.name }));
});

function resetForm() {
  formData.value = initialData();
  isHasResult.value = false;
}
</script>

<template>
  <div class="w-full flex justify-center items-center min-h-screen flex-col">
    <div class="max-w-4xl min-h-[20rem] shadow-md p-6 rounded-lg">
      <div class="space-y-5">
        <header>
          <h1 class="text-xl font-bold text-center mb-10">
            SISTEM PENDUKUNG KEPUTUSAN PENENTUAN NILAI EKONOMIS KEHARTABENDAAN
            MILIK PEMERINTAH DESA DENGAN METODE NAIVE BAYES CLASSIFIER
          </h1>
        </header>
        <main>
          <n-form v-if="!isHasResult">
            <n-form-item label="Jenis">
              <n-select
                v-model:value="formData.type"
                :options="categorySelect"
                filterable
              />
            </n-form-item>
            <n-form-item label="Jenis Kategori">
              <n-select
                v-model:value="formData.subType"
                :disabled="!formData.type"
                :options="subCategorySelect"
                filterable
              />
            </n-form-item>
            <n-form-item label="Harga">
              <n-select
                v-model:value="formData.price"
                :options="priceSelect"
                filterable
              ></n-select>
            </n-form-item>
            <n-form-item label="Kebutuhan">
              <n-select
                v-model:value="formData.classification"
                :options="classificationSelect"
                filterable
              ></n-select>
            </n-form-item>
            <n-form-item label="Kondisi">
              <n-select
                v-model:value="formData.condition"
                :options="conditionSelect"
                filterable
              ></n-select>
            </n-form-item>
            <div class="flex justify-center max-w-full gap-5">
              <n-button @click="router.push('/')">Kembali</n-button>
              <n-button type="primary" @click="calculateData">
                Submit
              </n-button>
            </div>
          </n-form>
          <div class="space-y-10" v-else>
            <div>
              <n-result
                v-if="expected == 'Yes'"
                status="success"
                title="Yes"
                class="space-y-10"
                :description="`Berdasarkan hasil perhitungan Naive Bayes aset disimpulkan worth it untuk dibeli, dengan hasil perhitungan dibawah ini`"
              >
                <div class="space-y-10">
                  <n-table class="mb-10">
                    <thead>
                      <tr>
                        <th colspan="2">Total Data Training</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Yes: {{ classProbabilities.Yes }}</td>
                        <td>No: {{ classProbabilities.No }}</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>
                          {{ classProbabilities.Yes + classProbabilities.No }}
                        </td>
                      </tr>
                    </tbody>
                  </n-table>
                  <BarChart v-bind="barChartProps" />
                  <n-table stripped>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Yes</th>
                        <th>No</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Probablilitas</td>
                        <td>
                          {{ divideTotal.Yes }}
                        </td>
                        <td>
                          {{ divideTotal.No }}
                        </td>
                      </tr>
                      <tr v-for="item in Object.keys(result)">
                        <td>
                          {{ item }}
                        </td>
                        <td>
                          {{ result[item].yes }}
                        </td>
                        <td>
                          {{ result[item].no }}
                        </td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>
                          {{ totalResult.yes }}
                        </td>
                        <td>
                          {{ totalResult.no }}
                        </td>
                      </tr>
                    </tbody>
                  </n-table>
                  <DoughnutChart v-bind="doughnutChartProps" />
                </div>
              </n-result>
              <n-result
                v-else
                status="error"
                title="No"
                description="Berdasarkan hasil perhitungan Naive Bayes aset disimpulkan tidak worth it untuk dibeli. dengan hasil perhitungan dibawah ini"
              >
                <div class="space-y-10">
                  <n-table class="mb-10">
                    <thead>
                      <tr>
                        <th colspan="2">Total Data Training</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Yes: {{ classProbabilities.Yes }}</td>
                        <td>No: {{ classProbabilities.No }}</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>
                          {{ classProbabilities.Yes + classProbabilities.No }}
                        </td>
                      </tr>
                    </tbody>
                  </n-table>
                  <BarChart v-bind="barChartProps" />
                  <n-table stripped>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Yes</th>
                        <th>No</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Probablilitas</td>
                        <td>
                          {{ divideTotal.Yes.toFixed(2) }}
                        </td>
                        <td>
                          {{ divideTotal.No.toFixed(2) }}
                        </td>
                      </tr>
                      <tr v-for="item in Object.keys(result)">
                        <td>
                          {{ item }}
                        </td>
                        <td>
                          {{ result[item].yes }}
                        </td>
                        <td>
                          {{ result[item].no }}
                        </td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>
                          {{ totalResult.yes }}
                        </td>
                        <td>
                          {{ totalResult.no }}
                        </td>
                      </tr>
                    </tbody>
                  </n-table>
                  <DoughnutChart v-bind="doughnutChartProps" />
                </div>
              </n-result>
            </div>
            <div class="max-w-sm mx-auto mt-20">
              <n-button block @click="resetForm">Kembali</n-button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
