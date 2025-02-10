<script lang="tsx" setup>
import type { SelectValue } from 'ant-design-vue/es/select';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { GTShop } from '#/api/shop/goods';

import {
  EllipsisText,
  Page,
  useVbenModal,
  VbenCountToAnimator,
} from '@vben/common-ui';

import { Button, Image, message, Select, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { editGoodsStatus, getGoodsList } from '#/api/shop/goods';

import ProductCreateModal from '../components/product-create-modal.vue';
import { ShopGoodsCategoryTagColor, ShopGoodsStatusOption } from '../constants';

const gridOptions: VxeGridProps<GTShop.QueryGoodsListResult> = {
  columns: [
    { field: 'id', title: '商品ID', width: 72 },
    {
      field: 'category',
      title: '商品分类',
      align: 'left',
      width: 120,
      slots: {
        default({ row }) {
          return (
            <Tag color={ShopGoodsCategoryTagColor[row.categoryId]}>
              {row.category.name}
            </Tag>
          );
        },
      },
    },
    {
      field: 'thumbnail',
      title: '缩略图',
      width: 80,
      slots: {
        default({ row }) {
          return <Image height={40} src={row.thumbnail} width={40} />;
        },
      },
    },
    { field: 'title', title: '商品标题', width: 200, align: 'left' },
    {
      field: 'views',
      title: '浏览量',
      width: 80,
      slots: {
        default({ row }) {
          return (
            <VbenCountToAnimator
              duration={300}
              endVal={row.views}
              startVal={0}
            />
          );
        },
      },
    },
    {
      field: 'sales',
      title: '销量',
      width: 80,
      slots: {
        default({ row }) {
          return (
            <VbenCountToAnimator
              duration={300}
              endVal={row.sales}
              startVal={0}
            />
          );
        },
      },
    },
    {
      field: 'stock',
      title: '总库存',
      width: 100,
    },
    {
      field: 'status',
      title: '上架状态',
      width: 100,
      slots: {
        default({ row }) {
          return (
            <Select
              onChange={(value) => handleStatusChange(value, row.id)}
              options={ShopGoodsStatusOption}
              size={'small'}
              v-model:value={row.status}
            />
          );
        },
      },
    },
    {
      field: 'notes',
      title: '注意事项',
      width: 200,
      slots: {
        default({ row }) {
          return row.notes.length > 0 ? (
            <EllipsisText
              tooltipMaxWidth={500}
              v-slots={{
                tooltip: () => <div v-html={row.notes} />,
              }}
            >
              {row.notes
                .replaceAll(/<[^>]+>/g, '')
                .replaceAll(/\s+/g, ' ')
                .trim()}
            </EllipsisText>
          ) : (
            <span class={'text-red'}>未填写</span>
          );
        },
      },
    },
    {
      field: 'content',
      title: '商品详情',
      width: 200,
      slots: {
        default({ row }) {
          return row.content.length > 0 ? (
            <EllipsisText
              tooltipMaxWidth={500}
              v-slots={{
                tooltip: () => <div v-html={row.content} />,
              }}
            >
              {row.content
                .replaceAll(/<[^>]+>/g, '')
                .replaceAll(/\s+/g, ' ')
                .trim()}
            </EllipsisText>
          ) : (
            <>
              <span class="text-red-600">未填写</span>
            </>
          );
        },
      },
    },
    {
      field: 'updateTime',
      title: '更新时间',
      width: 180,
      formatter: ({ cellValue }) =>
        cellValue
          ? dayjs.unix(cellValue).format('YYYY-MM-DD HH:mm:ss')
          : '暂无更新时间',
    },
    {
      field: 'createTime',
      title: '创建时间',
      width: 180,
      formatter: ({ cellValue }) =>
        dayjs.unix(cellValue).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'active',
      title: '操作',
      fixed: 'right',
      width: 120,
      slots: {
        default() {
          return (
            <>
              <Button class={'mr-2'} size={'small'} type={'primary'}>
                编辑商品
              </Button>
            </>
          );
        },
      },
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) =>
        await getGoodsList({
          pageIndex: page.currentPage,
          pageSize: page.pageSize,
        }),
    },
    sort: true,
  },
  sortConfig: {
    remote: true,
  },
  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: { code: 'query' },
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ProductCreateModal,
});

function openModal() {
  modalApi
    .setData({
      content: '外部传递的数据 content',
      payload: '外部传递的数据 payload',
    })
    .open();
}
/** 更改商品状态 */
async function handleStatusChange(value: SelectValue, id: number) {
  gridApi.setLoading(true);
  try {
    await editGoodsStatus({ id, status: value as GTShop.GoodesStatus });
    message.success('修改成功');
  } finally {
    gridApi.setLoading(false);
    gridApi.query();
  }
}
</script>

<template>
  <Page auto-content-height>
    <Modal />
    <Grid table-title="商品管理">
      <template #toolbar-tools>
        <Button type="primary" @click="openModal"> 新建商品 </Button>
        <!-- <Button type="primary" @click="() => gridApi.reload()">
          刷新并返回第一页
        </Button> -->
      </template>
    </Grid>
  </Page>
</template>
