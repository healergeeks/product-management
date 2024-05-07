const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");

const productRoutes = require("./product.route");

module.exports = (app) => {
  const PATY_ADMIN = systemConfig.prefixAdmin;

  app.use(PATY_ADMIN + "/dashboard", dashboardRoutes);

  app.use(PATY_ADMIN + "/product", productRoutes);

}
