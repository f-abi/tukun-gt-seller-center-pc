<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

const data = ref();

const [Modal, modalApi] = useVbenModal({
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

const [BaseForm] = useVbenForm({
  showDefaultActions: true,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入商品标题',
      },
      // 字段名
      fieldName: 'title',
      // 界面显示的label
      label: '商品标题',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品副标题（选填）',
      },
      fieldName: 'subTitle',
      label: '商品副标题',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品副标题（选填）',
      },
      fieldName: 'subTitle',
      label: '商品副标题',
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
