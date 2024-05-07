const express = require("express"); // dùng express để xây dựng ứng dụng web 

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const session= require('express-session');

const methodOverride = require('method-override');//được sử dụng để ghi đè phương thức HTTP được sử dụng trong một yêu cầu HTTP.
//các trình duyệt web chỉ hỗ trợ một số phương thức HTTP chính thức như GET và POST. Tuy nhiên, có một số tình huống mà bạn muốn sử dụng các phương thức HTTP khác như PUT, DELETE, PATCH, v.v.


const flash = require('express-flash');


require("dotenv").config(); // 

const database = require("./config/database");

const route = require("./routes/client/index.route"); 

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route"); 

const port = process.env.PORT;

database.connect();

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('dungmanh'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.use(express.static("public")); // nhúng file tĩnh vào ứng dụng web 

app.set("views", "./views");

app.set("view engine", "pug");



routeAdmin(app);

route(app)

// App Locals Variables dungf để tạo ra biến toàn cục ở bất kỳ file nào cũng dùng được 
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.listen(port, () => {

  console.log(`App listening on port ${port}`);
});

/**trong folder  views tạo một folder client là phần giao diện cuối cùng  
 * và trong client có 2 folder có 2 phần Admin và client(giao diện người dùng)
 * phần giao diện người dùng có nhiều trang giống nhau thì có một folder pages
*/
/**dungmanh2402
 * 4x0niuLf45KzZaAX
 */