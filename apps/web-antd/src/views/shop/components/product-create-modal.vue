<script lang="tsx" setup>
import { computed, ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { useAsyncState } from '@vueuse/core';
import { message } from 'ant-design-vue';

import { getGoodsCategoryList } from '#/api/shop/goods';

const data = ref();

const { state, isLoading } = useAsyncState(
  getGoodsCategoryList({ pageIndex: 1, pageSize: 100 }),
  undefined,
);

const [Modal, modalApi] = useVbenModal({
  loading: !isLoading.value,
  closeOnClickModal: false,
  footer: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.warn('onConfirm');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
    }
  },
});

/** 商品分类选项 */
const goodsCategoryOption = computed(() =>
  state.value?.items.map((_) => ({
    label: _.name,
    value: _.id,
  })),
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
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
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
        if(values) {
          return !!values.isMultiSku;
        },
        triggerFields: ['isMultiSku'],
      },
      fieldName: 'isMultiSkuOrder',
      label: '多Sku购买',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>
<template>
  <Modal title="创建商品">
    <BaseForm />
  </Modal>
</template>
