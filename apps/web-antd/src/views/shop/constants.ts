import type { SelectProps } from 'ant-design-vue';

/** 商品分类TAG颜色 */
export const ShopGoodsCategoryTagColor: Record<number, string> = {
  11_502: 'processing',
  11_503: 'purple',
  11_504: 'error',
  11_505: 'pink',
  11_506: 'magenta',
  11_507: 'red',
  11_508: 'volcano',
  11_509: 'orange',
  11_510: 'gold',
  11_511: 'blue',
  11_512: 'green',
  11_513: 'cyan',
};

/** 商品状态选项 */
export const ShopGoodsStatusOption: SelectProps['options'] = [
  {
    value: 1,
    label: '上架',
  },
  {
    value: 2,
    label: '隐藏',
  },
  {
    value: 3,
    label: '下架',
  },
];
