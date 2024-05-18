// [GET] /admin/role
module.exports.dashborard = (req, res) => {

  res.render("admin/pages/dashboard/index", {
    
    pageTitle : "trang chủ",
  })
}