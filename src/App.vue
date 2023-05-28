<script setup lang="ts">
import { calculateProbability } from "./helpers";
import { trainingData } from "./training";

interface InitialData {
  type?: string;
  subType?: string;
  price?: string;
  excess?: string;
  lack?: string;
}

function initialData(): InitialData {
  return {
    type: undefined,
    subType: undefined,
    price: undefined,
    excess: undefined,
    lack: undefined,
  };
}

const formData = ref(initialData());
const result = ref<"Yes" | "No">("Yes");
const isHasResult = ref(false);

const sources = [
  {
    type: "Tanah",
    subCategory: [
      "Tanah Pertanian",
      "Tanah Perkampungan",
      "Tanah Kuburan",
      "Tanah Bangunan",
      "Tanah Pekarangan",
    ],
  },
  {
    type: "Gedung dan Bangunan",
    subCategory: [
      "Gedung PKK",
      "Gedung TK",
      "Gedung BPD",
      "Gedung PKD",
      "Gedung Balai Desa",
      "Gedung Kantor Desa",
      "Gudang",
    ],
  },
  {
    type: "Peralatan dan Mesin",
    subCategory: [
      "Almari",
      "meja",
      "Mesin Ketik",
      "Jam Dinding",
      "Kursi",
      "Papan Monografi",
      "Mobil Ambulance",
      "Sepeda Motor",
      "lapangan tenis meja",
      "Komputer",
      "Tralis Kantor",
      "Printer",
      "Laptop",
      "Lilling kabinet",
      "Meja tamu",
      "Laptop",
    ],
  },
  {
    type: "Inventaris Ruangan",
    subCategory: [
      "Jam Dinding",
      "Meja Tulis",
      "Almari Arsip",
      "Tralis Kantor",
      "Pinter",
      "Laptop",
      "Kursi",
      "Laptop",
      "printer",
      "Dispencer",
    ],
  },
  {
    type: "Jalan, Irigasi, dan Jaringan",
    subCategory: ["Tnh Pengairan", "Jembatan", "Jalan"],
  },
  {
    type: "Asset Tetap Lainnya",
    subCategory: ["Perpustakaan", "Buku"],
  },
];

const prices = ["< Rp 500.000,00", "> Rp 500.000,00", "> Rp 1.000.000,00"];

const excesses = ["Primer", "Sekunder", "Tersier"];

const lackes = ["Quality", "Pricy"];

//const count = ref();
const types = sources.map((item) => {
  return {
    label: item.type,
    value: item.type,
  };
});

const subTypes = computed(() => {
  const source = sources.find((source) => source.type === formData.value.type);
  return source?.subCategory.map((item) => ({ label: item, value: item }));
});

const priceSelect = prices.map((item) => ({ label: item, value: item }));
const excessSelect = excesses.map((item) => ({ label: item, value: item }));
const lackSelect = lackes.map((item) => ({ label: item, value: item }));

function calculateData() {
  isHasResult.value = true;
  result.value = calculateProbability(
    trainingData,
    formData.value.type as string,
    formData.value.subType as string,
    formData.value.price as string,
    formData.value.excess as string,
    formData.value.lack as string
  );

}

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
              <n-select v-model:value="formData.price" :options="priceSelect" filterable></n-select>
            </n-form-item>
            <n-form-item label="Kelebihan">
              <n-select v-model:value="formData.excess" :options="excessSelect" filterable></n-select>
            </n-form-item>
            <n-form-item label="Kekurangan">
              <n-select v-model:value="formData.lack" :options="lackSelect" filterable></n-select>
            </n-form-item>
            <div class="max-w-sm mx-auto">
              <n-button block type="primary" @click="calculateData">
                Submit
              </n-button>
            </div>
          </n-form>
          <div v-else>
            <div>
              <n-result v-if="result=='Yes'" status="success" title="Yes">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem neque voluptates totam quo recusandae architecto
                accusamus officia necessitatibus obcaecati accusantium deleniti
                ad ipsum, fugit consequatur, aut possimus ducimus provident
                porro!
              </n-result>
              <n-result v-else status="error" title="No">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem neque voluptates totam quo recusandae architecto
                accusamus officia necessitatibus obcaecati accusantium deleniti
                ad ipsum, fugit consequatur, aut possimus ducimus provident
                porro!
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
