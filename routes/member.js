var express = require("express");
var router = express.Router();
const multer = require("multer");
// limit filesize to 5 MB
const upload = multer({ dest: ".public/images/uploads/", limits: { fileSize: 5000000 } });

//import database
var connection = require("../library/db");
var com = require("../library/com");

/**
 * INDEX MEMBER
 */
router.get("/", async function (req, res, next) {
	//query
	const resp = await com.listen(res, "http://localhost:3000/api/member-r", "json");
	const rjson = await resp?.json();
	let filteredResp = rjson?.filter((item) => {
		return item?.access_type === "user";
	});
	res.render("member/index", { members: filteredResp || "" });
});

router.get("/create", function (req, res, next) {
	res.render("member/create", {
		access_id: 1,
		member_name: "",
		member_role: "",
		member_photo: "",
	});
});

router.post("/store", upload.single("member_photo"), async function (req, res, next) {
	connection.query(
		"SELECT access_id FROM type_access WHERE access_type = ?",
		[req.body.access_type],
		function (err, rows) {
			if (err) {
				req.flash("error", err);
				res.render("member/create", {
					access_id: access_id,
					member_name: member_name,
					member_role: member_role,
					member_photo: member_photo,
				});
			} else {
				access_id = rows[0].access_id;
				process_create(access_id);
			}
		}
	);

	async function process_create(access_id) {
		let { member_name, member_role } = req.body;
		let member_photo = req.file;

		const formData = {
			access_id: access_id,
			member_name: member_name,
			member_role: member_role,
			member_photo: member_photo,
		};

		console.log(formData);

		const resp = await com.talk(res, "http://localhost:3000/api/member-c", "json", formData);
		resp ? res.redirect("/member") : res.render("member/create", formData);
	}
});

module.exports = router;
