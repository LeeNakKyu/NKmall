const express = require("express");
const router = express.Router();
const Goods = require("../schemas/goods.js"); // 상품 작성

const goods = [
    {
        goodsId: 1,
        content: '넘모 좋아요1',
        author: '김이박1',
        title: '아이폰 1',
        password: '1111',
        status: 'FOR_SALE'

    },

    {
        goodsId: 2,
        content: '넘모  좋아요2',
        author: '김이박2',
        title: '아이폰 2',
        password: '2222',
        status: 'FOR_SALE'
    },
    {
        goodsId: 3,
        content: '넘모   좋아요3',
        author: '김이박3',
        title: '아이폰 3',
        password: '3333',
        status: 'FOR_SALE'
    },
    {
        goodsId: 4,
        content: '넘모    좋아요4',
        author: '김이박4',
        title: '아이폰 4',
        password: '4444',
        status: 'FOR_SALE'
    },
    {
        goodsId: 5,
        content: '넘모     좋아요5',
        author: '김이박5',
        title: '아이폰 5',
        password: '5555',
        status: 'FOR_SALE'
    },
];


router.get("/goods", (req, res) => {
    res.status(200).json({ "goods": goods })
});


// 상세 조회
router.get("/goods/:goodsId", (req, res) => {
    const { goodsId } = req.params;

    let result = null;
    for (good of goods) {
        if (Number(goodsId) === good.goodsId) {
            result = good;
        }
    }

    res.status(200).json({ "detail:": result });
})

// 상품작성
router.post("/goods/", async (req, res) => {
    const { goodsId, content, author, title, password } = req.body;

    const goods = await Goods.findOne({ goodsId });

    if (goods.length) {
        return res.status(400).json({
            success: false,
            errorMessage: "이미 존재하는 GoodsId"
        });
    }

    const createGoods = await Goods.create({ goodsId, content, author, title, password });

    res.json({ goods: createGoods });
})

// 상품 수정
router.put("/goods/:goodsId", async (req, res) => {
    const { content, goodsId, status } = req.params;
    // const { password } = req.params;
    // const { status } = req.params;
    // const { title } = req.params;
    // const {content} = req.params;

    const change = await Goods.find({ goodsId: Number(goodsId), password: password, status: status, title: title, content: content });
    if (change.length) {
        await Goods.updateOne({ goodsId: Number(goods) }, { $set: { content } });
    }

    res.json({ success: true });
})


// 삭제
router.delete("/goods/:goodsId", async (req, res) => {
    const { goodsId } = req.params;
    const { password } = req.params;

    const deletee = await Goods.find({ goodsId });
    if (deletee.length > 0) {
        if (goods.password === password)
            await Goods.deleteOne({ GoodsId });
    }

    res.json({ result: "success" });
})


module.exports = router;