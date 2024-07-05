const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const account = require("./account.route");
const auth = require("./auth.route");
const myAccountRoutes = require("./my-account.route");

module.exports = (app) => {
  const PATY_ADMIN = systemConfig.prefixAdmin;

  app.use(PATY_ADMIN + "/dashboard",authMiddleware.requireAuth, dashboardRoutes);

  app.use(PATY_ADMIN + "/product",authMiddleware.requireAuth, productRoutes);

  app.use(PATY_ADMIN + "/products-category",authMiddleware.requireAuth, productCategoryRoutes);

  app.use(PATY_ADMIN + "/roles",authMiddleware.requireAuth, roleRoutes);

  app.use(PATY_ADMIN + "/accounts",authMiddleware.requireAuth, account);

  app.use(PATY_ADMIN + "/auth", auth);

  app.use(PATY_ADMIN + "/my-account",authMiddleware.requireAuth, myAccountRoutes);

}
