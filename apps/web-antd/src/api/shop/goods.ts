import { requestClient } from '#/api/request';

export namespace GTShop {
  /** 商品状态 1=上架  2=隐藏  3=下架 */
  export type GoodesStatus = 1 | 2 | 3;
  /** 货物规格选项 */
  export interface GoodsSpecsOptions {
    /** 规格名称 */
    label: string;
    parentId: number;
    createTime: number;
    id: number;
    sort: number;
    updateTime: number;
  }
  /** 货物规格 */
  export interface GoodsSpecs {
    parentId: number;
    /** 选项标题 */
    label: string;
    /** 排序值 */
    sort: number;
    /** 规格选项 */
    options: Array<GoodsSpecsOptions>;
    id: number;
    updateTime: number;
  }
  /** 货物sku */
  export interface GoodesSkus {
    /** 选项名称 */
    labels: Array<string>;
    /** 规格ID */
    specIds: Array<number>;
    /** 商品标题 */
    title: string;
    /** 图片 */
    image: string;
    /** 库存 */
    stock: number;
    /** 库存阀值 */
    stockThreshold: number;
    /** 销量 */
    sales: number;
    /** 商品原价（） */
    originalPrice: number;
    /** 商品售价 */
    price: number;
    /** 商品重量 */
    weight: number;
    /** 状态 */
    status: GoodesStatus;
    createTime: number;
    id: number;
  }
  /** 创建商品 */
  export interface CreateGoodsForm {
    /** 分类ID */
    categoryId: number;
    /** 商品标题 */
    title: string;
    /** 商品副标题 */
    subTitle: string;
    /** 缩略图地址 */
    thumbnail: string;
    /** 轮播图 */
    images: Array<string>;
    /** 商品详情 */
    content: string;
    /** 商品注意事项 */
    notes: string;
    /** 是否多Sku */
    isMultiSku: boolean;
    /** 虚假的查看数量 */
    fakeViews: number;
    /** 虚假的销售数量 */
    fakeSales: number;
    /** 商品状态 */
    status: GoodesStatus;
  }
  /** 查询货物列表表单 */
  export interface QueryGoodsListForm extends GT.QueryListForm {
    /** 标题搜索关键词 */
    keyword?: string;
    /** 分类id */
    categoryId?: number;
    /** 商品状态 */
    status?: GoodesStatus;
  }
  /** 商品分类详情 */
  export interface GoodesCategory {
    /** 分类名称 */
    name: string;
  }
  /** 商品明细 */
  export interface GoodsDetail {
    /** 商品规格 */
    specs: Array<GoodsSpecs>;
    /** 商品sku */
    skus: Array<GoodesSkus>;
    /** 商品分类Id */
    categoryId: number;
    /** 商品标题 */
    title: string;
    /** 商品缩略图 */
    thumbnail: string;
    /** 商品浏览图 */
    images: Array<string>;
    /** 商品详情 */
    content: string;
    /** 是否多sku */
    isMultiSku: boolean;
    /** 是否可以多sku购买 */
    isMultiSkuOrder: boolean;
    /** 喜欢人数 */
    favorites: number;
    /** 分享次数 */
    shares: number;
    /** 浏览量 */
    views: number;
    /** 销量 */
    sales: number;
    /** 虚拟浏览量 */
    fakeViews: number;
    /** 虚拟销量 */
    fakeSales: number;
    /** 商品状态 */
    status: GoodesStatus;
    /** 交付类型 */
    deliveryType: number;
    /** 注意事项 */
    notes: string;
    sort: number;
    /** 商品分类详情 */
    category: GoodesCategory;
    createTime: number;
    updateTime: number;
    id: number;
  }
  /** 查询商品列表结果 */
  export type QueryGoodsListResult = Omit<GTShop.GoodsDetail, 'skus' | 'spec'> &
    Pick<GTShop.GoodesSkus, 'stock'>;
}

/**
 * 获取当前店铺商品列表
 */
export async function getGoodsList(data: GTShop.QueryGoodsListForm) {
  return requestClient.get<GT.ListResult<GTShop.QueryGoodsListResult>>(
    '/shop/goods/list',
    { params: data },
  );
}

/**
 * 编辑货物上下架状态
 */
export async function editGoodsStatus(
  data: Pick<GTShop.GoodsDetail, 'id' | 'status'>,
) {
  return requestClient.post('/shop/goods/status/edit', data);
}

/**
 * 创建货物商品（基础信息）
 */
export async function createGoodsBasicInfo(data: GTShop.CreateGoodsForm) {
  return requestClient.post('/shop/goods/create', data);
}

/**
 * 编辑货物商品（基础信息）
 */
export async function editGoodsBasicInfo(
  data: GTShop.CreateGoodsForm & { id: number },
) {
  return requestClient.post('/shop/goods/edit', data);
}

/**
 * 删除货物商品
 */
export async function deleteGoods(data: { id: number }) {
  return requestClient.post('/shop/goods/delete', data);
}

/**
 * 更新 / 创建商品的specs
 */
export async function editGoodsSpecs(data: {
  /** 商品ID */
  id: number;
  /** 规格 */
  specs: Array<{
    /** 规格ID */
    id?: number;
    /** 规格提示语 */
    label: string;
    options: Array<{
      /** 选项ID */
      id?: number;
      /** 选项提示语 */
      label: string;
    }>;
  }>;
}) {
  return requestClient.post('/shop/goods/specs/edit', data);
}
/**
 * 更新 / 创建商品的sku
 */
export async function editGoodsSkus(data: {
  /** 商品ID */
  id: number;
  skus: Array<GTShop.GoodesSkus>;
}) {
  return requestClient.post('/shop/goods/skus/edit', data);
}

/**
 * 获取指定商品的 sku 列表
 */
export async function getGoodsSkusList(data: {
  /** 商品ID */
  goodsId: number;
}) {
  return requestClient.get<Array<GTShop.GoodesSkus>>('/shop/goods/skus/list', {
    params: data,
  });
}

/**
 * 获取指定商品的 spec 列表
 */
export async function getGoodsSpecsList(data: {
  /** 商品ID */
  goodsId: number;
}) {
  return requestClient.get<Array<Pick<GTShop.GoodsSpecs, 'options'>>>(
    '/shop/goods/skus/list',
    {
      params: data,
    },
  );
}
