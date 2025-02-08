declare namespace GT {
  interface QueryListForm {
    pageIndex: number;
    pageSize: number;
  }
  interface ListResult<T> extends QueryList {
    items: Array<T>;
    total: number;
  }
}
