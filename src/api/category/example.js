const exapmle = {
  // get 方法
  getList: {
    config: {
      url: "/api/getList",
      method: "get",
    },
    handler: (data) => data,
  },
  // post 方法
  postItem: {
    config: {
      url: "/api/postItem",
      method: "post",
    },
    handler: (data) => data,
  },
  // delete 方法
  deleteItem: {
    config: {
      url: "/api/deleteItem",
      method: "delete",
    },
    handler: (data) => data,
  },
  // put 方法
  putItem: {
    config: {
      url: "/api/deleteItem",
      method: "put",
    },
    handler: (data) => data,
  },
};

export default exapmle;
