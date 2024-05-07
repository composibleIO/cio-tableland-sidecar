"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbController = void 0;
const sdk_1 = require("@tableland/sdk");
const ethers_1 = require("ethers");
class DbController {
    constructor() { }
    init(creds) {
        if (process.env.KEY != undefined && process.env.GATEWAY != undefined) {
            const wallet = new ethers_1.Wallet(process.env.KEY);
            const provider = (0, ethers_1.getDefaultProvider)(process.env.GATEWAY);
            const signer = wallet.connect(provider);
            return new sdk_1.Database({ signer });
        }
        else {
            throw Error("needed env vars not found");
        }
    }
    create_table(body) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.init();
            // move to service 
            // per publication!
            const prefix = "tusg_content";
            const { meta: create } = yield db
                .prepare(`CREATE TABLE ${prefix} (
                    id text primary key, 
                    slug text,
                    _owner text, 
                    publication text,
                    author text,
                    post_type text,
                    tags text,
                    categories text,
                    parent text,
                    creation_date text,
                    modified_date text,
                    content_cid text
                );
            `)
                .run();
            yield ((_a = create.txn) === null || _a === void 0 ? void 0 : _a.wait());
            const tableName = (_c = (_b = create.txn) === null || _b === void 0 ? void 0 : _b.names[0]) !== null && _c !== void 0 ? _c : "";
            console.log(tableName);
        });
    }
    mutate_table() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    write_record(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.init();
            const records = yield db.prepare(`SELECT * from ${body.table} WHERE id = '${body.content.id}';`).all();
            if (records.results.length < 1) {
                yield this.insert(db, body);
            }
            else {
                yield this.update(db, body);
            }
        });
    }
    query(body) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("1");
            console.log(body);
            if (body.query == undefined)
                return;
            console.log("2");
            console.log(body.query);
            const db = this.init();
            let payload = yield db.prepare(body.query).all();
            console.log(payload);
            return payload;
        });
    }
    insert(db, body) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const c = body.content;
            // c.blob = pack(c.content);
            console.log(c);
            const { meta: insert } = yield db
                .prepare(body.sql_query)
                .bind(c.id, c.slug, c._owner, c.publication, c.author, c.post_type, c.tags, c.categories, c.parent, c.creation_date, c.modified_date, c.content_cid)
                .run();
            let res = yield ((_a = insert.txn) === null || _a === void 0 ? void 0 : _a.wait());
            console.log(res);
            return "TL: item inserted";
        });
    }
    batch_insert(body) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (body.sql_query == undefined)
                return;
            const db = this.init();
            let statement = db.prepare(body.sql_query);
            const c = body.content;
            yield db.batch([
                statement.bind(c[0]),
                // etc.. 
            ]);
            const { meta: insert } = yield db
                .prepare(body.sql_query)
                .bind(c.id, c.slug, c._owner, c.publication, c.author, c.post_type, c.tags, c.categories, c.parent, c.creation_date, c.modified_date, c.content_cid)
                .run();
            console.log('insert');
            let res = yield ((_a = insert.txn) === null || _a === void 0 ? void 0 : _a.wait());
            console.log(res);
        });
    }
    update(db, body) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(body);
            const c = body.content;
            const { meta: insert } = yield db
                .prepare(`UPDATE ${body.table} SET slug = ?, publication = ?, author = ?, post_type = ?, tags = ?, categories = ?, parent = ?, creation_date = ?, modified_date = ?, content_cid = ? WHERE id = ?`)
                .bind(c.slug, c.publication, c.author, c.post_type, c.tags, c.categories, c.parent, c.creation_date, c.modified_date, c.content_cid, c.id)
                .run();
            console.log('update');
            let res = yield ((_a = insert.txn) === null || _a === void 0 ? void 0 : _a.wait());
            console.log(res);
            return "TL: item updated";
        });
    }
}
exports.DbController = DbController;
//# sourceMappingURL=db.controller.js.map