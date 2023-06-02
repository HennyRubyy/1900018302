<script setup lang="ts">
import {
  classificationSelect,
  conditionSelect,
  priceSelect,
  types,
  initialData,
  sources,
  priorityOrder
} from "../source";
import {trainingData} from '../training'
const showModal = ref(false)

const formData = ref(initialData());

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


</script>

<template>
    <div>
        <div class="flex justify-between">
            <n-h1>
            Daftar data training
        </n-h1>
        <n-button @click="showModal = true">
            Tambah
        </n-button>
        </div>
        <n-table>
            <tr>
                <th>No. </th>
                <th>Jenis</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Kebutuhan</th>
                <th>Kondisi</th>
                <th>Hasil</th>
            </tr>
            <tr v-for="(item, index) in trainingData">
                <td>
                    {{ index+1 }}
                </td>
                <td>
                     {{ item.category }}
                </td>
                <td>
                     {{ item.subCategory }}
                </td>
                <td>
                     {{ item.price }}
                </td>
                <td>
                     {{ item.classifications }}
                </td>
                <td>
                     {{ item.conditions }}
                </td>
                <td>
                     {{ item.result }}
                </td>
            </tr>
        </n-table>
    </div>
    <n-modal v-model:show="showModal" preset="card">
        <n-h2>
            Tambah Data
        </n-h2>
        <n-form>
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
            <div class="max-w-sm mx-auto">
              <n-button block type="primary">
                Submit
              </n-button>
            </div>
          </n-form>
    </n-modal>
</template>