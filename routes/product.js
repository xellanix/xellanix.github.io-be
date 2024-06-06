var express = require("express");
var router = express.Router();

//import database
var connection = require("../library/db");
var com = require("../library/com");

/**
 * INDEX PRODUCT
 */
router.get("/", async function (req, res, next) {
	//query
	const resp = await com.listen(res, "http://localhost:3000/api/product-r", "json");
	const rjson = await resp?.json();
	let filteredResp = rjson?.filter((item) => {
		return item?.access_type === "user";
	});
	res.render("product/index", { products: filteredResp || "" });
});

/**
 * CREATE POST
 */
router.get("/create", function (req, res, next) {
	res.render("product/create", {
		access_id: 1,
		product_name: "",
		description: "",
		learn_link: "",
	});
});

/**
 * STORE POST
 */
router.post("/store", async function (req, res, next) {
	connection.query(
		"SELECT access_id FROM type_access WHERE access_type = ?",
		[req.body.access_type],
		function (err, rows) {
			if (err) {
				req.flash("error", err);
				res.render("product/create", {
					access_id: access_id,
					product_name: product_name,
					description: description,
					learn_link: learn_link,
				});
			} else {
				access_id = rows[0].access_id;
				process_create(access_id);
			}
		}
	);

	async function process_create(access_id) {
		let { product_name, description, learn_link } = req.body;

		const resp = await com.talk(res, "http://localhost:3000/api/product-c", "json", {
			access_id: access_id,
			product_name: product_name,
			description: description,
			learn_link: learn_link,
		});
		resp ? res.redirect("/product") : res.render("product/create", formData);
	}
});

module.exports = router;
