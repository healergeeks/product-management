const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");

const productRoutes = require("./product.route");

const productCategoryRoutes = require("./product-category.route");

module.exports = (app) => {
  const PATY_ADMIN = systemConfig.prefixAdmin;

  app.use(PATY_ADMIN + "/dashboard", dashboardRoutes);

  app.use(PATY_ADMIN + "/product", productRoutes);

  app.use(PATY_ADMIN + "/products-category", productCategoryRoutes);

}
