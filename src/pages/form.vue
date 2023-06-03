<script setup lang="ts">
import { calculateProbability } from "../helpers";
import {
  classificationSelect,
  conditionSelect,
  priceSelect,
  types,
  priorityOrder,
  sources,
  initialData,
} from "../source";
import { useTraining } from "../composable/training";

const formData = ref(initialData());
const expected = ref<"Yes" | "No">("Yes");
const result = ref();
const totalResult = ref();
const classProbabilities = ref();
const isHasResult = ref(false);

const { getAll, trainings } = useTraining();

onMounted(() => {
  getAll();
});

function calculateData() {
  const {
    expected: e,
    result: r,
    totalResult: t,
    classProbabilities: c,
  } = calculateProbability(
    trainings.value,
    formData.value.type as string,
    formData.value.subType as string,
    formData.value.price as string,
    formData.value.classification as string,
    formData.value.condition as string
  );
  isHasResult.value = true;
  result.value = r;
  expected.value = e;
  totalResult.value = t;

  classProbabilities.value = c;
}

const subTypes = computed(() => {
  const source = sources.find((source) => source.type === formData.value.type);
  return source?.subCategory
    .sort((a, b) => {
      return (
        priorityOrder[a.priority.toLocaleLowerCase()] -
        priorityOrder[b.priority.toLocaleLowerCase()]
      );
    })
    .reverse()
    .map((item) => ({ label: item.name, value: item.name }));
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
                :options="types"
                filterable
              />
            </n-form-item>
            <n-form-item label="Jenis Kategori">
              <n-select
                v-model:value="formData.subType"
                :disabled="!formData.type"
                :options="subTypes"
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
              <n-button @click="$router.push('/')">Kembali</n-button>
              <n-button type="primary" @click="calculateData">
                Submit
              </n-button>
            </div>
          </n-form>
          <div v-else>
            <div>
              <n-result
                v-if="expected == 'Yes'"
                status="success"
                title="Yes"
                :description="`Berdasarkan hasil perhitungan Naive Bayes aset disimpulkan worth it untuk dibeli, dengan hasil perhitungan dibawah ini`"
              >
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
                <n-table stripped>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Yes</th>
                      <th>No</th>
                    </tr>
                  </thead>
                  <tbody>
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
              </n-result>
              <n-result
                v-else
                status="error"
                title="No"
                description="Berdasarkan hasil perhitungan Naive Bayes aset disimpulkan tidak worth it untuk dibeli. dengan hasil perhitungan dibawah ini"
              >
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
                <n-table stripped>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Yes</th>
                      <th>No</th>
                    </tr>
                  </thead>
                  <tbody>
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
