<script lang="ts" setup>
import type { GTShop } from '#/api/shop/goods';

import { computed, reactive, ref } from 'vue';

import { useVbenDrawer, useVbenForm } from '@vben/common-ui';

import { useAsyncState } from '@vueuse/core';
import { Card, Segmented } from 'ant-design-vue';

import { getGoodsCategoryList, getGoodsDetail } from '#/api/shop/goods';

import { ShopGoodsStatusOption } from '../constants';

interface Params {
  id: number;
}

/** 参数 */
const params = ref<Params | undefined>(undefined);

const init = () =>
  new Promise<[Array<GTShop.GoodsCategory>, GTShop.GoodsDetail | undefined]>(
    (resolve, reject) => {
      getGoodsCategoryList({ pageIndex: 1, pageSize: 100 }).then(
        ({ items }) => {
          setTimeout(() => {
            if (params.value?.id) {
              getGoodsDetail({ id: params.value.id }).then((goodsData) => {
                resolve([items, goodsData]);
              }, reject);
            } else {
              resolve([items, undefined]);
            }
          }, 0);
        },
        reject,
      );
    },
  );

const { state, isLoading, execute } = useAsyncState(init, undefined, {
  immediate: false,
});

/** 抽屉配置 */
const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      params.value = drawerApi.getData<Params>();
      execute();
    }
  },
});

/** 选项卡当前命中 */
const optionValue = ref<number>(1);
/** 选项卡配置 */
const options = reactive([
  { title: '基础设置', value: 1, disabled: false },
  { title: '规格设置', value: 2, disabled: false },
  { title: '价格/库存', value: 3, disabled: false },
  { title: '商品详情', value: 4, disabled: false },
  { title: '分享设置', value: 5, disabled: false },
  { title: '高级设置', value: 6, disabled: false },
]);

/** 商品分类选项 */
const goodsCategoryOption = computed<
  Array<{ label: string; value: number }> | undefined
>(() =>
  state.value
    ? state.value[0].map((_) => ({
        label: _.name,
        value: _.id,
      }))
    : undefined,
);

const [BaseForm] = useVbenForm({
  showDefaultActions: true,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema: [
    {
      help: '产品的分类',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: goodsCategoryOption,
        placeholder: '请选择商品分类',
        optionFilterProp: 'label',
        showSearch: true,
      },
      fieldName: 'categoryId',
      label: '商品分类',
      rules: 'required',
    },
    {
      help: '商品向用户展示的主要标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品标题',
      },
      fieldName: 'title',
      label: '商品标题',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品副标题（选填）',
      },
      fieldName: 'subTitle',
      label: '副标题',
    },
    {
      help: '控制商品的上架/下架',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: ShopGoodsStatusOption,
        placeholder: '请选择商品状态',
        optionFilterProp: 'label',
        showSearch: true,
      },
      defaultValue: 2,
      fieldName: 'status',
      label: '商品状态',
      rules: 'required',
    },
    {
      help: '添加商品的浏览量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入预设浏览量',
      },
      defaultValue: 0,
      fieldName: 'fakeViews',
      label: '预设浏览量',
      rules: 'required',
    },
    {
      help: '添加商品的销售数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入预设销量',
      },
      defaultValue: 0,
      fieldName: 'fakeSales',
      label: '预设销量',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'isMultiSku',
      label: '是否多Sku',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      dependencies: {
        disabled(values) {
          return !values.isMultiSku;
        },
        triggerFields: ['isMultiSku'],
      },
      fieldName: 'isMultiSkuOrder',
      label: '多Sku购买',
    },
  ],
  wrapperClass: 'grid-cols-3',
});
</script>
<template>
  <Drawer append-to-main title="商品编辑" :loading="isLoading">
    <Card>
      <Segmented
        v-model:value="optionValue"
        :options="options"
        block
        class="mb-8"
      >
        <template #label="{ title }">
          <span>{{ title }}</span>
        </template>
      </Segmented>
      <template v-if="optionValue === 1">
        <BaseForm />
      </template>
    </Card>
  </Drawer>
</template>
