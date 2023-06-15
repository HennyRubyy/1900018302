<script setup lang="ts">
import {
  initialData,
} from "../source";
import { useTraining } from "../composable/training";
import { useCategory } from "../composable/category";
import { useSubCategory } from "../composable/sub-category";
import { useClassification } from "../composable/classification";
import { usePrice } from "../composable/price";
import { useCondition } from "../composable/condition";

const router = useRouter()
const showModal = ref(false);
const showModalEdit = ref(false);
const showModalDelete = ref(false);
const selectedId = ref();

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

const { getAll, trainings, createOne, deleteOne, updateOne } = useTraining();

onMounted(() => {
  getAll();
});

watch(showModal, (v) => {
  if (v) {
    formData.value = { result: undefined, ...initialData() };
  }
});

const formData = ref<any>({ result: undefined, ...initialData() });

const resultSelect = [
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "No",
    value: "No",
  },
];

async function onSubmit() {
  createOne(
    formData.value.type as string,
    formData.value.subType as string,
    formData.value.price as string,
    formData.value.classification as string,
    formData.value.condition as string,
    formData.value.result as string
  );

  showModal.value = false;
}

function onEdit({
  category,
  sub_category,
  price,
  classification,
  condition,
  result,
  id,
}: any) {
  selectedId.value = id;
  formData.value.type = category.id;
  formData.value.subType = sub_category.id;
  formData.value.price = price.id;
  formData.value.classification = classification.id;
  formData.value.condition = condition.id;
  formData.value.result = result.id;

  showModalEdit.value = true;
}

function onSubmitEdit() {
  updateOne(
    selectedId.value,
    formData.value.type as string,
    formData.value.subType as string,
    formData.value.price as string,
    formData.value.classification as string,
    formData.value.condition as string,
    formData.value.result as string
  );

  showModalEdit.value = false;
}

const categorySelect = computed(() => {
  return categories.value?.data?.map((item) => ({
    label: item.name,
    value: item.id,
  }));
});

const classificationSelect = computed(() => {
  return classifications.value?.data?.map((item) => ({
    label: item.name,
    value: item.id,
  }));
});

const priceSelect = computed(() => {
  return prices.value?.data?.map((item) => ({
    label: item.name,
    value: item.id,
  }));
});

const conditionSelect = computed(() => {
  return conditions.value?.data?.map((item) => ({
    label: item.name,
    value: item.id,
  }));
});


const subCategorySelect = computed(() => {
  return subCategories.value?.data
    ?.filter((value) => value.category.id === formData.value.type)
    ?.map((item) => ({ label: item.name, value: item.id }));
});
</script>

<template>
  <div>
    <n-h1> Daftar data training </n-h1>

    <div class="flex justify-between mb-5">
      <n-button @click="router.push('/')">Kembali</n-button>
      <n-button @click="showModal = true"> Tambah </n-button>
    </div>
    <n-table>
      <tr>
        <th>No.</th>
        <th>Jenis</th>
        <th>Kategori</th>
        <th>Harga</th>
        <th>Kebutuhan</th>
        <th>Kondisi</th>
        <th>Hasil</th>
        <th>Aksi</th>
      </tr>
      <tr v-if="trainings.length == 0">
        <td colspan="8">
          <n-empty></n-empty>
        </td>
      </tr>
      <template v-else>
        <tr v-for="(item: any, index) in trainings">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ item.category.name }}
          </td>
          <td>
            {{ item.sub_category.name }}
          </td>
          <td>
            {{ item.price.name }}
          </td>
          <td>
            {{ item.classification.name }}
          </td>
          <td>
            {{ item.condition.name }}
          </td>
          <td>
            {{ item.result }}
          </td>
          <td class="space-x-2">
            <n-button text type="primary" @click="onEdit(item)">
              Edit
            </n-button>
            <n-button
              text
              type="error"
              @click="
                selectedId = item.id;
                showModalDelete = true;
              "
            >
              Hapus
            </n-button>
          </td>
        </tr>
      </template>
    </n-table>
  </div>
  <n-modal style="max-width: 80vw" v-model:show="showModal" preset="card">
    <n-h2> Tambah Data </n-h2>
    <n-form>
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
      <n-form-item label="Result">
        <n-select
          v-model:value="formData.result"
          :options="resultSelect"
          filterable
        ></n-select>
      </n-form-item>
      <div class="max-w-sm mx-auto">
        <n-button block type="primary" @click="onSubmit"> Submit </n-button>
      </div>
    </n-form>
  </n-modal>
  <n-modal v-model:show="showModalEdit" style="max-width: 80vw" preset="card">
    <n-h2> Edit Data </n-h2>
    <n-form>
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
      <n-form-item label="Result">
        <n-select
          v-model:value="formData.result"
          :options="resultSelect"
          filterable
        ></n-select>
      </n-form-item>
      <div class="max-w-sm mx-auto">
        <n-button block type="primary" @click="onSubmitEdit"> Submit </n-button>
      </div>
    </n-form>
  </n-modal>
  <n-modal
    v-model:show="showModalDelete"
    preset="dialog"
    type="error"
    title="Peringatan"
    content="Apakah anda yakin ingin menghapus data?"
    positive-text="Submit"
    negative-text="Cancel"
    @positive-click="
      () => {
        deleteOne(selectedId);
      }
    "
    @negative-click="showModalDelete = false"
  />
</template>
